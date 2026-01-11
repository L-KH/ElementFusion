// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ElementNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => uint256) public rarityPrices;
    mapping(address => uint256) public userHints;

    uint256 public constant BASIC_PACKAGE_PRICE = 0.001 ether;
    uint256 public constant PREMIUM_PACKAGE_PRICE = 0.002 ether;

    event ElementMinted(uint256 tokenId, string name, uint256 rarity, address minter);
    event HintPackagePurchased(address user, uint256 hintCount);
    event QuestCompleted(address user, uint256 periodType, uint256 questId, uint256 pointsEarned);
    event PointsAwarded(address user, uint256 points, string reason);

    struct Quest {
        string name;
        uint256 startTime;
        uint256 endTime;
        uint256 requiredCount;
        uint256 rewardPoints;
        uint256 rarityRequirement; // 0 for any, 1-6 for specific rarity
    }

    struct QuestPeriod {
        mapping(uint256 => Quest) quests;
        uint256 questCount;
    }

    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public userQuestProgress;
    mapping(address => uint256) public userPoints;
    mapping(address => string) private userProgress;
    mapping(uint256 => QuestPeriod) public questPeriods; // 0: daily, 1: weekly, 2: monthly, 3: yearly

    constructor(address initialOwner) ERC721("ElementFusion", "ELMNT") Ownable(initialOwner) {
        rarityPrices[0] = 0.00001 ether; // common
        rarityPrices[1] = 0.00005 ether; // uncommon
        rarityPrices[2] = 0.0001 ether;  // rare
        rarityPrices[3] = 0.0005 ether;  // epic
        rarityPrices[4] = 0.005 ether;   // legendary
        rarityPrices[5] = 0.05 ether;    // hidden
    }

    function mintElement(string memory name, uint256 rarity, string memory uri) public payable {
        require(rarity < 6, "Invalid rarity");
        require(msg.value >= rarityPrices[rarity], "Insufficient payment");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);

        updateQuestProgress(msg.sender, rarity);

        emit ElementMinted(newTokenId, name, rarity, msg.sender);
    }

    function purchaseHintPackage(bool isPremium) public payable {
        require(msg.value >= (isPremium ? PREMIUM_PACKAGE_PRICE : BASIC_PACKAGE_PRICE), "Insufficient payment");

        uint256 hintCount = isPremium ? 25 : 10;
        userHints[msg.sender] += hintCount;

        emit HintPackagePurchased(msg.sender, hintCount);
    }

    function useHint() public {
        require(userHints[msg.sender] > 0, "No hints available");
        userHints[msg.sender]--;
    }

    function getUserHints(address user) public view returns (uint256) {
        return userHints[user];
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(bytes(_tokenURIs[tokenId]).length == 0, "URI already set");
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(bytes(_tokenURIs[tokenId]).length > 0, "URI not set for this token");
        return _tokenURIs[tokenId];
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function addQuest(
        uint256 periodType,
        string memory name,
        uint256 duration,
        uint256 requiredCount,
        uint256 rewardPoints,
        uint256 rarityRequirement
    ) public onlyOwner {
        uint256 questId = questPeriods[periodType].questCount;
        questPeriods[periodType].quests[questId] = Quest(
            name,
            block.timestamp,
            block.timestamp + duration,
            requiredCount,
            rewardPoints,
            rarityRequirement
        );
        questPeriods[periodType].questCount++;
    }

    function updateQuestProgress(address user, uint256 rarity) internal {
        for (uint256 periodType = 0; periodType < 4; periodType++) {
            for (uint256 i = 0; i < questPeriods[periodType].questCount; i++) {
                Quest storage quest = questPeriods[periodType].quests[i];
                if (block.timestamp >= quest.startTime && block.timestamp <= quest.endTime) {
                    if (quest.rarityRequirement == 0 || quest.rarityRequirement == rarity + 1) {
                        userQuestProgress[user][periodType][i]++;
                    }
                }
            }
        }
    }

    function completeQuest(uint256 periodType, uint256 questId) public {
        Quest storage quest = questPeriods[periodType].quests[questId];
        require(block.timestamp >= quest.startTime && block.timestamp <= quest.endTime, "Quest is not active");
        require(userQuestProgress[msg.sender][periodType][questId] >= quest.requiredCount, "Quest requirements not met");
        require(userQuestProgress[msg.sender][periodType][questId] < quest.requiredCount + 1, "Quest already completed");

        userPoints[msg.sender] += quest.rewardPoints;
        userQuestProgress[msg.sender][periodType][questId] = quest.requiredCount + 1; // Mark as completed

        emit QuestCompleted(msg.sender, periodType, questId, quest.rewardPoints);
        emit PointsAwarded(msg.sender, quest.rewardPoints, "Quest completion");
    }

    function getQuestInfo(uint256 periodType, uint256 questId) public view returns (Quest memory) {
        return questPeriods[periodType].quests[questId];
    }

    function getUserQuestProgress(address user, uint256 periodType, uint256 questId) public view returns (uint256) {
        return userQuestProgress[user][periodType][questId];
    }

    function awardPoints(address user, uint256 points, string memory reason) public onlyOwner {
        userPoints[user] += points;
        emit PointsAwarded(user, points, reason);
    }

    function saveProgress(string memory progress) public {
        userProgress[msg.sender] = progress;
        emit ProgressSaved(msg.sender, progress);
    }

    function getProgress() public view returns (string memory) {
        return userProgress[msg.sender];
    }

    event ProgressSaved(address indexed user, string progress);
}
