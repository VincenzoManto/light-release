const { execSync } = require('child_process');

/**
 * Get the last commit to edit package.json version (blaming package.json). Uses package.json unless there is an override in the `versionFileName` config field.
 * @param {*} config configuration object
 * @returns the last commit hash
 */
function getLastCommit(config) {
  const versionFileName = config.versionFileName;
  try {
    // the versionFileName is one of the safe ones, since it is validated on loading of the config file.
    return execSync(`git rev-list -n 1 HEAD -- ${versionFileName}`, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Error: Git is not installed or not accessible in this environment.');
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

    const commitLogCommand = lastCommitHash ? `git log ${lastCommitHash}..HEAD --pretty=format:"%H|%s%b|%ae|%an|%cd" --numstat` : 
    'git log --pretty=format:"%H|%s%b|%ae|%an|%cd" --numstat';
    const commitLog = `31048da11cd259ad3485b4960c18c7c9d0f36521|Merge branch 'feature/sortDataGrid' int
o 'main'feat: add sorting in data-grid, can pass default sorting and dispatch Da
taGridSortingChangeEvent when change

See merge request gac/cfl-ui!168|cmaisonhaute@gac-technology.com|Clement MAISONH
AUTE|Wed Feb 5 15:32:52 2025 +0000
15a0aea7012dbc6d285bffed1af165092dd9a9ac|feat: add sorting in data-grid, can pas
s default sorting and dispatch DataGridSortingChangeEvent when change|cmaisonhau
te@gac-technology.com|Clement MAISONHAUTE|Wed Feb 5 15:32:52 2025 +0000
15 0 src/components/data-grid/event/data-grid-sorting-change-event.ts
59 6 src/components/data-grid/internal/data-grid.styles.scss
4 2 src/components/data-grid/internal/data-grid.test.ts
12 0 src/components/data-grid/internal/data-grid.tokens.scss
138 45 src/components/data-grid/internal/data-grid.ts
36 9 src/components/data-grid/internal/utils/render-utils.ts
80 3 src/components/data-grid/internal/utils/types.ts
6 2 src/components/data-grid/internal/utils/utils.ts
9 0 src/internal/icon/sort-asc-icon.ts
9 0 src/internal/icon/sort-desc-icon.ts
9 0 src/internal/icon/sort-icon.ts
6 0 src/tokens/media.scss

8f42b04052623c19fab550ecd512ed1e1ef29a9f|Merge branch 'renovate/all-minor-patch'
into 'main'build(deps): update all non-major dependencies

See merge request gac/cfl-ui!166|cmaisonhaute@gac-technology.com|Clement MAISONHAUTE|Wed Feb 5 15:28:20 2025 +0000
bf1499f9747e062fedfe639ecf913e5f95babc69|build(deps): update all non-major dependencies|group_2_bot_9516623e773e5eb79dad69541afbd41d@noreply.gitlab.gac-technology.com|renovate|Wed Feb 5 10:04:06 2025 +0000
136 136 package-lock.json
3 3 package.json

bee7056618caa97f25a898cb659c469b245b7bf9|Merge branch 'hotfix/headerResizerStyle' into 'main'fix: sync resizer style with figma

See merge request gac/cfl-ui!167|cmaisonhaute@gac-technology.com|Clement MAISONHAUTE|Tue Feb 4 14:54:31 2025 +0000
89e3b748be3fe3eb234e39fce5a3d51d2b51dfa8|fix: sync resizer style with figma|cmaisonhaute@gac-technology.com|Clement MAISONHAUTE|Tue Feb 4 14:54:30 2025 +0000
13 6 src/components/data-grid/internal/data-grid.styles.scss
5 2 src/components/data-grid/internal/data-grid.tokens.scss
5 0 src/tokens/media.scss

5f2a74146c0cee64d0a08b7c7d4c407564d52b7c|build: add renovate semanticCommits|cmaisonhaute@gac-technology.local|Clement MAISONHAUTE|Mon Feb 3 16:30:13 2025 +0100
1 1 renovate.json`
    
    // execSync(commitLogCommand, { encoding: 'utf8' });
    const commits = [];
    let currentCommit = null;

    commitLog.split('\n').forEach((line) => {
      if (line.includes('|')) {
        const [hash, message, email, author, date] = line.split('|');
        currentCommit = { hash, message, email, author, date, modifiedFiles: 1 };
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
    minorWords = [/^\s*feat(\(.*\))?:/i, /\bminor\b/i, /^\s*\bfeature\b/i, /^\s*\brefactor\b\s*:/i];
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
      prerelease = prereleaseWords.find((word) => word.test(commit.message)).toString().slice(1, -2);
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

module.exports = { getCommits, classifyVersion, checkIfChangesExist };
