import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processMessage } from "@/app/features/conversation/process-message";
import { importGithubRepo } from "@/app/features/inngest/imports/import-github-repo";
import { exportToGithub } from "@/app/features/inngest/exports/export-github-repo";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processMessage,
    importGithubRepo,
    exportToGithub
  ],
});