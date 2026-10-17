"""Prepare this specific cube-solver assembly; run through convert-cube-step.py.
Cube stickers are material assignments on the actual CAD faces, not replacement geometry.
"""
import bpy
from mathutils import Vector
import sys
import json
from pathlib import Path
from collections import Counter

source, destination = map(Path, sys.argv[sys.argv.index('--') + 1:])
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
source_triangles = sum(len(obj.data.polygons) for obj in meshes)
# AP242 contains duplicate part names: OpenCascade's native writer accepts them.
# Blender disambiguates occurrences while retaining the source names as metadata.
cube = [obj for obj in meshes if len(obj.material_slots) == 1
        and obj.material_slots[0].material.name == 'mat_2'
        and max(abs(c) for v in obj.bound_box for c in obj.matrix_world @ Vector(v)) < .075]
assert len(cube) == 33 and 'Corner' in bpy.data.objects, 'Cube export structure changed; inspect before recoloring'
basis = bpy.data.objects['Corner'].matrix_world.to_quaternion().inverted().to_matrix().to_4x4()
transforms = {obj.name: obj.matrix_world.copy() for obj in meshes}
for obj in meshes:
    obj.parent = None
    obj.matrix_world = basis @ transforms[obj.name]
    obj['cad_part'] = obj.name
points = [obj.matrix_world @ vertex.co for obj in cube for vertex in obj.data.vertices]
limits = [[min(v[a] for v in points), max(v[a] for v in points)] for a in range(3)]
assert all(abs(high - low - .056) < .0002 for low, high in limits), 'Expected a 56 mm cube'

def linear(value):
    return value / 12.92 if value <= .04045 else ((value + .055) / 1.055) ** 2.4

def material(name, color, roughness=.55, metallic=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    node = mat.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value = (*[linear(int(color[i:i+2],16)/255) for i in (0,2,4)],1)
    node.inputs['Roughness'].default_value = roughness
    node.inputs['Metallic'].default_value = metallic
    return mat

plastic = material('Cube black plastic', '17191b', .58)
# Opposite faces: orange/red, green/blue, yellow/white.
colors = ['f58b25','da3b35','2aaf66','2865d0','f3d341','f1f3ee']
stickers = [material('Cube '+name, color, .48) for name,color in zip(
    ['orange','red','green','blue','yellow','white'], colors)]
colored_area = [0.0] * 6
for obj in cube:
    obj.data.materials.clear()
    for mat in [plastic] + stickers:
        obj.data.materials.append(mat)
    for polygon in obj.data.polygons:
        normal = obj.matrix_world.to_3x3() @ polygon.normal
        axis = max(range(3), key=lambda a: abs(normal[a]))
        side = int(normal[axis] > 0)
        center = (obj.matrix_world @ polygon.center)[axis]
        outer = abs(center - limits[axis][side]) < .00015 and abs(normal[axis]) > .995
        polygon.material_index = 1 + axis * 2 + side if outer else 0
        if outer:
            colored_area[axis * 2 + side] += polygon.area
assert all(.002 < area < .003 for area in colored_area), 'Six outer sticker surfaces must be present'

# Retain the supplied assembly palette, with readable matte motor housings.
for mat in bpy.data.materials:
    if not mat.name.startswith('mat_') or not mat.use_nodes:
        continue
    node = mat.node_tree.nodes.get('Principled BSDF')
    color = node.inputs['Base Color'].default_value
    if max(color[:3]) < .04:
        node.inputs['Base Color'].default_value = (*[max(.009,c) for c in color[:3]],1)
    node.inputs['Roughness'].default_value = .62
    node.inputs['Metallic'].default_value = .15

for obj in meshes:
    bpy.context.view_layer.objects.active = obj
    # Preserve CAD silhouettes and material boundaries; remove dense interior detail.
    triangles = len(obj.data.polygons)
    budget = 1000 if obj in cube else 1400
    if triangles > budget:
        modifier = obj.modifiers.new('Web display mesh', 'DECIMATE')
        modifier.ratio = budget / triangles
        modifier.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    obj.data.set_sharp_from_angle(angle=.6)
    normal = obj.modifiers.new('CAD surface normals', 'WEIGHTED_NORMAL')
    normal.keep_sharp = True
    bpy.ops.object.modifier_apply(modifier=normal.name)

# Normalize in meters: center horizontally and rest the lowest motor on z=0.
points = [obj.matrix_world @ Vector(v) for obj in meshes for v in obj.bound_box]
low = Vector([min(v[a] for v in points) for a in range(3)])
high = Vector([max(v[a] for v in points) for a in range(3)])
center = Vector(((low.x+high.x)/2, (low.y+high.y)/2, low.z))
root = bpy.data.objects.new('Cube-solving robot', None)
bpy.context.collection.objects.link(root)
groups = {}
for name in ['Cube', 'Frame', 'Motor +X', 'Motor -X', 'Motor +Y', 'Motor -Y', 'Motor +Z', 'Motor -Z']:
    group = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(group)
    group.parent = root
    groups[name] = group
for obj in meshes:
    bounds = [obj.matrix_world @ Vector(v) for v in obj.bound_box]
    middle = sum(bounds,Vector())/8
    if obj in cube:
        group = 'Cube'
    elif max((max(v[a] for v in bounds)-min(v[a] for v in bounds)) for a in range(3)) > .11:
        group = 'Frame'
    else:
        axis = max(range(3),key=lambda a:abs(middle[a]))
        group = 'Motor '+('+' if middle[axis]>0 else '-')+'XYZ'[axis]
    obj.matrix_world.translation -= center
    matrix = obj.matrix_world.copy()
    obj.parent = groups[group]
    obj.matrix_world = matrix
    obj['assembly'] = group
bpy.ops.object.select_all(action='DESELECT')
for obj in [root]+list(groups.values())+meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = root
bpy.context.view_layer.update()
bpy.ops.export_scene.gltf(filepath=str(destination),export_format='GLB',use_selection=True,
    export_extras=True,export_cameras=False,export_lights=False,export_yup=True)
triangles = sum(sum(len(p.vertices)-2 for p in obj.data.polygons) for obj in meshes)
report = {'sourceMeshCount':len(meshes),'sourceTriangles':source_triangles,
    'displayTriangles':triangles,'sizeBytes':destination.stat().st_size,
    'dimensionsMeters':list(high-low),'cubeFaceAreasSquareMeters':colored_area,
    'groups':dict(Counter(obj['assembly'] for obj in meshes)),
    'cubeColors':dict(zip(['orange','red','green','blue','yellow','white'],colors))}
destination.with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report),flush=True)
