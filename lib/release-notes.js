const fs = require('fs');
const path = require('path');
const { generateBadge, getImpactBadge, getCommitterInfo } = require('./badge-utils');
const { getCommits } = require('./git-utils');

/**
 * Generate the release notes for the new version
 * It generates both HTML and Markdown files
 * It also updates the CHANGELOG.md file with the new release entry
 * @param {*} version version number
 * @param {*} config configuration object
 */
function generateReleaseNotes(version, config) {
  let releaseNotesDir = config.releaseNotesDir || '.release-notes';
  releaseNotesDir = path.join(releaseNotesDir, version);
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (!fs.existsSync(releaseNotesDir)) {
    fs.mkdirSync(releaseNotesDir);
  }

  const htmlContent = generateHTMLContent(version, formattedDate, config);
  const mdContent = generateMarkdownContent(version, formattedDate, config);

  fs.writeFileSync(path.join(releaseNotesDir, `release.html`), htmlContent);
  fs.writeFileSync(path.join(releaseNotesDir, `release.md`), mdContent);

  updateChangelog(version, formattedDate, config);
}

/**
 * Generate the HTML content for the release notes
 * @param {*} version version number
 * @param {*} date release date
 * @param {*} config configuration object
 * @returns 
 */
function generateHTMLContent(version, date, config) {
  const commits = getCommits(); 
  const releaseNoteDescription = "Release note for version " + version;
  const authors = [];
  
  let changeLog = '';
  for (const commit of commits) {
    const committer = getCommitterInfo(commit.email);
    committer.name = committer.name?.replace(/.*?\+/g, '');
    committer.image = committer.name ? `https://avatars.githubusercontent.com/${committer.name}` : null;

    if (!authors.find(e => e.name === committer.name)) {
        authors.push(committer);
    }
    const modifiedFiles = commit.modifiedFiles || 0; // Supponi di avere questo valore nei commit
    const impactBadge = getImpactBadge(modifiedFiles, config, 'html');

    const date = new Date(commit.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    changeLog += `
        <div class="flex items-start ml-[-12px] md:flex-col md:gap-[32px] md:ml-[0px] md:pb-[32px] md:pt-[32px]" data-animation-scroll-into-view="vrmnyy8z0" data-associated-animation-ids-for-scroll-into-view="tyxaiyxv7,12sujrt9r" data-animation-id-vrmnyy8z0>
            <div class="w-[100%] max-w-[300px] sticky top-[20px] md:max-w-[100%] md:static">
                <div class="flex items-start gap-[10px]">
                    <div class="rounded-[9999px] pt-[5px] pr-[5px] pb-[5px] pl-[5px] border-[white] border-[4px] md:hidden bg-[color:var(--64ddf9af7c88e)] border-[color:var(--64ddf9af953be)]">
                        <div class="rounded-[9999px] block w-[6px] h-[6px] bg-[color:var(--64ddf9af9798f)]"></div>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-[16px] text-[color:var(--64ddf9af7c9a7)]">${date}</span>
                        <h4 class="text-[24px] font-semibold tracking-[-0.025em]">
                            <img src="${committer.image || 'https://github.com/github.png?size=40'}" width="30" style="border-radius:50%; margin: 10px" class="inline-block"/><a href="${committer.profileLink}">@${committer.name}</a>
                        </h4>
                        <div class="inline-block"> <span>
                            ${impactBadge}
                        </span></div>
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <div class="transform relative mb-[20px]">
                    <!--img class="w-[auto] h-[auto] max-w-[100%] rounded-[12px]" src=""-->
                    <div class="absolute top-[0px] right-[0px] bottom-[0px] left-[0px] pointer-events-none border-[1px] border-[black] border-opacity-[15%] rounded-[12px]"></div>
                </div>
                <p class="text-[16px] font-normal leading-[1.8em] text-[color:var(--64ddf9af7ca7e)]">
                    ${commit.message}
                </p>
            </div>
        </div>`;
  }

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageName = packageJson.name;

  const logo = path.join(__dirname, '../assets/logo.png');
  const css = path.join(__dirname, '../assets/style.css');

  return `
  <link rel="icon" href="${logo}" type="image/png">
  <link rel="shortcut icon" href="${logo}" type="image/png">
  <title>${packageName} Release Note ${version}</title>

<link href="${css}" rel="stylesheet">

<div class="contents">
  <div class="contents":key="key">
      <section class="border-b-[1px] pt-[20px] pb-[20px] border-[color:var(--64ddf9af7c88e)]">
          <div class="mt-[0] mr-[auto] mb-[0] ml-[auto] pt-[0] pr-[32px] pb-[0] pl-[32px] md:pr-[24px] md:pl-[24px] max-w-[1024px]">
              <div class="flex justify-between items-center">
                  <a class="flex items-center justify-center" href="/" aria-current>
                      <i class="inline-block w-[24px] h-auto">
                          <img src="${logo}" width="60">
                      </i>
                  </a>
                  <h2 class="font-semibold tracking-[-0.025em] text-[48px] leading-[1.375em]">
                    ${packageName}
                  </h2>
              </div>
          </div>
          </section>
          <section class="pb-[80px] pt-[80px]">
          <div class="mt-[0] mr-[auto] mb-[0] ml-[auto] pt-[0] pr-[32px] pb-[0] pl-[32px] md:pr-[24px] md:pl-[24px] max-w-[1024px]">
              <div>
                  <div>
                      <h1 class="font-semibold tracking-[-0.025em] text-[48px] leading-[1.375em]">
                          Release ${version}
                      </h1>
                      <p class="text-[20px] text-[color:var(--64ddf9af7c9a7)]">${releaseNoteDescription}</p>
                      <p class="text-[20px] text-[color:var(--64ddf9af7c9a7)]">${date}</p>
                      <div class="mt-[40px]">
                        ${authors.size > 0 ? `<h3 class="text-[24px] font-semibold tracking-[-0.025em]">Authors</h3>` : ''}
                        <div class="flex items" style="gap: 10px;">
                            ${Array.from(authors).map(author => `
                                <div class="flex items-center gap-[10px]">
                                    <img src="${author.image}" width="30" style="border-radius:50%" class="inline-block"/>
                                </div>
                            `).join('')}
                            
                      </div>
                  </div>
                   <div class="ml-[8px] border-l-[1px] space-y-[120px] mt-[72px] md:border-l-[0px] md:ml-[0px] md:space-y-[0px] md:divide-y-[1px] border-[color:var(--64ddf9af7c88e)] md:divide-[color:var(--64ddf9af7c88e)]">

                        ${changeLog}
                    </div>
              </div>
          </div>
      </section>
           <section class="bg-[white] pt-[20px] pb-[20px] bg-[color:var(--64ddf9af953be)]">
          <div class="mt-[0] mr-[auto] mb-[0] ml-[auto] pt-[0] pr-[32px] pb-[0] pl-[32px] md:pr-[24px] md:pl-[24px] max-w-[1024px]">
              <div class="pt-[64px] pr-[64px] pb-[64px] pl-[64px] md:grid-cols-1 sm:pt-[40px] sm:pr-[40px] sm:pb-[40px] sm:pl-[40px] rounded-[16px] grid grid-cols-2 items-center gap-[12px] bg-[#dbeafe] bg-opacity-[30%]">
                  <div>
                      <h4 class="tracking-[-0.025em] font-semibold leading-[1.375em] text-[24px]">
                          Sign up for updates
                      </h4>
                      <p class="text-[18px] text-[color:var(--64ddf9af7c9a7)]">Get notified when we release new features.</p>
                  </div>
              </div>
          </div>
      </section>
      <footer class="pb-[80px] pt-[80px] bg-[white] bg-[color:var(--64ddf9af953be)]">
          <div class="max-w-[80rem] mt-[0] mr-[auto] mb-[0] ml-[auto] pt-[0] pr-[32px] pb-[0] pl-[32px] md:pr-[24px] md:pl-[24px] xl:pr-[40px] xl:pl-[40px]">
              <span class="text-[12px] block text-center sm:text-center text-[black] text-opacity-[50%]">© Generated with Light-Release</span>
          </div>
      </footer>
  </div>
</div>
`;
}

/**
 * Generate the markdown content for the release notes
 * @param {*} version version number
 * @param {*} date release date
 * @param {*} config configuration object
 * @returns 
 */
function generateMarkdownContent(version, date, config) {
  const commits = getCommits();
  let changeLog = '';

  for (const commit of commits) {
    const committer = getCommitterInfo(commit.email);
    committer.name = committer.name?.replace(/.*?\+/g, '');
    committer.image = committer.name ? `https://avatars.githubusercontent.com/${committer.name}` : null;
    const modifiedFiles = commit.modifiedFiles || 0;
    const impactBadge = getImpactBadge(modifiedFiles, config, 'md');

    changeLog += `
    ### ${commit.message} ${impactBadge}
    - **Author:** [${committer.name}](${committer.profileLink}) ![Author Image](${committer.image || 'https://github.com/github.png?size=40'})
    - **Date:** ${commit.date}
    - **Files Modified:** ${modifiedFiles}
    `;
  }

  return `# Release Note v${version} - ${date}

${changeLog}
`;
}

/**
 * Update the CHANGELOG.md file with the new release entry
 * @param {*} version version number
 * @param {*} date release date
 * @param {*} config configuration object
 */
function updateChangelog(version, date, config) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  let changelogContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '';
  

  const newEntry = `## [${version}] - ${date}\n\n### Changes\n- Release notes generated for version [${version}](.release-notes/${version}/release.md)\n\n`;

  changelogContent = newEntry + changelogContent;
  fs.writeFileSync(changelogPath, changelogContent);
  
}

module.exports = { generateReleaseNotes };

