// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract ZapGraph is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    using ECDSA for bytes32;

    mapping(address => uint256) public timeAllotments; // amount of time a signee has to redeem the autograph in seconds
    mapping(address => uint256) public prices; // price of an autograph for a given signer in wei

    event Purchase(
        address indexed _signer,
        address indexed _signee,
        uint256 indexed _timestamp,
        uint256 _price
    );

    event PriceChange(address indexed signer, uint256 newPrice);

    event TimeChange(address indexed signer, uint256 newTime);

    function setAllotment(uint256 _allotment) external {
        timeAllotments[msg.sender] = _allotment;
        emit TimeChange(msg.sender, _allotment);
    }

    function setPrice(uint256 _price) external {
        prices[msg.sender] = _price;
        emit PriceChange(msg.sender, _price);
    }

    function purchase(
        uint256 _timestamp,
        address _signer,
        bytes memory _signature,
        bytes memory data
    ) external payable {
        require(
            verifySignature(_timestamp, _signer, _signature),
            "Signature invalid"
        );
        require(
            timeAllotments[_signer] == 0 ||
                _timestamp + timeAllotments[_signer] > block.timestamp,
            "Signature has expired"
        );
        require(
            prices[_signer] == 0 ||
                _timestamp + timeAllotments[_signer] > block.timestamp,
            "Insufficient funds provided"
        );
        uint256 id = uint256(uint160(_signer));
        _mint(msg.sender, id, 1, data);
        payable(_signer).transfer(msg.value);
        emit Purchase(_signer, msg.sender, _timestamp, msg.value);
    }

    function verifySignature(
        uint256 _timestamp,
        address _signer,
        bytes memory _signature
    ) public view returns (bool) {
        bytes32 hashedEncodedData = keccak256(
            abi.encode("timestamp:", _timestamp, " signee:", msg.sender)
        );

        return
            hashedEncodedData.toEthSignedMessageHash().recover(_signature) ==
            _signer;
    }

    // OpenZeppelin ERC1155:
    constructor()
        ERC1155(
            "https://gateway.pinata.cloud/ipfs/QmPwvH9EKw4oxK7Xt2RxjCKabud88wUDJov5EyMMSL61gs/{id}.json"
        )
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
