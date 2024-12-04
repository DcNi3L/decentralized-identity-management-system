const IdentityManager = artifacts.require('IdentityManager');

module.exports = function (deployer) {
  deployer.deploy(IdentityManager);
};
