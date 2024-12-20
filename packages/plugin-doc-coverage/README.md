# @code-pushup/doc-coverage-plugin

[![npm](https://img.shields.io/npm/v/%40code-pushup%2Fdoc-coverage-plugin.svg)](https://www.npmjs.com/package/@code-pushup/doc-coverage-plugin)
[![downloads](https://img.shields.io/npm/dm/%40code-pushup%2Fdoc-coverage-plugin)](https://npmtrends.com/@code-pushup/doc-coverage-plugin)
[![dependencies](https://img.shields.io/librariesio/release/npm/%40code-pushup%2Fdoc-coverage-plugin)](https://www.npmjs.com/package/@code-pushup/doc-coverage-plugin?activeTab=dependencies)

📚 **Code PushUp plugin for tracking documentation coverage.** 📝

This plugin allows you to measure and track documentation coverage in your TypeScript/JavaScript project.
It analyzes your codebase and checks for documentation on different code elements like classes, functions, interfaces, types, and variables.

Measured documentation types are mapped to Code PushUp audits in the following way:

- The value is in range 0-100 and represents the documentation coverage for all passed results (_documented / total_)
- The score is value converted to 0-1 range
- Missing documentation is mapped to issues in the audit details (undocumented classes, functions, interfaces, etc.)

## Getting started

1. If you haven't already, install [@code-pushup/cli](../cli/README.md) and create a configuration file.

2. Install as a dev dependency with your package manager:

   ```sh
   npm install --save-dev @code-pushup/doc-coverage-plugin
   ```

   ```sh
   yarn add --dev @code-pushup/doc-coverage-plugin
   ```

   ```sh
   pnpm add --save-dev @code-pushup/doc-coverage-plugin
   ```

3. Add Compodoc to your project. You can follow the instructions [here](https://compodoc.app/guides/installation.html).

4. Add this plugin to the `plugins` array in your Code PushUp CLI config file (e.g. `code-pushup.config.js`).

   Pass the target files to analyze and optionally specify which types of documentation you want to track.
   All documentation types are measured by default. If you wish to focus on a subset of offered types, define them in `docTypes`.

   The configuration will look similarly to the following:

   ```js
   import docCoveragePlugin from '@code-pushup/doc-coverage-plugin';

   export default {
     // ...
     plugins: [
       // ...
       await docCoveragePlugin({
         coverageToolCommand: {
           command: 'npx',
           args: ['compodoc', '-p', 'tsconfig.doc.json', '-e', 'json'],
         },
       }),
     ],
   };
   ```

5. (Optional) Reference individual audits or the provided plugin group which you wish to include in custom categories (use `npx code-pushup print-config` to list audits and groups).

   💡 Assign weights based on what influence each documentation type should have on the overall category score (assign weight 0 to only include as extra info, without influencing category score).

   ```js
   export default {
     // ...
     categories: [
       {
         slug: 'documentation',
         title: 'Documentation',
         refs: [
           {
             type: 'group',
             plugin: 'doc-coverage',
             slug: 'doc-coverage',
             weight: 1,
           },
           // ...
         ],
       },
       // ...
     ],
   };
   ```

6. Run the CLI with `npx code-pushup collect` and view or upload report (refer to [CLI docs](../cli/README.md)).

## About documentation coverage

Documentation coverage is a metric that indicates what percentage of your code elements have proper documentation. It helps ensure your codebase is well-documented and maintainable.

The plugin provides a single audit that measures the overall percentage of documentation coverage across your codebase:

- **Percentage coverage**: Measures how many percent of the codebase have documentation.

## Plugin architecture

### Plugin configuration specification

The plugin accepts the following parameters:

- (optional) `coverageToolCommand`: If you wish to run your documentation coverage tool (compodoc) to generate the results first, you may define it here.
  - `command`: Command to run coverage tool (e.g. `npx`).
  - `args`: Arguments to be passed to the coverage tool (e.g. `['compodoc', '-p', 'tsconfig.doc.json', '-e', 'json']`).
- `outputPath`: Path to the documentation.json file. Defaults to `'documentation/documentation.json'`.

### Audits and group

This plugin provides a group for convenient declaration in your config. When defined this way, all measured documentation type audits have the same weight.

```ts
     // ...
     categories: [
       {
         slug: 'documentation',
         title: 'Documentation',
         refs: [
           {
             type: 'group',
             plugin: 'doc-coverage',
             slug: 'doc-coverage',
             weight: 1,
           },
           // ...
         ],
       },
       // ...
     ],
```

Each documentation type still has its own audit. So when you want to include a subset of documentation types or assign different weights to them, you can do so in the following way:

```ts
     // ...
     categories: [
       {
         slug: 'documentation',
         title: 'Documentation',
         refs: [
           {
             type: 'audit',
             plugin: 'doc-coverage',
             slug: 'class-doc-coverage',
             weight: 2,
           },
           {
             type: 'audit',
             plugin: 'doc-coverage',
             slug: 'function-doc-coverage',
             weight: 1,
           },
           // ...
         ],
       },
       // ...
     ],
```

### Audit output

The plugin outputs a single audit that measures the overall documentation coverage percentage of your codebase.

For instance, this is an example of the plugin output:

```json
{
  "packageName": "@code-pushup/doc-coverage-plugin",
  "version": "0.57.0",
  "title": "Documentation coverage",
  "slug": "doc-coverage",
  "icon": "folder-src",
  "duration": 920,
  "date": "2024-12-17T16:45:28.581Z",
  "audits": [
    {
      "slug": "percentage-coverage",
      "displayValue": "16 %",
      "value": 16,
      "score": 0.16,
      "details": {
        "issues": []
      },
      "title": "Percentage of codebase with documentation",
      "description": "Measures how many % of the codebase have documentation."
    }
  ],
  "description": "Official Code PushUp documentation coverage plugin.",
  "docsUrl": "https://www.npmjs.com/package/@code-pushup/doc-coverage-plugin/",
  "groups": [
    {
      "slug": "doc-coverage",
      "refs": [
        {
          "slug": "percentage-coverage",
          "weight": 1
        }
      ],
      "title": "Documentation coverage metrics",
      "description": "Group containing all defined documentation coverage types as audits."
    }
  ]
}
```