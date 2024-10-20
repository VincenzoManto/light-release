/**
 * Create a badge with the given label, value, and color
 * @param {*} label label for the badge
 * @param {*} value value for the badge
 * @param {*} color color of the badge
 * @param {*} style style of the badge (flat, flat-square, plastic)
 * @param {*} type type of the badge (html, md)
 * @returns 
 */
function generateBadge(label, value, color, style = 'flat-square', type = 'md') {
  if (type === 'html') {
    return `<img src="https://img.shields.io/badge/${label}-${value}-${color}?style=${style}" alt="${label} badge" class="rounded-[6px]"/>`;
  } else if (type === 'md') {
    return `![${label}](https://img.shields.io/badge/${label}-${value}-${color}?style=${style})`;
  }
}

/**
 * Generate a badge based on the number of modified files
 * @param {*} modifiedFiles modified files in the commit
 * @param {*} config configuration object
 * @param {*} type type of the badge (html, md)
 * @returns 
 */
function getImpactBadge(modifiedFiles, config, type = 'md') {
  const thresholds = config.defaultImpactThresholds || { low: 1, medium: 5, high: 10 };

  if (modifiedFiles <= thresholds.low) {
    return generateBadge('impact', 'low', 'green', config.badgeStyle, type);
  } else if (modifiedFiles <= thresholds.medium) {
    return generateBadge('impact', 'medium', 'yellow', config.badgeStyle, type);
  } else {
    return generateBadge('impact', 'high', 'red', config.badgeStyle, type);
  }
}

/**
 * Get committer information from the email
 * @param {*} email email of the committer
 * @returns 
 */
function getCommitterInfo(email) {
  const emailParts = email.split('@');
  const username = emailParts[0];

  let profileLink = `https://github.com/${username}`; 

  if (!username) {
    profileLink = '#';
  }

  return {
    name: username,
    profileLink: profileLink,
    image: getCommitterImage(username), 
  };
}

/**
 * Get the committer image from the username
 * @deprecated
 * @param {*} username username of the committer
 * @returns 
 */
function getCommitterImage(username) {
  return `https://cdn-icons-png.flaticon.com/512/25/25231.png`;
}

module.exports = { generateBadge, getImpactBadge, getCommitterInfo, getCommitterImage };
