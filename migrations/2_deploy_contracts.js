var DetailedERC20 = artifacts.require("./DetailedERC20.sol");

module.exports = function(deployer) {
    deployer.deploy(DetailedERC20);
};
