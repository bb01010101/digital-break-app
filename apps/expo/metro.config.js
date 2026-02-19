const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// Use the root of the monorepo
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `node_modules` directories
config.resolver.disableHierarchicalLookup = true;

const { withTamagui } = require("@tamagui/metro-plugin");

// 4. Alias semver for reanimated
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  semver: path.resolve(workspaceRoot, "node_modules/semver"),
};

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  // outputCSS: "./tamagui.css",
});
