import { PluginServiceHTTPClient } from 'flex-plugins-api-client';
import { Realm } from 'flex-plugins-api-utils/dist/env';
import { OptionalHttpConfig } from 'flex-plugins-api-utils';

import FlexPluginsAPIToolkitBase from './flexPluginsAPIToolkitBase';

export {
  DeployOption,
  DeployPlugin,
  CreateConfigurationOption,
  CreateConfiguration,
  ReleaseOption,
  Release,
  DescribePluginOption,
  DescribePlugin,
  Plugin,
  DescribePluginVersionOption,
  DescribePluginVersion,
  PluginVersion,
  DescribeConfigurationOption,
  DescribeConfiguration,
  DescribeReleaseOption,
  DescribeRelease,
  Configuration,
  InstalledPlugin,
  ListPluginsOption,
  ListPluginsResource,
  ListPluginVersionsOption,
  ListPluginVersionsResource,
  ListConfigurationsOption,
  ListConfigurationsResource,
  ListReleasesOption,
  ListReleasesResource,
  ArchivePluginOption,
  ArchivePluginVersionOption,
  ArchiveConfigurationOption,
  DiffOption,
  Diff,
} from './scripts';

interface FlexPluginsAPIToolkitOptions extends OptionalHttpConfig {
  realm?: Realm;
}

export { default as FlexPluginsAPIToolkitBase } from './flexPluginsAPIToolkitBase';

export default class FlexPluginsAPIToolkit extends FlexPluginsAPIToolkitBase {
  constructor(username: string, password: string, options?: FlexPluginsAPIToolkitOptions) {
    const httpClient = new PluginServiceHTTPClient(username, password, options);

    super(httpClient);
  }
}
