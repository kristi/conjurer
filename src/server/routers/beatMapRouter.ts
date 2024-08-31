import * as fs from "fs";
import { publicProcedure, router } from "@/src/server/trpc";
import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  ASSET_BUCKET_NAME,
  BEAT_MAP_ASSET_PREFIX,
  LOCAL_ASSET_PATH,
} from "@/src/utils/assets";
import { z } from "zod";
import { getS3 } from "@/src/utils/s3";

export const beatMapRouter = router({
  listBeatMaps: publicProcedure
    .input(
      z.object({
        usingLocalAssets: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      let beatMaps: string[] = [];
      if (input.usingLocalAssets) {
        // TODO: implement this
        beatMaps = fs
          .readdirSync(`${LOCAL_ASSET_PATH}${BEAT_MAP_ASSET_PREFIX}`)
          .map((file) => file.toString());
      } else {
        const listObjectsCommand = new ListObjectsCommand({
          Bucket: ASSET_BUCKET_NAME,
          Prefix: BEAT_MAP_ASSET_PREFIX,
        });
        const data = await getS3().send(listObjectsCommand);
        beatMaps =
          data.Contents?.map((object) => object.Key?.split("/")[1] ?? "") ?? [];
      }
      return beatMaps.filter((b) => !!b);
    }),

  getBeatMap: publicProcedure
    .input(
      z.object({
        beatMapName: z.string(),
        usingLocalAssets: z.boolean(),
      })
    )
    .query(async ({ input }) => {
      if (input.usingLocalAssets) {
        // TODO: implement this
        const beatMap = fs
          .readFileSync(
            `${LOCAL_ASSET_PATH}${BEAT_MAP_ASSET_PREFIX}${input.beatMapName}.json`
          )
          .toString();
        return { beatMap };
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: ASSET_BUCKET_NAME,
        Key: `${BEAT_MAP_ASSET_PREFIX}${input.beatMapName}.json`,
        ResponseCacheControl: "no-store",
      });

      try {
        const beatMapData = await getS3().send(getObjectCommand);
        const beatMapString = await beatMapData.Body?.transformToString();
        return { beatMap: beatMapString ?? "" };
      } catch (err) {
        console.log(err);
        return { beatMap: "" };
      }
    }),

  saveBeatMap: publicProcedure
    .input(
      z.object({
        beatMap: z.string(),
        beatMapName: z.string(),
        usingLocalAssets: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.usingLocalAssets) {
        // TODO: implement this
        fs.writeFileSync(
          `${LOCAL_ASSET_PATH}${BEAT_MAP_ASSET_PREFIX}${input.beatMapName}.json`,
          input.beatMapName
        );
        return;
      }

      const putObjectCommand = new PutObjectCommand({
        Bucket: ASSET_BUCKET_NAME,
        Key: `${BEAT_MAP_ASSET_PREFIX}${input.beatMapName}.json`,
        Body: input.beatMap,
      });

      return getS3().send(putObjectCommand);
    }),
});
