/** Scene units: X is left/right, Y is height, +Z is toward the front of the desk. */
export const workshopLayout = {
    deskView: {
        // Change this direction to choose the angle of the click-to-zoom view.
        direction: [-.35, .7, 1] as [number, number, number],
        targetOffset: [0, 0, 0] as [number, number, number], // Shift the point the camera aims at.
        fill: .74, // Smaller values leave more space around the desk.
        duration: 1000, // Milliseconds to travel from overview to desk.
    },
    monitor: {
        position: [-550, -451.9, -450] as [number, number, number],
        width: 2100,
        height: 1312.5,
        screenHeight: 950,
    },
    cubeRobot: {
        position: [450, -451.9, 1050] as [number, number, number],
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
    frcRobot: {
        position: [4800, -2984.18927, 150] as [number, number, number],
        rotation: -.25,
        length: 4000,
        lift: 35,
        motions: [{ node: 'Intake', axis: 'x' as const, angle: -.38 }],
        // Export contains a lower protrusion: align the drive tires, not the overall bounding box.
        groundOffset: .02540000046,
        contacts: [
            [-0.27475069590, 0.02540000046, -0.42743995998],
            [0.28427569509, 0.02540000046, 0.13127653667],
            [-0.27475069590, 0.02540000046, 0.13136004002],
            [0.28404930410, 0.02540000046, -0.42743995998],
        ] as [number, number, number][],
    },
    elevatorRobot: {
        position: [9200, -2984.18927, -900] as [number, number, number],
        rotation: -.4,
        length: 3900,
        lift: 35,
        // The preserved CAD groups use Z-up locally; the assembly maps Z to world Y.
        motions: [
            { node: 'ElevatorMiddle', axis: 'z' as const, distance: .18 },
            { node: 'ElevatorCarriage', axis: 'z' as const, distance: .36 },
        ],
    },
    rcCar: {
        position: [1750, -451.9, 0] as [number, number, number],
        rotation: -.1,
        length: 1900,
        lift: 25,
    },
    resume: {
        position: [-2600, -440, 650] as [number, number, number],
        rotation: .12, // Radians around the vertical axis.
        width: 900,
        height: 1164,
        lift: 85,
    },
};
