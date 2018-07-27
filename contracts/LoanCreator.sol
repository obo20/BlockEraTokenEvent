pragma solidity ^0.4.17;

import "./Loan.sol";

//factory used for creations Loans
contract LoanCreator {
    
    //event emission for web3 to track
    event LoanCreated(
        address indexed _lender,
        address  indexed _borrower,
        address _contractAddress,
        uint _valueLent,
        uint _interestDesired
    );
    
    
    function createLoan(address _borrower, uint _interestDesired)
    public
    payable
    returns (Loan _loanAddress) 
    {
        Loan newLoan = (new Loan).value(msg.value)(msg.sender, _borrower, _interestDesired);
        LoanCreated(msg.sender, _borrower, newLoan, msg.value, _interestDesired);
        return newLoan;
    }
}