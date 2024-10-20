# Light Release


## What is Light Release?

Light Release is a lightweight alternative to [semantic-release](https://semantic-release.gitbook.io/semantic-release/) designed to simplify your release process while maintaining compatibility with conventional commit messages. It reads your commit history, determines the type of release (major, minor, or patch), and generates visually appealing release notes—all without unnecessary dependencies!

![Light Release Logo](assets/logo.png)


![npm version](https://img.shields.io/npm/v/light-release)
![npm downloads](https://img.shields.io/npm/dm/light-release)
![test passed](https://img.shields.io/badge/tests-passing-brightgreen)


## Purpose

The purpose of Light Release is to automate the release process for developers who want a hassle-free experience without the complexity of larger tools. If you're tired of managing your releases manually, or if you just want to impress your team with snazzy release notes, then Light Release is here to save the day!

## How to Install It

Getting started with Light Release is a breeze! Just run the following command in your terminal:

```bash
npm install light-release --save-dev
```

Make sure you have **Git** installed, as Light Release relies on your commit history. If Git is not found, Light Release will kindly inform you to install it. 

## How to Use It

Using Light Release is as simple as pie! Once installed, you can run it from the command line. Here's how:

1. Navigate to your project directory.
2. Run the command:

```bash
npx light-release
```

This will analyze your commit history, determine the release version, and generate the release notes in both HTML and Markdown formats. 

### Configuration

On the first run, Light Release will generate a default configuration file named `light-release.config.json` in your project's root directory. You can modify this file to customize the behavior of the tool according to your preferences. If the file doesn't exist, everything will be activated by default—because who doesn't love a little plug-and-play?

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

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 

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
