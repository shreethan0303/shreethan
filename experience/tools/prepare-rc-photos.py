"""Make web display copies of the supplied RC photos. Originals stay outside Git.
Usage: python3 experience/tools/prepare-rc-photos.py source-folder public/projects/rc-car
Requires Pillow with WebP and ImageCms support.
"""
from pathlib import Path
from io import BytesIO
import hashlib,json,sys
from PIL import Image,ImageOps,ImageCms
source,target=map(Path,sys.argv[1:]);target.mkdir(parents=True,exist_ok=True)
files={
 'IMG_8911.jpeg':'drivetrain-gears.webp',
 'IMG_8912.jpeg':'assembly-overhead.webp',
 'IMG_8913.jpeg':'assembly-side.webp',
 'IMG_9005.jpeg':'assembled-car-outdoors.webp',
 'IMG_9038.jpeg':'assembled-car-workbench.webp',
}
report=[]
for name,output in files.items():
 original=source/name
 with Image.open(original) as image:
  image=ImageOps.exif_transpose(image)
  profile=image.info.get('icc_profile')
  if profile:
   image=ImageCms.profileToProfile(image,ImageCms.ImageCmsProfile(BytesIO(profile)),ImageCms.createProfile('sRGB'),outputMode='RGB')
  else:image=image.convert('RGB')
  image.thumbnail((1600,1600),Image.Resampling.LANCZOS)
  image.save(target/output,'WEBP',quality=84,method=6,exif=b'',icc_profile=b'')
  report.append({'source':name,'sourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'sourceBytes':original.stat().st_size,'webFile':output,'webBytes':(target/output).stat().st_size,'width':image.width,'height':image.height})
(target/'photo-manifest.json').write_text(json.dumps({'settings':{'maxEdge':1600,'webpQuality':84,'colorSpace':'sRGB','orientation':'EXIF applied','metadata':'omitted'},'photos':report},indent=2)+'\n')
print(json.dumps({'photos':len(report),'sourceBytes':sum(p['sourceBytes']for p in report),'webBytes':sum(p['webBytes']for p in report)},indent=2))
