import * as THREE from 'three';
import Application from '../Application';
import { afterCameraFrame, selectionMotion } from './SelectionMotion';
import { CameraKey } from '../Camera/Camera';
import { MonitorKeyframe } from '../Camera/CameraKeyframes';
import UIEventBus from '../UI/EventBus';
import { workshopLayout } from './WorkshopLayout';

/** A lightweight modern monitor. The real portfolio UI opens on selection. */
export default class PortfolioMonitor {
    application = new Application();
    group = new THREE.Group();
    screen: THREE.Mesh;
    button: HTMLButtonElement;
    meshes: THREE.Mesh[] = [];
    raycaster = new THREE.Raycaster();
    hovered = false;
    open = false;
    constructor() {
        const layout = workshopLayout.monitor;
        this.group.name = 'Portfolio monitor';
        this.group.position.fromArray(layout.position);
        const metal = new THREE.MeshStandardMaterial({
            color: 0x242629,
            roughness: 0.65,
            metalness: 0.25,
        });
        const add = (
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            x: number,
            y: number,
            z: number,
        ) => {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            this.group.add(mesh);
            this.meshes.push(mesh);
            return mesh;
        };
        add(new THREE.BoxGeometry(660, 55, 390), metal, 0, 27.5, 0);
        add(new THREE.BoxGeometry(110, 460, 100), metal, 0, 270, -55);
        const rounded = (width: number, height: number, radius: number) => {
            const s = new THREE.Shape(),
                x = -width / 2,
                y = -height / 2;
            s.moveTo(x + radius, y);
            s.lineTo(x + width - radius, y);
            s.quadraticCurveTo(x + width, y, x + width, y + radius);
            s.lineTo(x + width, y + height - radius);
            s.quadraticCurveTo(
                x + width,
                y + height,
                x + width - radius,
                y + height,
            );
            s.lineTo(x + radius, y + height);
            s.quadraticCurveTo(x, y + height, x, y + height - radius);
            s.lineTo(x, y + radius);
            s.quadraticCurveTo(x, y, x + radius, y);
            return s;
        };
        const frame = rounded(layout.width + 110, layout.height + 110, 65);
        const display = rounded(layout.width, layout.height, 22);
        frame.holes.push(display);
        add(
            new THREE.ExtrudeGeometry(frame, {
                depth: 110,
                bevelEnabled: false,
                curveSegments: 8,
            }),
            metal,
            0,
            layout.screenHeight,
            -55,
        );
        add(
            new THREE.BoxGeometry(layout.width - 10, layout.height - 10, 45),
            metal,
            0,
            layout.screenHeight,
            -65,
        );
        const geometry = new THREE.ShapeGeometry(display, 8),
            uv = geometry.getAttribute('uv'),
            pos = geometry.getAttribute('position');
        for (let i = 0; i < uv.count; i++)
            uv.setXY(
                i,
                pos.getX(i) / layout.width + 0.5,
                pos.getY(i) / layout.height + 0.5,
            );
        const texture = this.preview();
        this.screen = add(
            geometry,
            new THREE.MeshBasicMaterial({ map: texture }),
            0,
            layout.screenHeight,
            56,
        );
        this.application.scene.add(this.group);
        this.group.updateMatrixWorld(true);
        this.button = document.createElement('button');
        this.button.id = 'workspace-monitor-access';
        this.button.className = 'cube-robot-access';
        this.button.textContent = 'Portfolio workspace';
        this.button.hidden = true;
        this.button.setAttribute('aria-label', 'Open portfolio workspace');
        this.button.setAttribute('aria-haspopup', 'dialog');
        this.button.addEventListener('click', () => {
            if (this.active()) this.show();
        });
        document.getElementById('ui-app')!.appendChild(this.button);
        document.addEventListener('pointermove', (event) => {
            this.hovered =
                this.active() && this.hit(event.clientX, event.clientY);
        });
        document.addEventListener(
            'click',
            (event) => {
                if (
                    (event.target as Element).closest(
                        'button,a,[data-no-camera]',
                    )
                )
                    return;
                if (this.active() && this.hit(event.clientX, event.clientY)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.show();
                }
            },
            true,
        );
        UIEventBus.on('workspace:close', () => {
            if (!this.open) return;
            this.open = false;
            this.application.camera.transition(
                CameraKey.DESK,
                selectionMotion.returnToDesk,
                undefined,
                () => {
                    this.application.camera.interactionLocked = false;
                    requestAnimationFrame(() =>
                        this.button.focus({ preventScroll: true }),
                    );
                },
            );
        });
    }
    preview() {
        const canvas = document.createElement('canvas');
        canvas.width = 1440;
        canvas.height = 900;
        const c = canvas.getContext('2d')!;
        c.fillStyle = '#fff';
        c.fillRect(0, 0, 1440, 900);
        c.fillStyle = '#eef0f2';
        c.fillRect(0, 0, 1440, 70);
        c.fillRect(0, 840, 1440, 60);
        c.fillStyle = '#262a2e';
        c.font = '500 29px Arial';
        c.fillText('Shreethan Palla', 30, 46);
        c.font = '22px Arial';
        c.fillStyle = '#69727c';
        c.fillText('Portfolio', 315, 46);
        c.strokeStyle = '#dce0e4';
        c.beginPath();
        c.moveTo(295, 70);
        c.lineTo(295, 840);
        c.stroke();
        c.font = '23px Arial';
        c.fillText('Projects', 25, 125);
        [
            'Cube Solving Robot',
            'RC Car',
            'FRC Robot',
            'REEFSCAPE Robot',
        ].forEach((name, i) => {
            c.fillStyle = i === 0 ? '#e7f0fa' : '#fff';
            c.fillRect(12, 155 + i * 70, 270, 54);
            c.fillStyle = '#36424c';
            c.font = '21px Arial';
            c.fillText(name, 25, 190 + i * 70);
        });
        c.textAlign = 'center';
        c.fillStyle = '#2b3035';
        c.font = '500 52px Arial';
        c.fillText('Shreethan Palla', 865, 390);
        c.fillStyle = '#737d86';
        c.font = '25px Arial';
        c.fillText('Explore my projects', 865, 445);
        c.textAlign = 'left';
        c.font = '23px Arial';
        c.fillStyle = '#3976b9';
        c.fillText('Projects', 35, 879);
        c.fillStyle = '#56616b';
        c.fillText('About', 190, 879);
        c.fillText('Résumé', 325, 879);
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(
            8,
            this.application.renderer.instance.capabilities.getMaxAnisotropy(),
        );
        return texture;
    }
    active() {
        const c = this.application.camera;
        return (
            c.currentKeyframe === CameraKey.DESK &&
            !c.freeCam &&
            !c.interactionLocked
        );
    }
    hit(x: number, y: number) {
        const bounds =
            this.application.renderer.instance.domElement.getBoundingClientRect();
        this.raycaster.setFromCamera(
            new THREE.Vector2(
                ((x - bounds.left) / bounds.width) * 2 - 1,
                1 - ((y - bounds.top) / bounds.height) * 2,
            ),
            this.application.camera.instance,
        );
        return this.raycaster.intersectObjects(this.meshes, false).length > 0;
    }
    show() {
        this.open = true;
        this.application.camera.interactionLocked = true;
        (
            this.application.camera.keyframes.monitor as MonitorKeyframe
        ).setBounds(new THREE.Box3().setFromObject(this.screen));
        this.application.camera.transition(
            CameraKey.MONITOR,
            selectionMotion.approach,
            undefined,
            () => afterCameraFrame(() => UIEventBus.dispatch('workspace:open', {})),
        );
    }
    update() {
        const active = this.active();
        this.button.hidden = !active;
        this.button.disabled = !active;
        const highlighted =
            active && (this.hovered || document.activeElement === this.button);
        this.button.classList.toggle('is-highlighted', highlighted);
        if (highlighted) {
            this.application.renderer.instance.domElement.style.cursor =
                'pointer';
            this.application.renderer.cssInstance.domElement.style.cursor =
                'pointer';
        }
        if (!active) {
            this.hovered = false;
            return;
        }
        const center = new THREE.Box3()
            .setFromObject(this.screen)
            .getCenter(new THREE.Vector3())
            .project(this.application.camera.instance);
        const x = ((center.x + 1) * this.application.sizes.width) / 2,
            y = ((1 - center.y) * this.application.sizes.height) / 2;
        this.button.style.left = `${x}px`;
        this.button.style.top = `${y - 35}px`;
        this.button.dataset.modelX = `${x}`;
        this.button.dataset.modelY = `${y}`;
    }
}
