pragma solidity ^0.4.18;
import "./ERC20Basic.sol";
import "./SafeMath.sol";

contract DetailedERC20 is ERC20Basic {
    using SafeMath for uint256;
    mapping(address => uint256) balances;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply_;

    function DetailedERC20() public {
        name = "NextToken";
        symbol = "NEXT";
        decimals = 0;
        totalSupply_ = 10000;
        balances[msg.sender] = 10000;
    }

    /**
    * @dev total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * @dev transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}