const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the shared-types package for live updates during development
config.watchFolders = [monorepoRoot];

// Metro needs to know how to resolve @tiktak/shared-types from the workspace
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
];

// Map the @tiktak/shared-types package name to its actual directory
config.resolver.extraNodeModules = {
    '@tiktak/shared-types': path.resolve(monorepoRoot, '_shared.types'),
};

module.exports = config;
