pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract PropertyRegistry {

  ERC721Basic property;
  ERC20 propertyToken;

  uint256[] public registeredProperties;

  mapping(uint256 => Data) public stayData;

  struct Data {
    uint256 price;
    uint256 stays;
    address occupant;
    address requested;
    address approved;
    uint256 checkIn;
    uint256 checkOut;
  }

  constructor(address _property, address _propertyToken) public {
    property = ERC721Basic(_property);
    propertyToken = ERC20(_propertyToken);
  }

  event Registered(uint256 indexed _tokenId);
  event Approved(uint256 indexed _tokenId);
  event Requested(uint256 indexed _tokenId);
  event CheckIn(uint256 indexed _tokenId);
  event CheckOut(uint256 indexed _tokenId);

  modifier onlyOwner(uint256 _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender);
    _;
  }

  function getStayData(uint256 _tokenId) external view returns(uint256, uint256, address, address, address, uint256, uint256) {
    return (
      stayData[_tokenId].price,
      stayData[_tokenId].stays,
      stayData[_tokenId].requested,
      stayData[_tokenId].approved,
      stayData[_tokenId].occupant,
      stayData[_tokenId].checkIn,
      stayData[_tokenId].checkOut
    );
  }

  function registerProperty(uint256 _tokenId, uint256 _price) external onlyOwner(_tokenId) {
    stayData[_tokenId] = Data(_price, 0, address(0), address(0), address(0), 0, 0);
    registeredProperties.push(_tokenId);
    emit Registered(_tokenId);

  }

  function request(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) external {
    require(stayData[_tokenId].requested == address(0));
    stayData[_tokenId].requested = msg.sender;
    stayData[_tokenId].checkIn = _checkIn;
    stayData[_tokenId].checkOut = _checkOut;
    emit Requested(_tokenId);
  }

  function approveRequest(uint256 _tokenId) external onlyOwner(_tokenId) {
    stayData[_tokenId].approved = stayData[_tokenId].requested;
    emit Approved(_tokenId);
  }

  function checkIn(uint256 _tokenId) external {
    require(stayData[_tokenId].approved == msg.sender);
    require(block.timestamp > stayData[_tokenId].checkIn);
    require(propertyToken.transferFrom(msg.sender, this, stayData[_tokenId].price));
    stayData[_tokenId].occupant = stayData[_tokenId].approved;
    emit CheckIn(_tokenId);
  }

  function checkOut(uint256 _tokenId) external {
    require(stayData[_tokenId].occupant == msg.sender);
    //require(now < stayData[_tokenId].checkOut);
    //REQUIRED: transfer tokens to Alice upon successful check out
    require(propertyToken.transfer(property.ownerOf(_tokenId), stayData[_tokenId].price));
    //clear the request to let another guest request
    stayData[_tokenId].requested = address(0);
    stayData[_tokenId].stays++;
    emit CheckOut(_tokenId);
  }

  /* function payOut(uint256 _tokenId, uint256 _price) {
    require(propertyToken.transferFrom(address(this), property.ownerOf(_tokenId), _price));
  }

  function checkOut(uint256 _tokenId) external {
    require(stayData[_tokenId].occupant == msg.sender);
    //require(block.timestamp < stayData[_tokenId].checkOut);
    payOut(_tokenId, stayData[_tokenId].price);
    stayData[_tokenId].occupant = address(0);
    stayData[_tokenId].requested = address(0);
    emit CheckOut(_tokenId);
  } */



}
