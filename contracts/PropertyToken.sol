pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract PropertyToken is DetailedERC20, MintableToken {

  constructor(string _name, string _symbol, uint8 _decimals) public DetailedERC20(_name, _symbol, _decimals) {

  }

}
