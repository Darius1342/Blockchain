import React, { Component } from "react";
import TeamsForm from "./TeamsForm";


class TeamsPage extends Component {
  createTeam = async (teamData) => {
    const teamWrapper = this.props.teamWrapper;
    const account = this.props.account;
    
    // Destructure properties from the teamData object
    const {  teamName, optionNames, timeLimit, minimumVoterParticipation, createJoinCode  } = teamData;

    // Split the optionNames string into an array of strings
    const optionNamesArray = optionNames.split(",").map(name => name.trim());
    console.log("optionNamesArray:", optionNamesArray);

    try {
      // Pass the properties as individual arguments
      const newContractAddress = await teamWrapper.deployNewTeam(account,teamName, optionNamesArray, Number(timeLimit), Number(minimumVoterParticipation), createJoinCode);
      console.log("Team created");
      const newTeam = {
        contractAddress: newContractAddress,
        teamName: teamName,
        optionNames: optionNamesArray,
        timeLimit: timeLimit,
        minimumVoterParticipation: minimumVoterParticipation,
        joinCode: createJoinCode,
      };
      this.props.addTeam(newTeam);
    } catch (error) {
      console.error("Error creating team:", error);
    }
    
  };

  joinTeam = async (joinCode) => {
    const { teamWrapper, account } = this.props;
    try {
      await teamWrapper.requestToJoinTeam(account, joinCode);
      console.log("Joined team");
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  render() {
    console.log("Props received by TeamsPage:", this.props);
    return (
      <div>
        <h2>Teams</h2>
        <TeamsForm createTeam={this.createTeam} joinTeam={this.joinTeam} />
      </div>
    );
  }
}

export default TeamsPage;