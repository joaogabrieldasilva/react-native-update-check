// import { Linking } from 'react-native';

import { Linking } from 'react-native';

const fetchLatestVersion = async (bundleId: string) => {
  try {
    const response = await fetch(
      'https://itunes.apple.com/lookup?' +
        new URLSearchParams({
          bundleId,
        })
    );
    const data = (await response.json()) as { results: { version: string }[] };

    const appVersion = data.results[0]?.version;

    if (!appVersion)
      throw new Error(`Failed to get data from bundleId: ${bundleId}`);

    return {
      latestVersion: appVersion,
    };
  } catch (error) {
    throw error;
  }
};

const goToStorePage = (bundleId: string) => {
  const appStoreURI = `itms-apps://apps.apple.com/app/id${bundleId}?mt=8`;
  const appStoreURL = `https://apps.apple.com/app/id${bundleId}?mt=8`;

  // itms-apps must be added to ios InfoPlist
  Linking.canOpenURL(appStoreURI).then((supported) => {
    if (supported) {
      Linking.openURL(appStoreURI);
    } else {
      Linking.openURL(appStoreURL);
    }
  });
};

const needUpdate = (latestVersion: string, currentVersion: string) => {
  const currentVersionArray = currentVersion.split('.');
  const latestVersionArray = latestVersion.split('.');

  for (let i = 0; i < currentVersionArray.length; i++) {
    if (latestVersionArray[i]! > currentVersionArray[i]!) {
      return true;
    }
  }
  return false;
};

const checkForUpdate = async (bundleId: string, currentVersion: string) => {
  const { latestVersion } = await fetchLatestVersion(bundleId);

  return needUpdate(latestVersion, currentVersion);
};

checkForUpdate('br.com.doctorclin', '1.2.3');

export { goToStorePage, needUpdate };
