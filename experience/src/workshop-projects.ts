import { ProjectContent } from './project-story';

/** User-supplied dates and notes; the intake season is inferred from “last season”. */
export const frcProject: ProjectContent = {
    title: 'FRC Robot', pagePath: '/projects/frc-robot', date: '2026 · REBUILT',
    brief: 'A robot from my FRC season.',
    details: 'Build photos, testing footage and my contribution to the team’s robot will be added here.',
    videoUrl: null, previewImage: '/projects/frc-robot/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
};
export const rcProject: ProjectContent = {
    title: 'RC Car', pagePath: '/projects/rc-car', date: 'August 2023',
    brief: 'An RC car project with custom drivetrain assemblies.',
    details: 'I spent three months learning CAD, building and refining the car, then improving its gearing and strength. The drivetrain includes custom differentials, gearbox gearing and driveshafts.',
    videoUrl: null, previewImage: '/projects/rc-car/assembled-car-workbench.webp',
    previewAlt: 'The assembled RC car on a workbench.',
    cadUrl: null, githubUrl: null, story: [
        { id: 'cad', title: 'Month 1 · Learning CAD', media: [], summary: 'The first month was primarily learning CAD and iterating on the designs.' },
        { id: 'assembly', title: 'Month 2 · Assembly and tolerances', media: [
            { type: 'image', src: '/projects/rc-car/drivetrain-gears.webp', aspectRatio: '4 / 3', caption: 'Exposed blue gears in the printed drivetrain assembly.' },
            { type: 'image', src: '/projects/rc-car/assembly-overhead.webp', aspectRatio: '4 / 3', caption: 'Drivetrain and suspension assembly viewed from above.' },
            { type: 'image', src: '/projects/rc-car/assembly-side.webp', aspectRatio: '4 / 3', caption: 'Side view of the printed assembly and suspension.' },
        ], summary: 'I assembled the car, fixed issues and learned about 3D printing and tolerances.' },
        { id: 'refinement', title: 'Month 3 · Gearing and strength', media: [
            { type: 'image', src: '/projects/rc-car/assembled-car-outdoors.webp', aspectRatio: '4 / 3', caption: 'The assembled RC car outdoors.' },
            { type: 'image', src: '/projects/rc-car/assembled-car-workbench.webp', aspectRatio: '4 / 3', caption: 'The assembled RC car on the workbench.' },
        ], summary: 'I optimized the gearbox for higher speed, fixed issues and strengthened the car.' },
    ], reflections: [],
    models: [{ title: 'Custom driveshafts · 3D model', href: '/models/rc-car/driveshaft.glb' }],
};

export const elevatorProject: ProjectContent = {
    title: 'FRC Elevator Robot', pagePath: '/projects/frc-elevator', date: '2025 · REEFSCAPE',
    brief: 'An FRC robot with a multi-stage elevator.',
    details: 'Build photos, testing footage and my contribution to the team’s robot will be added here.',
    videoUrl: null, previewImage: '/projects/frc-elevator/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
};

export const dirtbikeProject: ProjectContent = {
    title: 'Dirtbike Projects', pagePath: '/projects/dirtbike', date: '2025',
    brief: 'Projects I’ve worked on with my dirtbike.',
    details: 'This CRF450 is a temporary visual stand-in for my own bike. I’ll add the individual projects, photos and build notes here.',
    videoUrl: null, previewImage: '/projects/dirtbike/preview.jpg',
    previewAlt: 'Representative CRF450 model with plain red plastics and gold forks.',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
};
