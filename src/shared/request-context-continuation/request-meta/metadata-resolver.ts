import { IRequestMetadataResolver } from './request-metada.interface';
import { HeaderMapper } from './header-mapper';
import { ClientAppNameReader } from './sources/app-name';
import { UserIdResolverInstance } from './sources/user-id';

export const requestMetadata: IRequestMetadataResolver = function(req) {
  const cookies = req.cookies || {};
  const headers = req.headers || {};
  const appClient = headers['android-app'] ? 'android' : headers['ios-app'] ? 'ios' : 'web';
  const appVersion = headers['android-app'] ? headers['ios-app'] : 'web';

  const mapper = new HeaderMapper();

  mapper.registerMapper('X-justo-RealIP', [
    headers['x-ccs-realip'],
    headers['true-client-ip'],
    headers['x-client-ip'],
  ] as string[]);

  mapper.registerMapper('X-justo-RequestId', headers['x-justo-requestid']);

  mapper.registerMapper('X-justo-User-Agent', headers['User-Agent']);

  mapper.registerMapper('X-justo-appClient', appClient);

  mapper.registerMapper('X-justo-appVersion', appVersion);

  mapper.registerMapper('X-justo-ClientAppName', ClientAppNameReader.appName);

  mapper.registerMapper('X-justo-UserId', UserIdResolverInstance.getUserId((req as any).user));

  mapper.registerRegExpForwarder(/^X-justo-/i, headers as Record<string, string>);

  return mapper.getHeaders();
};
