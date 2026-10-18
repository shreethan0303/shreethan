import * as THREE from 'three';
import Application from '../Application';
import { workshopLayout } from './WorkshopLayout';

/** Original lightweight presentation models, inspired by a 75% board and ergonomic gaming mouse. */
function roundedBox(width: number, height: number, depth: number, radius: number) {
    const s = new THREE.Shape(), x = -width / 2, z = -depth / 2;
    s.moveTo(x + radius, z); s.lineTo(x + width - radius, z);
    s.quadraticCurveTo(x + width, z, x + width, z + radius);
    s.lineTo(x + width, z + depth - radius); s.quadraticCurveTo(x + width, z + depth, x + width - radius, z + depth);
    s.lineTo(x + radius, z + depth); s.quadraticCurveTo(x, z + depth, x, z + depth - radius);
    s.lineTo(x, z + radius); s.quadraticCurveTo(x, z, x + radius, z);
    const bevel = Math.min(height / 6, radius / 3);
    const geometry = new THREE.ExtrudeGeometry(s, { depth: height - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, steps: 1, curveSegments: 4 });
    geometry.translate(0, 0, bevel); geometry.rotateX(-Math.PI / 2);
    return geometry;
}

export default class DeskPeripherals {
    application = new Application();
    keyboard = new THREE.Group();
    mouse = new THREE.Group();
    constructor() {
        this.keyboard.name = '75 percent mechanical keyboard';
        this.keyboard.position.fromArray(workshopLayout.keyboard.position);
        this.keyboard.rotation.y = workshopLayout.keyboard.rotation;
        this.mouse.name = 'Ergonomic gaming mouse';
        this.mouse.position.fromArray(workshopLayout.mouse.position);
        this.mouse.rotation.y = workshopLayout.mouse.rotation;
        this.makeKeyboard(); this.makeMouse();
        this.application.scene.add(this.keyboard, this.mouse);
        this.contactShadow(this.keyboard, 1410, 620);
        this.contactShadow(this.mouse, 380, 560);
    }
    add(group: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
        const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); group.add(mesh); return mesh;
    }
    makeKeyboard() {
        const frame = new THREE.MeshStandardMaterial({ color: 0x181a1d, roughness: .6, metalness: .25 });
        const tray = new THREE.MeshStandardMaterial({ color: 0x0d0e10, roughness: .8 });
        this.add(this.keyboard, roundedBox(1340, 72, 560, 32), frame);
        this.add(this.keyboard, roundedBox(1286, 8, 508, 16), tray, 0, 72);
        const keys: { x: number; z: number; width: number; label: string }[] = [];
        const pitch = 78, start = -611;
        const row = (z: number, items: (string | [string, number])[]) => {
            let unit = 0;
            items.forEach(item => {
                const [label, units] = typeof item === 'string' ? [item, 1] : item;
                keys.push({ x: start + (unit + units / 2) * pitch, z, width: units * pitch - 9, label }); unit += units;
            });
        };
        row(-210, ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']);
        row(-126, ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', ['Back', 1.75], 'Del']);
        row(-42, [['Tab', 1.5], 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', ['\\', 1.25], 'Home']);
        row(42, [['Caps', 1.75], 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", ['Enter', 2], 'PgUp']);
        row(126, [['Shift', 2.25], 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ['Shift', 1.5], '↑', 'PgDn']);
        row(210, [['Ctrl', 1.25], ['Win', 1.25], ['Alt', 1.25], ['', 6.25], 'Alt', 'Fn', '←', '↓', '→']);
        const caps = new THREE.InstancedMesh(roundedBox(1, 1, 1, .11), new THREE.MeshStandardMaterial({ color: 0xf2f0e9, roughness: .55, metalness: .02 }), keys.length);
        caps.name = 'White sculpted keycaps';
        const transform = new THREE.Object3D();
        keys.forEach((key, i) => { transform.position.set(key.x, 80, key.z); transform.scale.set(key.width, 42, 69); transform.updateMatrix(); caps.setMatrixAt(i, transform.matrix); });
        this.keyboard.add(caps);
        // One transparent atlas for all legends, rather than one texture/draw call per key.
        const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1024;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#34363a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        keys.forEach(key => {
            ctx.font = `${key.label.length > 2 ? 18 : 25}px Arial`;
            ctx.fillText(key.label, (key.x / 1340 + .5) * 2048, (key.z / 560 + .5) * 1024);
        });
        const texture = new THREE.CanvasTexture(canvas); texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = Math.min(4, this.application.renderer.instance.capabilities.getMaxAnisotropy());
        const legends = this.add(this.keyboard, new THREE.PlaneGeometry(1340, 560), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), 0, 123, 0);
        legends.rotation.x = -Math.PI / 2;
        const metal = new THREE.MeshStandardMaterial({ color: 0x949a9e, metalness: .7, roughness: .3 });
        const ring = this.add(this.keyboard, new THREE.CylinderGeometry(53, 53, 12, 32), metal, 555, 91, -210);
        ring.name = 'Dial trim';
        this.add(this.keyboard, new THREE.CylinderGeometry(47, 47, 49, 32), frame, 555, 118, -210);
        const grip = new THREE.InstancedMesh(new THREE.BoxGeometry(3, 38, 5), frame, 32);
        for (let i = 0; i < 32; i++) { const a = i * Math.PI / 16; transform.position.set(555 + Math.sin(a) * 47, 118, -210 + Math.cos(a) * 47); transform.rotation.y = a; transform.scale.set(1, 1, 1); transform.updateMatrix(); grip.setMatrixAt(i, transform.matrix); }
        this.keyboard.add(grip);
        this.add(this.keyboard, roundedBox(5, 2, 16, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), 555, 143, -235);
    }
    makeMouse() {
        const body = new THREE.MeshStandardMaterial({ color: 0x191b1e, roughness: .55, metalness: .12 });
        const button = new THREE.MeshStandardMaterial({ color: 0x303338, roughness: .6, metalness: .08 });
        const light = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.add(this.mouse, roundedBox(242, 20, 450, 65), body);
        const rings = [
            [-250, 65, 42], [-210, 118, 108], [-130, 134, 160], [-30, 142, 180],
            [65, 139, 171], [150, 121, 138], [215, 84, 81], [245, 22, 24],
        ];
        const positions: number[] = [], indices: number[] = [], segments = 20;
        rings.forEach(([z, width, height]) => { for (let j = 0; j <= segments; j++) { const a = j / segments * Math.PI; positions.push(Math.cos(a) * width, 17 + Math.sin(a) * height, z); } });
        for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < segments; j++) { const a = i * (segments + 1) + j, b = a + segments + 1; indices.push(a, a + 1, b, a + 1, b + 1, b); }
        // Close the ends so the shell remains a solid object from free-camera angles.
        for (const row of [0, rings.length - 1]) {
            const center = positions.length / 3; positions.push(0, 17, rings[row][0]);
            for (let j = 0; j < segments; j++) {
                const a = row * (segments + 1) + j;
                if (row === 0) indices.push(center, a + 1, a);
                else indices.push(center, a, a + 1);
            }
        }
        const shell = new THREE.BufferGeometry(); shell.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); shell.setIndex(indices); shell.computeVertexNormals();
        this.add(this.mouse, shell, body);
        const profile = (z: number) => {
            const i = Math.max(0, Math.min(rings.length - 2, rings.findIndex(r => r[0] >= z) - 1));
            const a = rings[i], b = rings[i + 1], t = (z - a[0]) / (b[0] - a[0]);
            return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
        };
        // Curved primary buttons follow the body instead of floating flat above it.
        for (const side of [-1, 1]) {
            const vertices: number[] = [], faces: number[] = [], zs = [-236, -205, -165, -120, -65, -20], columns = 9;
            zs.forEach(z => {
                const [width, height] = profile(z);
                for (let j = 0; j < columns; j++) {
                    const t = .045 + j / (columns - 1) * .8;
                    vertices.push(side * width * t, 24 + height * Math.sqrt(1 - t * t), z);
                }
            });
            for (let row = 0; row < zs.length - 1; row++) for (let j = 0; j < columns - 1; j++) {
                const a = row * columns + j, b = a + columns;
                if (side === 1) faces.push(a, b, a + 1, a + 1, b, b + 1);
                else faces.push(a, a + 1, b, a + 1, b + 1, b);
            }
            const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geometry.setIndex(faces); geometry.computeVertexNormals();
            this.add(this.mouse, geometry, button);
        }
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x747b82, roughness: .35, metalness: .7 });
        const wheel = this.add(this.mouse, new THREE.CylinderGeometry(22, 22, 40, 20), wheelMaterial, 0, 175, -151); wheel.rotation.z = Math.PI / 2;
        this.add(this.mouse, roundedBox(23, 10, 22, 5), button, 0, 195, -75);
        const thumbRest = this.add(this.mouse, roundedBox(78, 22, 173, 25), body, -130, 10, 51); thumbRest.rotation.y = -.15;
        for (const z of [-42, 30]) { const thumbButton = this.add(this.mouse, roundedBox(20, 18, 58, 7), button, -134, 86, z); thumbButton.rotation.z = .25; }
        const [ledWidth, ledHeight] = profile(100);
        const points = [-1, -.8, -.5, 0, .5, .8, 1].map(t => {
            const x = t * 126;
            return new THREE.Vector3(x, 21 + ledHeight * Math.sqrt(1 - (x / ledWidth) ** 2), 100);
        });
        const strip = this.add(this.mouse, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 4, 6, false), light);
        strip.name = 'White rear LED strip';
    }
    contactShadow(group: THREE.Group, width: number, depth: number) {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
        const ctx = canvas.getContext('2d')!, gradient = ctx.createRadialGradient(32, 32, 5, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(0,0,0,.26)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 64, 64);
        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }));
        shadow.rotation.x = -Math.PI / 2; shadow.rotation.z = -group.rotation.y;
        shadow.position.copy(group.position); shadow.position.y += 1;
        this.application.scene.add(shadow);
    }
}
