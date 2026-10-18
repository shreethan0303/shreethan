/** Compress the baked CRF450 stand-in. Offline dependencies: glTF Transform 4.5.1 and meshoptimizer.
 * CAD_TOOL_MODULES=/path/to/node_modules node this.mjs raw.glb display.glb source.zip
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const modules=process.env.CAD_TOOL_MODULES;
if(!modules)throw new Error('Set CAD_TOOL_MODULES to the offline conversion dependencies.');
const get=relative=>import(pathToFileURL(path.join(modules,relative)));
const {NodeIO}=await get('@gltf-transform/core/dist/index.js');
const {ALL_EXTENSIONS}=await get('@gltf-transform/extensions/dist/index.js');
const {dedup,flatten,join,weld,prune,meshopt}=await get('@gltf-transform/functions/dist/index.js');
const {MeshoptEncoder}=await get('meshoptimizer/index.js');
const [source,destination,archive]=process.argv.slice(2);
if(!source||!destination||!archive)throw new Error('Expected raw.glb display.glb source.zip');
await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder});
const doc=await io.read(source);
await doc.transform(dedup(),flatten(),join(),weld(),prune(),meshopt({encoder:MeshoptEncoder,level:'medium',quantizePosition:16}));
if(doc.getRoot().listTextures().length)throw new Error('The solid-color stand-in must not retain decal textures.');
fs.mkdirSync(path.dirname(destination),{recursive:true});await io.write(destination,doc);
const report=JSON.parse(fs.readFileSync(source.replace(/\.glb$/i,'.json'),'utf8'));
report.sizeBytes=fs.statSync(destination).size;
report.archiveSha256=createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
report.sourceArchive=path.basename(archive);
report.attribution='User-supplied downloaded model; author, source URL and license were not included in the archive.';
fs.writeFileSync(destination.replace(/\.glb$/i,'.json'),JSON.stringify(report,null,2)+'\n');
console.log({sizeBytes:report.sizeBytes,triangles:report.displayTriangles,materials:doc.getRoot().listMaterials().length,textures:0});
