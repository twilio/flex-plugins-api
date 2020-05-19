[![Version](https://img.shields.io/npm/v/flex-plugins-api-toolkit.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-toolkit)
[![Download](https://img.shields.io/npm/dt/flex-plugins-api-toolkit.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-toolkit)
[![License](https://img.shields.io/npm/l/flex-plugins-api-toolkit.svg?style=square)](../../LICENSE)

# Flex Plugins API Client

A wrapper for performing the most common use cases of the Flex Plugins API.

## Installation

Install this package using:

```bash
npm i -S flex-plugins-api-toolkit

# Or use yarn
yarn add flex-plugins-api-toolkit
``` 

## Usage

Instantiate a `FlexPluginsAPIToolkit` client by providing username/password (which can be AccountSid/AuthToken or API Key/Secret).

```js
import { FlexPluginsAPIToolkit } from 'flex-plugins-api-toolkit';

// Instantiate the HTTP client
const toolkit = new FlexPluginsAPIToolkit(process.env.USERNAME, process.env.PASSWORD);
```
