import { readFile as fsReadFile } from "fs";
import IORedis from "ioredis";
import { promisify } from "util";

const readFile = promisify(fsReadFile);

type getIsEqualSetPExpireType = {
  getIsEqualSetPExpire?: (key: IORedis.KeyType, id: string, ms: number) => Promise<boolean>;
};

export async function atomicGetIsEqualSetPExpire(
  asyncRedis: IORedis.Redis & getIsEqualSetPExpireType,
  key: IORedis.KeyType,
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
