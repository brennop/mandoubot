import "dotenv/config";
import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { onMessage } from "./handlers";

const port = 3000;
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_TOKEN);

slackEvents.on("message", (event) =>
  onMessage(event)
    .then(() => {
      web.reactions.add({
        channel: event.channel,
        name: "thumbsup",
        timestamp: event.ts,
      });
    })
    .catch(console.error)
);

slackEvents.on("error", console.error);

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  // Listening on path '/slack/events' by default
  console.log(`server listening on port ${port}`);
});
