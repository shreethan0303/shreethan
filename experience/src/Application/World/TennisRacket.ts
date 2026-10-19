import * as THREE from 'three';

/** Textured Wilson rackets leaning in the same head-down arrangement as the reference. */
export default function tennisRacket(blade: THREE.Object3D, wilson: THREE.Object3D) {
    const rack = new THREE.Group();
    const rubber = new THREE.MeshStandardMaterial({ color: 0x171719, roughness: .95 });
    const silver = new THREE.MeshStandardMaterial({ color: 0x777b7e, metalness: .8, roughness: .35 });
    const paleGrip = new THREE.MeshStandardMaterial({ color: 0xe3e0d6, roughness: .95 });

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
    for (const x of [-.46, .46]) {
        box(.032, .038, .56, x, .019, 0, wood);
        box(.032, .565, .035, x, .3025, -.17, wood);
        box(.042, .025, .045, x, .014, -.23, rubber);
        box(.042, .025, .045, x, .014, .25, rubber);
        for (const y of [.032, .105, .55]) {
            const screw = new THREE.Mesh(new THREE.CylinderGeometry(.004, .004, .033, 12), silver);
            screw.rotation.z = Math.PI / 2; screw.position.set(x, y, y < .04 ? .20 : -.17); rack.add(screw);
        }
    }
    box(.89, .040, .030, 0, .555, -.17, wood);
    box(.89, .021, .018, 0, .560, -.146, rubber);
    box(.89, .030, .030, 0, .064, .20, wood);
    box(.89, .010, .055, 0, .084, .20, rubber);

    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    function normalize(source: THREE.Object3D, isBlade: boolean) {
        const model = source.clone(true);
        const orientation = new THREE.Group();
        orientation.add(model);
        // Both exports run along X, with different axes perpendicular to the string bed.
        const basis = isBlade
            ? new THREE.Matrix4().set(0,0,1,0, 1,0,0,0, 0,1,0,0, 0,0,0,1)
            : new THREE.Matrix4().set(0,1,0,0, 1,0,0,0, 0,0,-1,0, 0,0,0,1);
        orientation.quaternion.setFromRotationMatrix(basis);
        orientation.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(orientation);
        const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
        const scale = .686 / size.y;
        orientation.scale.setScalar(scale);
        orientation.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
        const result = new THREE.Group(); result.add(orientation);
        return result;
    }
    const normalized = [normalize(blade, true), normalize(wilson, false)];
    const finishes = [0xe1dfcf, 0x24272b, 0x13171c, 0xb1c926, 0xb6252b];
    for (let i = 0; i < 5; i++) {
        const x = (i - 2) * .151 + .025;
        // Two short padded pegs cradle each handle, with the faces aimed outwards.
        for (const dx of [-.030, .030]) bar(rack, v(x + dx, .560, -.155), v(x + dx, .560, -.045), .008, paleGrip);
        const item = normalized[i % 2].clone(true);
        item.name = `Wilson tennis racket ${i + 1}`;
        const finish = new THREE.Color(finishes[i]);
        item.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            const source = object.material as THREE.MeshStandardMaterial;
            const material = source.clone();
            // Preserve the supplied UV textures, grip, lettering and string transparency.
            // Recolor only saturated paint pixels; neutral markings retain their original detail.
            if (/Raketka|TennisRacket_Low1/i.test(source.name)) {
                material.onBeforeCompile = shader => {
                    shader.uniforms.racketFinish = { value: finish };
                    shader.fragmentShader = 'uniform vec3 racketFinish;\n' + shader.fragmentShader;
                    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
                        #include <map_fragment>
                        float hi = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b));
                        float lo = min(diffuseColor.r, min(diffuseColor.g, diffuseColor.b));
                        float paint = smoothstep(.10, .23, (hi - lo) / max(hi, .001));
                        diffuseColor.rgb = mix(diffuseColor.rgb, racketFinish * (.45 + hi * .55), paint);
                    `);
                };
                material.customProgramCacheKey = () => `racket-finish-${i}`;
            }
            object.material = material;
        });
        // Heads lean towards the viewer; the grips sit behind them on the top rail.
        item.rotation.set(-.55, (i - 2) * .018, Math.PI - .060);
        item.position.set(x, .685, -.16);
        // Seat the actual hoop surface on the padded rail, accounting for each export.
        item.updateMatrixWorld(true);
        const contact = new THREE.Vector3(0, Infinity, 0), point = new THREE.Vector3();
        item.traverse(object => {
            if (!(object instanceof THREE.Mesh)) return;
            const positions = object.geometry.getAttribute('position');
            for (let vertex = 0; vertex < positions.count; vertex++) {
                point.fromBufferAttribute(positions, vertex).applyMatrix4(object.matrixWorld);
                if (point.y < contact.y) contact.copy(point);
            }
        });
        item.position.y += .089 - contact.y;
        item.position.z += .20 - contact.z;
        rack.add(item);
    }
    return rack;
}
