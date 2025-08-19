const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 添加对更多文件类型的支持
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db'
);

// 确保正确处理源码映射
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;