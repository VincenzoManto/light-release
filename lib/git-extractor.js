function getCommits(commitLog) {
  try {
    const commits = [];
    let currentCommit = null;

    commitLog.split('££££').forEach((line) => {
      if (line.includes('§§§§')) {
        const [hash, message, email, author, date] = line.split('|');
        currentCommit = { hash: hash.replace('§§§§', ''), message: message.replace(/\n/g, ' '), email, author, date, modifiedFiles: 0 };
        commits.push(currentCommit);
      } else if (line.trim() !== '') {
        line.split('\n').forEach((l) => {  
          // const [added, deleted, file] = l.split(/\s+/);
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
console.log(getCommits(
    `\$\$\$\$§§§§af6c5b0bd91786fd0009cbb897c216318995603c|chore: release v2.0.1|vincmanto@gmail.com|VincenzoManto|Thu Feb 13 20:46:19 2025 +0100\$\$\$\$
5       63      .release-notes/2.0.1/release.html
1       15      .release-notes/2.0.1/release.md
5       0       CHANGELOG.md

\$\$\$\$§§§§871a2f8b86af9a90eafb93960591695d12e20ae6|chore: update light-release dependency to version 2.7.1|vincmanto@gmail.com|VincenzoManto|Thu Feb 13 20:46:14 2025 +0100\$\$\$\$
1       1       package.json
4       4       pnpm-lock.yaml
`

))