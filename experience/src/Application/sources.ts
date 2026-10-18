const sources: Resource[] = [
    { name: 'frcRobotModel', type: 'gltfModel', path: '/models/frc-robot/robot.glb' },
    { name: 'frcElevatorModel', type: 'gltfModel', path: '/models/frc-elevator/robot.glb' },
    { name: 'rcCarModel', type: 'gltfModel', path: '/models/rc-car/car.glb' },
    {
        name: 'cubeRobotModel',
        type: 'gltfModel',
        path: '/models/cube-solver/robot.glb',
    },
    {
        name: 'environmentModel',
        type: 'gltfModel',
        path: 'models/World/empty_workbench.glb',
    },
    {
        name: 'environmentTexture',
        type: 'texture',
        path: 'models/World/baked_empty_workbench.jpg',
    },
];

export default sources;
