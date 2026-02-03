// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract Voting {
    address public electionCommission;
    uint public totalVotes;
    uint public totalVoters;
    uint public electionDeadline;
    bool public electionEnded;
    address[] public voterAddresses;
    uint[] public partyIds;
    struct Party {
        uint id;
        string name;
        uint voteCount;
        bool exists;
    }

    struct Voter {
        bool isRegistered;
        bool isBlocked;
        bool hasVoted;
        uint allocatedTokens;
    }
    mapping(uint => Party) public parties;
    mapping(address => Voter) public voters;

    modifier onlyCommission() {
        require(msg.sender == electionCommission, "Only election commission can perform this action");
        _;
    }
    modifier electionActive() {
        require(!electionEnded, "Election has ended");
        _;
    }
    constructor() {
        electionCommission = msg.sender;
        totalVotes = 0;
        totalVoters = 0;
        electionEnded = true;
        electionDeadline = 0;
    }
    event VoteCast(address indexed voter, uint indexed partyId);
    //Admin functions>>>

    function startElection(uint _duration) public onlyCommission  {
        require(electionEnded, "An election is already active");
        electionDeadline = block.timestamp + _duration;
        totalVotes = 0;
        for (uint i = 0; i < partyIds.length; i++) {
            uint partyId = partyIds[i];
            if (parties[partyId].exists) {
                parties[partyId].voteCount = 0;
            }
        }
        electionEnded = false;
    }
    function results() public onlyCommission view returns(uint,string memory, uint){
        uint winningPartyId;
        string memory winningPartyName = "";
        uint highestVotes = 0;

        for (uint i = 0; i < partyIds.length; i++) {
            uint partyId = partyIds[i];
            if (parties[partyId].exists && parties[partyId].voteCount > highestVotes) {
                highestVotes = parties[partyId].voteCount;
                winningPartyId = parties[partyId].id;
                winningPartyName = parties[partyId].name;
            }
        }
        return (winningPartyId, winningPartyName, highestVotes);
    }
    function endElection() public onlyCommission electionActive {
        electionEnded = true;
    }
    function resetElection() public onlyCommission {
        for(uint i = 0; i < partyIds.length; i++){
            uint partyId = partyIds[i];
            if (parties[partyId].exists) {
                parties[partyId].voteCount = 0;
            }
        }
        for (uint i = 0; i < voterAddresses.length; i++) {
            address voter = voterAddresses[i];
            voters[voter] = Voter(true, false, false, 0);
        }
        totalVotes = 0;
        electionEnded = true;
    }
    function addParty(uint _partyId,string memory _name) public onlyCommission{
        require(!parties[_partyId].exists, "Party already exists");
        parties[_partyId] = Party(_partyId, _name, 0, true);
        partyIds.push(_partyId);
    }
    function removeParty(uint _partyId) public onlyCommission{
        require(parties[_partyId].exists, "Party does not exist.");
        delete parties[_partyId];
        for(uint i = 0; i < partyIds.length; i++){
            if(partyIds[i] == _partyId){
                partyIds[i] = partyIds[partyIds.length -1];
                partyIds.pop();
                break;
            }
        }
    }
    function registerVoter(address _voter) public onlyCommission{
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter] = Voter(true,false,false,1);
        voterAddresses.push(_voter);
        totalVoters++;
    }
    function blockVoter(address _voter) public onlyCommission{
        require(voters[_voter].isRegistered, "Voter not registered");
        voters[_voter].isBlocked = true;
    }
    function unblockVoter(address _voter) public onlyCommission{
        require(voters[_voter].isRegistered, "Voter not registered");
        voters[_voter].isBlocked = false;
    }

    //token Management>>>

    function mintTokens(address _voter) public onlyCommission{
        require(voters[_voter].isRegistered, "Voter not registered");
        voters[_voter].allocatedTokens = 1;
    }
    function distributeTokens() public onlyCommission {
        for (uint i = 0; i < voterAddresses.length; i++) {
            address voter = voterAddresses[i];
            if (voters[voter].allocatedTokens == 0 && !voters[voter].isBlocked && !voters[voter].hasVoted) {
                voters[voter].allocatedTokens = 1;
            }
        }
    }
    function vote(uint _partyId) public electionActive {
        require(block.timestamp < electionDeadline, "Election is over");
        require(parties[_partyId].exists, "Invalid party");
        require(voters[msg.sender].isRegistered, "Not registered");
        require(!voters[msg.sender].isBlocked, "Voter is Blocked");
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(voters[msg.sender].allocatedTokens > 0, "No voting tokens left");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].allocatedTokens =0;
        parties[_partyId].voteCount ++;
        totalVotes++;
        emit VoteCast(msg.sender, _partyId);
    }
    function getPartyStatus(uint _partyId) public view returns(uint, string memory, uint, bool){
        require(parties[_partyId].exists,"Party not exists");
        Party memory p = parties[_partyId];
        return (p.id, p.name, p.voteCount, p.exists);
    }
    function getVoterStatus(address _voter) public view returns(bool, bool, bool, uint) {
        require(voters[_voter].isRegistered, "Voter not registered");
        Voter memory v = voters[_voter];
        return (v.isRegistered, v.isBlocked, v.hasVoted, v.allocatedTokens);
    }
    function getTotalVotes() public view returns(uint){
        return totalVotes;
    }
    function getTotalVoters() public view returns(uint){
        return totalVoters;
    }
    function getTotalParties() public view returns(uint){
        return partyIds.length;
    }
    function getVoterAddresses() public view returns(address[] memory){
        return voterAddresses;
    }
}