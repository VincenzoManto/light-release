const { execSync } = require('child_process');

/**
 * Get the commit history from git
 * @throws Error if git is not installed or not accessible
 * @returns
 */
function getCommits() {
  try {
    const commitLog = execSync('git log --pretty=format:"%H|%s|%ae|%an|%cd" --numstat', { encoding: 'utf8' });
    const commits = [];
    let currentCommit = null;

    commitLog.split('\n').forEach((line) => {
      if (line.includes('|')) {
        const [hash, message, email, author, date] = line.split('|');
        currentCommit = { hash, message, email, author, date, modifiedFiles: 0 };
        commits.push(currentCommit);
      } else if (line.trim() !== '') {
        const [added, deleted, file] = line.split(/\s+/);
        currentCommit.modifiedFiles++;
      }
    });

    return commits;
  } catch (error) {
    console.error('Error: Git is not installed or not accessible in this environment.');
    process.exit(1);
  }
}

/**
 * Classify the version based on the commits
 * it will return 'major' if there is a breaking change
 * it will return 'minor' if there is a new feature
 * it will return 'patch' if there is a fix
 * it is compatible with the conventional commits, Azure DevOps, Github, and Jira commit messages
 * @param {*} commits commits from the git history
 * @returns
 */
function classifyVersion(commits, config) {
  let major = 0,
    minor = 0,
    patch = 0;

    let {majorWords, minorWords, patchWords} = config;

    if (!majorWords) {
        majorWords = [/^feat(\(.*\))?!:/, /BREAKING CHANGE/, /^\s*major|^\s*breaking/i];
    } else {
        majorWords = majorWords.map((word) => new RegExp(word));
    }

    if (!minorWords) {
        minorWords = [/^feat(\(.*\))?:/, /minor/i, /^\s*\bfeature\b/i];
    } else {
        minorWords = minorWords.map((word) => new RegExp(word));
    }

    if (!patchWords) {
        patchWords = [/^fix(\(.*\))?:/, /close|closes|fixes|resolves/i];
    } else {
        patchWords = patchWords.map((word) => new RegExp(word));
    }


  commits.forEach((commit) => {
    if (majorWords.some((word) => word.test(commit))) {
      major++;
    } else if (minorWords.some((word) => word.test(commit))) {
      minor++;
    } else if (patchWords.some((word) => word.test(commit))) {
      patch++;
    }
  });

  if (major) return 'major';
  if (minor) return 'minor';
  return 'patch';
}

module.exports = { getCommits, classifyVersion };
