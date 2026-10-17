"""Find a natural support plane for the three tires in this supplied car export.
Run on the uncompressed prepared GLB; requires NumPy and SciPy.
"""
import json,struct,sys,numpy as np
from pathlib import Path
from scipy.spatial import ConvexHull
from scipy.spatial.transform import Rotation
source=Path(sys.argv[1]);b=source.read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);binary=b[28+n:]
def accessor(i):
 a=j['accessors'][i];v=j['bufferViews'][a['bufferView']];dtype={5126:'<f4',5125:'<u4',5123:'<u2'}[a['componentType']];cols={'VEC3':3,'SCALAR':1}[a['type']];return np.ndarray((a['count'],cols),dtype=dtype,buffer=binary,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',np.dtype(dtype).itemsize*cols),np.dtype(dtype).itemsize))
points=[];labels=[]
for m in j['meshes']:
 for prim in m['primitives']:
  raw=accessor(prim['attributes']['POSITION']);idx=np.unique(accessor(prim['indices']));v=raw[idx];rubber=j['materials'][prim['material']]['name'].startswith('Rubber')
  points.extend(v);labels.extend([('front'if q[2]>0 else 'rear-left'if q[0]<0 else'rear-right')if rubber else''for q in v])
p=np.array(points);h=ConvexHull(p);choices=[]
for tri,plane in zip(h.simplices,h.equations):
 if len(set(labels[i]for i in tri))==3 and all(labels[i]for i in tri):choices.append((plane[:3]@np.array([0,-1,0]),tri,plane))
score,tri,plane=max(choices,key=lambda x:x[0]);r=Rotation.align_vectors([[0,-1,0]],[plane[:3]])[0];rot=p@r.as_matrix().T
report={'quaternion':r.as_quat().tolist(),'contactPoints':p[tri].tolist(),'contactHeightSpread':float(np.ptp(rot[tri,1])),'allGeometryAboveSupport':bool(np.all(rot[:,1]>=rot[tri[0],1]-1e-7)),'score':float(score)}
source.with_suffix('.support.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
