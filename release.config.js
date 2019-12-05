module.exports = {
  repositoryUrl: 'https://github.com/deltoss/d3-mitch-tree.git',
  plugins: [
    // Default plugins
    ['@semantic-release/commit-analyzer', {
      releaseRules: [{
        // Add release rule for dependabot dependency updates
        type: 'chore',
        scope: 'deps-dev',
        release: 'patch',
      }],
    }],
    '@semantic-release/release-notes-generator',
    // Generates Changelogs
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    // Makes commits to GIT for changed files (e.g. changelog)
    // done during the release process (e.g. from @semantic-release/changelog)
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md'],
    }],
  ],
  debug: true,
};
