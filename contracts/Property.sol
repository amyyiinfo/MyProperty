pragma solidity ^0.4.24;
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract Property is ERC721Token {

address public guest;
uint public price;

//event GuestInvited(string _msg);

constructor(string _name, string _symbol) public ERC721Token(_name, _symbol) {
  //leave empty for now, we've passed through the args above (i.e. super)
  }

/* function inviteGuest(address _guest) external onlyOwner returns(address) {
  require(_guest != address(0));
//  emit GuestInvited(_msg);
  guest = _guest;

  } */

modifier onlyOwner(uint256 _tokenId) {
  require(tokenOwner[_tokenId] == msg.sender);
  _;
  }

/* modifier onlyGuest() {
    require(msg.sender == guest);
    _;
  } */

/* modifier correctPrice() {
  require(msg.value == price);
  _;
} */

function getProperties() external view returns(uint256[]) {
  return ownedTokens[msg.sender];
}

function createProperty() external {
  _mint(msg.sender, allTokens.length + 1);
}

function getTokenId() external view returns(uint256) {
  return balanceOf(msg.sender);
}

function setURI(uint256 _tokenId, string _uri) external onlyOwner(_tokenId) {
  _setTokenURI(_tokenId, _uri);
}

function getURI(uint256 _tokenId) external view returns(string) {
  return tokenURIs[_tokenId];
}

/* function reserveRoom() external payable onlyGuest correctPrice returns (bool) {
  guest = msg.sender;
  price = 1;
  if (msg.value != price) {
    return false;
  } else {
  guest.transfer(msg.value);
  return true;
    }
  } */

}
