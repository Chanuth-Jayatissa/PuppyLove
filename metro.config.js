const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add TypeScript extensions to the resolver
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable symlinks for better module resolution
config.resolver.unstable_enableSymlinks = true;

// Set condition names for module resolution
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native', 'module'];

// Configure transformer to handle TypeScript files in node_modules
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!((react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-modules-core))'
];

// Reduce the number of watched files
config.watcher = {
  additionalExts: ['cjs', 'mjs'],
  watchman: {
    deferStates: ['hg.update'],
  },
};

// Ignore unnecessary directories to reduce file watching load
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
];

module.exports = config;