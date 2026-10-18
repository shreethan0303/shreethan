"""Rebuild only the desk and its baked contact shadows; retain the reference backdrop.
Run with: blender -b --factory-startup -t 8 --python experience/tools/build-empty-workbench.py
"""
from pathlib import Path
import bpy
from mathutils import Vector
from mathutils.geometry import barycentric_transform

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'static/models/World'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(OUT / 'environment.glb'))
background = bpy.data.objects['Background']
for obj in list(bpy.context.scene.objects):
    if obj != background:
        bpy.data.objects.remove(obj, do_unlink=True)
original = bpy.data.images.load(str(OUT / 'baked_environment.jpg'))
source_uv = background.data.uv_layers.active
source_uv.name = 'SourceUV'
# Sample an unoccupied piece of the original floor to preserve its neutral color.
hit, point, _, face = background.ray_cast(Vector((9, 0, 5)), Vector((0, 0, -1)))
assert hit
poly = background.data.polygons[face]
loops = list(poly.loop_indices)[:3]
verts = [background.data.vertices[background.data.loops[i].vertex_index].co for i in loops]
uvs = [Vector((*source_uv.data[i].uv, 0)) for i in loops]
uv = barycentric_transform(point, *verts, *uvs)
pixels = original.pixels[:]
x = int(uv.x * (original.size[0] - 1)); y = int(uv.y * (original.size[1] - 1))
index = (y * original.size[0] + x) * 4
def linear(c):
    return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
floor_color = tuple(linear(c) for c in pixels[index:index+3]) + (1,)
print('Unoccupied original floor color:', floor_color, flush=True)

# Keep the original background everywhere except the obsolete prop shadows.
mat = bpy.data.materials.new('Original backdrop with cleared floor')
mat.use_nodes = True
nodes = mat.node_tree.nodes; nodes.clear(); links = mat.node_tree.links
output = nodes.new('ShaderNodeOutputMaterial')
emission = nodes.new('ShaderNodeEmission'); links.new(emission.outputs[0], output.inputs['Surface'])
texture = nodes.new('ShaderNodeTexImage'); texture.image = original
uvnode = nodes.new('ShaderNodeUVMap'); uvnode.uv_map = 'SourceUV'
links.new(uvnode.outputs[0], texture.inputs[0])
geometry = nodes.new('ShaderNodeNewGeometry')
separate = nodes.new('ShaderNodeSeparateXYZ'); links.new(geometry.outputs['Position'], separate.inputs[0])
combine = nodes.new('ShaderNodeCombineXYZ')
links.new(separate.outputs['X'], combine.inputs['X']); links.new(separate.outputs['Y'], combine.inputs['Y'])
length = nodes.new('ShaderNodeVectorMath'); length.operation='LENGTH'; links.new(combine.outputs[0], length.inputs[0])
falloff = nodes.new('ShaderNodeMapRange'); falloff.interpolation_type='SMOOTHSTEP'
falloff.inputs['From Min'].default_value=6; falloff.inputs['From Max'].default_value=13
falloff.inputs['To Min'].default_value=1; falloff.inputs['To Max'].default_value=0
links.new(length.outputs['Value'], falloff.inputs['Value'])
floor_mask = nodes.new('ShaderNodeMath'); floor_mask.operation='LESS_THAN'; floor_mask.inputs[1].default_value=-3.30
links.new(separate.outputs['Z'], floor_mask.inputs[0])
mask = nodes.new('ShaderNodeMath'); mask.operation='MULTIPLY'
links.new(falloff.outputs[0], mask.inputs[0]); links.new(floor_mask.outputs[0], mask.inputs[1])
ao = nodes.new('ShaderNodeAmbientOcclusion'); ao.inputs['Color'].default_value=floor_color; ao.inputs['Distance'].default_value=5; ao.samples=32
mix = nodes.new('ShaderNodeMixRGB'); links.new(mask.outputs[0], mix.inputs[0]); links.new(texture.outputs['Color'], mix.inputs[1]); links.new(ao.outputs['Color'], mix.inputs[2]); links.new(mix.outputs[0], emission.inputs['Color'])
background.data.materials.clear(); background.data.materials.append(mat)

