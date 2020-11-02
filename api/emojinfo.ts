import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";
import { URLSearchParams } from "url";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const match = (req.body.text as string).match(/:?([\w\-]+):?/);
    if (!match) {
      throw new Error("");
    }

    const emoji = match[1];

    const params = new URLSearchParams({
      token: process.env.SLACK_TOKEN,
      name: emoji,
    });

    const resp = await axios.post(
      "https://slack.com/api/emoji.getInfo",
      params.toString()
    );
    if (!resp.data.ok) {
      throw new Error("");
    }
    res.json({
      text: `Ah yes, :${resp.data.name}: (\`${resp.data.name}\`) was uploaded by <@${resp.data.user_id}>`,
    });
  } catch (e) {
    res.json({
      text:
        "Something went wrong :cry: Make sure you ran the command like this: `/emojinfo :emoji-name:`\nAlso, this command only works for custom emoji.",
    });
  }
};
