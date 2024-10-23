const fs = require('fs');
const path = require('path');

/**
 * Update the version in the package.json file
 * @param {*} newVersion new version changes (major, minor, patch)
 * @returns 
 */
function updateVersion(newVersion, config) {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  let [major, minor, patch] = packageJson.version.split('.').map(Number);
  if (config.squashIntoSingleVersioning) {
    if (newVersion.major > 0) {
      minor = 0;
      patch = 0;
    }
    if (newVersion.minor > 0) {
      patch = 0;
    }
  }
  major += newVersion.major;
  minor += newVersion.minor;
  patch += newVersion.patch;

  packageJson.version = `${major}.${minor}.${patch}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  return packageJson.version;
}

module.exports = { updateVersion };
