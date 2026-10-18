import { cubeProject } from "../../experience/src/cube-project";
import {
  frcProject,
  rcProject,
  elevatorProject,
} from "../../experience/src/workshop-projects";
import type { ProjectContent } from "../../experience/src/project-story";

// The HTML pages and workshop readers use the same owner-supplied stories.
export const projects: { slug: string; content: ProjectContent }[] = [
  { slug: "cube-solver", content: cubeProject },
  { slug: "rc-car", content: rcProject },
  { slug: "frc-robot", content: frcProject },
  { slug: "frc-elevator", content: elevatorProject },
];

// Keep sparse project placeholders out of search until their stories are supplied.
export const hasStory = (project: ProjectContent) =>
  project.story.some((stage) => Boolean(stage.summary));
