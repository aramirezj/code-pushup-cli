import { readJsonFile } from '@nx/devkit';
import * as path from 'node:path';
import type { PackageJson } from 'nx/src/utils/package-json';

const workspaceRoot = path.join(__dirname, '../../');
const projectsFolder = path.join(__dirname, '../../../');

export const cpNxPluginVersion = loadPackageJson(workspaceRoot).version;
export const cpModelVersion = loadPackageJson(
  path.join(projectsFolder, 'cli'),
).version;
export const cpUtilsVersion = loadPackageJson(
  path.join(projectsFolder, 'utils'),
).version;
export const cpCliVersion = loadPackageJson(
  path.join(projectsFolder, 'models'),
).version;

/**
 * Load the package.json file from the given folder path.
 * @param folderPath
 */
function loadPackageJson(folderPath: string): PackageJson {
  return readJsonFile<PackageJson>(path.join(folderPath, 'package.json'));
}
