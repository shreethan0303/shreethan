import * as THREE from 'three';

/** Four CAD-based Pro Staff-style rackets, stored head-down as on a floor rack. */
export default function tennisRacket(frame: THREE.Object3D) {
    const rack = new THREE.Group();
    const graphite = new THREE.MeshStandardMaterial({ color: 0x08090b, roughness: .43, metalness: .08 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x171719, roughness: .95 });
    const silver = new THREE.MeshStandardMaterial({ color: 0x777b7e, metalness: .8, roughness: .35 });
    const ivory = new THREE.MeshStandardMaterial({ color: 0xe4dfcd, roughness: .7 });
    const red = new THREE.MeshStandardMaterial({ color: 0xaf1825, roughness: .6 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xb19a64, metalness: .45, roughness: .5 });
    const paleGrip = new THREE.MeshStandardMaterial({ color: 0xe3e0d6, roughness: .95 });
    const darkGrip = new THREE.MeshStandardMaterial({ color: 0x101113, roughness: .95 });

    // Subtle longitudinal grain, shared by the slim solid-wood rails and uprights.
    const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#a9774c'; ctx.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 55; i++) {
        const x = (i * 23.17) % 64;
        ctx.strokeStyle = i % 3 ? 'rgba(60,27,10,.09)' : 'rgba(245,209,151,.13)';
        ctx.lineWidth = .4 + (i % 3) * .3;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x + 3, 80, x - 3, 160, x + 1, 256); ctx.stroke();
    }
    const grain = new THREE.CanvasTexture(canvas); grain.encoding = THREE.sRGBEncoding;
    const wood = new THREE.MeshStandardMaterial({ map: grain, roughness: .76 });
    const bar = (parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material, sides = 10) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), sides), material);
        mesh.position.copy(a).add(b).multiplyScalar(.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        parent.add(mesh); return mesh;
    };
    const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        mesh.position.set(x, y, z); rack.add(mesh);
    };
    // Open sides and narrow feet replace the old plinth and grip blocks.
    for (const x of [-.42, .42]) {
        box(.032, .038, .40, x, .019, 0, wood);
        box(.032, .61, .035, x, .335, -.12, wood);
        box(.042, .025, .045, x, .014, -.17, rubber);
        box(.042, .025, .045, x, .014, .17, rubber);
        for (const y of [.032, .105, .60]) {
            const screw = new THREE.Mesh(new THREE.CylinderGeometry(.004, .004, .033, 12), silver);
            screw.rotation.z = Math.PI / 2; screw.position.set(x, y, y < .04 ? .11 : -.12); rack.add(screw);
        }
    }
    box(.81, .040, .030, 0, .603, -.12, wood);
    box(.81, .021, .018, 0, .608, -.096, rubber);
    box(.81, .030, .030, 0, .064, .12, wood);
    box(.81, .010, .042, 0, .084, .12, rubber);
    box(.81, .026, .025, 0, .075, -.12, wood);

    // The CAD file supplies the curved hoop and throat. Each instance shares geometry.
    const racket = new THREE.Group(); racket.name = 'Black Pro Staff-style racket';
    const cad = frame.clone(true);
    cad.traverse(object => { if (object instanceof THREE.Mesh) object.material = graphite; });
    racket.add(cad);
    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    // The original STL's flat grid is replaced by an open 16-main / 19-cross string bed.
    const stencil = [v(-.057, .547), v(-.029, .483), v(0, .525), v(.029, .483), v(.057, .547)];
    const isStencil = (p: THREE.Vector3) => stencil.slice(1).some((end, i) => {
        const start = stencil[i], delta = end.clone().sub(start);
        const t = THREE.MathUtils.clamp(p.clone().sub(start).dot(delta) / delta.lengthSq(), 0, 1);
        return p.distanceTo(start.clone().addScaledVector(delta, t)) < .0055;
    });
    const string = (a: THREE.Vector3, b: THREE.Vector3) => {
        // Color only the string portions touched by the red Wilson-style W stencil.
        const steps = Math.ceil(a.distanceTo(b) / .0035);
        let start = a.clone(), painted = isStencil(a);
        for (let i = 1; i <= steps; i++) {
            const end = a.clone().lerp(b, i / steps);
            const next = isStencil(end);
            if (next !== painted || i === steps) {
                bar(racket, start, end, .00055, painted ? red : ivory, 5);
                start = end; painted = next;
            }
        }
    };
    // Ellipse follows the inside of the imported hoop (head spans Y=.34–.686).
    for (let i = 0; i < 16; i++) {
        const x = (i - 7.5) * .0145;
        const h = .167 * Math.sqrt(1 - (x / .129) ** 2);
        string(v(x, .513 - h), v(x, .513 + h));
    }
    for (let i = 0; i < 19; i++) {
        const y = (i - 9) * .0158;
        const w = .129 * Math.sqrt(1 - (y / .167) ** 2);
        string(v(-w, .513 + y, .0006), v(w, .513 + y, .0006));
    }
    bar(racket, v(0, 0), v(0, .012), .019, graphite, 8);
    bar(racket, v(0, .217), v(0, .226), .0165, red, 8);
    // Two narrow gold bands at the base of the throat recall the black Pro Staff finish.
    bar(racket, v(-.008, .233), v(-.011, .241), .005, gold);
    bar(racket, v(.008, .233), v(.011, .241), .005, gold);
    const logoCanvas = document.createElement('canvas'); logoCanvas.width = 512; logoCanvas.height = 64;
    const logoContext = logoCanvas.getContext('2d')!;
    logoContext.fillStyle = '#eee9dc'; logoContext.font = 'italic 46px Arial';
    logoContext.textAlign = 'center'; logoContext.textBaseline = 'middle';
    logoContext.fillText('Wilson', 256, 32);
    const logoMap = new THREE.CanvasTexture(logoCanvas); logoMap.encoding = THREE.sRGBEncoding;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(.048, .006), new THREE.MeshBasicMaterial({ map: logoMap, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    label.position.set(-.009, .275, .011); label.rotation.z = Math.PI / 2 - .19; racket.add(label);

    const wrapGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 321 }, (_, i) => {
        const y = .014 + i / 320 * .197, angle = i / 320 * Math.PI * 2 * 14;
        // Follow an octagonal grip rather than the previous stack of circular rings.
        const r = .0162 * Math.cos(Math.PI / 8) / Math.cos((angle + Math.PI / 8) % (Math.PI / 4) - Math.PI / 8);
        return v(Math.cos(angle) * r, y, Math.sin(angle) * r);
    })), 320, .0006, 4, false);
    for (let i = 0; i < 4; i++) {
        const x = (i - 1.5) * .183;
        // Rounded, padded handle dividers on the upper rail, as in the reference.
        for (const dx of [-.035, .035]) bar(rack, v(x + dx, .608, -.105), v(x + dx, .608, -.015), .008, rubber);
        const item = racket.clone(true); item.name = `Tennis racket ${i + 1}`;
        const gripMaterial = i === 0 || i === 2 ? paleGrip : darkGrip;
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(.0162, .0162, .217, 8), gripMaterial);
        handle.position.y = .1135; item.add(handle);
        item.add(new THREE.Mesh(wrapGeometry, i === 0 || i === 2 ? ivory : rubber));
        item.rotation.set(-.36, 0, Math.PI);
        item.position.set(x, .735, -.12); rack.add(item);
    }
    return rack;
}
