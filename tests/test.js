describe('lightRelease', () => {
  const testCases = [
    { version: { major: 0, minor: 1, patch: 0 }, commits: [{ message: 'BREAKING CHANGE: update API' }], expected: { major: 1, minor: 0, patch: 0 }, expectedVersion: '1.0.0' },
    { version: { major: 1, minor: 0, patch: 0 }, commits: [{ message: 'BREAKING CHANGE: modify structure' }], expected: { major: 2, minor: 0, patch: 0 }, expectedVersion: '2.0.0' },

    { version: { major: 0, minor: 1, patch: 0 }, commits: [{ message: 'feat: add login feature' }], expected: { major: 0, minor: 2, patch: 0 }, expectedVersion: '0.2.0' },
    { version: { major: 1, minor: 2, patch: 3 }, commits: [{ message: 'feat: dashboard enhancement' }], expected: { major: 1, minor: 3, patch: 0 }, expectedVersion: '1.3.0' },

    { version: { major: 1, minor: 2, patch: 3 }, commits: [{ message: 'fix: resolve navbar issue' }], expected: { major: 1, minor: 2, patch: 4 }, expectedVersion: '1.2.4' },
    { version: { major: 1, minor: 3, patch: 9 }, commits: [{ message: 'fix: correct typo' }], expected: { major: 1, minor: 3, patch: 10 }, expectedVersion: '1.3.10' },

    { version: { major: 1, minor: 0, patch: 0 }, commits: [{ message: 'feat: add analytics' }, { message: 'fix: handle null pointer' }], expected: { major: 1, minor: 1, patch: 0 }, expectedVersion: '1.1.0' },
    { version: { major: 0, minor: 5, patch: 7 }, commits: [{ message: 'fix: align text' }, { message: 'feat: add dark mode' }], expected: { major: 0, minor: 6, patch: 0 }, expectedVersion: '0.6.0' },

    { version: { major: 2, minor: 1, patch: 3 }, commits: [{ message: 'BREAKING CHANGE: restructure modules' }, { message: 'feat: add user profile' }, { message: 'fix: logout bug' }], expected: { major: 3, minor: 0, patch: 0 }, expectedVersion: '3.0.0' },

    { version: { major: 1, minor: 1, patch: 1 }, commits: [], expected: { major: 1, minor: 1, patch: 1 }, expectedVersion: '1.1.1' },

    { version: { major: 1, minor: 0, patch: 0 }, commits: [{ message: 'BREAKING CHANGE: revamp architecture' }, { message: 'BREAKING CHANGE: redesign core' }], expected: { major: 2, minor: 0, patch: 0 }, expectedVersion: '2.0.0' },

    { version: { major: 1, minor: 1, patch: 0, prerelease: ['alpha', 1] }, commits: [{ message: 'fix: beta fix' }], expected: { major: 1, minor: 1, patch: 0, prerelease: ['alpha', 2] }, expectedVersion: '1.1.0-alpha.2' },
    { version: { major: 1, minor: 1, patch: 1, prerelease: ['beta', 3] }, commits: [{ message: 'feat: add new beta feature' }], expected: { major: 1, minor: 2, patch: 0 }, expectedVersion: '1.2.0' },

    { version: { major: 1, minor: 2, patch: 0, prerelease: ['rc', 1] }, commits: [{ message: 'fix: final adjustments' }], expected: { major: 1, minor: 2, patch: 0 }, expectedVersion: '1.2.0' },

    { version: { major: 1, minor: 0, patch: 0 }, commits: [{ message: '' }, { message: 'feat: update design' }], expected: { major: 1, minor: 1, patch: 0 }, expectedVersion: '1.1.0' },

    { version: { major: 1, minor: 4, patch: 8 }, commits: [{ message: 'fix: patch 1' }, { message: 'fix: patch 2' }], expected: { major: 1, minor: 4, patch: 10 }, expectedVersion: '1.4.10' },
    { version: { major: 1, minor: 0, patch: 9 }, commits: [{ message: 'feat: add preview mode' }, { message: 'fix: toolbar bug' }], expected: { major: 1, minor: 1, patch: 0 }, expectedVersion: '1.1.0' },

    ...Array(35)
      .fill(null)
      .map((_, i) => ({
        version: { major: 1, minor: i % 10, patch: i % 3 },
        commits: [{ message: 'fix: resolve issue #' + i }, { message: 'feat: feature #' + i }, { message: i % 5 === 0 ? 'BREAKING CHANGE: incompatible API changes' : '' }],
        expected: {
          major: i % 5 === 0 ? 2 : 1,
          minor: (i % 10) + 1,
          patch: i % 3 === 2 ? 0 : (i % 3) + 1,
        },
        expectedVersion: `${i % 5 === 0 ? 2 : 1}.${(i % 10) + 1}.${i % 3 === 2 ? 0 : (i % 3) + 1}`,
      })),
  ];

  testCases.forEach(({ version, commits, expected, expectedVersion }, index) => {
    it(`Test case #${index + 1}: should increment version to ${expectedVersion}`, () => {
      const newVersionType = classifyVersion(commits, config);

      const result = getNewVersion(newVersionType, config, [version.major, version.minor, version.patch]);
      expect(result).toEqual(expectedVersion);
      expect(newVersionType.major).toBe(expected.major);
      expect(newVersionType.minor).toBe(expected.minor);
      expect(newVersionType.patch).toBe(expected.patch);
    });
  });
});
