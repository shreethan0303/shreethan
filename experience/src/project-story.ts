/** Shared story format: reuse this for other projects without changing the UI. */
export type StoryMedia = {
    type: 'image' | 'video';
    src: string;
    caption: string;
    poster?: string;
    aspectRatio?: string; // Preserve portrait footage without cropping its contents.
};
export type StoryStage = {
    id: string;
    title: string;
    media: StoryMedia[];
    summary: string | null;
    challenge?: string;
    change?: string;
    learning?: string;
};
export type StoryReflection = { title: string; text: string | null };

export type ProjectContent = {
    title: string;
    date: string;
    brief: string;
    details: string;
    videoUrl: string | null;
    videoPoster?: string;
    previewImage?: string;
    previewAlt?: string;
    cadUrl: string | null;
    githubUrl: string | null;
    story: StoryStage[];
    reflections: StoryReflection[];
    models?: { title: string; href: string }[];
};
