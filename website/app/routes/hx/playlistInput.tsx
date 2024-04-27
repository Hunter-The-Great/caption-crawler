import { createRoute } from "honox/factory";
import { z } from "zod";
import { hxRender } from "../../middleware/hxRender";
import { hxValidate } from "../../validate";
import { ErrorMsg } from "../../components/ErrorMsg";
import { getPlaylistDisplayInfo, getPlaylistIdFromUrl } from "shared/yt";
import { Request } from "@cloudflare/workers-types";

const inputSchema = z.object({
  url: z.string().url(),
});

// Main initial playlist ingest point
export const POST = createRoute(
  hxRender,
  hxValidate("form", inputSchema),
  async (c) => {
    try {
      const { url } = c.req.valid("form");
      const playlistId = getPlaylistIdFromUrl(url);
      const playlistInfo = await getPlaylistDisplayInfo(
        c.env.YOUTUBE_API_KEY,
        playlistId,
      );

      await c.env.worker.fetch("https://fakeurl/queue", {
        method: "POST",
        body: JSON.stringify({
          type: "playlistIngest",
          playlistId,
        }),
      });

      return c.render(
        <div>{playlistInfo.description || playlistInfo.title}</div>,
      );
    } catch (e) {
      console.log(e);
      return c.render(
        <ErrorMsg>There was an error processing your playlist</ErrorMsg>,
      );
    }
  },
);
