import { name } from '../../../../../package.json'

/**
 * Gets application name
 */
// tslint:disable-next-line:interface-name
interface IAppNameResolver {
  appName: string | undefined;
}

/**
 * Resolves application name where this module is running
 * Tries to read it from 'npm_package_' env variable
 * if not available it will lookup for the package.json of the application
 *
 * @implements AppNameResolver
 */
class AppNameResolver implements IAppNameResolver {
  private name: string | undefined;

  constructor() {
    this.name = process.env.PACKAGE_NAME || name;

    if (!this.name) {
      // tslint:disable-next-line:no-console
      console.error('@bff/core could not read the app name from the environment.');
    }
  }

  get appName(): string | undefined {
    if (this.name) {
      return this.name;
    }

    this.name = name;

    return this.name;
  }
}

export const ClientAppNameReader = new AppNameResolver();
