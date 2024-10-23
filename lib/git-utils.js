const { execSync } = require('child_process');

/**
 * Get the last commit to edit package.json version (blaming package.json)
 * @returns the last commit hash
 */
function getLastCommit() {
  try {
    return execSync('git rev-list -n 1 HEAD -- package.json', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Error: Git is not installed or not accessible in this environment.');
    process.exit(1);
  }

}

/**
 * Get the commit history from git
 * @throws Error if git is not installed or not accessible
 * @returns
 */
function getCommits() {
  try {
    const lastCommitHash = getLastCommit();

    const commitLogCommand = lastCommitHash ? `git log ${lastCommitHash}..HEAD --pretty=format:"%H|%s%b|%ae|%an|%cd" --numstat` : 
    'git log --pretty=format:"%H|%s%b|%ae|%an|%cd" --numstat';
    const commitLog = execSync(commitLogCommand, { encoding: 'utf8' });
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
        majorWords = [/^\s*feat(\(.*\))?!:/i, /BREAKING CHANGE/i, /^\s*major|^\s*breaking/i, /^perf(\(.*\))?:/i];
    } else {
        majorWords = majorWords.map((word) => new RegExp(word));
    }

    if (!minorWords) {
        minorWords = [/^\s*feat(\(.*\))?:/i, /\bminor\b/i, /^\s*\bfeature\b/i, /^\s*\brefactor\b?:/i];
    } else {
        minorWords = minorWords.map((word) => new RegExp(word));
    }

    if (!patchWords) {
        patchWords = [/^fix(\(.*\))?:/, /close|closes|fixes|resolves|fix|fixed|closed|resolve|resolved/i];
    } else {
        patchWords = patchWords.map((word) => new RegExp(word));
    }


  commits.forEach((commit) => {
    if (majorWords.some((word) => word.test(commit.message))) {
      major++;
    } else if (minorWords.some((word) => word.test(commit.message))) {
      minor++;
    } else if (patchWords.some((word) => word.test(commit.message))) {
      patch++;
    }
  });

  return { 
    major,
    minor,
    patch,
    type: major > 0 ? 'major' : minor > 0 ? 'minor' : 'patch'
  };
}

module.exports = { getCommits, classifyVersion };
