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

`IMG_1658.zip` contained the first, second and sixth files above. `IMG_1632.zip` contained the other three videos. `IMG_1520.zip` exceeded the 32 MiB attachment-transfer limit and could not be inspected. The single-axis clips (`IMG_1571`, `IMG_1520`) were subsequently uploaded individually and imported. The magnetic-frame assembly photo (`IMG_1602`) still needs a downloadable JPG; its inline image is visible in chat but not available as a local file.

The timeline uses an editorial progression from basic tests to integration, debugging and first solve. It does not claim exact recording chronology from filenames, download timestamps or metadata. The magnetic-frame idea and PCB inspiration come from the user's account. The user subsequently confirmed five frame-design iterations, a magnetic loading/stiffness compromise, code optimization and repeated motion/step-count tuning, and motors salvaged from an old 3D printer. Future plans are a stronger magnetic frame and encoder-based shaft-position feedback. No encoder system is implemented or claimed. Exact driver values, original authorship of the solver algorithm, and solve-time/reliability statistics remain unconfirmed.

## Conversion

```bash
python3 experience/tools/prepare-cube-media.py /path/to/extracted-files public/projects/cube-solver
```

Requires FFmpeg/ffprobe and Python; no extra runtime dependencies. The script preserves the complete clips and audio, normalizes recorded rotation, scales to at most 1280 pixels on the long edge, and writes H.264/AAC MP4 with yuv420p and fast-start placement. Posters are JPEG frames at 0.5 seconds; the connector photo is resized with its full framing retained. Source originals are unchanged. No demonstration frames were synthesized.

The initial six originals totaled 47,399,901 bytes and produced about 7 MB of web media. With both additional single-axis clips included, the eight source files total 83,467,695 bytes; the web assets and manifest now total 10,100,113 bytes. Visitors do not download that entire set on entry: project videos use `preload="none"` and poster previews. Playing one project video pauses the others. Close/Escape/backdrop immediately pause playback before removing the reader.

Actual video, captions, narrative stages and reflections are edited in `experience/src/cube-project.ts`. The first-solve clip appears in the overview and its chapter using the same URL. The single-axis chapter now has both recordings. The magnetic-frame chapter retains its media placeholder until its original image is available. CAD and GitHub links remain pending.

## Additional single-axis clips

`IMG_1520.mov` and `IMG_1571.mov` were subsequently uploaded individually and successfully downloaded. Both were inspected and converted to portrait H.264/AAC MP4, keeping the full recordings. They appear together under Single-axis testing with previous/next controls. The conversion script accepts `--only` to add these clips without re-encoding earlier assets and merges their provenance records into the manifest.

```bash
python3 experience/tools/prepare-cube-media.py /path/to/extracted-files public/projects/cube-solver --only IMG_1520.mov IMG_1571.mov
```

The frame-assembly picture was visible as an inline chat image, but no downloadable original file was supplied for it in this session. Its exact bytes are not available in the workspace, so the frame stage keeps its media placeholder until the JPG arrives. The two new clips are imported; the earlier oversized ZIP is no longer needed for them.

The displayed date is now simply “March 2025”. A start/end month range is pending the user's confirmation; no start month was invented. The existing inferred school-year/date context remains provisional.
