import { PluginServiceHTTPClient, PluginsClient, PluginVersionsClient } from './clients';
import { DeployScript, deployScript } from './scripts';

export default class Toolkit {
  public readonly deploy: DeployScript;

  constructor(username: string, password: string) {
    const httpClient = new PluginServiceHTTPClient(username, password);
    const pluginClient = new PluginsClient(httpClient);
    const pluginVersionsClient = new PluginVersionsClient(httpClient);

    this.deploy = deployScript(pluginClient, pluginVersionsClient);
  }
}
