# Safe Redis Leader

Fork of: [Safe Redis Leader](https://www.npmjs.com/package/safe-redis-leader)

1. Built with typescript
2. New tests running with Jest and testing multiple instances at the same time to make sure there is only 1 leader at all time
3. New event (main reason of this fork) 
  - After an election, all the instances will send an event either ```elected``` or ```notElected```

## Goal

The Safe Redis Leader TS module is designed to provide a leader election implementation that provides tested gaurentees that there is only a single leader elected from a group of clients at one time.

The implementation is a port of the stale [Redis Leader npm package](https://github.com/pierreinglebert/redis-leader) that implements a solution to the [known race condition](https://github.com/pierreinglebert/redis-leader/blob/c3b4db5df9802908728ad0ae4310a52e74acb462/index.js#L81). Additionally, this rewritten package:

1. Only exposes public api functions that should be exposed (no more public-but-should-be-private `_elect` fn)
2. has a test suite within docker-compose using a real redis instance, which allows anyone to run the tests with no heavy dependency setup
3. Replace callback-hell with async/await

## Usage

Install the package:

```bash
  npm install ts-safe-redis-leader
```

Exemple:
```typescript
  import * as Redis from "ioredis";
  import { SafeRedisLeader } from "../src";
  
  const redisConfig: Redis.RedisOptions = {
    port: 6379,
    host: "localhost",
    autoResubscribe: false,
    lazyConnect: true,
    maxRetriesPerRequest: 0,
  };
  const redisClient = new Redis(redisConfig);

  const leaderElectionKey = 'the-election';
  const safeLeader = new SafeRedisLeader(redisClients[i], 1500, 3000, leaderElectionKey);

  await safeLeader.elect();
```

# License
MIT