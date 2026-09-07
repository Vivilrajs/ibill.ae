export interface ProjectSeed {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  description: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  year: string;
  externalUrl: string;
  order: number;
  published: boolean;
}

/** Populated by the client via the admin panel. */
export const PROJECTS: ProjectSeed[] = [];
