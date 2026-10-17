import * as THREE from 'three';
import Application from '../Application';
import { afterPreviewSettles, afterCameraFrame, selectionMotion } from './SelectionMotion';
import { CameraKey } from '../Camera/Camera';
import { ProjectKeyframe } from '../Camera/CameraKeyframes';
import UIEventBus from '../UI/EventBus';
import { ProjectContent } from '../../project-story';

type Placement = {
    position: [number, number, number]; rotation: number; length: number;
    groundOffset?: number; contacts?: [number, number, number][];
    lift: number;
    motions?: { node: string; axis: 'x' | 'y' | 'z'; distance?: number; angle?: number }[];
};

/** Three r137's CPU picking reads raw normalized integers, while WebGL decodes
 * them. Expand positions once so raycasts use exactly the displayed geometry. */
function prepareCadPicking(model: THREE.Object3D) {
    model.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const position = object.geometry.getAttribute('position');
        if (!position?.normalized) return;
        const array = position instanceof THREE.InterleavedBufferAttribute ? position.data.array : position.array;
        const maximum = array instanceof Int16Array ? 32767 : array instanceof Uint16Array ? 65535
            : array instanceof Int8Array ? 127 : array instanceof Uint8Array ? 255 : 1;
        const values = new Float32Array(position.count * 3);
        for (let i = 0; i < position.count; i++) {
            values[i * 3] = Math.max(-1, position.getX(i) / maximum);
            values[i * 3 + 1] = Math.max(-1, position.getY(i) / maximum);
            values[i * 3 + 2] = Math.max(-1, position.getZ(i) / maximum);
        }
        object.geometry.setAttribute('position', new THREE.BufferAttribute(values, 3));
        object.geometry.computeBoundingBox(); object.geometry.computeBoundingSphere();
    });
}

/** A material-preserving CAD object sharing the existing project reader. */
export default class WorkshopProject {
    application = new Application();
    group = new THREE.Group();
    meshes: THREE.Mesh[] = [];
    materials = new Set<THREE.MeshStandardMaterial>();
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    button: HTMLButtonElement;
    hovered = false;
    focused = false;
    open = false;
    highlight = 0;
    motions: { object: THREE.Object3D; position: THREE.Vector3; rotation: THREE.Euler; axis: 'x' | 'y' | 'z'; distance: number; angle: number }[] = [];
    rect = { x: 0, y: 0, width: 0, height: 0 };

