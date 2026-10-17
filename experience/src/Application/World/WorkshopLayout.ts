/** Scene units: X is left/right, Y is height, +Z is toward the front of the desk. */
export const workshopLayout = {
    deskView: {
        // Change this direction to choose the angle of the click-to-zoom view.
        direction: [-.35, .7, 1] as [number, number, number],
        targetOffset: [0, 0, 0] as [number, number, number], // Shift the point the camera aims at.
        fill: .74, // Smaller values leave more space around the desk.
        duration: 1000, // Milliseconds to travel from overview to desk.
    },
    cubeRobot: {
        position: [-400, -451.9, 550] as [number, number, number],
        rotation: -.3,
        width: 1147.5, // 85% of the original size; scaling uses the unrotated model.
        // A measured support plane through three motor tips, mapped onto the tabletop.
        restQuaternion: [-.3104557349, 0, .3105470733, .8984307163] as [number, number, number, number],
        contactPoints: [
            [-.0178030636, .0838162508, -.1038856693],
            [-.1037331812, .0835490879, -.0176360440],
            [-.0262711700, .0002321897, -.0033639789],
        ] as [number, number, number][],
        lift: 25,
    },
    resume: {
        position: [-2400, -440, 450] as [number, number, number],
        rotation: .12, // Radians around the vertical axis.
        width: 900,
        height: 1164,
        lift: 85,
    },
};
