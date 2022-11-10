import { readFile as fsReadFile } from "fs";
import Redis, { RedisKey } from "ioredis";
import { promisify } from "util";

const readFile = promisify(fsReadFile);

type getIsEqualSetPExpireType = {
  getIsEqualSetPExpire?: (key: RedisKey, id: string, ms: number) => Promise<boolean>;
};

export async function atomicGetIsEqualSetPExpire(
  asyncRedis: Redis & getIsEqualSetPExpireType,
  key: RedisKey,
  id: string,
  ms: number,
): Promise<boolean> {
  if (!asyncRedis.getIsEqualSetPExpire) {
    const file = await readFile(`${__dirname}/../luas/atomicGetIsEqualSetPExpire.lua`, "utf8");

    asyncRedis.defineCommand("getIsEqualSetPExpire", {
      numberOfKeys: 1,
      lua: file,
    });
  }

  const res = await asyncRedis.getIsEqualSetPExpire!(key, id, ms);
  return res;
}
