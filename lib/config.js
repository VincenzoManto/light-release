const fs = require('fs');
const path = require('path');

/**
 * Check if the configuration file exists, if not create it
 * @returns true if the configuration file was created
 */
function checkAndCreateConfig() {
  const configPath = path.join(process.cwd(), 'light-release.config.json');
  if (!fs.existsSync(configPath)) {
    createDefaultConfig();
    console.log('Default configuration file created: light-release.config.json');
    return true;
  }
  return false;
}

/**
 * Load the configuration from the configuration
 * @returns
 */
function loadConfig() {
  const configPath = path.join(process.cwd(), 'light-release.config.json');
  if (fs.existsSync(configPath)) {
    const found = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return _validateConfig(found);
  } else {
    return _buildDefaultConfig();
  }
}

/**
 * Create a default configuration file
 * @returns default configuration object
 */
function createDefaultConfig() {
  const defaultConfig = _buildDefaultConfig();

  const configPath = path.join(process.cwd(), 'light-release.config.json');
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  return defaultConfig;
}

// PRIVATE HELPERS

function _validateConfig(config) {
  config.versionFileName = _validateVersionFileName(config.versionFileName);
  return config;
}

const DEFAULT_VERSION_FILENAME = "package.json";
const VALID_VERSION_FILENAMES = [DEFAULT_VERSION_FILENAME, "deno.json", "jsr.json"];

function _validateVersionFileName(given) {
  if (!given) return DEFAULT_VERSION_FILENAME;
  
  if (VALID_VERSION_FILENAMES.includes(given)) {
    return given;
  }

  const errorMessage = `The versionFileName is invalid. Choose one of the following: ${JSON.stringify(VALID_VERSION_FILENAMES)}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

function _buildDefaultConfig() {
  return {
    generateMarkdown: true,
    generateHTML: true,
    releaseNotesDir: '.release-notes',
    badgeStyle: 'flat-square',
    dateFormat: 'YYYY-MM-DD',
    autoCommit: false,
    omitAuthor: false,
    blockIfChangesExist: true,
    squashIntoSingleVersioning: true,
    showCommitImpact: true,
    showAuthorLinks: true,
    versionFileName: DEFAULT_VERSION_FILENAME,
    defaultImpactThresholds: {
      low: 1,
      medium: 5,
      high: 10,
    },
  };
}

module.exports = { loadConfig, createDefaultConfig, checkAndCreateConfig };
