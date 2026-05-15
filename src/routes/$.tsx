import { createFileRoute } from "@tanstack/react-router";

// Catch-all route — the original react-router app (rendered in __root) handles
// rendering for every path on the client.
export const Route = createFileRoute("/$")({
  component: () => null,
});
