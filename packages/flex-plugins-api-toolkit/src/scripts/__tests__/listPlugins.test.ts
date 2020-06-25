import {
  PluginServiceHTTPClient,
  ConfiguredPluginsClient,
  PluginsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import listPluginsScript, { ListPlugins } from '../listPlugins';
import { installedPlugin, meta, plugin, release } from './mockStore';

describe('ListPluginsScriipt', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releaseClient = new ReleasesClient(httpClient);

  const listPlugins = jest.spyOn(pluginsClient, 'list');
  const listConfiguredPlugins = jest.spyOn(configuredPluginsClient, 'list');
  const active = jest.spyOn(releaseClient, 'active');

  const script = listPluginsScript(pluginsClient, configuredPluginsClient, releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const assertPlugin = (result: ListPlugins[], isActive: boolean) => {
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      sid: plugin.sid,
      name: plugin.unique_name,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      isActive,
      dateCreated: plugin.date_created,
      dateUpdated: plugin.date_updated,
    });
  };

  it('should list plugins with no release', async () => {
    listPlugins.mockResolvedValue({ plugins: [plugin], meta });
    active.mockResolvedValue(null);

    const result = await script();

    expect(listPlugins).toHaveBeenCalledTimes(1);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).not.toHaveBeenCalled();
    assertPlugin(result, false);
  });

  it('should list plugins with release but none are active', async () => {
    const _installedPlugins = { ...installedPlugin };
    _installedPlugins.plugin_sid = 'FP000';

    listPlugins.mockResolvedValue({ plugins: [plugin], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [_installedPlugins], meta });
    active.mockResolvedValue(release);

    const result = await script();

    expect(listPlugins).toHaveBeenCalledTimes(1);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(release.configuration_sid);
    assertPlugin(result, false);
  });

  it('should list plugins with release and is active', async () => {
    const _installedPlugins = { ...installedPlugin };
    _installedPlugins.plugin_sid = plugin.sid;

    listPlugins.mockResolvedValue({ plugins: [plugin], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [_installedPlugins], meta });
    active.mockResolvedValue(release);

    const result = await script();

    expect(listPlugins).toHaveBeenCalledTimes(1);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(release.configuration_sid);
    assertPlugin(result, true);
  });
});
