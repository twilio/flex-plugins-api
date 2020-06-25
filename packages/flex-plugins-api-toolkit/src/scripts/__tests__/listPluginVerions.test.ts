import {
  PluginServiceHTTPClient,
  ConfiguredPluginsClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import listPluginVersionsScript, { ListPluginVersions } from '../listPluginVerions';
import { installedPlugin, meta, version, release } from './mockStore';

describe('ListPluginsScriipt', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginVersionsClient = new PluginVersionsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releaseClient = new ReleasesClient(httpClient);

  const listVersions = jest.spyOn(pluginVersionsClient, 'list');
  const listConfiguredPlugins = jest.spyOn(configuredPluginsClient, 'list');
  const active = jest.spyOn(releaseClient, 'active');

  const script = listPluginVersionsScript(pluginVersionsClient, configuredPluginsClient, releaseClient);
  const option = { name: 'plugin-sample' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const assertVersions = (result: ListPluginVersions[], isActive: boolean) => {
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      sid: version.sid,
      pluginSid: version.plugin_sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive,
      dateCreated: version.date_created,
    });
  };

  it('should list versions with no release', async () => {
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    active.mockResolvedValue(null);

    const result = await script(option);

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).not.toHaveBeenCalled();
    assertVersions(result, false);
  });

  it('should list versions with release but none are active', async () => {
    const _installedPlugins = { ...installedPlugin };
    _installedPlugins.plugin_version_sid = 'FV000';

    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [_installedPlugins], meta });
    active.mockResolvedValue(release);

    const result = await script(option);

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(release.configuration_sid);
    assertVersions(result, false);
  });

  it('should list versions with release and is active', async () => {
    const _installedPlugins = { ...installedPlugin };
    _installedPlugins.plugin_version_sid = version.sid;

    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [_installedPlugins], meta });
    active.mockResolvedValue(release);

    const result = await script(option);

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(release.configuration_sid);
    assertVersions(result, true);
  });
});
