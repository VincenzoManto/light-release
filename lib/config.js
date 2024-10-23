const fs = require('fs');
const path = require('path');

/**
 * Check if the configuration file exists, if not create it
 */
function checkAndCreateConfig() {
  const configPath = path.join(process.cwd(), 'light-release.config.json');
  if (!fs.existsSync(configPath)) {
    createDefaultConfig();
    console.log('Default configuration file created: light-release.config.json');
  }
}

/**
 * Load the configuration from the configuration
 * @returns
 */
function loadConfig() {
  const configPath = path.join(process.cwd(), 'light-release.config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    return {
      generateMarkdown: true,
      generateHTML: true,
      releaseNotesDir: '.release-notes',
      badgeStyle: 'flat-square',
      dateFormat: 'YYYY-MM-DD',
      blockIfChangesExist: true,
      showCommitImpact: true,
      autoCommit: false,
      squashIntoSingleVersioning: true,
      showAuthorLinks: true,
      defaultImpactThresholds: {
        low: 1,
        medium: 5,
        high: 10,
      },
    };
  }
}

/**
 * Create a default configuration file
 * @returns default configuration object
 */
function createDefaultConfig() {
  const defaultConfig = {
    generateMarkdown: true,
    generateHTML: true,
    releaseNotesDir: '.release-notes',
    badgeStyle: 'flat-square',
    dateFormat: 'YYYY-MM-DD',
    autoCommit: false,
    blockIfChangesExist: true,
    squashIntoSingleVersioning: true,
    showCommitImpact: true,
    showAuthorLinks: true,
    defaultImpactThresholds: {
      low: 1,
      medium: 5,
      high: 10,
    },
  };

  const configPath = path.join(process.cwd(), 'light-release.config.json');
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  return defaultConfig;
}

module.exports = { loadConfig, createDefaultConfig, checkAndCreateConfig };
