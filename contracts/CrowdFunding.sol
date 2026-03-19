// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        string image;
        uint256 goal;
        uint256 deadline;
        uint256 amountCollected;
        bool withdrawn;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => Donation[]) public donations;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _image,
        uint256 _goal,
        uint256 _deadline
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_goal > 0, "Goal must be greater than 0");

        campaigns[numberOfCampaigns] = Campaign({
            owner: msg.sender,
            title: _title,
            description: _description,
            image: _image,
            goal: _goal,
            deadline: _deadline,
            amountCollected: 0,
            withdrawn: false
        });

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        require(block.timestamp < campaigns[_id].deadline, "Campaign has ended");
        require(msg.value > 0, "Donation must be greater than 0");

        campaigns[_id].amountCollected += msg.value;
        contributions[_id][msg.sender] += msg.value;

        donations[_id].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
    }

    function getDonors(uint256 _id) public view returns (Donation[] memory) {
        return donations[_id];
    }

    // Owner can withdraw anytime after deadline regardless of goal
    function withdrawFunds(uint256 _id) public {
        Campaign storage c = campaigns[_id];
        require(msg.sender == c.owner, "Only owner can withdraw");
        require(block.timestamp >= c.deadline, "Campaign still active");
        require(c.amountCollected > 0, "No funds to withdraw");
        require(!c.withdrawn, "Already withdrawn");

        c.withdrawn = true;
        (bool success, ) = payable(c.owner).call{value: c.amountCollected}("");
        require(success, "Transfer failed");
    }


    function deleteCampaign(uint256 _id) public {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        require(msg.sender == campaigns[_id].owner, "Only owner can delete");
        delete campaigns[_id];
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }
}
