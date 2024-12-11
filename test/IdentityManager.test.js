const assert = require('assert');
const IdentityManager = artifacts.require('IdentityManager');

contract('IdentityManager', (accounts) => {
  let identityManager;

  // Accounts
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const unregisteredUser = accounts[4];

  beforeEach(async () => {
    // Deploy a fresh contract instance before each test
    identityManager = await IdentityManager.new({ from: owner });
  });

  describe('Deployment', () => {
    it('should deploy the contract successfully', async () => {
      assert.ok(identityManager.address, 'Contract was not deployed');
    });
  });

  describe('Register Identity', () => {
    it('should allow a user to register an identity', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });

      const identity = await identityManager.getIdentity(user1);
      assert.strictEqual(identity[0], 'Alice', 'Name does not match');
      assert.strictEqual(identity[1], 'alice@example.com', 'Email does not match');
    });

    it('should not allow a user to register twice', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });

      try {
        await identityManager.registerIdentity('Alice Duplicate', 'duplicate@example.com', { from: user1 });
        assert.fail('Expected error not received');
      } catch (error) {
        assert(error.message.includes('User already registered'), 'Unexpected error message');
      }
    });

    it('should require non-empty name and email for registration', async () => {
      try {
        await identityManager.registerIdentity('', 'alice@example.com', { from: user1 });
        assert.fail('Expected error not received for empty name');
      } catch (error) {
        assert(error.message.includes('Name is required'), 'Unexpected error message for empty name');
      }

      try {
        await identityManager.registerIdentity('Alice', '', { from: user1 });
        assert.fail('Expected error not received for empty email');
      } catch (error) {
        assert(error.message.includes('Email is required'), 'Unexpected error message for empty email');
      }
    });
  });

  describe('Register Multiple Users', () => {
    it('should allow multiple users to register identities', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });
      await identityManager.registerIdentity('Bob', 'bob@example.com', { from: user2 });

      const identity1 = await identityManager.getIdentity(user1);
      const identity2 = await identityManager.getIdentity(user2);

      assert.strictEqual(identity1[0], 'Alice', 'User1 name mismatch');
      assert.strictEqual(identity1[1], 'alice@example.com', 'User1 email mismatch');
      assert.strictEqual(identity2[0], 'Bob', 'User2 name mismatch');
      assert.strictEqual(identity2[1], 'bob@example.com', 'User2 email mismatch');

      const users = await identityManager.getAllUsers();
      assert.deepStrictEqual(users, [user1, user2], 'Registered users list mismatch');
    });
  });

  describe('Update Identity', () => {
    it('should allow a registered user to update their identity', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });
      await identityManager.updateIdentity('Alice Updated', 'alice_updated@example.com', { from: user1 });

      const identity = await identityManager.getIdentity(user1);
      assert.strictEqual(identity[0], 'Alice Updated', 'Updated name does not match');
      assert.strictEqual(identity[1], 'alice_updated@example.com', 'Updated email does not match');
    });

    it('should reject update for unregistered user', async () => {
      try {
        await identityManager.updateIdentity('Bob', 'bob@example.com', { from: unregisteredUser });
        assert.fail('Expected error not received');
      } catch (error) {
        assert(error.message.includes('User not registered'), 'Unexpected error message');
      }
    });

    it('should require non-empty name and email for update', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });

      try {
        await identityManager.updateIdentity('', 'alice_updated@example.com', { from: user1 });
        assert.fail('Expected error not received for empty name');
      } catch (error) {
        assert(error.message.includes('Name is required'), 'Unexpected error message for empty name');
      }

      try {
        await identityManager.updateIdentity('Alice Updated', '', { from: user1 });
        assert.fail('Expected error not received for empty email');
      } catch (error) {
        assert(error.message.includes('Email is required'), 'Unexpected error message for empty email');
      }
    });
  });

  describe('Get Identity', () => {
    it('should fetch the correct identity details for a user', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });

      const identity = await identityManager.getIdentity(user1);
      assert.strictEqual(identity[0], 'Alice', 'Name does not match');
      assert.strictEqual(identity[1], 'alice@example.com', 'Email does not match');
    });

    it('should revert if fetching an unregistered user\'s identity', async () => {
      try {
        await identityManager.getIdentity(unregisteredUser);
        assert.fail('Expected error not received');
      } catch (error) {
        assert(error.message.includes('User not registered'), 'Unexpected error message');
      }
    });
  });

  describe('Fetch All Users', () => {
    it('should return all registered users', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });
      await identityManager.registerIdentity('Bob', 'bob@example.com', { from: user2 });

      const users = await identityManager.getAllUsers();
      assert.deepStrictEqual(users, [user1, user2], 'User list does not match');
    });

    it('should return an empty array when no users are registered', async () => {
      const users = await identityManager.getAllUsers();
      assert.strictEqual(users.length, 0, 'User list is not empty');
    });
  });

  describe('Fetch All Identities', () => {
    it('should return all registered identities', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', { from: user1 });
      await identityManager.registerIdentity('Bob', 'bob@example.com', { from: user2 });
      await identityManager.registerIdentity('Charlie', 'charlie@example.com', { from: user3 });

      const identities = await identityManager.getAllIdentities();

      assert.strictEqual(identities.length, 3, 'Identity list length mismatch');
      assert.strictEqual(identities[0].name, 'Alice', 'First user name mismatch');
      assert.strictEqual(identities[1].name, 'Bob', 'Second user name mismatch');
      assert.strictEqual(identities[2].name, 'Charlie', 'Third user name mismatch');
    });

    it('should return an empty array when no identities exist', async () => {
      const identities = await identityManager.getAllIdentities();
      assert.strictEqual(identities.length, 0, 'Identity list is not empty');
    });
  });
});
