import { PluginServiceHTTPClient, PluginsClient, PluginVersionsClient } from './clients';
import { createConfigurationScript, CreateConfigurationScript, DeployScript, deployScript } from './scripts';
import ConfigurationsClient from './clients/configurations';
import ConfiguredPluginsClient from './clients/configuredPlugins';

export default class Toolkit {
  public readonly deploy: DeployScript;
  public readonly createConfiguration: CreateConfigurationScript;

  constructor(username: string, password: string) {
    const httpClient = new PluginServiceHTTPClient(username, password);
    const pluginClient = new PluginsClient(httpClient);
    const pluginVersionsClient = new PluginVersionsClient(httpClient);
    const configurationsClient = new ConfigurationsClient(httpClient);
    const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);

    this.deploy = deployScript(pluginClient, pluginVersionsClient);
    this.createConfiguration = createConfigurationScript(
      pluginClient,
      pluginVersionsClient,
      configurationsClient,
      configuredPluginsClient,
    );
  }
}
