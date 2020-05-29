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
  describeConfigurationScript,
  DescribeConfigurationScript,
  describePluginScript,
  DescribePluginScript,
  describePluginVersionScript,
  DescribePluginVersionScript,
  describeReleaseScript,
  DescribeReleaseScript,
  releaseScript,
  ReleaseScript,
} from './scripts';

interface FlexPluginsAPIToolkitOptions {
  realm?: Realm;
}

export {
  DeployOption,
  DeployPlugin,
  CreateConfigurationOption,
  CreateConfiguration,
  ReleaseOption,
  Release,
  DescribePluginOption,
  DescribePlugin,
  DescribePluginVersionOption,
  DescribePluginVersion,
  DescribeConfigurationOption,
  DescribeConfiguration,
  DescribeReleaseOption,
  DescribeRelease,
} from './scripts';

export default class FlexPluginsAPIToolkit {
  public readonly deploy: DeployScript;
  public readonly createConfiguration: CreateConfigurationScript;
  public readonly release: ReleaseScript;
  public readonly describePlugin: DescribePluginScript;
  public readonly describePluginVersion: DescribePluginVersionScript;
  public readonly describeConfiguration: DescribeConfigurationScript;
  public readonly describeRelease: DescribeReleaseScript;

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
    this.describePlugin = describePluginScript(
      pluginClient,
      pluginVersionsClient,
      configuredPluginsClient,
      releasesClient,
    );
    this.describePluginVersion = describePluginVersionScript(
      pluginClient,
      pluginVersionsClient,
      configuredPluginsClient,
      releasesClient,
    );
    this.describeConfiguration = describeConfigurationScript(
      pluginClient,
      pluginVersionsClient,
      configurationsClient,
      configuredPluginsClient,
      releasesClient,
    );
    this.describeRelease = describeReleaseScript(
      pluginClient,
      pluginVersionsClient,
      configurationsClient,
      configuredPluginsClient,
      releasesClient,
    );
  }
}
