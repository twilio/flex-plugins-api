import { ReleasesClient } from 'flex-plugins-api-client';

import { Script } from '.';

export interface ReleaseOption {
  version: string;
}

export interface Release {
  releaseSid: string;
  configurationSid: string;
  version: string;
  dateCreated: string;
}

export type ReleaseScript = Script<ReleaseOption, Release>;

export default function release(releaseClient: ReleasesClient) {
  return async (option: ReleaseOption): Promise<Release> => {
    const createOption = {
      ConfigurationId: option.version,
    };
    const releaseResource = await releaseClient.create(createOption);

    return {
      releaseSid: releaseResource.sid,
      configurationSid: releaseResource.configuration_sid,
      version: option.version,
      dateCreated: releaseResource.date_created,
    };
  };
}
