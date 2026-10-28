import { getGithubStats } from "@/lib/github";
import { Bookshelf } from "./bookshelf";
import { GithubCard } from "./github-card";

export async function PersonalShelf() {
  const stats = await getGithubStats();

  return (
    <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <Bookshelf />
      {stats && <GithubCard stats={stats} />}
    </div>
  );
}
