import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerZIP } from '@electron-forge/maker-zip';
import MyPortableMaker from './forge-makers/makerMyPortable';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { execSync } from 'child_process';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './assets/icons/icon.ico',
    prune: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP(),
    new MyPortableMaker({
      appId: 'com.theu.wmslabeler',
      icon: './assets/icons/icon.ico',
    }),
  ],
  hooks: {
    preMake: async () => {
      // Executa o script para limpar os locales
      execSync('npx ts-node ./scripts/clean-locales.ts', { stdio: 'inherit' });
    },
    postMake: async (config, makeResults) => {
      const fs = await import('fs');
      const path = await import('path');

      const zipArtifact = makeResults
        .flatMap(result => result.artifacts)
        .find(file => file.endsWith('.zip'));

      if (zipArtifact) {
        const newName = path.join(path.dirname(zipArtifact), 'wmslabeler-portatil.zip');
        fs.renameSync(zipArtifact, newName);
        console.log(`Renomeado para: ${newName}`);
      }
    }
  },
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
