"""Reduce the batched articulated display without joining its mechanism parents.
blender -b --factory-startup --python this.py -- input.glb output.glb ratio
Then apply Meshopt compression to output.glb as a final separate step.
"""
import bpy,sys
source,destination,ratio=sys.argv[sys.argv.index('--')+1:]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=source)
for o in list(bpy.data.objects):
 if o.type!='MESH':continue
 bpy.context.view_layer.objects.active=o
 if len(o.data.polygons)>500:
  m=o.modifiers.new('Display detail budget','DECIMATE');m.ratio=float(ratio);m.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=m.name)
for o in list(bpy.data.objects):
 if o.type!='MESH':continue
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
 bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons)for o in bpy.data.objects if o.type=='MESH')
bpy.ops.export_scene.gltf(filepath=destination,export_format='GLB',export_extras=True,export_cameras=False,export_lights=False)
print('DISPLAY_TRIANGLES',triangles,flush=True)
