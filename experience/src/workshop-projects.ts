import { ProjectContent } from './project-story';

/** User-supplied dates and notes; the intake season is inferred from “last season”. */
export const frcProject: ProjectContent = {
    title: 'FRC Robot', date: '2026 season',
    brief: 'A robot from my FRC season.',
    details: 'Build photos, testing footage and my contribution to the team’s robot will be added here.',
    videoUrl: null, previewImage: '/projects/frc-robot/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
};
export const rcProject: ProjectContent = {
    title: 'RC Car', date: '2023 · 3-month build',
    brief: 'An RC car project with custom drivetrain assemblies.',
    details: 'I spent three months learning CAD, building and refining the car, then improving its gearing and strength. The drivetrain includes custom differentials, gearbox gearing and driveshafts.',
    videoUrl: null, previewImage: '/projects/rc-car/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [
        { id: 'cad', title: 'Month 1 · Learning CAD', media: [], summary: 'The first month was primarily learning CAD and iterating on the designs.' },
        { id: 'assembly', title: 'Month 2 · Assembly and tolerances', media: [], summary: 'I assembled the car, fixed issues and learned about 3D printing and tolerances.' },
        { id: 'refinement', title: 'Month 3 · Gearing and strength', media: [], summary: 'I optimized the gearbox for higher speed, fixed issues and strengthened the car.' },
    ], reflections: [],
    models: [{ title: 'Custom driveshafts · 3D model', href: '/models/rc-car/driveshaft.glb' }],
};

export const elevatorProject: ProjectContent = {
    title: 'FRC Elevator Robot', date: '2025 · REEFSCAPE',
    brief: 'An FRC robot with a multi-stage elevator.',
    details: 'Build photos, testing footage and my contribution to the team’s robot will be added here.',
    videoUrl: null, previewImage: '/projects/frc-elevator/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
};
