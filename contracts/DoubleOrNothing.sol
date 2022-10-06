// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract DoubleOrNothing {

    address payable minter;
    
    uint256 private run_number;

    uint256 public pot_jar;
    uint256 public fees_jar;
    bool private allowEntry;

    mapping(uint256 => mapping(address => bool)) private participants;
    mapping(uint256 => address[]) public participants_list;
    mapping(uint256 => address) public winners_list;
    mapping(address => uint256) public pending_claims;

    bool private winnerWasPicked;

    event ParticipantsUpdated(address[] participants_list, bool is_complete);
    event WinnerPicked(address winner, uint256 prize_won);

    uint256 maxParticipants;
    uint256 betAmount;

    constructor() {
        minter = payable(msg.sender);
        pot_jar = 0;
        fees_jar = 0;
        allowEntry = true;
        winnerWasPicked = false;
        run_number = 0;
        maxParticipants = 2;
        betAmount = 0.01 ether;
    }

    function join() external payable returns (bool success) {
        require(allowEntry == true, "Entries are closed. Prizes can now be claimed.");
        require(msg.value == betAmount, "You need to send 0.1 ether.");

        // Register participation
        participants[run_number][msg.sender] = true;
        participants_list[run_number].push(msg.sender);
        
        // Increase pot_jar and fees_jar accordingly
        uint256 entry_stake = msg.value * 99/100;
        pot_jar  += entry_stake;
        fees_jar += msg.value - entry_stake;

        bool is_complete = participants_list[run_number].length >= maxParticipants;

        emit ParticipantsUpdated(participants_list[run_number], is_complete);
        
        if(is_complete) {
            closeEntries();
        }

        return true;
    }

    function closeEntries() private returns (bool) {
        allowEntry = false;
        pickWinner();
        return true;
    }

    function pickWinner() internal {
        require(allowEntry == false, "Entries are still open.");
        require(winnerWasPicked == false, "Winner has already been picked.");
        winnerWasPicked = true;
        uint256 winnerIndex = uint256(blockhash(block.number - 1)) % participants_list[run_number].length;
        address winner = participants_list[run_number][winnerIndex];
        uint256 prize = pot_jar;
        pot_jar = 0;
        pending_claims[winner] += prize;
        winners_list[run_number] = winner;
        emit WinnerPicked(winner, prize);
        reset();
    }

    function reset() internal {
        run_number += 1;
        winnerWasPicked = false;
        allowEntry = true;
    }

    function claimPrize() external returns (bool) {
        require(pending_claims[msg.sender] > 0, "You have no prizes to collect.");
        uint256 earnings = pending_claims[msg.sender];
        pending_claims[msg.sender] = 0;
        payable(msg.sender).transfer(earnings);
        return true;
    }

    function collectFees() external returns (bool) {
        require(msg.sender == minter, "Only the contract owner can collect the fees.");
        require(fees_jar > 0, "No fees to collect.");
        uint256 fees_to_collect = fees_jar;
        fees_jar = 0;
        minter.transfer(fees_to_collect);
        return true;
    }

    receive() external payable {
        this.join();
    }
}
