const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages - project first, then workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Prevent Metro from walking up the directory tree to resolve modules.
// In pnpm monorepos, packages live in .pnpm/ virtual store; without this flag
// Metro can resolve 'react' from multiple symlink paths (all pointing to the
// same physical files) and bundle it twice → duplicate React → hook crash.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
