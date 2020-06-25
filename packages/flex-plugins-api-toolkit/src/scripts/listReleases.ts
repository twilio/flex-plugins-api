import { ReleasesClient } from 'flex-plugins-api-client';

import { Script } from '.';

export interface ListReleases {
  sid: string;
  configurationSid: string;
  dateCreated: string;
}

export type ListReleasesScript = Script<{}, ListReleases[]>;

/**
 * The .listReleases script. This script returns overall information about a Release
 * @param releaseClient the Public API {@link ReleasesClient}
 */
export default function listReleases(releaseClient: ReleasesClient) {
  return async (): Promise<ListReleases[]> => {
    const result = await releaseClient.list();

    return result.releases.map((release) => ({
      sid: release.sid,
      configurationSid: release.configuration_sid,
      dateCreated: release.date_created,
    }));
  };
}
