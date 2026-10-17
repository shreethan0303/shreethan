"""Convert the supplied STEP with OpenCascade, preserving assembly names and colors.
Usage: python3 experience/tools/convert-cube-step.py source.step output.glb
Requires cadquery-ocp and Blender offline; neither is needed by Vercel.
"""
import argparse
from pathlib import Path
import subprocess
import tempfile
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString, TCollection_AsciiString
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.TDF import TDF_LabelSequence
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.RWGltf import RWGltf_CafWriter
from OCP.TColStd import TColStd_IndexedDataMapOfStringString
from OCP.Message import Message_ProgressRange

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
args.output.parent.mkdir(parents=True, exist_ok=True)
reader = STEPCAFControl_Reader()
reader.SetColorMode(True)
reader.SetNameMode(True)
assert int(reader.ReadFile(str(args.source.resolve()))) == 1, 'STEP read failed'
document = TDocStd_Document(TCollection_ExtendedString('Cube solver'))
assert reader.Transfer(document), 'STEP transfer failed'
shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(document.Main())
labels = TDF_LabelSequence()
shape_tool.GetFreeShapes(labels)
for label in labels:
    mesh = BRepMesh_IncrementalMesh(shape_tool.GetShape_s(label), .16, False, .2, True)
    mesh.Perform()
    assert mesh.IsDone(), 'Tessellation failed'
with tempfile.TemporaryDirectory() as folder:
    intermediate = Path(folder) / 'source.glb'
    writer = RWGltf_CafWriter(TCollection_AsciiString(str(intermediate)), True)
    assert writer.Perform(document, TColStd_IndexedDataMapOfStringString(), Message_ProgressRange())
    subprocess.run(['blender', '-b', '--factory-startup', '-t', '4', '--python',
                    str(Path(__file__).with_name('prepare-cube-model.py')), '--',
                    str(intermediate), str(args.output.resolve())], check=True)
