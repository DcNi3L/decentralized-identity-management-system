const assert = require('assert');
const IdentityManager = artifacts.require('IdentityManager');

contract('IdentityManager', (accounts) => {
  let identityManager;

  // Accounts
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const unregisteredUser = accounts[3];

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
      await identityManager.registerIdentity('Alice', 'alice@example.com', {
        from: user1,
      });

      const identity = await identityManager.getIdentity(user1);
      const name = identity[0]; // Access name directly
      const email = identity[1]; // Access email directly

      assert.strictEqual(name, 'Alice', 'Name does not match');
      assert.strictEqual(email, 'alice@example.com', 'Email does not match');
    });

    it('should not allow a user to register twice', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', {
        from: user1,
      });

      try {
        await identityManager.registerIdentity('Bob', 'bob@example.com', {
          from: user1,
        });
        assert.fail('Expected error not received');
      } catch (error) {
        assert(
          error.message.includes('User already registered'),
          'Unexpected error message'
        );
      }
    });
  });

  describe('Update Identity', () => {
    it('should allow a registered user to update their identity', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', {
        from: user1,
      });
      await identityManager.updateIdentity(
        'Alice Updated',
        'alice_updated@example.com',
        { from: user1 }
      );

      const identity = await identityManager.getIdentity(user1);
      const name = identity[0]; // Access name directly
      const email = identity[1]; // Access email directly

      assert.strictEqual(name, 'Alice Updated', 'Updated name does not match');
      assert.strictEqual(
        email,
        'alice_updated@example.com',
        'Updated email does not match'
      );
    });

    it('should reject update for unregistered user', async () => {
      try {
        await identityManager.updateIdentity('Bob', 'bob@example.com', {
          from: unregisteredUser,
        });
        assert.fail('Expected error not received');
      } catch (error) {
        assert(
          error.message.includes('User not registered'),
          'Unexpected error message'
        );
      }
    });
  });

  describe('Get Identity', () => {
    it('should fetch the correct identity details for a user', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', {
        from: user1,
      });

      const identity = await identityManager.getIdentity(user1);
      const name = identity[0]; // Access name directly
      const email = identity[1]; // Access email directly

      assert.strictEqual(name, 'Alice', 'Name does not match');
      assert.strictEqual(email, 'alice@example.com', 'Email does not match');
    });

    it("should revert if fetching an unregistered user's identity", async () => {
      try {
        await identityManager.getIdentity(unregisteredUser);
        assert.fail('Expected error not received');
      } catch (error) {
        assert(
          error.message.includes('User not registered'),
          'Unexpected error message'
        );
      }
    });
  });

  describe('Fetch All Users', () => {
    it('should return all registered users', async () => {
      await identityManager.registerIdentity('Alice', 'alice@example.com', {
        from: user1,
      });
      await identityManager.registerIdentity('Bob', 'bob@example.com', {
        from: user2,
      });

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
      await identityManager.registerIdentity('Alice', 'alice@example.com', {
        from: user1,
      });
      await identityManager.registerIdentity('Bob', 'bob@example.com', {
        from: user2,
      });

      const identities = await identityManager.getAllIdentities();

      assert.strictEqual(
        identities.length,
        2,
        'Identity list length does not match'
      );
      assert.strictEqual(
        identities[0][0],
        'Alice',
        'First identity name does not match'
      ); // Access nested array
      assert.strictEqual(
        identities[1][0],
        'Bob',
        'Second identity name does not match'
      );
    });

    it('should return an empty array when no identities exist', async () => {
      const identities = await identityManager.getAllIdentities();
      assert.strictEqual(identities.length, 0, 'Identity list is not empty');
    });
  });
});
