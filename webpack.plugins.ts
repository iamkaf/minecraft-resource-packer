import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

import { IgnorePlugin } from 'webpack';

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new MonacoEditorWebpackPlugin(),
  // @aws-sdk/client-s3 is required by unzipper and will make the build fail without this plugin.
  new IgnorePlugin({
    resourceRegExp: /\@aws\-sdk\/client-s3/,
  }),
];
