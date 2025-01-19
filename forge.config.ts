import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
//import { MakerZIP } from '@electron-forge/maker-zip';
//import { MakerDeb } from '@electron-forge/maker-deb';
//import { MakerRpm } from '@electron-forge/maker-rpm';
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
    new MakerSquirrel({
      name: 'GeradorEtiquetasWMS',
      setupIcon: './assets/icons/icon.ico',
      skipUpdateIcon: true,
      setupExe: 'wmslabeler.exe', // Nome do arquivo do instalador
      setupMsi: 'wmslabeler.msi', // Nome do arquivo MSI (opcional)
      noMsi: true, // Evita gerar arquivos MSI se não forem necessários
      loadingGif: './assets/loading.gif'
    }), // Para gerar executáveis Windows (.exe)
  ],
  hooks: {
    preMake: async () => {
      // Executa o script para limpar os locales
      execSync('npx ts-node ./scripts/clean-locales.ts', { stdio: 'inherit' });
    },
  },
  //[new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
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
