[![Version](https://img.shields.io/npm/v/flex-plugins-api-toolkit.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-toolkit)
[![Download](https://img.shields.io/npm/dt/flex-plugins-api-toolkit.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-toolkit)
[![License](https://img.shields.io/npm/l/flex-plugins-api-toolkit.svg?style=square)](../../LICENSE)

# Flex Plugins API Toolkit

A wrapper for performing the most common use cases of the Flex Plugins API.

## Installation

Install this package using:

```bash
# Using npm
npm i -S flex-plugins-api-toolkit

# Using yarn
yarn add flex-plugins-api-toolkit
``` 

## Usage

Instantiate a `FlexPluginsAPIToolkit` client by providing username/password (AccountSid/AuthToken, API Key/Secret, or JWE token).

```js
import FlexPluginsAPIToolkit from 'flex-plugins-api-toolkit';

// Instantiate the HTTP client
const toolkit = new FlexPluginsAPIToolkit(process.env.USERNAME, process.env.PASSWORD);

// In case of a JWE token, the username is "token" and the password is your JWE token.
```

## Methods

The toolkit provides the following commands. 

*Note*: If you are using the JWE token for authentication, then _all_ identifiers (such as `name`, `version`, etc) _must_ be the sid of the resource only.

### .deploy(option)

This command deploys a new plugin version to Plugins API. This wrapper upserts a plugin (i.e., updates the plugin if it exists, otherwise creates a new plugin) and then creates a new version. 

The command takes an argument object of the format:

```ts
interface DeployOption {
  name: string;
  url: string;
  version: string;
  friendlyName?: string;
  description?: string;
  changelog?: string;
  isPrivate?: boolean;
}
```

The command returns a promise of type:

```ts
interface DeployPlugin {
  pluginSid: string;
  pluginVersionSid: string;
  name: string;
  version: string;
  url: string;
  friendlyName: string;
  description: string;
  changelog: string;
  isPrivate: boolean;
}
```

### .createConfiguration(option)

This command creates a new configuration and installs a list of provided plugins. 

The command takes an argument object of the format:

```ts
interface CreateConfigurationOption {
  plugins: string[];
  version: string;
  description?: string;
  fromConfiguration?: 'active' | string;
}
```

where the `plugins` field is an array of plugins formatted as `pluginName@version`. It is the list of plugins and their corresponding versions that you want to include in this plugin (you can use Sids or unique name/version):

```ts
const option = {
  plugins: [
    'plugin-sample@1.0.0',
    'FPxxx@1.0.0',
    'another-plugin@FVxxx',
    'FPxxy@FVxxy'
  ],
  ...
}
```

The command returns a promise of type:

```ts
export interface CreateConfiguration {
  configurationSid: string;
  version: string;
  description: string;
  dateCreated: string;
  plugins: Array<{
    pluginSid: string;
    pluginVersionSid: string;
    name: string;
    version: string;
    url: string;
    friendlyName: string;
    description: string;
    changelog: string;
    isPrivate: boolean;
    phase: number;
  }>;
}
```

### .release(option)

This command creates a new release and activates the given configuration. 

The command takes an argument object of the format:

```ts
interface ReleaseOption {
  version: string;
}
```

where `version` is the identifier of the configuration which can be either the version or its sid.

The command returns a promise of type:

```ts
interface Release {
  releaseSid: string;
  configurationSid: string;
  version: string;
  dateCreated: string;
}
```

### .describePlugin(option)

This command returns information about a plugin and its versions. 

The command takes an argument object of the format:

```ts
interface DescribePluginOption {
  name: string;
}
```

where the  `name` is either the plugin's unique name or its sid.

The command returns a promise of type:

```ts
interface DescribePlugin {
  sid: string;
  name: string;
  friendlyName: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
  dateUpdated: string;
  versions: Array<{
    sid: string;
    version: string;
    url: string;
    changelog: string;
    isPrivate: boolean;
    isActive: boolean;
    dateCreated: string;
  }>;
}
```

The field `isActive` is set to true if this plugin is part of an active release. The associated version that is part of the active release also has `isActive` set to true.

### .describePluginVersion(option)

This command returns information about a plugin version.

The command takes an argument object of the format:

```ts
interface DescribePluginVersionOption {
  name: string;
  version: string;
}
```

where the `name` is either the plugin's unique name or its sid; the version is either the plugin version's version or its sid.

The command returns a promise of type:

```ts
interface DescribePluginVersion {
  sid: string;
  version: string;
  url: string;
  changelog: string;
  isPrivate: boolean;
  isActive: boolean;
  plugin: {
    sid: string;
    name: string;
    friendlyName: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
  };
  dateCreated: string;
}
```

The field `isActive` is set to true if this plugin version is part of an active release. 

### .describeConfiguration(option)

This command returns information about a configuration, including a list of plugins included in it.

The command takes an argument object of the format:

```ts
interface DescribeConfigurationOption {
  version: string;
}
```

where the `version` is either the configuration's version or its sid.

The command returns a promise of type:

```ts
interface DescribeConfiguration {
  sid: string;
  version: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
  plugins: Array<{
    pluginSid: string;
    pluginVersionSid: string;
    name: string;
    version: string;
    url: string;
    friendlyName: string;
    description: string;
    changelog: string;
    isPrivate: boolean;
    phase: number;
  }>;
}
```

The field `isActive` is set to true if this configuration is part of an active release.

### .describeRelease(option)

This command returns information about a release.

The command takes an argument object of the format:

```ts
interface DescribeReleaseOption {
  sid: string;
}
```

The command returns a promise of type:

```ts
interface Release {
  sid: string;
  configurationSid: string;
  isActive: boolean;
  dateCreated: string;
  configuration: {
    sid: string;
    version: string;
    description: string;
    isActive: boolean;
    dateCreated: string;
    plugins: Array<{
      pluginSid: string;
      pluginVersionSid: string;
      name: string;
      version: string;
      url: string;
      friendlyName: string;
      description: string;
      changelog: string;
      isPrivate: boolean;
      phase: number;
   }>;
  }
}
```

The field `isActive` is set to true if this release is the active release.
