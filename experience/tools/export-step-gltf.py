"""Offline OpenCascade STEP-to-GLB export preserving CAD names and colors.
Usage: python3 export-step-gltf.py source.step output.glb
Requires cadquery-ocp. Deployment uses already-prepared GLBs.
"""
import sys,time
from pathlib import Path
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString,TCollection_AsciiString
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.TDF import TDF_LabelSequence
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.RWGltf import RWGltf_CafWriter
from OCP.TColStd import TColStd_IndexedDataMapOfStringString
from OCP.Message import Message_ProgressRange
source,dest=sys.argv[1:];start=time.time();reader=STEPCAFControl_Reader();reader.SetColorMode(True);reader.SetNameMode(True)
assert int(reader.ReadFile(source))==1
print('Read',time.time()-start,flush=True)
doc=TDocStd_Document(TCollection_ExtendedString('Supplied CAD'));assert reader.Transfer(doc)
print('Transferred',time.time()-start,flush=True)
tool=XCAFDoc_DocumentTool.ShapeTool_s(doc.Main());labels=TDF_LabelSequence();tool.GetFreeShapes(labels)
for label in labels:
 mesh=BRepMesh_IncrementalMesh(tool.GetShape_s(label),.3,False,.3,True);mesh.Perform();assert mesh.IsDone()
print('Meshed',time.time()-start,flush=True)
writer=RWGltf_CafWriter(TCollection_AsciiString(dest),True);assert writer.Perform(doc,TColStd_IndexedDataMapOfStringString(),Message_ProgressRange())
print('Wrote',Path(dest).stat().st_size,'bytes in',time.time()-start,flush=True)
