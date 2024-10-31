const fs = require('fs');
const path = require('path');

/**
 * Update the version in the package.json file. Uses package.json unless there is an override in the `versionFileName` config field.
 * @param {*} version new version changes (major, minor, patch)
 * @param {*} config 
 * @returns 
 */
function updateVersion(version, config) { 
  const packageJsonPath = path.resolve(process.cwd(), config.versionFileName);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  return packageJson.version;
}

/**
 * Get the new version based on the current version and the changes. Uses package.json unless there is an override in the `versionFileName` config field.
 * @param {*} newVersion 
 * @param {*} config 
 * @returns 
 */
function getNewVersion(newVersion, config, _passedVersion = null) {
  const packageJsonPath = path.resolve(process.cwd(), config.versionFileName);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  let [major, minor, patch] = _passedVersion || packageJson.version.split('.').map(Number);
  if (config.squashIntoSingleVersioning) {
    if (newVersion.major > 0) {
      major++;
      minor = 0;
      patch = 0;
    } else if (newVersion.minor > 0) {
      minor++;
      patch = 0;
    } else if (newVersion.patch > 0) {
      patch++;
    }
  } else {
    major += newVersion.major;
    minor += newVersion.minor;
    patch += newVersion.patch;
  }

  return `${major}.${minor}.${patch}`;
}

module.exports = { updateVersion, getNewVersion };
