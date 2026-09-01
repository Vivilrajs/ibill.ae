/**
 * Local dev / verification without Atlas: spins up an in-memory MongoDB, seeds
 * it, then starts the API pointed at it.
 *
 *   node scripts/dev-mem-db.mjs [dist/main.js | src/seed/seed.ts]
 *
 * Not for production - the DB is wiped on exit.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'node:child_process';
import 'dotenv/config';

const mongod = await MongoMemoryServer.create({ instance: { dbName: 'ibill' } });
const uri = mongod.getUri();
console.log(`[mem-db] MongoDB at ${uri}`);

const target = process.argv[2] || 'dist/main.js';
const runner = target.endsWith('.ts') ? ['npx', 'tsx', target] : ['node', target];

const child = spawn(runner[0], runner.slice(1), {
  stdio: 'inherit',
  env: { ...process.env, MONGODB_URI: uri, MONGODB_DB: 'ibill' },
});

const shutdown = async () => {
  child.kill('SIGTERM');
  await mongod.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
child.on('exit', async (code) => {
  await mongod.stop();
  process.exit(code ?? 0);
});
