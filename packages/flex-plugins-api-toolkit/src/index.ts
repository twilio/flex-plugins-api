import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
  ConfiguredPluginsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';
import { Realm } from 'flex-plugins-api-utils/dist/env';
import { PluginServiceHttpOption } from 'flex-plugins-api-client/dist/clients/client';

import {
  createConfigurationScript,
  CreateConfigurationScript,
  DeployScript,
  deployScript,
  releaseScript,
  ReleaseScript,
} from './scripts';

interface FlexPluginsAPIToolkitOptions {
  realm?: Realm;
}

export default class FlexPluginsAPIToolkit {
  public readonly deploy: DeployScript;
  public readonly createConfiguration: CreateConfigurationScript;
  public readonly release: ReleaseScript;

  constructor(username: string, password: string, options?: FlexPluginsAPIToolkitOptions) {
    // Optional realm environment
    const clientOption: PluginServiceHttpOption = {};
    if (options && options.realm) {
      clientOption.realm = options.realm;
    }

    const httpClient = new PluginServiceHTTPClient(username, password, clientOption);
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
