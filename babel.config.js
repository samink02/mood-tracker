module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/hooks': './src/hooks',
            '@/models': './src/models',
            '@/services': './src/services',
            '@/state': './src/state',
            '@/utils': './src/utils',
            '@/tests': './src/tests',
            '@/config': './src/config',
            '@/theme': './src/theme',
          },
        },
      ],
      [
        'react-native-dotenv',
        {
          moduleName: 'react-native-dotenv',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};
