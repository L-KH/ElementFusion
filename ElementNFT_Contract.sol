// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ElementNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct Quest {
        string name;
        string description;
        uint256 rewardPoints;
    }

    struct QuestPeriod {
        uint256 questId;
        uint256 periodType;
        uint256 requiredProgress;
    }

    mapping(uint256 => Quest) public quests;
    mapping(uint256 => QuestPeriod) public questPeriods;
    mapping(address => uint256) public userPoints;
    mapping(address => uint256) public userHints;
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public userQuestProgress;

    uint256[] public rarityPrices = [
        1e13,   // common
        5e13,   // uncommon
        1e14,   // rare
        5e14,   // epic
        5e15,   // legendary
        5e16    // hidden
    ];

    uint256 public questCount;

    event ElementMinted(address indexed user, string indexed name, uint256 indexed rarity);
    event HintPackagePurchased(address indexed user, bool isPremium);
    event QuestProgressUpdated(address indexed user, uint256 questId, uint256 progress);

    constructor(address initialOwner) ERC721("ElementFusion", "ELMNT") Ownable(initialOwner) {
        questCount = 0;
    }

    function mintElement(
        string memory name,
        uint256 rarity,
        string memory uri
    ) public payable {
        require(rarity < rarityPrices.length, "Invalid rarity");
        require(msg.value >= rarityPrices[rarity], "Insufficient payment");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit ElementMinted(msg.sender, name, rarity);
    }

    function purchaseHintPackage(bool isPremium) public payable {
        uint256 price = isPremium ? 2e15 : 1e15;
        require(msg.value >= price, "Insufficient payment");

        if (isPremium) {
            userHints[msg.sender] += 5;
        } else {
            userHints[msg.sender] += 2;
        }

        emit HintPackagePurchased(msg.sender, isPremium);
    }

    function useHint() public {
        require(userHints[msg.sender] > 0, "No hints available");
        userHints[msg.sender]--;
    }

    function addQuest(
        string memory name,
        string memory description,
        uint256 rewardPoints
    ) public onlyOwner {
        quests[questCount] = Quest(name, description, rewardPoints);
        questCount++;
    }

    function updateUserQuestProgress(
        address user,
        uint256 questId,
        uint256 periodType,
        uint256 progress
    ) public onlyOwner {
        userQuestProgress[user][questId][periodType] = progress;
        emit QuestProgressUpdated(user, questId, progress);
    }

    function getUserQuestProgress(
        address user,
        uint256 periodType,
        uint256 questId
    ) public view returns (uint256) {
        return userQuestProgress[user][questId][periodType];
    }

    function getUserPoints() public view returns (uint256) {
        return userPoints[msg.sender];
    }

    function getUserHints() public view returns (uint256) {
        return userHints[msg.sender];
    }

    function saveProgress(string memory progress) public {
        // Placeholder for progress saving
    }

    function getQuest(uint256 questId)
        public
        view
        returns (string memory name, string memory description, uint256 rewardPoints)
    {
        Quest memory quest = quests[questId];
        return (quest.name, quest.description, quest.rewardPoints);
    }

    // Override required by ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Override required by OpenZeppelin
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
