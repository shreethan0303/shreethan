"""Create a decal-free display stand-in from the owner's supplied CRF450 blend.
blender -b --disable-autoexec INPUT.blend --python this.py -- OUTPUT.glb PREVIEW.jpg
"""
import bpy, sys, math, json, hashlib
from pathlib import Path
from mathutils import Vector, Matrix
out,preview=map(Path,sys.argv[sys.argv.index('--')+1:]);out.parent.mkdir(parents=True,exist_ok=True)
objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
source_triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
def linear(c):return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
def material(name,hex,rough,metal):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=tuple(linear(int(hex[i:i+2],16)/255) for i in (0,2,4))+(1,)
 p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 return m
red=material('Solid red plastics','e42b24',.37,.05)
gold=material('Gold anodized forks','dbb255',.28,.72)
metal=material('Brushed aluminum','b0b4b7',.4,.72)
steel=material('Brake steel','8a9095',.4,.8)
black=material('Black hardware','25272a',.5,.25)
rubber=material('Tire rubber','151617',.95,0)
seat=material('Black seat and bar pad','1b1b1e',.88,0)
titanium=material('Warm exhaust metal','9d866a',.35,.7)
white=material('Neutral hardware','d5d7d6',.65,.1)
replacements={}
for o in objects:
 # Bound the geometry cost. Existing dense shapes already contain their silhouette.
 for mod in list(o.modifiers):
  if mod.type=='SUBSURF':o.modifiers.remove(mod)
 for slot in o.material_slots:
  old=slot.material.name if slot.material else ''
  if old in ['SHROUDS','NUMBERPLATES','FENDERS','FORKGUARD','Honda Red','Honda Red Seat']:new=red
  elif old=='FORK':new=gold
  elif old in ['SEAT','BARPAD']:new=seat
  elif old=='TIRE':new=rubber
  elif old in ['RIMS','BLACK PLASTICS','HANDLEBAR','HOSE','EXHAUST BLACK']:new=black
  elif old in ['EXHAUST FLAT','EXHAUST SHINE']:new=titanium
  elif old=='brakes':new=steel
  elif old=='WHITE':new=white
  else:new=metal
  slot.material=new;replacements[old]=new.name
# Evaluate while the source armature/curve guides still exist. Removing them
# first would straighten the chain's curve modifier and leave exploded geometry.
originals=list(bpy.context.scene.objects);bpy.context.view_layer.update()
graph=bpy.context.evaluated_depsgraph_get();display=[]
for source in objects:
 evaluated=source.evaluated_get(graph)
 mesh=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=graph)
 obj=bpy.data.objects.new(source.name+' display',mesh);bpy.context.collection.objects.link(obj)
 obj.matrix_world=source.matrix_world.copy();display.append((source.name,obj))
for original in originals:bpy.data.objects.remove(original,do_unlink=True)
objects=[]
for name,obj in display:obj.name=name;objects.append(obj)
bpy.context.view_layer.update()
# A tiny pitch adjustment puts both tire contact surfaces on one ground plane.
front=next(o for o in objects if o.name=='FRONT TIRE');rear=next(o for o in objects if o.name=='REAR TIRE')
points={o.name:[o.matrix_world@v.co for v in o.data.vertices] for o in [front,rear]}
def contacts(angle):
 r=Matrix.Rotation(angle,4,'X')
 return [min((r@v).z for v in values) for values in points.values()]
lo,hi=-.03,.03
for _ in range(35):
 mid=(lo+hi)/2;a,b=contacts(mid)
 if a>b:lo=mid
 else:hi=mid
pitch=(lo+hi)/2;rotation=Matrix.Rotation(pitch,4,'X')
for o in objects:o.matrix_world=rotation@o.matrix_world
bpy.context.view_layer.update()
all_points=[o.matrix_world@v.co for o in objects for v in o.data.vertices]
low=Vector([min(v[i] for v in all_points)for i in range(3)]);high=Vector([max(v[i] for v in all_points)for i in range(3)])
assert high.x-low.x < (high.y-low.y)*.6, 'Curve-guided geometry must be frozen before removing its guides'
center=Vector(((low.x+high.x)/2,(low.y+high.y)/2,low.z))
for o in objects:o.matrix_world.translation-=center
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();bike=bpy.context.object;bike.name='CRF450 display stand-in'
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bike['role']='Representative model for projects on an existing bike; not a bike built by Shreethan.'
bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',use_selection=True,export_yup=True,export_extras=True,export_cameras=False,export_lights=False)
report={'sourceBlendSha256':hashlib.sha256(Path(bpy.data.filepath).read_bytes()).hexdigest(),'sourceTriangles':source_triangles,'displayTriangles':sum(len(p.vertices)-2 for p in bike.data.polygons),'pitchRadians':pitch,'wheelGroundDifferenceMeters':abs(contacts(pitch)[0]-contacts(pitch)[1]),'dimensionsMeters':list(high-low),'materialReplacements':replacements,'rawSizeBytes':out.stat().st_size,'texturesExported':False,'role':'Temporary CRF450 stand-in; actual dirtbike projects and media pending.'}
out.with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n')
# A small genuine model preview for the readable project page/card.
preview.parent.mkdir(parents=True,exist_ok=True)
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=128;scene.cycles.use_adaptive_sampling=True;scene.cycles.adaptive_threshold=.05;scene.cycles.use_denoising=False
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.94,.94,.93,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.7
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.002));floor=bpy.context.object;floor.data.materials.append(material('Preview floor','f2f2ef',.9,0))
bpy.ops.object.light_add(type='AREA',location=(3,-4,5));light=bpy.context.object;light.data.energy=650;light.data.shape='DISK';light.data.size=5
light.rotation_euler=(Vector((0,0,.6))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(3,-3,1.8));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,.65))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=2.8;scene.camera=camera
scene.render.resolution_x=1000;scene.render.resolution_y=760;scene.render.resolution_percentage=100
scene.view_settings.view_transform='Standard';scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=90;scene.render.filepath=str(preview);bpy.ops.render.render(write_still=True)
print(json.dumps(report),flush=True)
