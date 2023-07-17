import React, { Component } from "react";

class TeamsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinCode: "",
      optionNames: "",
      timeLimit: "",
      minimumVoterParticipation: "",
      createJoinCode: "",
      teamName: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="TeamsForm">
        <h3>Create Team</h3>
        <br></br>
        
        <form
          onSubmit={(event) => {
            event.preventDefault();
            this.props.createTeam(this.state);
          }}
        >
          <label htmlFor="teamName">Team Name:</label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={this.state.teamName}
            onChange={this.handleChange}
          />
          <label htmlFor="optionNames">Option Names (comma separated):</label>
          <input
            type="text"
            id="optionNames"
            name="optionNames"
            value={this.state.optionNames}
            onChange={this.handleChange}
          />
          <label htmlFor="timeLimit">Time Limit:</label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={this.state.timeLimit}
            onChange={this.handleChange}
          />
          <label htmlFor="minimumVoterParticipation">Minimum Voter Participation:</label>
          <input
            type="number"
            id="minimumVoterParticipation"
            name="minimumVoterParticipation"
            value={this.state.minimumVoterParticipation}
            onChange={this.handleChange}
          />
          <label htmlFor="createJoinCode">Join Code:</label>
          <input
            type="text"
            id="createJoinCode"
            name="createJoinCode"
            value={this.state.createJoinCode}
            onChange={this.handleChange}
          />
          <br></br>
          <button type="submit">Create Team</button>
          
        </form>
          <br></br>
          <br></br>
          <br></br>
        <h3>Join Team</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            this.props.joinTeam(this.state.joinCode);
          }}
        >
          <label htmlFor="joinCode">Join Code:</label>
          <input
            type="text"
            id="joinCode"
            name="joinCode"
            value={this.state.joinCode}
            onChange={this.handleChange}
          />
          <br></br>
          <button type="submit">Join Team</button>
        </form>
      </div>
    );
  }
}

export default TeamsForm;