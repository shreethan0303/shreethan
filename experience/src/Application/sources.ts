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
    {
        name: 'mouseDown',
        type: 'audio',
        path: 'audio/mouse/mouse_down.mp3',
    },
    {
        name: 'mouseUp',
        type: 'audio',
        path: 'audio/mouse/mouse_up.mp3',
    },
    {
        name: 'keyboardKeydown1',
        type: 'audio',
        path: 'audio/keyboard/key_1.mp3',
    },
    {
        name: 'keyboardKeydown2',
        type: 'audio',
        path: 'audio/keyboard/key_2.mp3',
    },
    {
        name: 'keyboardKeydown3',
        type: 'audio',
        path: 'audio/keyboard/key_3.mp3',
    },
    {
        name: 'keyboardKeydown4',
        type: 'audio',
        path: 'audio/keyboard/key_4.mp3',
    },
    {
        name: 'keyboardKeydown5',
        type: 'audio',
        path: 'audio/keyboard/key_5.mp3',
    },
    {
        name: 'keyboardKeydown6',
        type: 'audio',
        path: 'audio/keyboard/key_6.mp3',
    },
    {
        name: 'startup',
        type: 'audio',
        path: 'audio/startup/startup.mp3',
    },
    {
        name: 'office',
        type: 'audio',
        path: 'audio/atmosphere/office.mp3',
    },
    {
        name: 'ccType',
        type: 'audio',
        path: 'audio/cc/type.mp3',
    },
];

export default sources;
