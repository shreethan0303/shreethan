import { ProjectContent } from './project-story';

/** Project facts/photos will be supplied later. No season or personal team role is assumed. */
export const frcProject: ProjectContent = {
    title: 'FRC Robot', date: '',
    brief: 'A robot from my FRC season.',
    details: 'Build photos, testing footage and my contribution to the team’s robot will be added here.',
    videoUrl: null, previewImage: '/projects/frc-robot/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
};
export const rcProject: ProjectContent = {
    title: 'RC Car', date: '',
    brief: 'An RC car project with custom drivetrain assemblies.',
    details: 'The build story will cover the differentials, gearbox gearing and custom driveshafts. Photos, test footage and detailed results will be added here.',
    videoUrl: null, previewImage: '/projects/rc-car/cad-preview.jpg',
    cadUrl: null, githubUrl: null, story: [], reflections: [],
    models: [{ title: 'Custom driveshafts · 3D model', href: '/models/rc-car/driveshaft.glb' }],
};
