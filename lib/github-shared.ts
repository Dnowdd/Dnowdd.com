export const GITHUB_LOGIN = "Dnowdd";

export type GithubStats = {
  contributions: number;
  repositories: number;
  stars: number;
  longestStreak: number;
  weeks: (number | null)[][];
  languages: { name: string; color: string; share: number }[];
};
