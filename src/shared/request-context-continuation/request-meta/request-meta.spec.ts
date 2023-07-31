import { requestMetadata } from './index';
import { ClientAppNameReader } from './sources/app-name';

const MockExpressRequest = require('mock-express-request');

const MOCK_TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJqdGkiOjEyMzQ1Nn0.' +
  'mjyN0XVQsSnCMBehEhq2fjwI7N7VRgaP2JKkb0cRkZs';

const COMPRESSED_MOCK_TOKEN = [
  'Bearer eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9',
  'eNqUV9ty4yAM_Ree452kaS6bp_7Hzo4Hg9LSxcYLONtMp_--4JAG2RgnTwlICOlIR8ifxHQVORBD61bCiwVjfzBVkwVhGqgFTg6rzWa_Xf9cL3eb1X5BWtDk8Ek41Iq2LTn8Ik6RuwNdy90B94eDhP7PPy3c7-8FcYoFfPRXFP4Kdyrs-lWhlQRz2TM11dY70K8qRSvK1GURDFwudWvBg1Zv43vbr4Jj3lW_Q83frr-AUFO2WvGO2ZLRhoEsT0rwUjSm037tnI5Uatp0VF41me6ECRqdAV3Ch2pAUytUU1rV6SmRs2yOoLHt-HqsUZm21HDsGu6Uwp5qvTWFDccOpRXo4NJLiiJnBwLKrDgJex45ggUBlyDD3o_Cf1MWZCb2my_0XENjTXmiUvDL4YF_ccTJJOXy11L2h77CtCtHKV7fbM7EfCqjaOM8Rn5j8CJ9RiXrpA_zCnqtusYicEqmpATWY4NzklAYVDW-eHAa4zzBhyBNx3hLZMBDg2edxfdmqvVmIC3OlxmOZyROVU6ctxtVxjjeURcjQmH5BGLJarpyFAvnuXFXD0vWTM5qHHvkOoJkjNg3mrcjmcxOdp1hSPPuTnW2ew1MF8gs21B7ScaJG1ACtdwDM8BiJE92t2vbpFOsmUhv3LPHfmbrNraYRCHblVI0DYZRgPjU43XyMA9GTynmVRw19i2W3Do8lbUTKhcvcGFN6mAm3pEzUaEmX-hvVkQ5RvZjjt5DM1QByTTP1kFiLsCYPp7VacimajlNl5m3YnaQQAYS_BmOPLFwTL1cxJH2-MnLl6wXh3HZCA7XGdulyoZZvD6Hqdr_C7M0vIMbwvuJ_GtB3q1w3w6rij9v1tW6WD6tt8Xzfr8sKOVQbHbVfrfdH6vqyYPhbLuPid1qGb4mvv4DAAD__w',
  '34_xbKTBsJ_2rVCKCXd5kagEmco1nXDKkf1nZ5Arcrg',
].join('.');

