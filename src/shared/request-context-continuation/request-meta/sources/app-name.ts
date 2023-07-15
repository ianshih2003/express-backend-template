const pkgUp = require('pkg-up');
const debug = require('debug')('bff-core:request-meta:headers:app-name');

/**
 * Gets application name
 */
interface IAppNameResolver {
  appName: string | undefined;
}

/**
 * Resolves application name where this module is running
 * Tries to read it from 'npm_package_' env variable
 * if not available it will lookup for the package.json of the application
 *
 * @implements IAppNameResolver
 */
class AppNameResolver implements IAppNameResolver {
  private name: string | undefined;
  private packagePath: string | null;

  constructor() {
    this.name = process.env.PACKAGE_NAME;
    this.packagePath = pkgUp.sync();

    if (!this.name && !this.packagePath) {
      debug('Process name not found in process.env.PACKAGE_NAME');
      debug('Could not find the package.json file in the current working directory');
      console.error('@bff/core could not read the app name from the environment.');
    }
  }

  get appName(): string | undefined {
    if (this.name) {
      return this.name;
    }

    if (this.packagePath) {
      debug('Reading app name from ' + this.packagePath);
      const { name } = require(this.packagePath);
      debug('App name set to: ' + name);
      this.name = name;
    }

    return this.name;
  }
}

export const ClientAppNameReader = new AppNameResolver();
