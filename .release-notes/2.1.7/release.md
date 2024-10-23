# Release Note v2.1.7 - October 23, 2024


### chore(versions): enable squashIntoSingleVersioning option in light-release.config.json ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [vincmanto](https://github.com/vincmanto) ![Author Image](https://avatars.githubusercontent.com/vincmanto?size=40)
- **Date:** Wed Oct 23 11:37:04 2024 +0200
- **Files Modified:** 1
    
### fix(badge-utils): handle null email in getCommitterInfo function ![impact](https://img.shields.io/badge/impact-medium-yellow?style=flat-square)
- **Author:** [vincmanto](https://github.com/vincmanto) ![Author Image](https://avatars.githubusercontent.com/vincmanto?size=40)
- **Date:** Wed Oct 23 11:36:49 2024 +0200
- **Files Modified:** 2
    
### fix(git-utils): update minorWords regex pattern ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [vincmanto](https://github.com/vincmanto) ![Author Image](https://avatars.githubusercontent.com/vincmanto?size=40)
- **Date:** Wed Oct 23 11:33:03 2024 +0200
- **Files Modified:** 1
    
### feat(git-utils): add support for additional commit message keywordsAdded support for additional commit message keywords in the git-utils.js file. The patchWords array now includes the keywords "style", "docs", "test", and "chore" in addition to the existing keywords for fixing and closing issues. This change enhances the classification of commit messages in the versioning logic. ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [](#) ![Author Image](https://github.com/github.png?size=40)
- **Date:** undefined
- **Files Modified:** 1
    
### vincmanto@gmail.com ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [VincenzoManto](https://github.com/VincenzoManto) ![Author Image](https://avatars.githubusercontent.com/VincenzoManto?size=40)
- **Date:** undefined
- **Files Modified:** 1
    
### feat(versioning): update versioning logic to support squashIntoSingleVersioning option ![impact](https://img.shields.io/badge/impact-medium-yellow?style=flat-square)
- **Author:** [vincmanto](https://github.com/vincmanto) ![Author Image](https://avatars.githubusercontent.com/vincmanto?size=40)
- **Date:** Wed Oct 23 11:29:48 2024 +0200
- **Files Modified:** 4
    
### fix(git-utils): add support for multi-line commit messagesThe code changes in this commit modify the `commitLogCommand` in the `getCommits` function of `git-utils.js`. The changes include adding support for multi-line commit messages by appending `%b` to the format string. This allows the commit messages to include line breaks and additional information. ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [](#) ![Author Image](https://github.com/github.png?size=40)
- **Date:** undefined
- **Files Modified:** 1
    
### vincmanto@gmail.com ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [VincenzoManto](https://github.com/VincenzoManto) ![Author Image](https://avatars.githubusercontent.com/VincenzoManto?size=40)
- **Date:** undefined
- **Files Modified:** 1
    
### feat(added refactor keywords): added case insensitivity to keywords introduced github-colpilot keyword "refactor" ![impact](https://img.shields.io/badge/impact-low-green?style=flat-square)
- **Author:** [vincmanto](https://github.com/vincmanto) ![Author Image](https://avatars.githubusercontent.com/vincmanto?size=40)
- **Date:** Wed Oct 23 11:09:18 2024 +0200
- **Files Modified:** 1
    
