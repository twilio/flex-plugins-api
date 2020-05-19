import releaseScript from '../release';
import { ReleasesClient } from '../../clients';
import PluginServiceHttpClient from '../../clients/client';
import { ReleaseResource } from '../../clients/releases';

describe('DeployScript', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const releaseClient = new ReleasesClient(httpClient);

  const create = jest.spyOn(releaseClient, 'create');

  const release: ReleaseResource = {
    sid: 'FK00000000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000000',
    configuration_sid: 'FJ00000000000000000000000000000000',
    date_created: '',
  };

  const script = releaseScript(releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a release', async () => {
    create.mockResolvedValue(release);
    const result = await script({ version: '1.2.3' });

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({ ConfigurationId: '1.2.3' });
    expect(result).toEqual({
      version: '1.2.3',
      configurationSid: release.configuration_sid,
      releaseSid: release.sid,
      dateCreated: release.date_created,
    });
  });
});
