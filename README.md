# Light Release

A lightweight tool to automate your release process, compatible with conventional commit messages. It reads your commit history, determines the release type, and generates release notes without unnecessary dependencies.

## What is Light Release?

<img src="./assets/logo.png" width="30" style="display: inline">

Light Release is a lightweight alternative to [semantic-release](https://semantic-release.gitbook.io/semantic-release/) designed to simplify your release process while maintaining compatibility with conventional commit messages. It reads your commit history, determines the type of release (major, minor, or patch), and generates visually appealing release notes—all without unnecessary dependencies!


[![npm version](https://img.shields.io/npm/v/light-release)](https://www.npmjs.com/package/light-release)
[![npm downloads](https://img.shields.io/npm/dm/light-release)](https://www.npmjs.com/package/light-release)
![test passed](https://img.shields.io/badge/tests-passing-brightgreen)
[![Installs](https://img.shields.io/npm/dt/light-release)](https://www.npmjs.com/package/light-release)


## Purpose

The purpose of Light Release is to automate the release process for developers who want a hassle-free experience without the complexity of larger tools. If you're tired of managing your releases manually, or if you just want to impress your team with snazzy release notes, then Light Release is here to save the day!

## How to Install It

Getting started with Light Release is a breeze! Just run the following command in your terminal:

```bash
npm install light-release --save-dev
```

```bash
yarn add light-release --save-dev
```

```bash
pnpm add light-release --save
```

Make sure you have **Git** installed, as Light Release relies on your commit history. If Git is not found, Light Release will kindly inform you to install it. 

## How to Use It

Using Light Release is as simple as pie! Once installed, you can run it from the command line. Here's how:

1. Navigate to your project directory.
2. Run the command:

```bash
npx light-release
```

**Another method**, extremely more useful is to include light-release among your package scripts:

To include Light Release in your package scripts, add the following to the `scripts` section of your `package.json` file:

```json
"scripts": {
  "release": "light-release"
}
```

Now, you can run Light Release using the following command:

```bash
npm run release
```

This will analyze your commit history, determine the release version, and generate the release notes in both HTML and Markdown formats. 

### Difference with Semantic-release

1. **No dependencies**:  
   - **Semantic-release** relies on plugins for almost every functionality, including versioning, changelog generation, and publishing. These plugins introduce a significant dependency chain that can lead to vulnerabilities or conflicts.  
   - **Light Release**, on the other hand, is entirely dependency-free, reducing the risk of breaking changes or security issues from external libraries.

---

2. **Built-in customizability**:  
   - With **semantic-release**, customization requires selecting and configuring specific plugins, often involving additional dependencies or complex setups. For example, generating release notes in different formats or modifying version bump keywords requires third-party plugins or extended configurations.  
   - **Light Release** provides built-in options for:
     - Release notes in **Markdown** and **HTML** formats.  
     - Custom keywords for major, minor, and patch versioning directly in the configuration.  
     - Customizable thresholds to categorize the impact of changes.  
     This is all managed via a single, automatically generated config file without needing extra plugins.

---

3. **Hassle-free setup**:  
   - Setting up **semantic-release** involves configuring multiple plugins and often requires CI/CD pipelines to manage releases effectively. It can be overwhelming for smaller projects or developers unfamiliar with its ecosystem.  
   - **Light Release** is designed for simplicity:
     - A single command (`npx light-release`) automates the process.  
     - On the first run, it generates a default configuration file, enabling a plug-and-play experience.  

---

4. **Works without `package.json`**:  
   - **Semantic-release** is tightly coupled with `package.json` for versioning. If you're working on non-Node.js projects, it doesn’t natively support alternative versioning files.  
   - **Light Release** allows you to define other JSON-based versioning files (e.g., `deno.json` or `jsr.json`) in the configuration, offering flexibility for projects outside the Node.js ecosystem.

---

5. **Streamlined for smaller projects**:  
   - **Semantic-release** is optimized for larger teams and projects, focusing on full automation and continuous delivery pipelines. This can be overkill for smaller projects, leading to unnecessary complexity and overhead.  
   - **Light Release** is specifically designed for smaller, independent projects or developers who value simplicity and control. It avoids the complexity of semantic-release while maintaining essential features like conventional commit compatibility and automated release note generation.


### Configuration

On the first run, Light Release will generate a default configuration file named `light-release.config.json` in your project's root directory. You can modify this file to customize the behavior of the tool according to your preferences. If the file doesn't exist, everything will be activated by default—because who doesn't love a little plug-and-play?



| Option                     | Type    | Default                  | Description                                                                                                                                                                 |
|----------------------------|---------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `generateMarkdown`         | Boolean | `true`                   | If `true`, generates release notes in Markdown format. Useful for lightweight, text-based logs.                                                                            |
| `generateHTML`             | Boolean | `true`                   | If `true`, generates release notes in HTML format. Ideal for a web-viewable format of release notes.                                                                       |
| `releaseNotesDir`          | String  | `.release-notes`         | Specifies the directory to store release notes files.                                                                                                                      |
| `badgeStyle`               | String  | `flat-square`            | Defines the style of version badges (styles depend on badge provider).                                                                                                     |
| `dateFormat`               | String  | `YYYY-MM-DD`             | Specifies the date format for release notes. Adjust based on preference.                                                                                                   |
| `showCommitImpact`         | Boolean | `true`                   | If `true`, includes an impact summary based on commits in release notes to highlight key changes.                                                                          |
| `blockIfChangesExist`      | Boolean | `true`                   | Prevents releases if uncommitted changes are in the working directory, ensuring a clean and stable flow.                                                                   |
| `autoCommit`               | Boolean | `false`                   | If `true`, automatically commits generated files (like release notes) after each release, streamlining the workflow.                                                       |
| `squashIntoSingleVersioning` | Boolean | `true`                 | Combines all new changes into a single version increment to avoid multiple minor jumps in versioning, ideal for simplified versioning.                                     |
| `showAuthorLinks`          | Boolean | `true`                   | If `true`, shows clickable links to authors in the release notes, useful for tracking contributors.                                                                        |
| `defaultImpactThresholds`   | Object  | `{ "low": 1, "medium": 5, "high": 10 }` | Sets thresholds for categorizing impact of changes: `low`, `medium`, `high`, based on commit count.                                        |
| `versionFileName`   | String  | `package.json` | If your version is not in `package.json` and instead is in another file (e.g. `deno.json`). The file is expected to be a JSON file and the version will be in the `version` field.          |
| `majorWords`               | Array   | `["BREAKING CHANGE", "major", "perf", "^\s*feat(\(.*\))?!:"]`    | Specifies keywords in commit messages that trigger a major version bump.                                                                                                   |
| `minorWords`               | Array   | `["feat", "minor", "feature", "refactor"]`               | Specifies keywords in commit messages that trigger a minor version bump.                                                                                                   |
| `patchWords`               | Array   | `["fix", "perf", "close", "closes", "fixes", "resolves", "fix", "fixed", "closed", "resolve", "resolved"], "style", "docs", "test", "chore"]`        | Specifies keywords in commit messages that trigger a patch version bump.                                                                                                   |
| `prereleaseWords`          | Array   | `["beta", "alpha", "rc"]`| Specifies keywords in commit messages that trigger a prerelease version bump.                                                                                              |




### Without `package.json` (e.g. Deno)

If your version is not in `package.json` and instead is in another file (e.g. `deno.json`), you can change the config in `light-release.config.json` and alter `versionFileName` to the file name that you need to modify. The file is expected to be a JSON file and the version will be in the `version` field.

For security reasons, we allow only the following values: `package.json`, `deno.json`, or `jsr.json`.




## What It Produces

After running Light Release, you can expect to find:

- A structured set of release notes in both **HTML** and **Markdown** formats, beautifully organized by version in the `.release-notes` directory.
- A **CHANGELOG.md** file detailing all changes made in each release.
- Shield badges indicating the impact of each commit (how many files were changed).
- Author information pulled from your Git configuration, so everyone gets the credit they deserve!

## How to Collaborate

We welcome contributions from everyone! Whether you have ideas for new features, improvements, or just want to report a bug, please feel free to open an issue or submit a pull request. 

To start collaborating, simply fork the repository and follow these steps:

1. Clone your forked repository to your local machine.
2. Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/my-awesome-feature
```

3. Make your changes and commit them:

```bash
git commit -m "Add my awesome feature"
```

4. Push your changes to your forked repository:

```bash
git push origin feature/my-awesome-feature
```

5. Open a pull request and describe your changes!

## Collaborators

A big thank you to all the wonderful contributors who help make Light Release shine! If you’ve contributed to this project, your name will be here. Let’s keep the love rolling!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details. 

## References

- [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Badges](https://shields.io/)

## How to Cite It

If you find Light Release useful, please consider citing it in your work:

```markdown
@software{light_release,
  author = {Vincenzo Manto},
  title = {Light Release},
  year = {2024},
  url = {https://github.com/VincenzoManto/light-release},
}
```
