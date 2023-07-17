// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
contract Team {
                address public teamOwner;
                string public teamName;
                uint256 public totalParticipants;
                uint256 public voterParticipation;
                Option[] public options;
                bool public isVotingSessionOpen;
                uint public timeLimit;
                uint public minimumVoterParticipation;
                string public joinCode;
                mapping(address => Voter) public voters;
                mapping(address => bool) public voterRegistry;
                mapping(address => bool) public isEligible;
                struct Voter {
                    uint256 weight;
                    bool hasVoted;
                    uint256 voteChoice;
                }

                struct Option {
                    string name;
                    uint256 voteCount;
                    uint timeLimit;
                }

                struct OptionResult {
                    string name;
                    uint256 voteCount;
                    bool isWinner;
                }


                modifier teamOwnerModifier {
                    require(msg.sender == teamOwner, "You can only call this function if you are the team owner.");
                    _;
                }

                event votingPeriodEnded(address owner);
                event isTieBeingHandled(uint256 optionId);
                event removedVoterRights(address voter);
                event periodEnded();

                constructor(string memory _teamName, string[] memory optionNames, uint _timeLimit, uint _minimumVoterParticipation, string memory _joinCode) {
                    teamOwner = msg.sender;
                    teamName = _teamName;
                    voterRegistry[teamOwner] = true;
                    voters[teamOwner].weight = 1;
                    isVotingSessionOpen = true;
                    timeLimit = _timeLimit;
                    minimumVoterParticipation = _minimumVoterParticipation;
                    joinCode = _joinCode;
                    for (uint256 i = 0; i < optionNames.length; i++) {
                        options.push(Option({name: optionNames[i], voteCount: 0, timeLimit: _timeLimit}));
                    }
                }

                
                

            function requestToJoinTeam(string memory providedCode) public {
                require(!isEligible[msg.sender], "You have already joined this team.");
                require(keccak256(abi.encodePacked(providedCode)) == keccak256(abi.encodePacked(joinCode)), "Invalid join code.");

                isEligible[msg.sender] = true;
                }

                function updateJoinCode(string memory newJoinCode) public teamOwnerModifier {
                joinCode = newJoinCode;
            }

                function updateMinimumParticipation(uint newMinimumParticipation) public teamOwnerModifier {
                minimumVoterParticipation = newMinimumParticipation;
            }

                function registerVoter(address voter) public teamOwnerModifier {
                    require(!voterRegistry[voter], "The voter is already registered in the team.");
                    isEligible[voter] = true;
                }

                function excludeVoter(address voter) public teamOwnerModifier {
                    require(voterRegistry[voter], "The voter is not registered in the team.");
                    isEligible[voter] = false;
                }

                function addVotingOption(string memory optionName) public teamOwnerModifier {
                    require(isVotingSessionOpen, "The voting session is closed.");
                    options.push(Option({name: optionName, voteCount: 0, timeLimit: timeLimit}));
                }
                function removeVotingOption(uint256 optionIndex) public teamOwnerModifier {
                    require(isVotingSessionOpen, "The voting session is closed.");
                    require(optionIndex < options.length, "Invalid option index.");
                    for (uint256 i = optionIndex; i < options.length - 1; i++) {
                        options[i] = options[i + 1];
                    }
                    options.pop();
                }

                function updateOptionName(uint256 optionIndex, string memory newName) public teamOwnerModifier {
                require(isVotingSessionOpen, "The voting session is closed.");
                require(optionIndex < options.length, "Invalid option index.");
                options[optionIndex].name = newName;
            }
            function totalOptions() public view returns (uint256) {
                return options.length;
            }

            function checkIfEligible(address voter) public view returns (bool) {
                    return isEligible[voter];
                }
                function vote(uint256 option) public {
                    require(isVotingSessionOpen, "The voting session is closed.");
                    require(options[option].timeLimit >= block.timestamp, "This option voting period has ended.");
                    Voter storage sender = voters[msg.sender];
                    require(voterRegistry[msg.sender], "You are not a registered voter.");
                    require(!sender.hasVoted, "You already voted.");
                    require(option < options.length, "Invalid option.");

                    sender.hasVoted = true;
                    sender.voteChoice = option;
                    options[option].voteCount += sender.weight;
                    voterParticipation++;
                }
                

                function winningOption() public view returns (uint256 winningOptionIndex) {
                    require(!isVotingSessionOpen, "The voting period is still open.");
                    uint256 counterForVoteWinner = 0;
                    uint256 i = 0;
                    for (i;i < options.length; i++) {
                        if (options[i].voteCount > counterForVoteWinner) {
                            counterForVoteWinner = options[i].voteCount;
                            winningOptionIndex = i;
                        }
                    }
                }

                function optionStatus(uint256 optionIndex) public view returns (string memory name, uint256 voteCount, uint _timeLimit) {
                require(optionIndex < options.length, "Invalid option index.");
                Option storage option = options[optionIndex];
                return (option.name, option.voteCount, option.timeLimit);
            }

            function votingPeriodStatus() public view returns (bool) {
                return isVotingSessionOpen;
            }

                function closeVotingSessionEarly() public teamOwnerModifier {
                    require(isVotingSessionOpen, "The voting period is already closed.");
                    isVotingSessionOpen = false;
                    emit votingPeriodEnded(msg.sender);
                }


                modifier checkVotingPeriodTime {
                    if (block.timestamp >= timeLimit) {
                        isVotingSessionOpen = false;
                        emit votingPeriodEnded(teamOwner);
                    }
                    _;
                }


                function tieHandler(uint256 optionId) public teamOwnerModifier {
                    require(!isVotingSessionOpen, "The voting period is still open.");
                    options[optionId].timeLimit += 24 hours;
                    emit isTieBeingHandled(optionId);
                }

            

                function removeVoterRight() public {
                    require(isVotingSessionOpen, "The voting session is closed.");
                    Voter storage sender = voters[msg.sender];
                    require(sender.hasVoted, "You have not voted yet."); 
                    uint256 votedOption = sender.voteChoice;
                    options[votedOption].voteCount -= sender.weight;
                    sender.hasVoted = false;
                    voterParticipation--;
                    emit removedVoterRights(msg.sender);
                }
                
                function finishVotingSession() public teamOwnerModifier {
                    require(isVotingSessionOpen, "The voting period is already closed.");
                    require(voterParticipation * 100 / totalParticipants >= minimumVoterParticipation, "Minimum participation  not reached.");
                    isVotingSessionOpen = false;
                    emit periodEnded();
                }
}