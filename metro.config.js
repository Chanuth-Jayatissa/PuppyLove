const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce file watching to prevent inotify limit issues
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

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