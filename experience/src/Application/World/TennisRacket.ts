import * as THREE from 'three';

/** Upright, thin-beam black racket in a compact oak display stand. */
export default function tennisRacket() {
    const model = new THREE.Group();
    const black = new THREE.MeshStandardMaterial({ color: 0x161719, roughness: .42, metalness: .12 });
    const grip = new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: .95 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xb09a65, roughness: .5, metalness: .4 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x9b683f, roughness: .85 });
    const string = new THREE.MeshStandardMaterial({ color: 0xbdb9aa, roughness: .8 });
    function bar(a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material) {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 8), material);
        mesh.position.copy(a).add(b).multiplyScalar(.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        model.add(mesh);
    }
    function box(w: number, h: number, d: number, x: number, y: number, z: number) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wood);
        mesh.position.set(x, y, z); model.add(mesh);
    }
    box(.32, .035, .23, 0, .0175, 0);
    box(.055, .14, .07, -.055, .09, 0);
    box(.055, .14, .07, .055, .09, 0);
    bar(new THREE.Vector3(0,.055,0), new THREE.Vector3(0,.25,0), .019, grip);
    for (let y = .065; y < .25; y += .016) {
        const wrap = new THREE.Mesh(new THREE.TorusGeometry(.0195,.0012,4,16), black);
        wrap.rotation.x = Math.PI / 2; wrap.position.y = y; model.add(wrap);
    }
    bar(new THREE.Vector3(0,.055,0), new THREE.Vector3(0,.065,0), .023, black);
    bar(new THREE.Vector3(0,.25,0), new THREE.Vector3(-.072,.365,0), .009, black);
    bar(new THREE.Vector3(0,.25,0), new THREE.Vector3(.072,.365,0), .009, black);
    const points = Array.from({length: 97}, (_, i) => {
        const angle = i / 96 * Math.PI * 2;
        return new THREE.Vector3(.123 * Math.cos(angle), .493 + .163 * Math.sin(angle), 0);
    });
    model.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true), 96, .009, 8, true), black));
    for (let x = -.10; x <= .101; x += .014) {
        const h = .153 * Math.sqrt(1 - (x / .115) ** 2);
        bar(new THREE.Vector3(x,.493-h,0),new THREE.Vector3(x,.493+h,0),.00065,string);
    }
    for (let y = -.133; y <= .134; y += .014) {
        const w = .115 * Math.sqrt(1 - (y / .153) ** 2);
        bar(new THREE.Vector3(-w,.493+y,.001),new THREE.Vector3(w,.493+y,.001),.00065,string);
    }
    bar(new THREE.Vector3(-.023,.287,.001),new THREE.Vector3(-.035,.306,.001),.0095,gold);
    bar(new THREE.Vector3(.023,.287,.001),new THREE.Vector3(.035,.306,.001),.0095,gold);
    return model;
}
