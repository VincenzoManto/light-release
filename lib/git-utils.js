const { execSync } = require('child_process');

/**
 * Get the last commit to edit package.json version (blaming package.json). Uses package.json unless there is an override in the `versionFileName` config field.
 * @param {*} config configuration object
 * @returns the last commit hash
 */
function getLastCommit(config) {
  const versionFileName = config.versionFileName;

  try {
    // Prende i commit che hanno modificato package.json con diff
    const log = execSync(`git log -p -- ${versionFileName}`, { encoding: 'utf8' })
      .toString()
      .split(/^commit\s([a-f0-9]{40})$/gm) 
      .filter(Boolean);

    for (let i = 0; i < log.length; i += 2) {
      const sha = log[i].trim();
      const diff = log[i + 1];

      // Here I am looking for the lines that start with - (old version) and + (new version) in the diff
      const versionChanged = /^[-+]\s*"version"\s*:\s*".*"/gm;
      const changes = [...diff.matchAll(versionChanged)];

      const hasRemoval = changes.some((c) => c[0].startsWith('-'));
      const hasAddition = changes.some((c) => c[0].startsWith('+'));

      if (hasRemoval && hasAddition) {
        console.log(`Last commit with edited "version": ${sha}`);
        return sha;
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

/**
 * Get the commit history from git
 * @throws Error if git is not installed or not accessible
 * @param {*} config configuration object
 * @returns
 */
function getCommits(config) {
  try {
    const lastCommitHash = getLastCommit(config);

    const commitLogCommand = lastCommitHash ? `git log ${lastCommitHash}..HEAD --pretty=format:"££££§§§§%H|%s%b|%ae|%an|%cd££££" --numstat` : 'git log --pretty=format:"££££§§§§%H|%s%b|%ae|%an|%cd££££" --numstat';
    const commitLog = execSync(commitLogCommand, { encoding: 'utf8' });
    const commits = [];
    let currentCommit = null;

    commitLog.split('££££').forEach((line) => {
      if (line.includes('§§§§')) {
        const [hash, message, email, author, date] = line.split('|');
        currentCommit = { hash: hash.replace('§§§§', ''), message: message.replace(/\n/g, ' '), email, author, date, modifiedFiles: 0 };
        commits.push(currentCommit);
      } else if (line.trim() !== '') {
        line.split('\n').forEach((l) => {
          currentCommit.modifiedFiles++;
        });
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
 * @param {*} commits commits from the git history
 * @param {*} config configuration object
 * @returns { major, minor, patch, prerelease, type }
 */
function classifyVersion(commits, config) {
  let major = 0,
    minor = 0,
    patch = 0,
    prerelease = null;

  let { majorWords, minorWords, patchWords, prereleaseWords } = config;

  if (!majorWords) {
    majorWords = [/^\s*feat(\(.*\))?\!:/i, /BREAKING CHANGE/i, /^\s*major|^\s*breaking/i, /^\s*\bperf\b/i, /^\s*\bfeat\b\!/i];
  } else {
    majorWords = majorWords.map((word) => new RegExp(word));
  }

  if (!minorWords) {
    minorWords = [/^\s*feat(\(.*\))?:/i, /^\s*\bminor\b/i, /^\s*\bfeature\b/i, /^\s*\brefactor\b\s*:/i];
  } else {
    minorWords = minorWords.map((word) => new RegExp(word));
  }

  if (!patchWords) {
    patchWords = [/^fix(\(.*\))?:/, /close|closes|fixes|resolves|fix|fixed|closed|resolve|resolved/i, /^\s*(style|docs|test|chore)/i];
  } else {
    patchWords = patchWords.map((word) => new RegExp(word));
  }

  // Define prerelease indicators
  if (!prereleaseWords) {
    prereleaseWords = [/alpha/i, /beta/i, /rc/i];
  } else {
    prereleaseWords = prereleaseWords.map((word) => new RegExp(word));
  }

  commits.forEach((commit) => {
    if (prereleaseWords.some((word) => word.test(commit.message))) {
      // Extract prerelease type from commit message
      prerelease = prereleaseWords
        .find((word) => word.test(commit.message))
        .toString()
        .slice(1, -2);
    } else if (majorWords.some((word) => word.test(commit.message))) {
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
    prerelease,
    type: major > 0 ? 'major' : minor > 0 ? 'minor' : 'patch',
  };
}

/**
 * Check if uncommitted changes are present in the repository
 * @returns true if changes exist, false otherwise
 */
function checkIfChangesExist() {
  try {
    const changes = execSync('git status --porcelain', { encoding: 'utf8' });
    return changes.trim() !== '';
  } catch (error) {
    console.error('Error: Git is not installed or not accessible in this environment.');
    process.exit(1);
  }
}

module.exports = { getCommits, classifyVersion, checkIfChangesExist, getLastCommit };
