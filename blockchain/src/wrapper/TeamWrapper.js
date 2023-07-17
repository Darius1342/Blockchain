import teamJSON from '../contracts/Team.json';

class TeamWrapper {
  constructor(web3, networkId, contractAddress) {
    this.web3 = web3;
    this.networkId = networkId;
    this.contractAddress = contractAddress || teamJSON.networks[networkId].address;
    this.contract = new this.web3.eth.Contract(teamJSON.abi, this.contractAddress);
    this.teamABI = teamJSON.abi;
    this.teamByteCode = teamJSON.bytecode;
    console.log("Bytecode:", this.teamByteCode); // Add this line
  }

  async requestToJoinTeam(fromAddress, providedCode) {
    return await this.contract.methods.requestToJoinTeam(providedCode).send({ from: fromAddress });
  }

  async updateJoinCode(fromAddress, newJoinCode) {
    return await this.contract.methods.updateJoinCode(newJoinCode).send({ from: fromAddress });
  }

  async updateMinimumParticipation(fromAddress, newMinimumParticipation) {
    return await this.contract.methods.updateMinimumParticipation(newMinimumParticipation).send({ from: fromAddress });
  }

  async registerVoter(fromAddress, voter) {
    return await this.contract.methods.registerVoter(voter).send({ from: fromAddress });
  }

  async excludeVoter(fromAddress, voter) {
    return await this.contract.methods.excludeVoter(voter).send({ from: fromAddress });
  }

  async addVotingOption(fromAddress, optionName) {
    return await this.contract.methods.addVotingOption(optionName).send({ from: fromAddress });
  }

  async removeVotingOption(fromAddress, optionIndex) {
    return await this.contract.methods.removeVotingOption(optionIndex).send({ from: fromAddress });
  }

  async updateOptionName(fromAddress, optionIndex, newName) {
    return await this.contract.methods.updateOptionName(optionIndex, newName).send({ from: fromAddress });
  }


  async vote(fromAddress, option) {
    return await this.contract.methods.vote(option).send({ from: fromAddress });
  }

  async winningOption() {
    return await this.contract.methods.winningOption().call();
  }

  async optionStatus(optionIndex) {
    return await this.contract.methods.optionStatus(optionIndex).call();
  }

  async votingPeriodStatus() {
    return await this.contract.methods.votingPeriodStatus().call();
  }

  async closeVotingSessionEarly(fromAddress) {
    return await this.contract.methods.closeVotingSessionEarly().send({ from: fromAddress });
  }

  async tieHandler(fromAddress, optionId) {
    return await this.contract.methods.tieHandler(optionId).send({ from: fromAddress });
  }
  async removeVoterRight(fromAddress) {
    return await this.contract.methods.removeVoterRight().send({ from: fromAddress });
  }

  async finishVotingSession(fromAddress) {
    return await this.contract.methods.finishVotingSession().send({ from: fromAddress });
  }

  async deployNewTeam(fromAddress, teamName, optionNames, timeLimit, minimumVoterParticipation, joinCode) {
    const contract = new this.web3.eth.Contract(teamJSON.abi);
  
    
    if (!fromAddress || !optionNames || !timeLimit || !minimumVoterParticipation || !joinCode || !teamName) {
      console.error('One or more arguments are undefined');
      return;
    }
  
    const deployArguments = {
      data: this.teamByteCode,
      arguments: [teamName, optionNames, timeLimit, minimumVoterParticipation, joinCode],
      from: fromAddress,
      gas: '3000000', 
    };
    console.log("Team Name:", teamName);
    console.log("Option Names:", optionNames);
    console.log("Deployment arguments:", deployArguments);
  
    try {
      const newContractInstance = await contract.deploy(deployArguments).send({
        from: fromAddress,
        gas: '3000000', 
      });
    
      console.log('New team contract deployed at:', newContractInstance.options.address);
      return newContractInstance.options.address;
    } catch (error) {
      console.error('Error deploying team contract:', error);
      throw error;
    }
  }

}



export default TeamWrapper;