import 'dotenv/config';
import { z } from 'zod';
import {
  coverageCoreConfigNx,
  docCoverageCoreConfig,
  eslintCoreConfigNx,
  jsPackagesCoreConfig,
  lighthouseCoreConfig,
} from './code-pushup.preset.js';
import type { CoreConfig } from './packages/models/src/index.js';
import { mergeConfigs } from './packages/utils/src/index.js';

// load upload configuration from environment
const envSchema = z.object({
  CP_SERVER: z.string().url(),
  CP_API_KEY: z.string().min(1),
  CP_ORGANIZATION: z.string().min(1),
  CP_PROJECT: z.string().min(1),
});
const { data: env } = await envSchema.safeParseAsync(process.env);

const config: CoreConfig = {
  ...(env && {
    upload: {
      server: env.CP_SERVER,
      apiKey: env.CP_API_KEY,
      organization: env.CP_ORGANIZATION,
      project: env.CP_PROJECT,
    },
  }),

  plugins: [],
};

export default mergeConfigs(
  config,
  await coverageCoreConfigNx(),
  await jsPackagesCoreConfig(),
  await lighthouseCoreConfig(
    'https://github.com/code-pushup/cli?tab=readme-ov-file#code-pushup-cli/',
  ),
  await eslintCoreConfigNx(),
  await docCoverageCoreConfig({
    sourceGlob: [
      'packages/**/src/**/*.ts',
      '!**/*.spec.ts',
      '!**/*.test.ts',
      '!**/implementation/**',
      '!**/internal/**',
    ],
    skipAudits: ['methods-coverage'],
  }),
);
