import { GitHubContributor } from "@/types/github";

export async function getContributors(): Promise<GitHubContributor[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Vaibhav-kesarwani/100-reactjs-projects/contributors",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!res.ok) {
      console.warn("getContributors: non-ok response", res.status, res.statusText);
      return [];
    }

    const data: GitHubContributor[] = await res.json();
    return data;
  } catch (err) {
    console.warn("getContributors: fetch failed", err);
    return [];
  }
}