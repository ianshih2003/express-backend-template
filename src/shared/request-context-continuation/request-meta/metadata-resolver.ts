import { RequestMetadataResolver } from './request-metada.interface';
import { HeaderMapper } from './header-mapper';
import { ClientAppNameReader } from './sources/app-name';
import { UserIdResolverInstance } from './sources/user-id';

export const requestMetadata: RequestMetadataResolver = (req) => {

  const platformHeader = 'x-justo-platform';
  const platformVersionHeader = 'x-justo-platformversion';
  const cookies = req.cookies || {};
  const headers = req.headers || {};
  const platform = headers[platformHeader] ? headers[platformHeader] : 'unknown';
  const appVersion = headers[platformVersionHeader] ? headers[platformVersionHeader] : 'unknown';

  const authorization: string = 'authorization';
  const mapper = new HeaderMapper();

  mapper.registerMapper('Authorization', headers[authorization]);

  mapper.registerMapper('X-justo-RealIP', [
    headers['x-justo-realip'],
    headers['true-client-ip'],
    headers['x-client-ip'],
  ] as string[]);

  mapper.registerMapper('X-justo-RequestId', headers['x-justo-requestid']);

  mapper.registerMapper('X-justo-User-Agent', headers['User-Agent']);

  mapper.registerMapper('X-justo-Platform', platform);

  mapper.registerMapper('X-justo-PlatformVersion', appVersion);

  mapper.registerMapper('X-justo-ClientAppName', ClientAppNameReader.appName);

  mapper.registerMapper('X-justo-UserId', UserIdResolverInstance.getUserId((req as any).user));

  mapper.registerRegExpForwarder(/^X-justo-/i, headers as Record<string, string>);

  return mapper.getHeaders();
};
