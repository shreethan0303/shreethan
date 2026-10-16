import * as THREE from 'three';
import Application from '../Application';
import { CameraKey } from '../Camera/Camera';
import UIEventBus from '../UI/EventBus';
import { workshopLayout } from './WorkshopLayout';

/** Lightweight paper geometry, pointer picking, and the bridge to readable HTML. */
export default class ResumePaper {
    application: Application;
    sheet: THREE.Mesh;
    shadow: THREE.Mesh;
    group = new THREE.Group();
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
    hovered = false;
    focused = false;
    open = false;
    lift = 0;
    rect = { x: 0, y: 0, width: 0, height: 0 };

    constructor() {
        this.application = new Application();
        const layout = workshopLayout.resume;
        this.group.name = 'Resume paper';
        this.group.position.fromArray(layout.position);
        this.group.rotation.y = layout.rotation;

        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 1164;
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#fffefb';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#dcdedb';
        context.lineWidth = 1.5;
        for (let y = 195; y < canvas.height - 40; y += 44) {
            context.beginPath(); context.moveTo(55, y); context.lineTo(845, y); context.stroke();
        }
        context.strokeStyle = '#d9d0c7';
        context.beginPath(); context.moveTo(100, 40); context.lineTo(100, 1124); context.stroke();
        context.fillStyle = '#272725';
        context.font = '32px Arial'; context.fillText('Shreethan Palla', 135, 100);
        context.font = '48px Georgia'; context.fillText('Résumé', 135, 158);
        context.fillStyle = '#71716d';
        context.font = '22px Arial'; context.fillText('Placeholder', 135, 1090);
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(4, this.application.renderer.instance.capabilities.getMaxAnisotropy());
        const geometry = new THREE.PlaneGeometry(layout.width, layout.height, 10, 14);
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            // A tiny curl catches the edge without making the sheet look like a board.
            const edge = Math.max(0, positions.getX(i) / layout.width - .25);
            positions.setZ(i, edge * edge * 100);
        }
        geometry.computeVertexNormals();
        this.sheet = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            map: texture, color: new THREE.Color().setScalar(.9), side: THREE.DoubleSide,
        }));
        this.sheet.rotation.x = -Math.PI / 2;
        this.group.add(this.sheet);
        this.application.scene.add(this.group);

        const shade = document.createElement('canvas');
        shade.width = 256; shade.height = 336;
        const shadeContext = shade.getContext('2d')!;
        shadeContext.shadowColor = '#000'; shadeContext.shadowBlur = 16;
        shadeContext.fillStyle = '#000'; shadeContext.fillRect(24, 24, 208, 288);
        this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(layout.width * 1.18, layout.height * 1.18),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shade), transparent: true, opacity: .14, depthWrite: false }));
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.rotation.z = -layout.rotation;
        this.shadow.position.set(layout.position[0], -449, layout.position[2]);
        this.application.scene.add(this.shadow);

        document.addEventListener('pointermove', event => {
            this.hovered = this.active() && this.hit(event.clientX, event.clientY);
        });
        document.addEventListener('pointerleave', () => { this.hovered = false; });
        document.addEventListener('click', event => {
            if ((event.target as Element).closest('button,a,[data-no-camera]')) return;
            if (this.active() && this.hit(event.clientX, event.clientY)) {
                event.preventDefault(); event.stopImmediatePropagation();
                this.showResume();
            }
        }, true);
        UIEventBus.on('resume:request', () => { if (this.active()) this.showResume(); });
        UIEventBus.on('resume:focus', (focused: boolean) => { this.focused = focused; });
        UIEventBus.on('resume:visibility', (open: boolean) => {
            this.open = open;
            this.application.camera.interactionLocked = open;
            this.sheet.visible = !open;
            this.shadow.visible = !open;
            this.hovered = false;
            this.focused = false;
        });
    }

    active() {
        const camera = this.application.camera;
        return camera.currentKeyframe === CameraKey.DESK && !camera.freeCam && !this.open;
    }

    hit(x: number, y: number) {
        const canvas = this.application.renderer.instance.domElement.getBoundingClientRect();
        this.pointer.set((x - canvas.left) / canvas.width * 2 - 1, -(y - canvas.top) / canvas.height * 2 + 1);
        this.raycaster.setFromCamera(this.pointer, this.application.camera.instance);
        return this.raycaster.intersectObject(this.sheet).length > 0;
    }

    showResume() {
        UIEventBus.dispatch('resume:open', this.rect);
    }

    update() {
        const active = this.active();
        const raised = active && (this.hovered || this.focused);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const blend = reduced ? 1 : 1 - Math.exp(-this.application.time.delta / 100);
        this.lift += ((raised ? 1 : 0) - this.lift) * blend;
        this.group.position.y = workshopLayout.resume.position[1] + this.lift * workshopLayout.resume.lift;
        (this.sheet.material as THREE.MeshBasicMaterial).color.setScalar(.9 + .1 * this.lift);
        this.shadow.scale.setScalar(1 + this.lift * .08);
        (this.shadow.material as THREE.MeshBasicMaterial).opacity = .14 - this.lift * .035;
        const cursor = raised ? 'pointer' : 'auto';
        this.application.renderer.cssInstance.domElement.style.cursor = cursor;
        this.application.renderer.instance.domElement.style.cursor = cursor;
        const button = document.getElementById('resume-paper-access') as HTMLButtonElement | null;
        if (!button) return;
        button.hidden = !active;
        button.disabled = !active;
        if (!active) return;
        this.group.updateMatrixWorld(true);
        const { width, height } = workshopLayout.resume;
        const points = [-1, 1].flatMap(x => [-1, 1].map(y => {
            const point = this.sheet.localToWorld(new THREE.Vector3(x * width / 2, y * height / 2, 0));
            return point.project(this.application.camera.instance);
        }));
        const { width: screenWidth, height: screenHeight } = this.application.sizes;
        const left = (Math.min(...points.map(p => p.x)) + 1) / 2 * screenWidth;
        const right = (Math.max(...points.map(p => p.x)) + 1) / 2 * screenWidth;
        const top = (1 - Math.max(...points.map(p => p.y))) / 2 * screenHeight;
        const bottom = (1 - Math.min(...points.map(p => p.y))) / 2 * screenHeight;
        this.rect = { x: left, y: top, width: right - left, height: bottom - top };
        button.style.left = `${(left + right) / 2}px`;
        button.style.top = `${bottom + 8}px`;
        button.dataset.paperX = `${(left + right) / 2}`;
        button.dataset.paperY = `${(top + bottom) / 2}`;
        button.dataset.lift = this.lift.toFixed(3);
    }
}
