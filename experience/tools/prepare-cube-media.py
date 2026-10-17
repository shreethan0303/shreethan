"""Offline conversion: preserve the full recordings, correct rotation, generate posters."""
from pathlib import Path
import argparse
import subprocess,json,hashlib
from concurrent.futures import ThreadPoolExecutor
parser=argparse.ArgumentParser(description='Prepare the supplied cube-robot media for the web with FFmpeg.')
parser.add_argument('source', type=Path)
parser.add_argument('target', type=Path)
parser.add_argument('--only', nargs='+', help='Convert only these source filenames and merge their manifest records.')
args=parser.parse_args()
source=args.source;target=args.target;target.mkdir(parents=True,exist_ok=True)
clips={'IMG_1504.MOV':'stepper-motor-test','IMG_1662.MOV':'two-axis-test','IMG_1663.MOV':'six-axis-test','IMG_1632.MOV':'alignment-debugging','IMG_1658.mov':'first-solve','IMG_1520.mov':'single-axis-testing','IMG_1571.mov':'single-axis-early-test'}
def run(pair):
 name,slug=pair;p=source/name;out=target/(slug+'.mp4');poster=target/(slug+'.jpg')
 scale="scale=w='if(gte(iw,ih),min(1280,iw),-2)':h='if(gte(iw,ih),-2,min(1280,ih))':out_range=tv"
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(p),'-map','0:v:0','-map','0:a:0?','-vf',scale,'-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-threads','2','-c:a','aac','-b:a','96k','-movflags','+faststart','-map_metadata','-1','-map_chapters','-1','-metadata:s:v:0','rotate=0','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709',str(out)],check=True)
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss','0.5','-i',str(out),'-frames:v','1','-vf',"scale=w='if(gte(iw,ih),min(960,iw),-2)':h='if(gte(iw,ih),-2,min(960,ih))'",'-q:v','3',str(poster)],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(out)]))
 return {'source':name,'sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sourceBytes':p.stat().st_size,'webFile':out.name,'webBytes':out.stat().st_size,'poster':poster.name,'duration':float(probe['format']['duration']),'video':[{k:s.get(k)for k in ['codec_name','width','height','pix_fmt']}for s in probe['streams']if s['codec_type']=='video'][0]}
selected={name:slug for name,slug in clips.items() if not args.only or name in args.only}
if args.only and not selected: parser.error('No matching source filenames')
with ThreadPoolExecutor(max_workers=2) as pool:report=list(pool.map(run,selected.items()))
if not args.only:
 p=source/'IMG_1637.jpeg';out=target/'connector-issues.jpg'
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(p),'-vf',"scale=w='if(gte(iw,ih),min(1280,iw),-2)':h='if(gte(iw,ih),-2,min(1280,ih))'",'-frames:v','1','-q:v','3','-map_metadata','-1',str(out)],check=True)
 report.append({'source':p.name,'sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sourceBytes':p.stat().st_size,'webFile':out.name,'webBytes':out.stat().st_size})
if args.only and (target/'media-manifest.json').exists():
 old=json.loads((target/'media-manifest.json').read_text())
 report=[item for item in old if item['source'] not in selected]+report
(target/'media-manifest.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
