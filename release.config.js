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
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  debug: true,
};
