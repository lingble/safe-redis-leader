import { EmitterEnum, SafeRedisLeader } from "../src/safeRedisLeader";

/* eslint-disable no-async-promise-executor */
export async function waitForElection(safeLeader: SafeRedisLeader): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    safeLeader.on(EmitterEnum.ELECTED, async () => {
      resolve(true);
    });

    safeLeader.once(EmitterEnum.NOT_ELECTED, async () => {
      resolve(false);
    });

    await safeLeader.elect();
  });
}

export async function waitForDemotion(safeLeader: SafeRedisLeader): Promise<void> {
  return new Promise<void>(async (resolve) => {
    safeLeader.on(EmitterEnum.DEMOTED, async () => {
      resolve();
    });
  });
}

export async function getLeaderIndex(safeLeaders: SafeRedisLeader[]): Promise<number> {
  for (let i = 0; i < safeLeaders.length; i += 1) {
    const safeLeader = safeLeaders[i];
    // eslint-disable-next-line no-await-in-loop
    const isLeading = await safeLeader.isLeader();
    if (isLeading) {
      return i;
    }
  }

  return -1;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
