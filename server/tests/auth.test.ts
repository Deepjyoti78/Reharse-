import assert from 'assert';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  findUserById,
  findUserByEmail,
  findUserByProviderIdentity,
  createUserWithIdentity,
  linkIdentityToUser,
  updateUserLastLogin,
  saveOAuthState,
  consumeOAuthState,
} from '../db/users';
import {
  createSessionToken,
  verifySessionToken,
  generateRandomString,
  generateCodeChallenge,
} from '../services/session';
import { createGoogleAuthUrl } from '../services/googleOAuth';
import { createGitHubAuthUrl } from '../services/githubOAuth';

async function runTests() {
  console.log('--- Starting Rehearse Authentication Test Suite ---');
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`  ✓ ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`  ✗ ${name}`);
        console.error('    Error:', err.message);
        failed++;
      });
  }

  // 1. Password Hashing & Email Registration
  await test('Email registration with bcrypt password hash inside transaction', async () => {
    const testEmail = `test_${Date.now()}@rehearse.ai`;
    const password = 'testPassword123!';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = createUserWithIdentity(
      {
        name: 'Test Candidate',
        email: testEmail,
        passwordHash,
      },
      {
        provider: 'email',
        providerUserId: testEmail,
        providerEmail: testEmail,
        emailVerified: false,
      }
    );

    assert.ok(user.id.startsWith('usr_'));
    assert.strictEqual(user.email, testEmail);

    // Verify bcrypt password verification
    const isMatch = await bcrypt.compare(password, user.password_hash!);
    assert.strictEqual(isMatch, true);

    const isWrongMatch = await bcrypt.compare('wrongPassword', user.password_hash!);
    assert.strictEqual(isWrongMatch, false);
  });

  // 2. Duplicate Email Prevention
  await test('Prevents duplicate email registration across database', async () => {
    const testEmail = `dup_${Date.now()}@rehearse.ai`;
    createUserWithIdentity(
      { name: 'First User', email: testEmail },
      { provider: 'email', providerUserId: testEmail }
    );

    assert.throws(() => {
      createUserWithIdentity(
        { name: 'Second User', email: testEmail },
        { provider: 'email', providerUserId: testEmail }
      );
    }, /UNIQUE constraint failed/);
  });

  // 3. Google OAuth Identity Creation & Re-login Retrieval
  await test('Creates Google OAuth user and identity, and retrieves existing user on re-login', async () => {
    const googleSub = `google_sub_${Date.now()}`;
    const googleEmail = `google_${Date.now()}@gmail.com`;

    // 1. First login creates user
    const newUser = createUserWithIdentity(
      {
        name: 'Google Engineer',
        email: googleEmail,
        avatarUrl: 'https://example.com/avatar.png',
      },
      {
        provider: 'google',
        providerUserId: googleSub,
        providerEmail: googleEmail,
        emailVerified: true,
      }
    );

    assert.ok(newUser);
    assert.strictEqual(newUser.email, googleEmail);

    // 2. Re-login with same Google Sub retrieves existing user instead of creating duplicate
    const existing = findUserByProviderIdentity('google', googleSub);
    assert.ok(existing);
    assert.strictEqual(existing.id, newUser.id);
  });

  // 4. GitHub OAuth Identity Creation & Retrieval
  await test('Creates GitHub user and identity with username and verified email', async () => {
    const githubId = `gh_${Date.now()}`;
    const githubEmail = `gh_${Date.now()}@github.com`;

    const ghUser = createUserWithIdentity(
      {
        name: 'GitHub Dev',
        email: githubEmail,
        avatarUrl: 'https://github.com/avatar.png',
      },
      {
        provider: 'github',
        providerUserId: githubId,
        providerEmail: githubEmail,
        emailVerified: true,
      }
    );

    assert.ok(ghUser);
    const retrieved = findUserByProviderIdentity('github', githubId);
    assert.ok(retrieved);
    assert.strictEqual(retrieved.id, ghUser.id);
  });

  // 5. Account Linking
  await test('Links a new OAuth identity to an existing user with verified email', async () => {
    const commonEmail = `common_${Date.now()}@rehearse.ai`;
    
    // User signed up with email
    const originalUser = createUserWithIdentity(
      { name: 'Multi Provider User', email: commonEmail },
      { provider: 'email', providerUserId: commonEmail }
    );

    // Later signs in with Google having the same verified email
    const newGoogleSub = `sub_link_${Date.now()}`;
    linkIdentityToUser(originalUser.id, {
      provider: 'google',
      providerUserId: newGoogleSub,
      providerEmail: commonEmail,
      emailVerified: true,
    });

    const userByGoogle = findUserByProviderIdentity('google', newGoogleSub);
    assert.ok(userByGoogle);
    assert.strictEqual(userByGoogle.id, originalUser.id);
  });

  // 6. Cryptographic Session Token Verification
  await test('Generates, signs, and verifies JWT session token with user claims', async () => {
    const testUser = findUserByEmail('demo@rehearse.ai') || createUserWithIdentity(
      { name: 'Demo Test', email: `session_${Date.now()}@rehearse.ai` },
      { provider: 'email', providerUserId: 'dummy' }
    );

    const token = createSessionToken(testUser);
    assert.ok(token);

    const decoded = verifySessionToken(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.userId, testUser.id);
    assert.strictEqual(decoded.email, testUser.email);

    // Tampered token fails
    const tampered = token.slice(0, -6) + 'abcdef';
    const invalid = verifySessionToken(tampered);
    assert.strictEqual(invalid, null);
  });

  // 7. PKCE Code Challenge Generation (RFC 7636)
  await test('Generates valid PKCE code verifier and S256 challenge', () => {
    const verifier = generateRandomString(48);
    const challenge = generateCodeChallenge(verifier);

    assert.ok(verifier.length >= 43);
    assert.ok(challenge.length > 0);
    assert.notStrictEqual(verifier, challenge);

    // Same verifier produces identical challenge
    const reChallenge = generateCodeChallenge(verifier);
    assert.strictEqual(challenge, reChallenge);
  });

  // 8. Transient OAuth State Replay Protection
  await test('Consumes OAuth state once and prevents replay attacks', () => {
    const testState = `state_${Date.now()}`;
    saveOAuthState({
      state: testState,
      provider: 'google',
      codeVerifier: 'test_verifier',
      nonce: 'test_nonce',
      expiresInMinutes: 5,
    });

    // 1st consumption succeeds
    const consumed = consumeOAuthState(testState, 'google');
    assert.ok(consumed);
    assert.strictEqual(consumed.code_verifier, 'test_verifier');

    // 2nd consumption fails (replay attempt blocked)
    const replay = consumeOAuthState(testState, 'google');
    assert.strictEqual(replay, null);
  });

  console.log('--------------------------------------------------');
  console.log(`Test Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
