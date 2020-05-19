import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
  ConfiguredPluginsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import {
  createConfigurationScript,
  CreateConfigurationScript,
  DeployScript,
  deployScript,
  releaseScript,
  ReleaseScript,
} from './scripts';

export default class Toolkit {
  public readonly deploy: DeployScript;
  public readonly createConfiguration: CreateConfigurationScript;
  public readonly release: ReleaseScript;

  constructor(username: string, password: string) {
    const httpClient = new PluginServiceHTTPClient(username, password);
    const pluginClient = new PluginsClient(httpClient);
    const pluginVersionsClient = new PluginVersionsClient(httpClient);
    const configurationsClient = new ConfigurationsClient(httpClient);
    const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
    const releasesClient = new ReleasesClient(httpClient);

    this.deploy = deployScript(pluginClient, pluginVersionsClient);
    this.createConfiguration = createConfigurationScript(
      pluginClient,
      pluginVersionsClient,
      configurationsClient,
      configuredPluginsClient,
    );
    this.release = releaseScript(releasesClient);
  }
}