describe('metadata resolver', () => {
  it('should resolve all default values', () => {
    const request = new MockExpressRequest();
    expect(requestMetadata(request)).toEqual({
      'X-justo-ClientAppName': ClientAppNameReader.appName,
      'X-justo-Platform': 'unknown',
      'X-justo-PlatformVersion': 'unknown',
    });
  });

  it('should resolve known cookies', () => {
    const request = new MockExpressRequest({
      headers: {
        Authorization: MOCK_TOKEN,
      },
      cookies: {
        _ccs_session_id: 'sample-session-id',
        _ccs_p13n: 'my-personalization-cookie',
        _ga: 'google.analytics.sample.code',
      },
    });

    expect(requestMetadata(request)).toEqual({
      'Authorization':
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJqdGkiOjEyMzQ1Nn0.mjyN0XVQsSnCMBehEhq2fjwI7N7VRgaP2JKkb0cRkZs',
      'X-justo-ClientAppName': ClientAppNameReader.appName,
      'X-justo-Platform': 'unknown',
      'X-justo-PlatformVersion': 'unknown',
    });
  });

  it('should resolve id user if exists in the request', () => {
    const request = new MockExpressRequest({
      headers: {
        Authorization: COMPRESSED_MOCK_TOKEN,
      },
      cookies: {},
      user: {
        id: '123456',
      },
    });

    expect(requestMetadata(request)).toEqual({
      'Authorization':
        'Bearer eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqUV9ty4yAM_Ree452kaS6bp_7Hzo4Hg9LSxcYLONtMp_--4JAG2RgnTwlICOlIR8ifxHQVORBD61bCiwVjfzBVkwVhGqgFTg6rzWa_Xf9cL3eb1X5BWtDk8Ek41Iq2LTn8Ik6RuwNdy90B94eDhP7PPy3c7-8FcYoFfPRXFP4Kdyrs-lWhlQRz2TM11dY70K8qRSvK1GURDFwudWvBg1Zv43vbr4Jj3lW_Q83frr-AUFO2WvGO2ZLRhoEsT0rwUjSm037tnI5Uatp0VF41me6ECRqdAV3Ch2pAUytUU1rV6SmRs2yOoLHt-HqsUZm21HDsGu6Uwp5qvTWFDccOpRXo4NJLiiJnBwLKrDgJex45ggUBlyDD3o_Cf1MWZCb2my_0XENjTXmiUvDL4YF_ccTJJOXy11L2h77CtCtHKV7fbM7EfCqjaOM8Rn5j8CJ9RiXrpA_zCnqtusYicEqmpATWY4NzklAYVDW-eHAa4zzBhyBNx3hLZMBDg2edxfdmqvVmIC3OlxmOZyROVU6ctxtVxjjeURcjQmH5BGLJarpyFAvnuXFXD0vWTM5qHHvkOoJkjNg3mrcjmcxOdp1hSPPuTnW2ew1MF8gs21B7ScaJG1ACtdwDM8BiJE92t2vbpFOsmUhv3LPHfmbrNraYRCHblVI0DYZRgPjU43XyMA9GTynmVRw19i2W3Do8lbUTKhcvcGFN6mAm3pEzUaEmX-hvVkQ5RvZjjt5DM1QByTTP1kFiLsCYPp7VacimajlNl5m3YnaQQAYS_BmOPLFwTL1cxJH2-MnLl6wXh3HZCA7XGdulyoZZvD6Hqdr_C7M0vIMbwvuJ_GtB3q1w3w6rij9v1tW6WD6tt8Xzfr8sKOVQbHbVfrfdH6vqyYPhbLuPid1qGb4mvv4DAAD__w.34_xbKTBsJ_2rVCKCXd5kagEmco1nXDKkf1nZ5Arcrg',
      'X-justo-UserId': '123456',
      'X-justo-ClientAppName': ClientAppNameReader.appName,
      'X-justo-Platform': 'unknown',
      'X-justo-PlatformVersion': 'unknown',
    });
  });

  it("should not resolve id user if it doesn't exists in the request", () => {
    const request = new MockExpressRequest({
      headers: {
        'Authorization': COMPRESSED_MOCK_TOKEN,
        'X-justo-ClientAppName': ClientAppNameReader.appName,
        'X-justo-Platform': 'unknown',
        'X-justo-PlatformVersion': 'unknown',
      },
      cookies: {},
    });

    expect(requestMetadata(request)).toEqual({
      'Authorization':
        'Bearer eyJhbGciOiJIUzI1NiIsInppcCI6IkRFRiJ9.eNqUV9ty4yAM_Ree452kaS6bp_7Hzo4Hg9LSxcYLONtMp_--4JAG2RgnTwlICOlIR8ifxHQVORBD61bCiwVjfzBVkwVhGqgFTg6rzWa_Xf9cL3eb1X5BWtDk8Ek41Iq2LTn8Ik6RuwNdy90B94eDhP7PPy3c7-8FcYoFfPRXFP4Kdyrs-lWhlQRz2TM11dY70K8qRSvK1GURDFwudWvBg1Zv43vbr4Jj3lW_Q83frr-AUFO2WvGO2ZLRhoEsT0rwUjSm037tnI5Uatp0VF41me6ECRqdAV3Ch2pAUytUU1rV6SmRs2yOoLHt-HqsUZm21HDsGu6Uwp5qvTWFDccOpRXo4NJLiiJnBwLKrDgJex45ggUBlyDD3o_Cf1MWZCb2my_0XENjTXmiUvDL4YF_ccTJJOXy11L2h77CtCtHKV7fbM7EfCqjaOM8Rn5j8CJ9RiXrpA_zCnqtusYicEqmpATWY4NzklAYVDW-eHAa4zzBhyBNx3hLZMBDg2edxfdmqvVmIC3OlxmOZyROVU6ctxtVxjjeURcjQmH5BGLJarpyFAvnuXFXD0vWTM5qHHvkOoJkjNg3mrcjmcxOdp1hSPPuTnW2ew1MF8gs21B7ScaJG1ACtdwDM8BiJE92t2vbpFOsmUhv3LPHfmbrNraYRCHblVI0DYZRgPjU43XyMA9GTynmVRw19i2W3Do8lbUTKhcvcGFN6mAm3pEzUaEmX-hvVkQ5RvZjjt5DM1QByTTP1kFiLsCYPp7VacimajlNl5m3YnaQQAYS_BmOPLFwTL1cxJH2-MnLl6wXh3HZCA7XGdulyoZZvD6Hqdr_C7M0vIMbwvuJ_GtB3q1w3w6rij9v1tW6WD6tt8Xzfr8sKOVQbHbVfrfdH6vqyYPhbLuPid1qGb4mvv4DAAD__w.34_xbKTBsJ_2rVCKCXd5kagEmco1nXDKkf1nZ5Arcrg',
      'X-justo-ClientAppName': ClientAppNameReader.appName,
      'X-justo-Platform': 'unknown',
      'X-justo-PlatformVersion': 'unknown',
    });
  });

  it('should resolve all headers starting with X-ccs-', () => {
    const request = new MockExpressRequest({
      headers: {
        'x-justo-header1': 'header1Val',
        'x-justo-header2': 'header2Val',
        'X-justoZ': 'amazon-known-header',
        'X-justo-platform': 'android-app',
        'X-justo-platformversion': '1.0.0',
      },
    });

    expect(requestMetadata(request)).toEqual({
      'X-justo-ClientAppName': ClientAppNameReader.appName,
      'X-justo-Platform': 'android-app',
      'X-justo-PlatformVersion': '1.0.0',
      'x-justo-header1': 'header1Val',
      'x-justo-header2': 'header2Val',
    });
  });
});
