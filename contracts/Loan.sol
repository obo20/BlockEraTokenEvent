pragma solidity ^0.4.17;

contract Loan {

    //initially play with all being public, but depending on use case, might want to make private
    address public owner;
    address public borrower;
    uint256 public amountLent; //the initial ammount the contract creator lent to the borrower
    uint256 public interestDesired; //in more advanced contract this can be calculated and incremented using time stamps and an oracle to supply the timestamps
    uint256 public amountPaid; // could maybe expand to an installment array later on.
    bool public loanWithdrawn; //marks whether or not the loan has been withdrawn by the borrower


    //contract constructor used to initialize the contract's global variables
    function Loan(address _owner, address _borrower, uint256 _interestDesired) public payable {
        require(_owner != _borrower);
        require(msg.value > 0);
        owner = _owner;
        borrower = _borrower;
        amountLent = msg.value;
        interestDesired = _interestDesired;
        loanWithdrawn = false;
    }

    function getBalance() external view returns (uint256 balance) {
        return this.balance;
    }

    function getOutstandingBalance() public view returns (uint256 oustandingBalance) {
        return amountLent + interestDesired - amountPaid;
    }

    //this allows the borrower to withdraw the funds that were initially deposited by the lender
    function withdrawLoan() external {
        //checks to make sure the sender can actually withdraw the loan
        require(loanWithdrawn == false);
        require(this.balance == amountLent);
        require(msg.sender == borrower);

        //transfer the loan deposit to the sender and mark the deposit withdrawn
        msg.sender.transfer(amountLent);
        loanWithdrawn = true;
    }

    function makePayment() external payable returns (uint256 outstandingBalance) {
        require(loanWithdrawn == true);
        require(msg.value <= getOutstandingBalance());
        amountPaid = amountPaid + msg.value;
        return getOutstandingBalance();
    }

    function collectLoanPayments() external {
        require(msg.sender == owner);
        require(loanWithdrawn == true);
        require(this.balance > 0);

        owner.transfer(this.balance);
    }

    //event emission for web3 to track
    event OwnerTransferred(
        address _oldOwner,
        address _newOwner
    );

    function transferLoanOwnership(address _newOwner) external {
        require(msg.sender == owner);
        owner = _newOwner;

        //emit event of ownership transferred
        OwnerTransferred(msg.sender, _newOwner);
    }

}