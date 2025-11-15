module.exports = {
  stories: ['../src/ui/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    // Add Linaria support to Storybook with wyw-in-js webpack-loader
    const jsRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('jsx?')
    );

    if (jsRule) {
      // Convert single loader to array if needed
      if (!Array.isArray(jsRule.use)) {
        jsRule.use = [jsRule.use];
      }

      // Find babel-loader
      const babelLoaderIndex = jsRule.use.findIndex(
        (loader) => 
          (typeof loader === 'string' && loader.includes('babel-loader')) ||
          (typeof loader === 'object' && loader.loader && loader.loader.includes('babel-loader'))
      );

      if (babelLoaderIndex !== -1) {
        const babelLoader = jsRule.use[babelLoaderIndex];
        
        // Ensure babel-loader has options
        if (typeof babelLoader === 'object' && babelLoader.options) {
          if (!babelLoader.options.presets) {
            babelLoader.options.presets = [];
          }
          
          // Check if Linaria preset is already added
          const hasLinariaPreset = babelLoader.options.presets.some(
            (preset) => 
              (Array.isArray(preset) && preset[0] === '@linaria/babel-preset') ||
              preset === '@linaria/babel-preset'
          );
          
          if (!hasLinariaPreset) {
            babelLoader.options.presets.unshift([
              '@linaria/babel-preset',
              {
                evaluate: true,
                displayName: true,
              }
            ]);
          }
        }
      }

      // Add wyw-in-js/webpack-loader before babel-loader
      // Note: webpack loaders execute from right to left (last to first in array)
      // So we need: [wyw-loader, babel-loader] to execute babel-loader first, then wyw-loader
      const hasWywLoader = jsRule.use.some(
        (loader) =>
          (typeof loader === 'string' && loader.includes('@wyw-in-js/webpack-loader')) ||
          (typeof loader === 'object' && loader.loader && loader.loader.includes('@wyw-in-js/webpack-loader'))
      );

      if (!hasWywLoader) {
        // Insert before babel-loader (will execute after babel-loader due to webpack's right-to-left execution)
        const insertIndex = babelLoaderIndex !== -1 ? babelLoaderIndex : jsRule.use.length;
        jsRule.use.splice(insertIndex, 0, {
          loader: '@wyw-in-js/webpack-loader',
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
            configFile: './wyw-in-js.config.js',
          },
        });
      }
    }

    // Ensure CSS files from Linaria are handled
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('css')
    );

    if (!cssRule) {
      config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      });
    }

    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
    
    return config;
  },
  docs: {
    autodocs: 'tag',
  },
};
