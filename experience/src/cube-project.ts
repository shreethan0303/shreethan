import { StoryStage, StoryReflection } from './project-story';

/** Project facts and file mapping supplied by Shreethan. Keep missing links null. */
export const cubeProject = {
    title: 'Rubik’s Cube Solving Robot',
    pagePath: '/projects/cube-solver',
    date: 'March 2023',
    brief: 'A six-axis Rubik’s Cube-solving robot I built in seventh grade.',
    details: 'I salvaged the stepper motors from my old 3D printer and built around the hardware I had. Five frame iterations and repeated code and motion tuning took the project from individual motor tests to a first solve.',
    videoUrl: '/projects/cube-solver/first-solve.mp4',
    videoPoster: '/projects/cube-solver/first-solve.jpg',
    cadUrl: null as string | null,
    githubUrl: null as string | null,
    // Narrative order, not a claim of exact recording dates. Reorder entries as needed.
    story: [
        {
            id: 'motor-test', title: 'Getting a stepper motor moving',
            media: [{ type: 'video', src: '/projects/cube-solver/stepper-motor-test.mp4', poster: '/projects/cube-solver/stepper-motor-test.jpg', caption: 'The first step: getting a stepper motor to work.' }],
            summary: 'I took apart my old 3D printer to salvage its stepper motors. I started by getting one motor working, using the hardware I already had rather than buying a new set.',
        },
        {
            id: 'one-axis', title: 'Single-axis testing',
            media: [
                { type: 'video', src: '/projects/cube-solver/single-axis-early-test.mp4', poster: '/projects/cube-solver/single-axis-early-test.jpg', aspectRatio: '9 / 16', caption: 'An early single-axis motion test.' },
                { type: 'video', src: '/projects/cube-solver/single-axis-testing.mp4', poster: '/projects/cube-solver/single-axis-testing.jpg', aspectRatio: '9 / 16', caption: 'More single-axis testing before coordinating multiple motors.' },
            ],
            summary: 'I tested one axis before moving on to coordinated motion. These tests let me work on individual turns before adding the complexity of the full mechanism.',
        },
        {
            id: 'magnetic-frame', title: 'Five frame iterations', media: [],
            summary: 'I went through five frame designs to balance easy cube loading with a rigid mechanism.',
            challenge: 'The cube needed to go in and out without taking the whole robot apart, but the frame also had to hold it securely while the motors applied torque.',
            change: 'I settled on a magnetic design that could come apart conveniently while staying sturdy enough to hold the cube during turns.',
            learning: 'Ease of assembly and mechanical stiffness had to be designed together. The useful design was a compromise between the two.',
        },
        {
            id: 'connections', title: 'When the wiring became the problem',
            media: [{ type: 'image', src: '/projects/cube-solver/connector-issues.jpg', aspectRatio: '3 / 4', caption: 'The connector setup that sometimes lost a secure connection.' }],
            summary: 'Intermittent connections made troubleshooting much harder than it needed to be.',
            challenge: 'Cables would randomly stop working. An unreliable connection could make the same setup behave differently from one test to the next.',
            learning: 'Reliable connections are part of the design, not just a detail to finish later. This experience inspired me to start designing my own PCBs.',
        },
        {
            id: 'two-axis', title: 'Two axes, with all six connected',
            media: [{ type: 'video', src: '/projects/cube-solver/two-axis-test.mp4', poster: '/projects/cube-solver/two-axis-test.jpg', caption: 'Early two-axis testing with all six axes connected.' }],
            summary: 'I moved on to testing two axes with the full six-axis setup connected.',
        },
        {
            id: 'six-axis', title: 'Testing all six axes',
            media: [{ type: 'video', src: '/projects/cube-solver/six-axis-test.mp4', poster: '/projects/cube-solver/six-axis-test.jpg', caption: 'Full six-axis testing of the assembled robot.' }],
            summary: 'Testing all six axes brought the mechanism together, but getting every cube face to line up reliably was a much bigger challenge than getting one motor to turn.',
        },
        {
            id: 'alignment', title: 'Skipped steps and misaligned faces',
            media: [{ type: 'video', src: '/projects/cube-solver/alignment-debugging.mp4', poster: '/projects/cube-solver/alignment-debugging.jpg', caption: 'Debugging skipped steps, microstepping and face alignment.' }],
            summary: 'Face alignment was one of the biggest problems in the build.',
            challenge: 'Motors skipped steps, microstepping was not behaving as expected, and the frame was not secure enough. I traced the problems to incorrect stepper-driver settings, insufficient torque and frame movement.',
            change: 'I refined the frame and optimized the motor-control code, with repeated tuning and testing to keep the commanded step counts consistent.',
            learning: 'A command to turn is not a guarantee that the face reaches the right position. Electrical settings, available torque and mechanical rigidity have to work together.',
        },
        {
            id: 'first-solves', title: 'The first solve',
            media: [{ type: 'video', src: '/projects/cube-solver/first-solve.mp4', poster: '/projects/cube-solver/first-solve.jpg', aspectRatio: '822 / 1280', caption: 'A short clip from the first solve.' }],
            summary: 'Reaching a first solve was the milestone that brought the motor tests, wiring and mechanism together. It also gave me a clearer view of what still needed to become more reliable.',
        },
    ] as StoryStage[],
    reflections: [
        { title: 'What I made', text: 'I designed and iterated the magnetic frame five times, tuned the motor-control code and tested the robot using motors salvaged from my old 3D printer.' },
        { title: 'What I learned', text: 'I learned to troubleshoot wiring, motor control and mechanical rigidity as one system. Consistent commanded steps are useful, but they do not measure the actual shaft position or guarantee that no steps were missed.' },
        { title: 'What inspired me', text: 'The frustration of intermittent cable connections pushed me toward designing my own PCBs for future projects.' },
        { title: 'What’s next', text: 'I would keep the convenient magnetic loading design, build a more secure frame and add motor-position feedback, such as encoders, so I could check shaft position rather than relying only on commanded steps.' },
    ] as StoryReflection[],
};
