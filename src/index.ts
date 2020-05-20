import dotenv from "dotenv";
import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";

dotenv.config();

const port = 3000;
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_TOKEN);

slackEvents.on("message", console.log);

slackEvents.on("error", console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});
