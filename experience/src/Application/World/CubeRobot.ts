import * as THREE from 'three';
import Application from '../Application';
import { CameraKey } from '../Camera/Camera';
import { workshopLayout } from './WorkshopLayout';

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

    constructor() {
        const { application, group } = this;
        const layout = workshopLayout.cubeRobot;
        this.model = application.resources.items.gltfModel.cubeRobotModel.scene;
        const bounds = new THREE.Box3().setFromObject(this.model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = layout.width / Math.max(size.x, size.z);
        this.model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
        this.model.scale.setScalar(scale);
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

        this.button = document.createElement('button');
        this.button.id = 'cube-robot-access';
        this.button.className = 'cube-robot-access';
        this.button.textContent = 'Cube-solving robot';
        this.button.setAttribute('aria-label', 'Highlight cube-solving robot');
        this.button.hidden = true;
        document.getElementById('ui-app')!.appendChild(this.button);
        this.button.addEventListener('focus', () => { this.focused = true; });
        this.button.addEventListener('blur', () => { this.focused = false; });
        this.button.addEventListener('keydown', event => {
            if (event.key === 'Escape') { event.stopPropagation(); this.button.blur(); }
        });
        document.addEventListener('pointermove', event => {
            this.hovered = this.active() && this.hit(event.clientX, event.clientY);
        });
        document.addEventListener('pointerleave', () => { this.hovered = false; });
        document.addEventListener('click', event => {
            if ((event.target as Element).closest('button,a,[data-no-camera]')) return;
            if (this.active() && this.hit(event.clientX, event.clientY)) {
                event.preventDefault(); event.stopImmediatePropagation();
                this.button.focus({ preventScroll: true });
            }
        }, true);
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
        const anchor = bounds.getCenter(new THREE.Vector3());
        anchor.y = bounds.max.y;
        anchor.project(this.application.camera.instance);
        const { width, height } = this.application.sizes;
        const x = (anchor.x + 1) * width / 2;
        const y = (1 - anchor.y) * height / 2;
        this.button.style.left = `${THREE.MathUtils.clamp(x, 100, width - 100)}px`;
        this.button.style.top = `${Math.max(40, y - 24)}px`;
        const center = bounds.getCenter(new THREE.Vector3()).project(this.application.camera.instance);
        this.button.dataset.modelX = `${(center.x + 1) * width / 2}`;
        this.button.dataset.modelY = `${(1 - center.y) * height / 2}`;
    }
}
