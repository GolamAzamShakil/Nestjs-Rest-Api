import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';
import * as path from 'path';

const nodeEnv = process.env.NODE_ENV || 'local';

config({
  path: path.resolve(process.cwd(), `.env.${nodeEnv}`),
});

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL!, // Direct URL for CLI/migrations
  },
});
