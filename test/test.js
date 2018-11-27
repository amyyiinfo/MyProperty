const Property = artifacts.require("./Property.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");
const PropertyToken = artifacts.require("./PropertyToken.sol");

contract('Property Tests', function(accounts) {

  let property, propertyRegistry, propertyToken;

  const alice = accounts[0]
  const bob = accounts[1]
  const eve = accounts[2]

  const allocation = 10000;
  const price = 1000;

//PROPERTY TESTS

  it('should be deployed, Property', async () => {
    property = await Property.deployed();
    assert(property !== undefined, 'Property was NOT deployed');
  });

  it('should allow Alice to createProperty', async () => {
    try {
      const tx = await property.createProperty( { from: alice});
      assert.equal(tx.receipt.status, "0x01");
      const properties = await property.getProperties( { from: alice});
      console.log(properties);
      assert(true, 'Alice can create a property');
    } catch(e) {
      assert(false, 'Alice should be able to createProperty')
    }
  });

  it('Alice should now have a token ID', async () => {

    try {
      const tokenId = await property.getTokenId( { from: alice});
      console.log(tokenId.toString(10))
      assert.equal(tokenId, 1)
      assert(true, 'Alice has a token ID');
    } catch(e) {
      assert(false, 'Alice should have a token ID')
    }

  });

  it('should allow Alice to setURI', async () => {
    try {
      const tx = await property.setURI( 1, 'http://my.house.com', { from: alice});
      assert.equal(tx.receipt.status, "0x01");
      assert(true, 'Alice can setURI');
    } catch(e) {
      assert(false, 'Alice should be able to setURI')
    }
  });

  it('should not allow Bob to setURI', async () => {
    try {
      const tx = await property.setURI( 1, 'http://bobs.house.com', { from: bob});
      assert(false, 'Bob cannot setURI');
    } catch(e) {
      assert(true, 'Bob should not be able to setURI')
    }
  });

//PROPERTY REGISTRY TESTS

  it('should be deployed, PropertyRegistry', async () => {
    propertyRegistry = await PropertyRegistry.deployed();
    assert(propertyRegistry !== undefined, 'PropertyRegistry was NOT deployed');
  });

  it('should allow Alice to register a property', async () => {
    try {
      const tx = await propertyRegistry.registerProperty( 1, price, { from: alice});
      //console.log(tx.receipt.logs[1].toString)
      //assert.equal
      assert.equal(tx.receipt.status, "0x01");
      const stayData = await propertyRegistry.getStayData(1, { from: alice});
      console.log(stayData);
      assert(true, 'Alice can registerProperty');
    } catch(e) {
      assert(false, 'Alice should be able to registerProperty')
    }
  });

  it('should not allow Bob to register a property', async () => {
    try {
      const tx = await propertyRegistry.registerProperty( 1, 0, { from: bob});
      assert(false, 'Bob cannot registerProperty');
    } catch(e) {
      assert(true, 'Bob should not be able to registerProperty')
    }
  });

  it('should allow Bob to submit a request', async () => {
    try {
      const tx = await propertyRegistry.request( 1, 7, 10, { from: bob});
      assert.equal(tx.receipt.status, "0x01");
      const stayData = await propertyRegistry.getStayData(1, { from: alice});
      console.log(stayData);
      //assert.equal(stayData[1].requested, bob);
      assert(true, 'Bob can request');
    } catch(e) {
      assert(false, 'Bob should be able to request')
    }
  });

  it('should not allow Eve to submit a request', async () => {
    try {
      const tx = await propertyRegistry.request( 1, 7, 12, { from: eve});
      assert(false, 'Eve cannot request');
    } catch(e) {
      assert(true, 'Eve should not be able to request')
    }
  });

  it("should allow Alice to approve Bob's request", async () => {
    try {
      const tx = await propertyRegistry.approveRequest( 1, { from: alice});
      const stayData = await propertyRegistry.getStayData(1, { from: alice});
      console.log(stayData);
      //assert.equal(stayData[1].approved, bob);
      assert(true, 'Alice can approveRequest from Bob');
    } catch(e) {
      assert(false, 'Alice should be able to approveRequest from Bob')
    }
  });

  it('should not allow Eve to checkIn', async () => {
    try {
      const tx = await propertyRegistry.checkIn( 1, { from: eve});
      assert(false, 'Eve cannot checkIn');
    } catch(e) {
      assert(true, 'Eve should not be able to checkIn')
    }
  });

  // it('should allow Bob to checkIn', async () => {
  //   try {
  //     const tx = await propertyRegistry.checkIn( 1, { from: bob});
  //     const stayData = await propertyRegistry.getStayData(1, { from: alice});
  //     console.log(stayData);
  //     //assert.equal(stayData[1].occupant, bob);
  //     assert(true, 'Bob can checkIn');
  //   } catch(e) {
  //     assert(false, 'Bob should be able to checkIn')
  //   }
  // });
  //
  // it('should allow Bob to checkOut', async () => {
  //   try {
  //     const tx = await propertyRegistry.checkOut( 1, { from: bob});
  //     assert(true, 'Bob can checkOut');
  //   } catch(e) {
  //     console.log(e)
  //     assert(false, 'Bob should be able to checkOut')
  //   }
  // });
  //
  // it('should allow Eve to submit a request after Bob has checked out', async () => {
  //   try {
  //     const tx = await propertyRegistry.request( 1, 13, 18, { from: eve});
  //     assert(true, 'Eve can request');
  //   } catch(e) {
  //     console.log(e)
  //     assert(false, 'Eve should be able to request')
  //   }
  // });

//PROPERTY TOKEN TESTS

  it('should be deployed, PropertyToken', async () => {
    propertyToken = await PropertyToken.deployed();
    assert(propertyToken !== undefined, 'PropertyToken was NOT deployed');
  });

  it('should allow alice to mint Property Token for bob', async () => {
    const tx = await propertyToken.mint(bob, allocation);
    //get the balance of property tokens for bob
    const balance = await propertyToken.balanceOf.call(bob);
    assert.equal(balance.toNumber(), allocation, 'balance');
  });

  it('should allow bob to approve the property registry to use his tokens', async () => {
    try {
      const tx = await propertyToken.approve(propertyRegistry.address, price, { from: bob });
      assert.equal(tx.receipt.status, "0x01");
      //assert.equal(tx, undefined, 'property registry has not been approved');
      assert(true, 'Bob can approve propertyRegistry to use his tokens');
    } catch(e) {
      assert(false, 'Bob should be able to approve propertyRegistry to use his tokens')
    }
  });

  it('should allow Bob to checkIn', async () => {
    try {
      const tx = await propertyRegistry.checkIn( 1, { from: bob});
      assert.equal(tx.receipt.status, "0x01");
      const balance = await propertyToken.balanceOf.call(bob);
      console.log(balance.toString(10))
      const stayData = await propertyRegistry.getStayData(1, { from: alice});
      console.log(stayData);
      //assert.equal(balance.toNumber(), (allocation - price), 'balance');
      assert(true, 'Bob can checkIn');
    } catch(e) {
      assert(false, 'Bob should be able to checkIn')
    }
  });

  it('should allow Bob to checkOut', async () => {
    try {
      const tx = await propertyRegistry.checkOut( 1, { from: bob});
      console.log(tx.receipt.logs);
      assert.equal(tx.receipt.status, "0x01");
      assert(true, 'Bob can checkOut');
    } catch(e) {
      assert(false, 'Bob should be able to checkOut')
    }
  });

  it('alice should receive tokens from bob', async () => {
    try {

      const balance = await propertyToken.balanceOf.call(alice);
      console.log(balance.toString(10))
      const balance2 = await propertyToken.balanceOf.call(bob);
      console.log(balance2.toString(10))
      assert.equal(balance.toString(10), price, 'balance');
      // console.log(propertyToken.balanceOf(alice));
      assert(true, 'Alice has received funds from Bob');
    } catch(e) {
      assert(false, 'Alice should have received funds from Bob')
    }
  });

});
