/** Offline CAD display conversion. Set CAD_TOOL_MODULES to a directory containing
 * @gltf-transform/core, @gltf-transform/functions, @gltf-transform/extensions,
 * meshoptimizer (tested with glTF Transform 4.5.1). No runtime dependency changes.
 * Usage: node this.mjs source.glb output.glb intake|elevator
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
const modules = process.env.CAD_TOOL_MODULES;
if (!modules) throw new Error('Set CAD_TOOL_MODULES to the offline conversion dependencies.');
const get = relative => import(pathToFileURL(path.join(modules, relative)));
const { NodeIO, getBounds } = await get('@gltf-transform/core/dist/index.js');
const { flatten, join, weld, simplify, dedup, meshopt, transformPrimitive } = await get('@gltf-transform/functions/dist/index.js');
const { ALL_EXTENSIONS } = await get('@gltf-transform/extensions/dist/index.js');
const { MeshoptEncoder, MeshoptSimplifier } = await get('meshoptimizer/index.js');
await Promise.all([MeshoptEncoder.ready, MeshoptSimplifier.ready]);
const [source, destination, kind] = process.argv.slice(2);
if (!['intake', 'elevator'].includes(kind)) throw new Error('Expected intake or elevator.');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder': MeshoptEncoder});
const doc = await io.read(source), scene = doc.getRoot().listScenes()[0], original = scene.listChildren()[0];
const tags = new Map(), parts = [];
const intakeRoots = new Set();
if (kind === 'intake') {
    for (const child of original.listChildren()) {
        if (child.getName().startsWith('Kicker Assembly')) break;
        const b = getBounds(child);
        if (child.getName() !== 'Kraken X60 Brushless Motor <6>' && (b.max[1] < .08 || b.min[1] < -.15)) intakeRoots.add(child);
    }
}
let sourceTriangles = 0;
for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue;
    const ancestors = []; for (let n = node; n; n = n.getParentNode()) ancestors.push(n);
    let tag = 'Chassis';
    if (kind === 'intake' && ancestors.some(n => intakeRoots.has(n))) tag = 'Intake';
    if (kind === 'elevator') {
        if (ancestors.some(n => n.getName().startsWith('Middle Stage'))) tag = 'ElevatorMiddle';
        if (ancestors.some(n => n.getName().startsWith('Inner Stage') || n.getName().startsWith('shooter o'))) tag = 'ElevatorCarriage';
    }
    tags.set(node, tag);
    const triangles = mesh.listPrimitives().reduce((sum, p) => sum + (p.getIndices()?.getCount() || p.getAttribute('POSITION').getCount()) / 3, 0);
    sourceTriangles += triangles;
    parts.push({name: node.getName(), group: tag, sourceTriangles: triangles});
    // Clone shared materials only when the physical finish needs to differ.
    for (const primitive of mesh.listPrimitives()) {
        const material = primitive.getMaterial(); if (!material) continue;
        const c = material.getBaseColorFactor(), neutral = Math.max(...c.slice(0,3)) - Math.min(...c.slice(0,3)) < .025;
        const rubber = /WCP-1728|tire|colson/i.test(node.getName());
        if (rubber) {
            const copy = material.clone().setName('Drive tire rubber').setBaseColorFactor([.012,.014,.017,1]).setMetallicFactor(0).setRoughnessFactor(.86);
            primitive.setMaterial(copy);
        } else if (neutral) {
            const dark = Math.max(...c.slice(0,3)) < .15;
            material.setBaseColorFactor(dark ? [.025,.028,.032,1] : [.34,.36,.38,1]).setMetallicFactor(dark ? .2 : .65).setRoughnessFactor(dark ? .6 : .4);
        } else material.setMetallicFactor(.12).setRoughnessFactor(.55);
    }
}
console.log('Source parts', parts.length, 'triangles', sourceTriangles);
await doc.transform(weld(), simplify({simplifier: MeshoptSimplifier, ratio: .065, error: .003}), flatten());
const assembly = doc.createNode('DisplayAssembly').setRotation([-Math.SQRT1_2,0,0,Math.SQRT1_2]);
scene.addChild(assembly);
const groups = new Map();
for (const [node, tag] of tags) {
    if (!node.getMesh()) continue;
    if (!groups.has(tag)) {const group=doc.createNode(tag);assembly.addChild(group);groups.set(tag,group);}
    groups.get(tag).addChild(node);
}
// The intake rotates around its cross-robot hinge; counter-translate children so
// its neutral CAD pose is unchanged. Elevator groups stay in raw Z-up axes.
if (kind === 'intake') {
    const pivot=[0,-.1016,.1016], group=groups.get('Intake');
    group.setTranslation(pivot);
    for (const node of group.listChildren()) {const t=node.getTranslation();node.setTranslation(t.map((v,i)=>v-pivot[i]));}
}
const bounds=getBounds(assembly);
assembly.setTranslation([-(bounds.min[0]+bounds.max[0])/2,-bounds.min[1],-(bounds.min[2]+bounds.max[2])/2]);
await doc.transform(dedup(),join({keepNamed:false}));
// STEP faces arrive as many tiny primitives. Simplify once more after batching,
// so the detail budget applies to the actual mechanism rather than each face.
await doc.transform(weld(), simplify({simplifier: MeshoptSimplifier, ratio: .12, error: .0025}));
// Bake each batch's local transform into its geometry while preserving the
// mechanism parents. Rotated batch boxes otherwise inflate room/camera bounds.
for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    for (const primitive of node.getMesh().listPrimitives()) transformPrimitive(primitive, node.getMatrix());
    node.setTranslation([0,0,0]).setRotation([0,0,0,1]).setScale([1,1,1]);
}
// join may choose a child mesh name; keep the mechanism parents intact.
const displayTriangles=doc.getRoot().listMeshes().reduce((sum,m)=>sum+m.listPrimitives().reduce((s,p)=>s+p.getIndices().getCount()/3,0),0);
await fs.mkdir(path.dirname(destination),{recursive:true});
await io.write(destination.replace(/\.glb$/,'.uncompressed.glb'),doc);
await doc.transform(meshopt({encoder:MeshoptEncoder,level:'medium',quantizePosition:16}));
await io.write(destination,doc);
const manifest={sourceParts:parts,sourceTriangles,displayTriangles,sizeBytes:(await fs.stat(destination)).size,dimensionsMeters:bounds.max.map((v,i)=>v-bounds.min[i]),compression:'Meshopt medium; 16-bit positions',mechanism:kind,groups:[...groups.keys()],pivot:kind==='intake'?[0,-.1016,.1016]:null};
await fs.writeFile(destination.replace(/\.glb$/,'.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({...manifest,sourceParts:undefined}));
