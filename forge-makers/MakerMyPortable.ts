import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { ForgePlatform } from '@electron-forge/shared-types';
import { build, Configuration } from 'app-builder-lib';
import { resolve } from 'path';

export default class MeuPortableMaker extends MakerBase<Configuration> {
  name = 'my-portable';
  defaultPlatforms: ForgePlatform[] = ['win32'];

  isSupportedOnCurrentPlatform() {
    return process.platform === 'win32' || process.platform === 'linux'; // ou 'darwin'
  }

  async make(options: MakerOptions) {
    if (options.targetPlatform !== 'win32') {
      throw new Error("Somente suportado para 'win32' por enquanto.");
    }

    const appDir = options.dir;

    return build({
      prepackaged: appDir,
      win: [`portable:${options.targetArch}`],
      config: {
        ...this.config,
        directories: {
          output: resolve(appDir, '..', 'make'),
          ...this.config?.directories,
        },
        win: {
          icon: resolve(__dirname, '../assets/icons/icon.ico'),
        },
      },
    });
  }
}
