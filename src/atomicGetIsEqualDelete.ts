import { readFile as fsReadFile } from "fs";
import Redis, { RedisKey } from "ioredis";
import { promisify } from "util";

const readFile = promisify(fsReadFile);

type getIsEqualDeleteType = {
  getIsEqualDelete?: (key: RedisKey, id: string) => Promise<boolean>;
};

export async function atomicGetIsEqualDelete(
  asyncRedis: Redis & getIsEqualDeleteType,
  key: RedisKey,
  id: string,
): Promise<boolean> {
  if (!asyncRedis.getIsEqualDelete) {
    const file = await readFile(`${__dirname}/../luas/atomicGetIsEqualDelete.lua`, "utf8");

    asyncRedis.defineCommand("getIsEqualDelete", {
      numberOfKeys: 1,
      lua: file,
    });
  }

  const res = await asyncRedis.getIsEqualDelete!(key, id);
  return res;
}
