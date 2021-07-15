import Redis from "ioredis";

import { SafeRedisLeader } from "../src/safeRedisLeader";
import { getLeaderIndex, sleep, waitForElection } from "./helper";

/* eslint-disable no-await-in-loop */

describe("SafeRedisLeader", () => {
  let redisClients: Redis.Redis[] = [];

  let safeLeader: SafeRedisLeader;

  let safeLeaders: SafeRedisLeader[] = [];

  beforeAll(async () => {
    const redisConfig: Redis.RedisOptions = {
      port: 6378,
      host: "localhost",
      autoResubscribe: false,
      lazyConnect: true,
      maxRetriesPerRequest: 0,
    };
    redisClients = Array.from(Array(5)).map(() => new Redis(redisConfig));

    safeLeaders = Array.from(Array(5)).map((_, i) => new SafeRedisLeader(redisClients[i], 1500, 3000, "test"));
  });

  afterEach(async () => {
    await safeLeader?.shutdown();
    await Promise.all(safeLeaders.map((sL) => sL.shutdown()));
    safeLeaders.length = 0;
  });

  it("should be connected to Redis", async () => {
    const setValue = await redisClients[0].set("test_key", "test_value");
    const getValue = await redisClients[0].get("test_key");

    expect(setValue).toEqual("OK");
    expect(getValue).toEqual("test_value");
  });

  it("should initialize SafeRedisLeader", async () => {
    safeLeader = new SafeRedisLeader(redisClients[0], 1500, 3000, "test");
    expect(safeLeader.id).toBeTruthy();
  });

  it("should elect a Leader", async () => {
    safeLeader = new SafeRedisLeader(redisClients[0], 1500, 3000, "test");
    const isLeader = await waitForElection(safeLeader);

    expect(isLeader).toEqual(true);
  });

  it("should only elect one Leader ", async () => {
    safeLeaders = Array.from(Array(5)).map((_, i) => new SafeRedisLeader(redisClients[i], 1500, 3000, "test"));
    for (let i = 0; i < safeLeaders.length; i += 1) {
      const sL = safeLeaders[i];
      const isLeader = await waitForElection(sL);

      expect(isLeader).toEqual(i === 0);
    }
  });

  it("Should re-elect a leader if the leader get disconnected", async () => {
    safeLeaders = Array.from(Array(5)).map((_, i) => new SafeRedisLeader(redisClients[i], 500, 1000, "test"));
    for (let i = 0; i < safeLeaders.length; i += 1) {
      const sL = safeLeaders[i];
      await waitForElection(sL);
    }

    const currentLeaderIndex = await getLeaderIndex(safeLeaders);
    expect(currentLeaderIndex).not.toEqual(-1);

    await safeLeaders[currentLeaderIndex].stop();
    const afterStopLeader = await getLeaderIndex(safeLeaders);
    expect(afterStopLeader).toEqual(-1);

    await sleep(1000);

    const newLeaderIndex = await getLeaderIndex(safeLeaders);
    expect(newLeaderIndex).not.toEqual(-1);
  });
});
