import { unstable_cache } from "next/cache";

import { GITHUB_LOGIN, type GithubStats } from "./github-shared";

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              weekday
            }
          }
        }
      }
      repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
        totalCount
        nodes {
          stargazerCount
          languages(first: 6, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: { contributionCount: number; weekday: number }[];
          }[];
        };
      };
      repositories: {
        totalCount: number;
        nodes: {
          stargazerCount: number;
          languages: {
            edges: {
              size: number;
              node: { name: string; color: string | null };
            }[];
          };
        }[];
      };
    };
  };
};

async function fetchGithubStats(): Promise<GithubStats> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_LOGIN } }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

  const { data } = (await response.json()) as GraphQLResponse;
  const user = data?.user;
  if (!user) throw new Error("GitHub user not found");

  const calendar = user.contributionsCollection.contributionCalendar;
  const weeks = calendar.weeks.map((week) => {
    const days: (number | null)[] = Array(7).fill(null);
    week.contributionDays.forEach((day) => {
      days[day.weekday] = day.contributionCount;
    });
    return days;
  });

  let longestStreak = 0;
  let streak = 0;
  for (const count of weeks.flat()) {
    if (count === null) continue;
    streak = count > 0 ? streak + 1 : 0;
    longestStreak = Math.max(longestStreak, streak);
  }

  const languageTotals = new Map<string, { size: number; color: string }>();
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const current = languageTotals.get(edge.node.name);
      languageTotals.set(edge.node.name, {
        size: (current?.size ?? 0) + edge.size,
        color: edge.node.color ?? "#a3a3a3",
      });
    }
  }
  const totalSize = [...languageTotals.values()].reduce(
    (sum, l) => sum + l.size,
    0,
  );
  const languages = [...languageTotals.entries()]
    .map(([name, { size, color }]) => ({
      name,
      color,
      share: size / totalSize,
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 5);

  return {
    contributions: calendar.totalContributions,
    repositories: user.repositories.totalCount,
    stars: user.repositories.nodes.reduce(
      (sum, repo) => sum + repo.stargazerCount,
      0,
    ),
    longestStreak,
    weeks,
    languages,
  };
}

const cachedGithubStats = unstable_cache(
  fetchGithubStats,
  ["github-stats", GITHUB_LOGIN],
  {
    revalidate: 60 * 60 * 24,
  },
);

export async function getGithubStats(): Promise<GithubStats | null> {
  try {
    return await cachedGithubStats();
  } catch {
    return null;
  }
}
