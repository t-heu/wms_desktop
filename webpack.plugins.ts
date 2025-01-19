import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyPlugin ({
    patterns: [
      {
        from: path.resolve(__dirname, 'assets/icons'),
        to: path.resolve(__dirname, '.webpack/main/assets/icons'),
      },
    ],
  }),
];