# Extend only the left edge by 1200 scene units; keep the right edge and desk height.
def material(name, color):
    m = bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Roughness'].default_value=.85
    return m
wood = material('Original charcoal brown tabletop', (.105, .096, .083))
metal = material('Original graphite grey legs', (.19, .19, .185))
parts=[]
def box(name, center, size, material, bevel):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj=bpy.context.object; obj.name=name; obj.dimensions=size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    modifier=obj.modifiers.new('Subtle edge', 'BEVEL'); modifier.width=bevel; modifier.segments=3
    bpy.context.view_layer.objects.active=obj; bpy.ops.object.modifier_apply(modifier=modifier.name)
    parts.append(obj)
left_extension = 1200 / 900
box('Tabletop', (-.6147-left_extension/2,-.27345,-.5713), (6.74265+left_extension,3.09459,.13825), wood, .012)
for i,(x,y) in enumerate([(-3.74-left_extension,1.001),(2.475,1.001),(-3.74-left_extension,-1.559),(2.475,-1.559)]):
    box('Leg_'+str(i+1), (x,y,(-3.30959-.64)/2), (.224,.224,3.30959-.64), metal, .009)

# Pack the existing backdrop UVs and new desk into one lightweight baked atlas.
background.data.uv_layers.new(name='BakeUV', do_init=True)
for uv in background.data.uv_layers['BakeUV'].data:
    uv.uv.x *= .72
background.data.uv_layers.active_index=1
background.data.uv_layers['BakeUV'].active_render=True
bpy.ops.object.select_all(action='DESELECT')
for obj in parts: obj.select_set(True)
bpy.context.view_layer.objects.active=parts[0]
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.uv.smart_project(island_margin=.025); bpy.ops.object.mode_set(mode='OBJECT')
for obj in parts:
    obj.data.uv_layers.active.name='BakeUV'
    for uv in obj.data.uv_layers.active.data:
        uv.uv.x=.735+uv.uv.x*.25; uv.uv.y=.015+uv.uv.y*.97

scene=bpy.context.scene
scene.render.engine='CYCLES'; scene.cycles.samples=32; scene.cycles.use_denoising=False
scene.world.use_nodes=True; scene.world.node_tree.nodes['Background'].inputs[0].default_value=(1,1,1,1); scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65
bpy.ops.object.light_add(type='AREA', location=(-3,-4,8))
light=bpy.context.object; light.data.energy=1000; light.data.shape='DISK'; light.data.size=7
light.rotation_euler=(Vector((-.6,-.27,-.5))-light.location).to_track_quat('-Z','Y').to_euler()
image=bpy.data.images.new('Empty workbench bake',width=2048,height=2048,alpha=False)
for m in (mat,wood,metal):
    target=m.node_tree.nodes.new('ShaderNodeTexImage'); target.image=image; m.node_tree.nodes.active=target
bpy.ops.object.select_all(action='DESELECT')
for obj in [background]+parts: obj.select_set(True)
bpy.context.view_layer.objects.active=background
scene.render.bake.margin=8
bpy.ops.object.bake(type='COMBINED')
assert max(image.pixels[:][::4]) > .1, 'Bake produced an empty image'
image.filepath_raw=str(OUT / 'baked_empty_workbench.jpg'); image.file_format='JPEG'; scene.render.image_settings.quality=95; image.save()
# The renderer supplies the atlas; retain only the UV map used by that atlas.
for obj in [background]+parts:
    for uv in list(obj.data.uv_layers):
        if uv.name!='BakeUV': obj.data.uv_layers.remove(uv)
    obj.data.materials.clear()
# BakedModel scales mesh geometry, so freeze each part's placement into vertices.
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
bpy.ops.export_scene.gltf(filepath=str(OUT / 'empty_workbench.glb'),use_selection=True,export_format='GLB',export_materials='NONE',export_texcoords=True)
print('Empty desk and backdrop exported.', flush=True)
