import createConfigurationScript from '../createConfiguration';
import { PluginsClient, PluginVersionsClient, ConfigurationsClient, ConfiguredPluginsClient } from '../../clients';
import PluginServiceHttpClient from '../../clients/client';
import TwilioError from '../../exceptions/twilioError';
import { PluginVersionResource } from '../../clients/pluginVersions';
import { ConfigurationResource } from '../../clients/configurations';
import { PluginResource } from '../../clients/plugins';
import { ConfiguredPluginResource } from '../../clients/configuredPlugins';

describe('CreateConfigurationScript', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);
  const versionsClient = new PluginVersionsClient(httpClient);
  const configurationsClient = new ConfigurationsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);

  const listConfiguredPlugins = jest.spyOn(configuredPluginsClient, 'list');
  const getPlugin = jest.spyOn(pluginsClient, 'get');
  const getVersion = jest.spyOn(versionsClient, 'get');
  const getLatestVersion = jest.spyOn(versionsClient, 'latest');
  const create = jest.spyOn(configurationsClient, 'create');

  const plugin: PluginResource = {
    sid: 'FP00000000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000000',
    unique_name: 'pluginName',
    friendly_name: '',
    description: '',
    date_created: '',
    date_updated: '',
  };
  const pluginVersion: PluginVersionResource = {
    sid: 'FV00000000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000000',
    plugin_sid: 'FP00000000000000000000000000000000',
    version: '1.0.0',
    plugin_url: 'https://twilio.com',
    private: true,
    changelog: '',
    date_created: '',
  };
  const configuration: ConfigurationResource = {
    sid: 'FJ00000000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000000',
    version: '1.2.3',
    description: '',
    date_created: '',
  };
  const configuredPlugin: ConfiguredPluginResource = {
    plugin_sid: 'FP00000000000000000000000000000000',
    plugin_version_sid: 'FV00000000000000000000000000000000',
    configuration_sid: 'FJ00000000000000000000000000000000',
    unique_name: 'pluginName',
    version: '1.0.0',
    plugin_url: 'https://twilio.com',
    phase: 3,
    private: true,
    date_created: '',
  };

  const script = createConfigurationScript(
    pluginsClient,
    versionsClient,
    configurationsClient,
    configuredPluginsClient,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw error if plugins does not contain version', async (done) => {
    const option = {
      plugins: ['plugin1'],
      version: '1.2.3',
    };

    try {
      await script(option);
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioError);
      expect(e.message).toContain('must be of the format');

      expect(getPlugin).not.toHaveBeenCalled();
      expect(getVersion).not.toHaveBeenCalled();
      expect(getLatestVersion).not.toHaveBeenCalled();
      expect(create).not.toHaveBeenCalled();
      expect(listConfiguredPlugins).not.toHaveBeenCalled();

      done();
    }
  });

  it('should throw an exception if a plugin is not found', async (done) => {
    const option = {
      plugins: ['plugin1@version1'],
      version: '1.2.3',
    };
    getPlugin.mockRejectedValue('plugin not found');

    try {
      await script(option);
    } catch (e) {
      expect(e).toEqual('plugin not found');

      expect(getPlugin).toHaveBeenCalledTimes(1);
      expect(getPlugin).toHaveBeenCalledWith('plugin1');
      expect(getVersion).not.toHaveBeenCalled();
      expect(getLatestVersion).not.toHaveBeenCalled();
      expect(create).not.toHaveBeenCalled();
      expect(listConfiguredPlugins).not.toHaveBeenCalled();

      done();
    }
  });

  it('should throw an exception if plugin version is not found', async (done) => {
    const option = {
      plugins: ['plugin1@version1'],
      version: '1.2.3',
    };
    getVersion.mockRejectedValue('plugin version not found');

    try {
      await script(option);
    } catch (e) {
      expect(e).toEqual('plugin version not found');

      expect(getPlugin).toHaveBeenCalledTimes(1);
      expect(getPlugin).toHaveBeenCalledWith('plugin1');
      expect(getVersion).toHaveBeenCalledTimes(1);
      expect(getVersion).toHaveBeenCalledWith('plugin1', 'version1');
      expect(getLatestVersion).not.toHaveBeenCalled();
      expect(create).not.toHaveBeenCalled();
      expect(listConfiguredPlugins).not.toHaveBeenCalled();

      done();
    }
  });

  it('should throw an exception create configuration fails', async (done) => {
    const option = {
      plugins: ['plugin1@version1'],
      version: '1.2.3',
    };
    getVersion.mockResolvedValue(pluginVersion);
    create.mockRejectedValue('failed to create configuration');

    try {
      await script(option);
    } catch (e) {
      expect(e).toEqual('failed to create configuration');

      expect(getPlugin).toHaveBeenCalledTimes(1);
      expect(getPlugin).toHaveBeenCalledWith('plugin1');
      expect(getVersion).toHaveBeenCalledTimes(1);
      expect(getVersion).toHaveBeenCalledWith('plugin1', 'version1');
      expect(getLatestVersion).not.toHaveBeenCalled();
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({
        Plugins: [{ plugin_version: pluginVersion.sid, phase: 3 }],
        Version: option.version,
      });
      expect(listConfiguredPlugins).not.toHaveBeenCalled();

      done();
    }
  });

  it('should create new configuration', async () => {
    const option = {
      plugins: ['plugin1@version1'],
      version: '1.2.3',
    };
    getVersion.mockResolvedValue(pluginVersion);
    create.mockResolvedValue(configuration);
    getPlugin.mockResolvedValue(plugin);
    getVersion.mockResolvedValue(pluginVersion);
    // @ts-ignore
    listConfiguredPlugins.mockResolvedValue({ plugins: [configuredPlugin], meta: null });

    const result = await script(option);
    expect(getPlugin).toHaveBeenCalledTimes(2);
    expect(getPlugin).toHaveBeenCalledWith('plugin1');
    expect(getPlugin).toHaveBeenCalledWith(plugin.sid);
    expect(getVersion).toHaveBeenCalledTimes(2);
    expect(getVersion).toHaveBeenCalledWith('plugin1', 'version1');
    expect(getVersion).toHaveBeenCalledWith(plugin.sid, pluginVersion.sid);
    expect(getLatestVersion).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({
      Plugins: [{ plugin_version: pluginVersion.sid, phase: 3 }],
      Version: option.version,
    });
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(configuration.sid);

    expect(result).toEqual({
      configurationSid: configuration.sid,
      version: configuration.version,
      description: configuration.description,
      plugins: [
        {
          pluginSid: configuredPlugin.plugin_sid,
          pluginVersionSid: configuredPlugin.plugin_version_sid,
          name: configuredPlugin.unique_name,
          version: configuredPlugin.version,
          url: configuredPlugin.plugin_url,
          phase: configuredPlugin.phase,
          friendlyName: plugin.friendly_name,
          description: plugin.description,
          changelog: pluginVersion.changelog,
          isPrivate: configuredPlugin.private,
        },
      ],
      dateCreated: configuration.date_created,
    });
  });

  it('should create fetch plugin version by latest', async (done) => {
    const option = {
      plugins: ['plugin1@latest'],
      version: '1.2.3',
    };
    getVersion.mockResolvedValue(pluginVersion);
    create.mockResolvedValue(configuration);

    try {
      await script(option);
    } catch (e) {
      // not really testing the rejection; just testing @latest is respected

      expect(getPlugin).toHaveBeenCalledTimes(1);
      expect(getPlugin).toHaveBeenCalledWith('plugin1');
      expect(getVersion).not.toHaveBeenCalled();
      expect(getLatestVersion).toHaveBeenCalledTimes(1);
      expect(getLatestVersion).toHaveBeenCalledWith('plugin1');

      done();
    }
  });
});
