"""Offline Blender preparation of the supplied FRC/RC/driveshaft display copies.
Usage: blender -b --factory-startup --python this.py -- input.glb output.glb frc|rc|driveshaft
"""
import bpy,sys,json,math
from pathlib import Path
from mathutils import Vector,Matrix
source,destination,kind=sys.argv[sys.argv.index('--')+1:];destination=Path(destination);destination.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=source)
objects=[o for o in bpy.data.objects if o.type=='MESH'];source_count=len(objects)
source_triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons)for o in objects)
matrices={o.name:o.matrix_world.copy()for o in objects}
# These Onshape assemblies use -Y as their up direction. glTF export later maps Blender Z to browser Y.
rotation=Matrix.Rotation(-math.pi/2,4,'X') if kind in ('frc','rc') else Matrix.Identity(4)
for o in objects:
 o.parent=None;o.matrix_world=rotation@matrices[o.name]
 o['source_part']=o.name
bpy.context.view_layer.update()
def limits(items):
 points=[o.matrix_world@v.co for o in items for v in o.data.vertices]
 return Vector([min(p[a]for p in points)for a in range(3)]),Vector([max(p[a]for p in points)for a in range(3)])
lo,hi=limits(objects)
print('Corrected dimensions',list(hi-lo),flush=True)
# Keep explicit tire boundaries, rather than recoloring the whole car's green CAD palette.
cache={};material_map={}
def physical(original,rubber=False):
 node=original.node_tree.nodes.get('Principled BSDF') if original and original.use_nodes else None
 color=list(node.inputs['Base Color'].default_value)if node else [.5,.5,.5,1]
 metallic=.12;roughness=.55
 neutral=max(color[:3])-min(color[:3])<.025
 if rubber:color=[.012,.014,.017,1];metallic=0;roughness=.86
 elif kind=='frc' and neutral:
  if max(color[:3])<.15:color=[.025,.028,.032,1];metallic=.2;roughness=.6
  elif max(color[:3])>.88:color=[.68,.7,.71,1];metallic=.05;roughness=.7
  else:color=[.34,.36,.38,1];metallic=.65;roughness=.4
 elif kind=='rc' and neutral:metallic=.35;roughness=.48
 key=tuple(round(c,3)for c in color)+(metallic,roughness)
 if key not in cache:
  m=bpy.data.materials.new(('Rubber' if rubber else kind+' material')+' '+str(len(cache)));m.use_nodes=True
  n=m.node_tree.nodes.get('Principled BSDF');n.inputs['Base Color'].default_value=color;n.inputs['Metallic'].default_value=metallic;n.inputs['Roughness'].default_value=roughness;cache[key]=m
 return cache[key]
parts=[]
for index,o in enumerate(objects):
 bpy.context.view_layer.objects.active=o
 bbox=[o.matrix_world@Vector(v)for v in o.bound_box];span=max(max(p[a]for p in bbox)-min(p[a]for p in bbox)for a in range(3))
 tris=sum(len(p.vertices)-2 for p in o.data.polygons)
 if kind=='frc':budget=2200 if span>.25 else 900 if span>.08 else 220 if span>.025 else 64
 elif kind=='rc':budget=1800 if span>.08 else 700 if span>.025 else 240
 else:budget=2400
 if kind=='frc' and 'wheel' in o.name.lower():budget=max(budget,600)
 parts.append({'name':o.name,'sourceTriangles':tris,'budget':budget})
 for slot in o.material_slots:
  rubber=(kind=='rc' and slot.material.name=='mat_3')or(kind=='frc' and 'WCP-1728' in o.name)
  slot.material=physical(slot.material,rubber)
 if tris>budget:
  modifier=o.modifiers.new('Web detail budget','DECIMATE');modifier.ratio=budget/tris;modifier.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=modifier.name)
 if index%100==0:print('Prepared',index,'of',len(objects),flush=True)
# Actual transformed mesh bounds ensure no artificial rotated-box gap.
lo,hi=limits(objects);offset=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
for o in objects:o.matrix_world.translation-=offset
bpy.context.view_layer.update()
# Batch the static display copy. Original STEP and a part manifest retain the authoring source.
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();model=bpy.context.object;model.name=kind+' display assembly'
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
for p in model.data.polygons:p.use_smooth=True
model.data.set_sharp_from_angle(angle=.65)
normal=model.modifiers.new('CAD normals','WEIGHTED_NORMAL');normal.keep_sharp=True;bpy.ops.object.modifier_apply(modifier=normal.name)
model['source_part_count']=source_count
bpy.ops.export_scene.gltf(filepath=str(destination),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_yup=True)
report={'sourceMeshes':source_count,'sourceTriangles':source_triangles,'displayTriangles':sum(len(p.vertices)-2 for p in model.data.polygons),'materialBatches':len(set(s.material.name for s in model.material_slots if s.material)),'dimensionsMeters':list(hi-lo),'sizeBytes':destination.stat().st_size,'sourceParts':parts}
destination.with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n')
# The working file is outside the repository and is used only to inspect/render the true mesh.
bpy.ops.wm.save_as_mainfile(filepath='/tmp/'+kind+'-prepared.blend')
print(json.dumps({k:v for k,v in report.items()if k!='sourceParts'}),flush=True)
