import { getGithubStats } from "@/lib/github";
import { getReadCount, getTrapicheProfileUrl } from "@/lib/trapiche";
import { Bookshelf } from "./bookshelf";
import { GithubCard } from "./github-card";

export async function PersonalShelf() {
  const [stats, totalRead] = await Promise.all([
    getGithubStats(),
    getReadCount(),
  ]);

  return (
    <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
      <Bookshelf totalRead={totalRead} profileUrl={getTrapicheProfileUrl()} />
      {stats && <GithubCard stats={stats} />}
    </div>
  );
}