    constructor(resource: string, public content: ProjectContent, public placement: Placement, id: string) {
        const model = this.application.resources.items.gltfModel[resource].scene;
        prepareCadPicking(model);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const scale = placement.length / Math.max(size.x, size.z);
        model.scale.setScalar(scale);
        model.position.y = -(placement.groundOffset || 0) * scale;
        this.group.name = content.title;
        this.group.position.fromArray(placement.position);
        this.group.rotation.y = placement.rotation;
        this.group.add(model);
        placement.motions?.forEach(motion => {
            const object = model.getObjectByName(motion.node);
            if (!object) throw new Error(`Missing CAD mechanism: ${motion.node}`);
            this.motions.push({ object, position: object.position.clone(), rotation: object.rotation.clone(),
                axis: motion.axis, distance: motion.distance || 0, angle: motion.angle || 0 });
        });
        model.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            this.meshes.push(object);
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach(material => { if (material instanceof THREE.MeshStandardMaterial) this.materials.add(material); });
        });
        this.application.scene.add(this.group);
        this.group.updateMatrixWorld(true);
        const footprint = new THREE.Box3().setFromObject(this.group).getSize(new THREE.Vector3());
        const shade = document.createElement('canvas'); shade.width = shade.height = 128;
        const context = shade.getContext('2d')!;
        const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(0,0,0,.23)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
        const shadowMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shade), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(footprint.x * 1.1, footprint.z * 1.1), shadowMaterial);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(placement.position[0], placement.position[1] + 1, placement.position[2]);
        this.application.scene.add(shadow);
        if (placement.contacts) {
            const contacts = placement.contacts.map(point => model.localToWorld(new THREE.Vector3(...point)));
            const center = contacts.reduce((sum, point) => sum.add(point), new THREE.Vector3()).divideScalar(contacts.length);
            shadow.position.x = center.x; shadow.position.z = center.z;
            contacts.forEach(point => {
                const contact = new THREE.Mesh(new THREE.PlaneGeometry(.12 * scale, .12 * scale), shadowMaterial);
                contact.rotation.x = -Math.PI / 2;
                contact.position.set(point.x, placement.position[1] + 2, point.z);
                this.application.scene.add(contact);
            });
        }

        this.button = document.createElement('button');
        this.button.id = id; this.button.className = 'cube-robot-access'; this.button.hidden = true;
        const title = document.createElement('span'); title.textContent = content.title; this.button.appendChild(title);
        if (content.date) { const date = document.createElement('span'); date.className = 'cube-robot-date'; date.textContent = content.date; this.button.appendChild(date); }
        this.button.setAttribute('aria-label', `Open ${content.title}`);
        this.button.setAttribute('aria-haspopup', 'dialog');
        this.button.addEventListener('focus', () => { this.focused = true; });
        this.button.addEventListener('blur', () => { this.focused = false; });
        this.button.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); this.button.blur(); } });
        this.button.addEventListener('click', () => { if (this.active()) this.showProject(); });
        document.getElementById('ui-app')!.appendChild(this.button);
        document.addEventListener('pointermove', event => { this.hovered = this.active() && this.hit(event.clientX, event.clientY); });
        document.addEventListener('pointerleave', () => { this.hovered = false; });
        document.addEventListener('click', event => {
            if ((event.target as Element).closest('button,a,[data-no-camera]')) return;
            if (this.active() && this.hit(event.clientX, event.clientY)) {
                event.preventDefault(); event.stopImmediatePropagation(); this.showProject();
            }
        }, true);
        UIEventBus.on('project:close', () => {
            if (!this.open) return;
            this.open = false;
            this.application.camera.transition(CameraKey.DESK, selectionMotion.returnToDesk, undefined, () => {
                this.application.camera.interactionLocked = false;
                requestAnimationFrame(() => this.button.focus({ preventScroll: true }));
            });
        });
    }

    active() {
        const camera = this.application.camera;
        return camera.currentKeyframe === CameraKey.DESK && !camera.freeCam && !camera.interactionLocked;
    }
    hit(x: number, y: number) {
        const bounds = this.application.renderer.instance.domElement.getBoundingClientRect();
        this.pointer.set((x - bounds.left) / bounds.width * 2 - 1, 1 - (y - bounds.top) / bounds.height * 2);
        this.raycaster.setFromCamera(this.pointer, this.application.camera.instance);
        if (this.raycaster.intersectObjects(this.meshes, false).length > 0) return true;
        // A hover preview must not move the original target out from under a tap.
        if (this.highlight <= 0) return false;
        this.applyPose(0);
        const restHit = this.raycaster.intersectObjects(this.meshes, false).length > 0;
        this.applyPose(this.highlight);
        return restHit;
    }
    showProject() {
        if (!this.active() || this.open) return;
        this.open = true;
        this.application.camera.interactionLocked = true;
        afterPreviewSettles(() => this.highlight, () => {
            this.highlight = 1;
            this.applyPose(1);
            (this.application.camera.keyframes.project as ProjectKeyframe).setBounds(new THREE.Box3().setFromObject(this.group));
            this.application.camera.transition(CameraKey.PROJECT, selectionMotion.approach, undefined, () => {
                afterCameraFrame(() => UIEventBus.dispatch('project:open', { rect: this.rect, project: this.content }));
            });
        });
    }
    applyPose(amount: number) {
        this.group.position.y = this.placement.position[1] + this.placement.lift * amount;
        this.motions.forEach(motion => {
            motion.object.position.copy(motion.position);
            motion.object.rotation.copy(motion.rotation);
            motion.object.position[motion.axis] += motion.distance * amount;
            motion.object.rotation[motion.axis] += motion.angle * amount;
        });
        this.group.updateMatrixWorld(true);
    }
    update() {
        const active = this.active();
        this.button.hidden = !active; this.button.disabled = !active;
        if (!active) { this.hovered = false; this.focused = false; }
        const raised = this.open || (active && (this.hovered || this.focused));
        const blend = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1 - Math.exp(-this.application.time.delta / 180);
        this.highlight += ((raised ? 1 : 0) - this.highlight) * blend;
        this.applyPose(this.highlight);
        this.button.dataset.lift = this.highlight.toFixed(3);
        this.motions.forEach(motion => {
            this.button.dataset[motion.object.name] = `${motion.object.position[motion.axis] - motion.position[motion.axis]},${motion.object.rotation[motion.axis] - motion.rotation[motion.axis]}`;
        });
        this.materials.forEach(material => { material.emissive.setHex(0xffffff); material.emissiveIntensity = this.highlight * .025; });
        this.button.classList.toggle('is-highlighted', raised);
        if (raised) {
            this.application.renderer.instance.domElement.style.cursor = 'pointer';
            this.application.renderer.cssInstance.domElement.style.cursor = 'pointer';
        }
        if (!active) return;
        const bounds = new THREE.Box3().setFromObject(this.group);
        const screen = this.application.sizes;
        const points = [-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z =>
            new THREE.Vector3(x < 0 ? bounds.min.x : bounds.max.x, y < 0 ? bounds.min.y : bounds.max.y,
                z < 0 ? bounds.min.z : bounds.max.z).project(this.application.camera.instance))));
        const left = (Math.min(...points.map(p => p.x)) + 1) * screen.width / 2;
        const right = (Math.max(...points.map(p => p.x)) + 1) * screen.width / 2;
        const top = (1 - Math.max(...points.map(p => p.y))) * screen.height / 2;
        const bottom = (1 - Math.min(...points.map(p => p.y))) * screen.height / 2;
        this.rect = { x: left, y: top, width: right - left, height: bottom - top };
        const center = bounds.getCenter(new THREE.Vector3()).project(this.application.camera.instance);
        const x = (center.x + 1) * screen.width / 2;
        this.button.style.left = `${THREE.MathUtils.clamp(x, Math.min(145, screen.width / 2), Math.max(screen.width - 145, screen.width / 2))}px`;
        this.button.style.top = `${Math.max(40, top - 12)}px`;
        this.button.dataset.modelX = `${x}`; this.button.dataset.modelY = `${(1 - center.y) * screen.height / 2}`;
        this.button.dataset.minY = `${bounds.min.y}`;
        this.button.dataset.minX = `${bounds.min.x}`; this.button.dataset.maxX = `${bounds.max.x}`;
    }
}
