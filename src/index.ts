import dotenv from "dotenv";
import { createEventAdapter } from "@slack/events-api";

dotenv.config();

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const port = 3000;

slackEvents.on("message", (event) => console.log(event));

slackEvents.on("error", console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});
