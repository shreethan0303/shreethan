/** Set a slot only after adding an optimized, publishable asset under public/models.
 * Example: frc: "/models/frc-robot.glb". Null retains the placeholder.
 * Materials/colors embedded in the GLB are preserved by ProjectModel.
 */
export const modelSources: {
  frc: string | null;
  rc: string | null;
  cube: string | null;
} = {
  frc: null,
  rc: null,
  cube: null,
};
