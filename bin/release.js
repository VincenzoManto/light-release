#!/usr/bin/env node
const { loadConfig, checkAndCreateConfig } = require('../lib/config');
const { getCommits, classifyVersion, checkIfChangesExist } = require('../lib/git-utils');
const { generateReleaseNotes } = require('../lib/release-notes');
const { updateVersion, getNewVersion } = require('../lib/versioning');

/**
 * @file release.js
 * @description This script automates the release process by loading configuration,
 *              retrieving commits, classifying the version type, updating the version,
 *              and generating release notes.
 * @module release
 */

/**
 * Loads the configuration file and checks if it needs to be created.
 * @function checkAndCreateConfig
 */

/**
 * Loads the configuration settings.
 * @function loadConfig
 * @returns {Object} The configuration settings.
 */

/**
 * Retrieves the list of commits.
 * @function getCommits
 * @returns {Array} The list of commits.
 */

/**
 * Classifies the version type based on the commits.
 * @function classifyVersion
 * @param {Array} commits - The list of commits.
 * @returns {string} The type of the new version (e.g., 'major', 'minor', 'patch').
 */

/**
 * Updates the version based on the version type.
 * @function updateVersion
 * @param {string} versionType - The type of the new version.
 * @returns {string} The new version number.
 */

/**
 * Generates release notes for the new version.
 * @function generateReleaseNotes
 * @param {string} newVersion - The new version number.
 * @param {Object} config - The configuration settings.
 */

checkAndCreateConfig();

const config = loadConfig();

if (config.blockIfChangesExist && checkIfChangesExist()) {
  console.log('\x1b[31m%s\x1b[0m', 'Error: There are uncommitted changes in the repository. Please commit or stash them before proceeding or change blockIfChangesExist config');
  process.exit(1);
}

const commits = getCommits(config);

const newVersionType = classifyVersion(commits, config);

const newVersion = getNewVersion(newVersionType, config);

const releaseNotes = generateReleaseNotes(newVersion, config);

const mdContent = releaseNotes.mdContent.replace(/\n/g, '\\n').replace(/[\*\#]/g, '') || `Release note v${newVersion}`;

updateVersion(newVersion, config);

console.log(`New release version: ${newVersion} of type ${newVersionType.type}`);

if (config.autoCommit) {
  console.log('\x1b[36m%s\x1b[0m', '\nAuto commit is enabled. Committing the changes to the repository...\n');
  const execSync = require('child_process').execSync;

  // Verifica se il tag esiste controllando l'output di `git tag -l`
  const tagExists = execSync(`git tag -l v${newVersion}`).toString().trim() === `v${newVersion}`;

  try {
    if (tagExists) {
      console.warn(`\n\x1b[33mWarning: Tag v${newVersion} already exists. Skipping tag creation.\x1b[0m\n`);
      execSync(`git add . && git commit -m "chore: release v${newVersion}" && git push`, { stdio: 'inherit' });
    } else {
      console.log(`git add . && git commit -m "chore: release v${newVersion}" && git tag -a v${newVersion} -m "${releaseNotes.mdContent.replace(/\n/g, '\\n') || 'Release note v' + newVersion}" && git push --follow-tags`);
      execSync(`git add . && git commit -m "chore: release v${newVersion}" && git tag -a v${newVersion} -m "${mdContent}" && git push --follow-tags`, { stdio: 'inherit' });
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: Unable to commit the changes to the repository.');
    process.exit(0);
  }
}
