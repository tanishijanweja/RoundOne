import { Router } from "express";
import { PreInterviewBody } from "../types";
import { scrapeGithub } from "../scrapers/github";
import { prisma } from "../db";

const router = Router();

router.post("/pre-interview", async (req, res) => {
  const { success, data } = PreInterviewBody.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Incorrect body",
    });
    return;
  }

  // TODO: URL can be very malformed, probably use an SLM here?
  const githubUrl = data.github.endsWith("/")
    ? data.github.slice(0, -1)
    : data.github;

  const githubUsername = githubUrl.split("/").pop();

  const githubData = await scrapeGithub(githubUsername!);

  const interview = await prisma.interview.create({
    data: {
      githubMetadata: JSON.stringify(githubData),
      status: "Pre",
    },
  });

  res.json({
    id: interview.id,
  });
});

export default router;
