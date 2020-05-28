[![Version](https://img.shields.io/npm/v/flex-plugins-api-client.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-client)
[![Download](https://img.shields.io/npm/dt/flex-plugins-api-client.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-client)
[![License](https://img.shields.io/npm/l/flex-plugins-api-client.svg?style=square)](../../LICENSE)

# Flex Plugins API Client

This package provides a NodeJS HTTP client for using the [Public API endpoints](https://www.twilio.com/docs/flex/plugins/api).

## Installation

Install this package using:

```bash
# Using npm
npm i -S flex-plugins-api-client

# Using yarn
yarn add flex-plugins-api-client
``` 

## Usage

Instantiate a `PluginServiceHttpClient` client by providing username/password (AccountSid/AuthToken, API Key/Secret, or JWE token). Then instantiate each client (corresponding to different resources) by passing this HTTP client to it:

```js
import {
    PluginServiceHttpClient,
    PluginsClient,
    PluginVersionsClient
} from 'flex-plugins-api-client';

// Instantiate the HTTP client
const httpClient = new PluginServiceHttpClient(process.env.USERNAME, process.env.PASSWORD);

// Now instantiate each endpoint client you want to use
const pluginsClient = new PluginsClient(httpClient);
const pluginsVersionClient = new PluginVersionsClient(httpClient);
```
## Clients

The available clients are listed below. All endpoints return a promise.

### PluginsClient

This is the HTTP client for [plugins](https://www.twilio.com/docs/flex/plugins/api/plugin) endpoints. Available endpoints are:

#### list()

This endpoint lists all plugins. 

#### get(pluginId)

This endpoint fetches the provided plugin.

#### create(requestObject)

This endpoint creates a new plugin.

#### update(pluginId, updateObjct)

This endpoint updates a plugin.

#### upsert(upsertObject)

This endpoint tries to find the plugin by uniqueName. If it is found, then it updates the plugin; otherwise, it creates a new plugin.

### PluginVersionsClient

This is the HTTP client for [plugin versions](https://www.twilio.com/docs/flex/plugins/api/plugin-version) endpoints. Available endpoints are:

#### list(pluginId)

This endpoint lists all plugin versions of the given plugin.

#### latest(pluginId)

This endpoints returns the latest plugin version (by the date created) of the given plugin.

#### get(pluginId, versionId)

This endpoint fetches the provided plugin version.

#### create(pluginId, requestObject)

This endpoint creates a new plugin version.

### ConfigurationsClient

This is the HTTP client for [configurations](https://www.twilio.com/docs/flex/plugins/api/plugin-configuration) endpoints. Available endpoints are:

#### list()

This endpoint lists all configurations.

#### get(configId)

This endpoint fetches the provided configuration.

#### create(requestObject)

This endpoint creates a new configuration.

### ConfiguredPluginsClient

This is the HTTP client for [configured plugins](https://www.twilio.com/docs/flex/plugins/api/plugin-configuration) endpoints. Available endpoints are:

#### list(configId)

This endpoint lists all configured plugins.

#### get(configId, pluginId)

This endpoint fetches the provided configured plugins.

### ReleasesClient

This is the HTTP client for [releases](https://www.twilio.com/docs/flex/plugins/api/release) endpoints. Available endpoints are:

#### list()

This endpoint lists all releases.

#### active()

This endpoint returns the currently active release.

#### get(releaseId)

This endpoint fetches the provided release.

#### create(requestObject)

This endpoint creates a new release.
