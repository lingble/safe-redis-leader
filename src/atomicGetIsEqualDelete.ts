import { readFile as fsReadFile } from "fs";
import IORedis from "ioredis";
import { promisify } from "util";

const readFile = promisify(fsReadFile);

type getIsEqualDeleteType = {
  getIsEqualDelete?: (key: IORedis.KeyType, id: string) => Promise<boolean>;
};

export async function atomicGetIsEqualDelete(
  asyncRedis: IORedis.Redis & getIsEqualDeleteType,
  key: IORedis.KeyType,
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
