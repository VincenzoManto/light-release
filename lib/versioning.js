const fs = require('fs');
const path = require('path');

/**
 * Update the version in the package.json file
 * @param {*} newVersion new version type (major, minor, patch)
 * @returns 
 */
function updateVersion(newVersion) {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  let [major, minor, patch] = packageJson.version.split('.').map(Number);
  if (newVersion === 'major') major++;
  if (newVersion === 'minor') minor++;
  if (newVersion === 'patch') patch++;

  packageJson.version = `${major}.${minor}.${patch}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  return packageJson.version;
}

module.exports = { updateVersion };
