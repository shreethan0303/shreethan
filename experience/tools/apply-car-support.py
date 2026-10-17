"""Apply the measured support rotation to the prepared Blender asset before compression."""
import bpy,json,sys
from pathlib import Path
from mathutils import Quaternion,Vector
model_path, support_path, blend_path=sys.argv[sys.argv.index('--')+1:]
bpy.ops.wm.open_mainfile(filepath=blend_path);o=next(o for o in bpy.data.objects if o.type=='MESH')
j=json.load(open(support_path));x,y,z,w=j['quaternion'];o.rotation_mode='QUATERNION';o.rotation_quaternion=Quaternion((w,x,-z,y));bpy.context.view_layer.update()
p=[o.matrix_world@v.co for v in o.data.vertices];lo=Vector([min(v[a]for v in p)for a in range(3)]);hi=Vector([max(v[a]for v in p)for a in range(3)])
o.location-=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z));bpy.context.view_layer.objects.active=o;bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bpy.ops.export_scene.gltf(filepath=model_path,export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=blend_path)
p=str(Path(model_path).with_suffix('.json'));r=json.load(open(p));r['restingPose']=j;r['dimensionsMeters']=list(hi-lo);open(p,'w').write(json.dumps(r,indent=2)+'\n')
