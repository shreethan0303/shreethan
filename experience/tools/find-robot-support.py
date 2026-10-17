"""Find a three-motor support plane for this GLB. Offline: requires NumPy/SciPy."""
import json,struct,sys,numpy as np
from scipy.spatial import ConvexHull
from scipy.spatial.transform import Rotation
b=open(sys.argv[1],'rb').read();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);binary=b[28+n:]
points=[];labels=[]
def visit(i,parent=np.eye(4),group=''):
 node=j['nodes'][i];group=node.get('name','') if node.get('name','').startswith('Motor ') else group
 m=np.eye(4)
 if 'matrix' in node:m=np.array(node['matrix']).reshape((4,4),order='F')
 else:
  m[:3,:3]=Rotation.from_quat(node.get('rotation',[0,0,0,1])).as_matrix()@np.diag(node.get('scale',[1,1,1]));m[:3,3]=node.get('translation',[0,0,0])
 m=parent@m
 if 'mesh'in node:
  for primitive in j['meshes'][node['mesh']]['primitives']:
   a=j['accessors'][primitive['attributes']['POSITION']];v=j['bufferViews'][a['bufferView']];p=np.ndarray((a['count'],3),dtype='<f4',buffer=binary,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',12),4));p=p@m[:3,:3].T+m[:3,3];points.extend(p);labels.extend([group or 'Frame/Cube']*len(p))
 for child in node.get('children',[]):visit(child,m,group)
for i in j['scenes'][j.get('scene',0)]['nodes']:visit(i)
p=np.array(points);h=ConvexHull(p);desired=np.array([-1,-1,-1])/np.sqrt(3);choices=[]
for tri,plane in zip(h.simplices,h.equations):
 names=set(labels[i]for i in tri)
 if len(names)==3 and all(x.startswith('Motor') for x in names):choices.append((plane[:3]@desired,tri,plane,names))
score,tri,plane,names=max(choices,key=lambda x:x[0]);normal=plane[:3];q=Rotation.align_vectors([[0,-1,0]],[normal])[0];rot=p@q.as_matrix().T
print(json.dumps({'normal':normal.tolist(),'quaternion':q.as_quat().tolist(),'contacts':sorted(names),'score':score,'contactPoints':p[tri].tolist(),'contactHeightSpread':float(np.ptp(rot[tri,1])),'allGeometryAboveSupport':bool(np.all(rot[:,1]>=rot[tri[0],1]-1e-8)),'minY':rot[:,1].min(),'maxY':rot[:,1].max(),'dimensions':np.ptp(rot,axis=0).tolist()},indent=2))
