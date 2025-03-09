import {
  type CreateNodesV2,
  type ProjectConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { combineGlobPatterns } from 'nx/src/utils/globs';
import { PROJECT_JSON_FILE_NAME } from '../internal/constants';
import { getProjectConfig } from './project-config';
import { createProjectConfiguration } from './utils';

type FileMatcher = `${string}${typeof PROJECT_JSON_FILE_NAME}`;
// const PROJECT_JSON_FILE_GLOB = `**/${PROJECT_JSON_FILE_NAME}` as FileMatcher;

// // name has to be "createNodes" to get picked up by Nx
// export const createNodes = [
//   PROJECT_JSON_FILE_GLOB,
//   createNodesV1Fn,
// ] satisfies CreateNodes;

// export async function createNodesV1Fn(
//   projectConfigurationFile: string,
//   createNodesOptions: unknown,
//   _: CreateNodesContext,
// ): Promise<CreateNodesResult> {
//   const projectJson = await loadProjectConfiguration(projectConfigurationFile);
//   const createOptions = normalizeCreateNodesOptions(createNodesOptions);

//   const { targets } = await createProjectConfiguration(
//     projectJson,
//     createOptions,
//   );
//   return {
//     projects: {
//       [projectJson.root]: {
//         targets,
//       },
//     },
//   };
// }

const PROJECT_JSON_FILE_GLOB = '**/project.json';
const PACKAGE_JSON_FILE_GLOB = '**/package.json';
const GLOB_PATTERN = combineGlobPatterns(
  PROJECT_JSON_FILE_GLOB,
  PACKAGE_JSON_FILE_GLOB,
);

export const createNodesV2: CreateNodesV2<any> = [
  GLOB_PATTERN,
  async (configFiles, options, context) => {
    console.log('hello');
    return await createNodesFromFiles(
      async (globMatchingFile, internalOptions) => {
        // Unexpected token 'g', "getProject"... is not valid JSON
        // Project lib-a-e2e is an environment project but has no implicit dependencies.
        const projectConfiguration: ProjectConfiguration = await readFile(
          join(process.cwd(), globMatchingFile),
          'utf8',
        ).then(JSON.parse);
        console.log(
          'getProjectConfig',
          await getProjectConfig(globMatchingFile),
        );
        console.log('projectConfiguration', projectConfiguration);
        if (
          !('name' in projectConfiguration) ||
          typeof projectConfiguration.name !== 'string'
        ) {
          throw new Error('Project name is required');
        }

        const projectRoot = dirname(globMatchingFile);
        const { targets } = await createProjectConfiguration(
          projectConfiguration,
          options,
        );
        // const codePushupConfigPath = join(projectRoot, 'code-pushup.config.ts');
        // const codePushupConfig = await readFile(codePushupConfigPath, 'utf8');
        console.log('targets', targets);
        return {
          projects: {
            [projectRoot]: {
              namedInputs: {},
              targets: {
                ...targets,
                'code-pushup': {
                  command: "node echo 'hello'",
                  options: {
                    'persist.filename': 'code-pushup.json',
                  },
                },
              },
            },
          },
        };
      },
      configFiles,
      options,
      context,
    );
  },
];
