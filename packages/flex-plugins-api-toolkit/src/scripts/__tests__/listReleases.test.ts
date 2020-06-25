import { PluginServiceHTTPClient, ReleasesClient } from 'flex-plugins-api-client';

import listReleasesScript from '../listReleases';
import { meta, release } from './mockStore';

describe('ListReleasesScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const releaseClient = new ReleasesClient(httpClient);

  const list = jest.spyOn(releaseClient, 'list');

  const script = listReleasesScript(releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list releases', async () => {
    list.mockResolvedValue({ releases: [release], meta });
    const result = await script();

    expect(list).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      sid: release.sid,
      configurationSid: release.configuration_sid,
      dateCreated: release.date_created,
    });
  });
});
