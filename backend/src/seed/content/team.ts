export interface TeamMemberSeed {
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
  published: boolean;
}

/**
 * The live ibill.ae site shows a "Meet The Team" heading with no members yet.
 * Seeded empty - the client adds real profiles from /admin/team and the About
 * page shows a graceful placeholder until then.
 */
export const TEAM: TeamMemberSeed[] = [];
