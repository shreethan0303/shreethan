# Cube robot recordings

Source: Shreethan's uploads and accompanying descriptions. The raw archives and originals stay outside Git under `/workspace/cube-media-source` in this session. Public files are web copies, not original camera files. Their source hashes, sizes and resulting formats are recorded in `public/projects/cube-solver/media-manifest.json`.

| Original      | Placement                        | Description supplied by Shreethan                                                                           |
| ------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| IMG_1504.MOV  | Getting a stepper motor moving   | Getting the motor to work                                                                                   |
| IMG_1637.jpeg | Wiring problems                  | Unreliable connectors, intermittent cable failures, difficult troubleshooting, inspiration for custom PCBs  |
| IMG_1662.MOV  | Two-axis testing                 | First two-axis tests, with all six axes connected                                                           |
| IMG_1663.MOV  | Six-axis testing                 | Full six-axis testing                                                                                       |
| IMG_1632.MOV  | Alignment debugging              | Skipped steps, microstepping problems, incorrect driver settings, insufficient torque and an insecure frame |
| IMG_1658.mov  | Overview and first-solve chapter | Short clip from the first solve                                                                             |

`IMG_1658.zip` contained the first, second and sixth files above. `IMG_1632.zip` contained the other three videos. `IMG_1520.zip` exceeded the 32 MiB attachment-transfer limit and could not be inspected. Awaiting the single-axis clips (`IMG_1571`, `IMG_1520`) and magnetic-frame assembly photo (`IMG_1602`), according to the user's file descriptions. Do not claim they have been imported.

The timeline uses an editorial progression from basic tests to integration, debugging and first solve. It does not claim exact recording chronology from filenames, download timestamps or metadata. The magnetic-frame idea and PCB inspiration come from the user's account. The user subsequently confirmed five frame-design iterations, a magnetic loading/stiffness compromise, code optimization and repeated motion/step-count tuning, and motors salvaged from an old 3D printer. Future plans are a stronger magnetic frame and encoder-based shaft-position feedback. No encoder system is implemented or claimed. Exact driver values, original authorship of the solver algorithm, and solve-time/reliability statistics remain unconfirmed.

## Conversion

```bash
python3 experience/tools/prepare-cube-media.py /path/to/extracted-files public/projects/cube-solver
```

Requires FFmpeg/ffprobe and Python; no extra runtime dependencies. The script preserves the complete clips and audio, normalizes recorded rotation, scales to at most 1280 pixels on the long edge, and writes H.264/AAC MP4 with yuv420p and fast-start placement. Posters are JPEG frames at 0.5 seconds; the connector photo is resized with its full framing retained. Source originals are unchanged. No demonstration frames were synthesized.

The six originals total 47,399,901 bytes. Published videos, image, posters and manifest total 6,975,826 bytes (about 7 MB). Visitors do not download that entire set on entry: project videos use `preload="none"` and poster previews. Playing one project video pauses the others. Close/Escape/backdrop immediately pause playback before removing the reader.

Actual video, captions, narrative stages and reflections are edited in `experience/src/cube-project.ts`. The first-solve clip appears in the overview and its chapter using the same URL. Single-axis and magnetic-frame chapters retain media placeholders while their files are unavailable. CAD and GitHub links remain pending.
