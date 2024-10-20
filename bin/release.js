#!/usr/bin/env node
const { loadConfig, checkAndCreateConfig } = require('../lib/config');
const { getCommits, classifyVersion } = require('../lib/git-utils');
const { generateReleaseNotes } = require('../lib/release-notes');
const { updateVersion } = require('../lib/versioning');

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

const commits = getCommits();

const newVersionType = classifyVersion(commits, config);

const newVersion = updateVersion(newVersionType);

generateReleaseNotes(newVersion, config);

if (config.autoCommit) {
  console.log('Auto commit is enabled. Committing the changes to the repository...');
  const execSync = require('child_process').execSync;
  execSync(`git add . && git commit -m "chore: release v${newVersion}" && git tag -a v${newVersion} -m "Release v${newVersion}" && git push --follow-tags`, { stdio: 'inherit' });
}

console.log(`New release version: ${newVersion} of type ${newVersionType}`);
