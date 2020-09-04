import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
  ConfiguredPluginsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';
import cloneDeep from 'lodash.clonedeep';
import { Realm } from 'flex-plugins-api-utils/dist/env';
import { PluginServiceHttpOption } from 'flex-plugins-api-client/dist/clients/client';
import { OptionalHttpConfig } from 'flex-plugins-api-utils';

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
  diffScript,
  DiffScript,
  listConfigurationsScript,
  ListConfigurationsScript,
  listPluginsScript,
  ListPluginsScripts,
  listPluginVersionsScript,
  ListPluginVersionsScripts,
  ListReleasesScript,
  listReleasesScript,
  releaseScript,
  ReleaseScript,
  Script,
} from './scripts';

interface FlexPluginsAPIToolkitOptions extends OptionalHttpConfig {
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
  PluginVersion,
  DescribeConfigurationOption,
  DescribeConfiguration,
  DescribeReleaseOption,
  DescribeRelease,
  InstalledPlugin,
  ListPluginsOption,
  ListPluginsResource,
  ListPluginVersionsOption,
  ListPluginVersionsResource,
  ListConfigurationsOption,
  ListConfigurationsResource,
  ListReleasesOption,
  ListReleasesResource,
  DiffOption,
  Diff,
} from './scripts';

export default class FlexPluginsAPIToolkit {
  public readonly deploy: DeployScript;
  public readonly createConfiguration: CreateConfigurationScript;
  public readonly release: ReleaseScript;
  public readonly listPlugins: ListPluginsScripts;
  public readonly describePlugin: DescribePluginScript;
  public readonly listPluginVersions: ListPluginVersionsScripts;
  public readonly describePluginVersion: DescribePluginVersionScript;
  public readonly listConfigurations: ListConfigurationsScript;
  public readonly describeConfiguration: DescribeConfigurationScript;
  public readonly listReleases: ListReleasesScript;
  public readonly describeRelease: DescribeReleaseScript;
  public readonly diff: DiffScript;

  constructor(username: string, password: string, options?: FlexPluginsAPIToolkitOptions) {
    // Optional realm environment
    const clientOption: PluginServiceHttpOption = {};
    if (options && options.realm) {
      clientOption.realm = options.realm;
    }
    if (options && options.caller) {
      clientOption.caller = options.caller;
    }
    if (options && options.packages) {
      clientOption.packages = options.packages;
    }

    const httpClient = new PluginServiceHTTPClient(username, password, clientOption);
    const pluginClient = new PluginsClient(httpClient);
    const pluginVersionsClient = new PluginVersionsClient(httpClient);
    const configurationsClient = new ConfigurationsClient(httpClient);
    const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
    const releasesClient = new ReleasesClient(httpClient);

    this.deploy = this.cloneArgs(deployScript(pluginClient, pluginVersionsClient));
    this.createConfiguration = this.cloneArgs(
      createConfigurationScript(
        pluginClient,
        pluginVersionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      ),
    );
    this.release = this.cloneArgs(releaseScript(releasesClient));

    this.listPlugins = this.cloneArgs(listPluginsScript(pluginClient, configuredPluginsClient, releasesClient));
    this.describePlugin = this.cloneArgs(
      describePluginScript(pluginClient, pluginVersionsClient, configuredPluginsClient, releasesClient),
    );

    this.listPluginVersions = this.cloneArgs(
      listPluginVersionsScript(pluginVersionsClient, configuredPluginsClient, releasesClient),
    );
    this.describePluginVersion = this.cloneArgs(
      describePluginVersionScript(pluginClient, pluginVersionsClient, configuredPluginsClient, releasesClient),
    );

    this.listConfigurations = this.cloneArgs(listConfigurationsScript(configurationsClient, releasesClient));
    this.describeConfiguration = this.cloneArgs(
      describeConfigurationScript(
        pluginClient,
        pluginVersionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      ),
    );

    this.listReleases = this.cloneArgs(listReleasesScript(releasesClient));
    this.describeRelease = this.cloneArgs(
      describeReleaseScript(
        pluginClient,
        pluginVersionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      ),
    );

    this.diff = this.cloneArgs(
      diffScript(pluginClient, pluginVersionsClient, configurationsClient, configuredPluginsClient, releasesClient),
    );
  }

  // Clones the arguments before passing them to the script
  private cloneArgs = <O, R>(script: Script<O, R>) => async (option: O) => script(cloneDeep(option));
}
