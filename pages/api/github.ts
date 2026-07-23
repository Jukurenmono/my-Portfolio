import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();

      return res.status(response.status).json({
        githubStatus: response.status,
        githubError: error,
      });
    }

    const repos = await response.json();

    const portfolioRepos = repos.filter(
      (repo: any) =>
        !repo.archived &&
        repo.topics?.includes("portfolio")
    );

    return res.status(200).json(portfolioRepos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}