import { StoryStage, StoryReflection } from './project-story';

/** Edit your project content here. Null links stay non-clickable until supplied. */
export const cubeProject = {
    title: 'Rubik’s Cube Solving Robot',
    date: 'Around March 2025',
    brief: 'A robot I built during freshman year to solve a Rubik’s Cube.',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    videoUrl: null as string | null, // Direct .mp4/.webm file or URL, not a YouTube page.
    cadUrl: null as string | null, // Your public Onshape document link.
    githubUrl: null as string | null,
    // Reorder these entries to change the timeline. Keep original media outside public/.
    // Example media: { type: 'video', src: '/projects/cube-solver/one-axis.mp4', caption: 'Your caption' }
    story: [
        { id: 'one-axis', title: 'One-axis testing', media: [], summary: null },
        { id: 'five-axis', title: 'Five-axis testing', media: [], summary: null },
        { id: 'alignment', title: 'Alignment issues', media: [], summary: null },
        { id: 'six-axis', title: 'Six-axis testing', media: [], summary: null },
        { id: 'first-solves', title: 'First solves', media: [], summary: null },
        { id: 'final-prototype', title: 'Final prototype', media: [], summary: null },
    ] as StoryStage[],
    reflections: [
        { title: 'What I made', text: null },
        { title: 'What I learned', text: null },
        { title: 'What inspired me', text: null },
        { title: 'What’s next', text: null },
    ] as StoryReflection[],
};
