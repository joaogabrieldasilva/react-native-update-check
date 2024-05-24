type AppStoreResult = { version: string; trackId: string };

export class ReactNativeUpdateCheck {
  readonly bundleId: string;
  latestVersion: string | null = null;
  storeUrl: string | null = null;

  constructor(bundleId: string) {
    this.bundleId = bundleId;

    this.fetchAppData();
  }

  private async fetchAppData() {
    try {
      const response = await fetch(
        'https://itunes.apple.com/lookup?' +
          new URLSearchParams({
            bundleId: this.bundleId,
          })
      );
      const data = (await response.json()) as {
        results: AppStoreResult[];
      };

      const result = data?.results[0];

      if (!result)
        throw new Error(
          `Failed to get app data from bundleId: ${this.bundleId}`
        );

      this.latestVersion = result.version;
      this.storeUrl = `https://apps.apple.com/app/id${result.trackId}?mt=8`;
    } catch (error) {
      throw error;
    }
  }

  private needsUpdate(currentVersion: string) {
    const currentVersionArray = currentVersion.split('.');
    const latestVersionArray = this.latestVersion!.split('.');

    for (let i = 0; i < currentVersionArray.length; i++) {
      if (latestVersionArray[i]! > currentVersionArray[i]!) {
        return true;
      }
    }
    return false;
  }

  async checkForUpdate(currentVersion: string) {
    return this.needsUpdate(currentVersion);
  }
}

export default ReactNativeUpdateCheck;
