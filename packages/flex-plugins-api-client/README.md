[![Version](https://img.shields.io/npm/v/flex-plugins-api-client.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-client)
[![Download](https://img.shields.io/npm/dt/flex-plugins-api-client.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-client)
[![License](https://img.shields.io/npm/l/flex-plugins-api-client.svg?style=square)](../../LICENSE)

# Flex Plugins API Client

This package provides a NodeJS client for using the [Public API endpoints](https://www.twilio.com/docs/flex/plugins/api).

## Installation

Install this package using:

```bash
npm i -S flex-plugins-api-client

# Or use yarn
yarn add flex-plugins-api-client
``` 

## Usage

Instantiate a `PluginServiceHttp` client by providing username/password (which can be AccountSid/AuthToken or API Key/Secret). Then instantiate each required client by passing this HTTP client to it:

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
