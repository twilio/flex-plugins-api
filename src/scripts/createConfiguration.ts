import { Plugin } from './deploy';
import { Script } from '.';
import TwilioError from '../exceptions/twilioError';
import PluginsClient from '../clients/plugins';
import PluginVersionsClient from '../clients/pluginVersions';
import ConfigurationsClient, { CreateConfigurationResource, CreateConfiguredPlugin } from '../clients/configurations';
import ConfiguredPluginsClient from '../clients/configuredPlugins';

const pluginRegex = /^(?<name>[\w-]*)@(?<version>[\w\.-]*)$/;

export interface InstalledPlugin extends Plugin {
  phase: number;
}

export interface CreateConfigurationOption {
  plugins: string[];
  version: string;
  description?: string;
  fromConfiguration?: 'active' | string;
}

export interface Configuration {
  configurationSid: string;
  version: string;
  description: string;
  plugins: InstalledPlugin[];
  dateCreated: string;
}

export type CreateConfigurationScript = Script<CreateConfigurationOption, Configuration>;

// TODO: Dedupe for plugins with a mix of Sid and UniqueName

export default function createConfiguration(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
): CreateConfigurationScript {
  return async (option: CreateConfigurationOption): Promise<Configuration> => {
    const pluginsValid = option.plugins.every((plugin) => {
      const match = plugin.match(pluginRegex);
      return match && match.groups && match.groups.name && match.groups.version;
    });
    if (!pluginsValid) {
      throw new TwilioError('Plugins must be of the format pluginName@version');
    }

    const list: string[] = option.plugins;
    // Fetch existing installed plugins
    if (option.fromConfiguration) {
      // TODO: Add support for active once Release client is created
      const items = await configuredPluginClient.list(option.fromConfiguration);
      const existingPlugins = items.plugins
        .filter((plugin) => list.every((p) => p.indexOf(`${plugin.unique_name}@`) === -1))
        .map((p) => `${p.unique_name}@${p.version}`);
      list.push(...existingPlugins);
    }
    const plugins: CreateConfiguredPlugin[] = await Promise.all(
      list.map(async (plugin) => {
        const match = plugin.match(pluginRegex);
        // @ts-ignore
        const { name, version } = match.groups;
        // This checks plugin exists
        await pluginClient.get(name);

        const versionResource =
          version === 'latest' ? await pluginVersionClient.latest(name) : await pluginVersionClient.get(name, version);

        return { plugin_version: versionResource.sid, phase: 3 };
      }),
    );

    // Create a Configuration
    const createOption: CreateConfigurationResource = {
      Plugins: plugins,
      Version: option.version,
    };
    if (option.description) {
      createOption.Description = option.description;
    }
    const configuration = await configurationClient.create(createOption);

    // Fetch installed plugins
    const configuredPluginsPage = await configuredPluginClient.list(configuration.sid);
    const installedPlugins: InstalledPlugin[] = await Promise.all(
      configuredPluginsPage.plugins.map(async (installedPlugin) => {
        const plugin = await pluginClient.get(installedPlugin.plugin_sid);
        const version = await pluginVersionClient.get(installedPlugin.plugin_sid, installedPlugin.plugin_version_sid);

        return {
          pluginSid: installedPlugin.plugin_sid,
          pluginVersionSid: installedPlugin.plugin_version_sid,
          name: installedPlugin.unique_name,
          version: installedPlugin.version,
          url: installedPlugin.plugin_url,
          phase: installedPlugin.phase,
          friendlyName: plugin.friendly_name,
          description: plugin.description,
          changelog: version.changelog,
          isPrivate: installedPlugin.private,
        };
      }),
    );

    return {
      configurationSid: configuration.sid,
      version: configuration.version,
      description: configuration.description,
      plugins: installedPlugins,
      dateCreated: configuration.date_created,
    };
  };
}
