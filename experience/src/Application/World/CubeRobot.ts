import * as THREE from 'three';
import Application from '../Application';
import { CameraKey } from '../Camera/Camera';
import { workshopLayout } from './WorkshopLayout';
import { cubeProject } from '../../cube-project';
import UIEventBus from '../UI/EventBus';
import { ProjectKeyframe } from '../Camera/CameraKeyframes';

/** The owner's real CAD, retaining glTF materials and named assembly parts. */
export default class CubeRobot {
    application = new Application();
    group = new THREE.Group();
    model: THREE.Group;
    meshes: THREE.Mesh[] = [];
    materials: THREE.MeshStandardMaterial[] = [];
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    hovered = false;
    focused = false;
    lift = 0;
    button: HTMLButtonElement;
    shadow: THREE.Mesh;
    open = false;
    rect = { x: 0, y: 0, width: 0, height: 0 };

    constructor() {
        const { application, group } = this;
        const layout = workshopLayout.cubeRobot;
        this.model = application.resources.items.gltfModel.cubeRobotModel.scene;
        const bounds = new THREE.Box3().setFromObject(this.model);
        const size = bounds.getSize(new THREE.Vector3());
        const scale = layout.width / Math.max(size.x, size.z);
        this.model.scale.setScalar(scale);
        this.model.quaternion.fromArray(layout.restQuaternion).normalize();
        this.model.updateMatrixWorld(true);
        // Evaluate actual vertices after tilting, not rotated bounding-box corners.
        // This puts the real three-point support plane on the tabletop.
        const restingBounds = new THREE.Box3();
        const vertex = new THREE.Vector3();
        this.model.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            const positions = object.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                vertex.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
                restingBounds.expandByPoint(vertex);
            }
        });
        const center = restingBounds.getCenter(new THREE.Vector3());
        this.model.position.set(-center.x, -restingBounds.min.y, -center.z);
        group.name = 'Cube-solving robot project';
        group.position.fromArray(layout.position);
        group.rotation.y = layout.rotation;
        group.add(this.model);
        this.model.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            this.meshes.push(object);
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            for (const material of materials) {
                if (material instanceof THREE.MeshStandardMaterial && !this.materials.includes(material)) {
                    this.materials.push(material);
                }
            }
        });
        application.scene.add(group);
        // The existing desk uses baked, unlit materials; these lights affect only CAD.
        application.scene.add(new THREE.HemisphereLight(0xffffff, 0xb7b7b2, .95));
        const light = new THREE.DirectionalLight(0xffffff, .85);
        light.position.set(-3000, 6000, 5000);
        application.scene.add(light);
        const shade = document.createElement('canvas');
        shade.width = shade.height = 128;
        const context = shade.getContext('2d')!;
        const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(0,0,0,.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
        this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(layout.width * 1.2, layout.width * 1.2),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shade), transparent: true, depthWrite: false }));
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.position.set(layout.position[0], -449, layout.position[2]);
        application.scene.add(this.shadow);
        this.model.updateMatrixWorld(true);
        group.updateMatrixWorld(true);
        // Small contact shadows at the three measured motor tips, plus the soft base shadow.
        for (const point of layout.contactPoints) {
            const contact = new THREE.Vector3().fromArray(point).applyMatrix4(this.model.matrixWorld);
            const patch = new THREE.Mesh(new THREE.PlaneGeometry(layout.width * .13, layout.width * .13),
                new THREE.MeshBasicMaterial({ map: (this.shadow.material as THREE.MeshBasicMaterial).map,
                    transparent: true, opacity: .8, depthWrite: false }));
            patch.rotation.x = -Math.PI / 2;
            patch.position.set(contact.x, -451.5, contact.z);
            application.scene.add(patch);
        }

        this.button = document.createElement('button');
        this.button.id = 'cube-robot-access';
        this.button.className = 'cube-robot-access';
        const title = document.createElement('span'); title.textContent = cubeProject.title;
        const date = document.createElement('span'); date.className = 'cube-robot-date'; date.textContent = cubeProject.date;
        this.button.append(title, date);
        this.button.setAttribute('aria-label', `Open ${cubeProject.title}`);
        this.button.setAttribute('aria-haspopup', 'dialog');
        this.button.addEventListener('click', () => { if (this.active()) this.showProject(); });
        this.button.hidden = true;
        document.getElementById('ui-app')!.appendChild(this.button);
        this.button.addEventListener('focus', () => { this.focused = true; });
        this.button.addEventListener('blur', () => { this.focused = false; });
        this.button.addEventListener('keydown', event => {
            if (event.key === 'Escape') { event.stopPropagation(); this.button.blur(); }
        });
        UIEventBus.on('project:close', () => {
            if (!this.open) return;
            this.open = false;
            this.application.camera.transition(CameraKey.DESK, 650, undefined, () => {
                this.application.camera.interactionLocked = false;
                requestAnimationFrame(() => this.button.focus({ preventScroll: true }));
            });
        });
        document.addEventListener('pointermove', event => {
            this.hovered = this.active() && this.hit(event.clientX, event.clientY);
        });
        document.addEventListener('pointerleave', () => { this.hovered = false; });
        document.addEventListener('click', event => {
            if ((event.target as Element).closest('button,a,[data-no-camera]')) return;
            if (this.active() && this.hit(event.clientX, event.clientY)) {
                event.preventDefault(); event.stopImmediatePropagation();
                this.showProject();
            }
        }, true);
    }

    showProject() {
        if (!this.active() || this.open) return;
        this.open = true;
        this.application.camera.interactionLocked = true;
        // Return the hover lift to rest before framing the selected object.
        this.group.position.y = workshopLayout.cubeRobot.position[1];
        this.group.updateMatrixWorld(true);
        (this.application.camera.keyframes.project as ProjectKeyframe).setBounds(new THREE.Box3().setFromObject(this.group));
        this.application.camera.transition(CameraKey.PROJECT, 700);
        UIEventBus.dispatch('project:open', { rect: this.rect, project: cubeProject });
    }

    active() {
        const camera = this.application.camera;
        return camera.currentKeyframe === CameraKey.DESK && !camera.freeCam && !camera.interactionLocked;
    }

    hit(x: number, y: number) {
        const bounds = this.application.renderer.instance.domElement.getBoundingClientRect();
        this.pointer.set((x - bounds.left) / bounds.width * 2 - 1, 1 - (y - bounds.top) / bounds.height * 2);
        this.raycaster.setFromCamera(this.pointer, this.application.camera.instance);
        return this.raycaster.intersectObjects(this.meshes, false).length > 0;
    }

    update() {
        const active = this.active();
        this.button.hidden = !active;
        this.button.disabled = !active;
        if (!active) { this.hovered = false; this.focused = false; }
        const raised = active && (this.hovered || this.focused);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const blend = reduced ? 1 : 1 - Math.exp(-this.application.time.delta / 100);
        this.lift += ((raised ? 1 : 0) - this.lift) * blend;
        const layout = workshopLayout.cubeRobot;
        this.group.position.y = layout.position[1] + this.lift * layout.lift;
        this.materials.forEach(material => {
            material.emissive.setHex(0xffffff);
            material.emissiveIntensity = this.lift * .035;
        });
        this.shadow.scale.setScalar(1 + .04 * this.lift);
        this.button.classList.toggle('is-highlighted', raised);
        this.button.dataset.lift = this.lift.toFixed(3);
        if (raised) {
            this.application.renderer.cssInstance.domElement.style.cursor = 'pointer';
            this.application.renderer.instance.domElement.style.cursor = 'pointer';
        }
        if (!active) return;
        this.group.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(this.group);
        const corners = [-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z =>
            new THREE.Vector3(x < 0 ? bounds.min.x : bounds.max.x, y < 0 ? bounds.min.y : bounds.max.y,
                z < 0 ? bounds.min.z : bounds.max.z).project(this.application.camera.instance))));
        const screen = this.application.sizes;
        const left = (Math.min(...corners.map(p => p.x)) + 1) * screen.width / 2;
        const right = (Math.max(...corners.map(p => p.x)) + 1) * screen.width / 2;
        const top = (1 - Math.max(...corners.map(p => p.y))) * screen.height / 2;
        const bottom = (1 - Math.min(...corners.map(p => p.y))) * screen.height / 2;
        this.rect = { x: left, y: top, width: right - left, height: bottom - top };
        const anchor = bounds.getCenter(new THREE.Vector3());
        anchor.y = bounds.max.y;
        anchor.project(this.application.camera.instance);
        const { width, height } = this.application.sizes;
        const x = (anchor.x + 1) * width / 2;
        const y = (1 - anchor.y) * height / 2;
        this.button.style.left = `${THREE.MathUtils.clamp(x, Math.min(145, width / 2), Math.max(width - 145, width / 2))}px`;
        this.button.style.top = `${Math.max(40, y - 24)}px`;
        const center = bounds.getCenter(new THREE.Vector3()).project(this.application.camera.instance);
        this.button.dataset.modelX = `${(center.x + 1) * width / 2}`;
        this.button.dataset.modelY = `${(1 - center.y) * height / 2}`;
    }
}
