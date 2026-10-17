/** Shared pacing for physical selections; readers open after the final camera frame. */
export const selectionMotion = { approach: 1100, returnToDesk: 900 };

export function afterPreviewSettles(progress: () => number, reveal: () => void) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reveal();
        return;
    }
    const check = () => {
        if (progress() >= .97) reveal();
        else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
}

export function afterCameraFrame(reveal: () => void) {
    // Camera tween completion runs before this frame's lookAt/render. Let that
    // final view reach the screen before mounting the HTML reader over it.
    requestAnimationFrame(reveal);
}
