import React, { useState } from 'react';

const Manage = ({ teams, teamWrapper, account }) => {
  const [inputValues, setInputValues] = useState({});

  const handleChange = (event, teamIndex, funcName, paramName) => {
    setInputValues({
      ...inputValues,
      [teamIndex]: {
        ...inputValues[teamIndex],
        [funcName]: { ...inputValues[teamIndex]?.[funcName], [paramName]: event.target.value },
      },
    });
  };

  const handleFunctionClick = async (teamIndex, funcName) => {
    try {
      const funcArgs = inputValues[teamIndex]?.[funcName];
      const argsArray = funcArgs ? Object.values(funcArgs) : [];
  
      const result = await teamWrapper[funcName](account, ...argsArray, teams[teamIndex].contractInstance);
      console.log(`Function ${funcName} result:`, result);
    } catch (error) {
      console.error(`Error executing ${funcName}:`, error);
    }
  };

  const renderInput = (teamIndex, funcName, paramName, label) => (
    <div key={paramName}>
      <label htmlFor={`${teamIndex}-${funcName}-${paramName}`}>{label}:</label>
      <input
        type="text"
        id={`${teamIndex}-${funcName}-${paramName}`}
        name={paramName}
        value={inputValues[teamIndex]?.[funcName]?.[paramName] || ''}
        onChange={(event) => handleChange(event, teamIndex, funcName, paramName)}
      />
    </div>
  );

  const renderFunction = (teamIndex, funcName, params) => (
    <div key={funcName} className="TeamsForm">
      <h4>Function {funcName}</h4>
      {params.map(([paramName, label]) => renderInput(teamIndex, funcName, paramName, label))}
      <button onClick={() => handleFunctionClick(teamIndex, funcName, params.map(([paramName]) => inputValues[teamIndex]?.[funcName]?.[paramName]))}>
        Execute
      </button>
    </div>
  );

  const renderFunctions = (teamIndex) => {
    const functionsToRender = {
      requestToJoinTeam: [['providedCode', 'Provided Code']],
      updateJoinCode: [['newJoinCode', 'New Join Code']],
      updateMinimumParticipation: [['newMinimumParticipation', 'New Minimum Participation']],
      registerVoter: [['voter', 'Voter Address']],
      excludeVoter: [['voter', 'Voter Address']],
      addVotingOption: [['optionName', 'OptionName Name']],
      removeVotingOption: [['optionIndex', 'Option Index']],
      updateOptionName: [['optionIndex', 'Option Index'], ['newName', 'New Name']],
      vote: [['option', 'Option Index']],
      winningOption: [],
      optionStatus: [['optionIndex', 'Option Index']],
      votingPeriodStatus: [],
      closeVotingSessionEarly: [],
      tieHandler: [['optionId', 'Option ID']],
      finishVotingSession: [],
      
    };

    return Object.entries(functionsToRender).map(([funcName, params]) => renderFunction(teamIndex, funcName, params));
  };

  return (
    <div>
      <h2>Manage</h2>
      {teams.map((team, index) => (
        <div key={index}>
          <h3>{team.teamName}</h3>
          <p>Options: {team.optionNames.join(', ')}</p>
          <p>End Time: {team.timeLimit}</p>
          <p>Minimum Participation: {team.minimumVoterParticipation}</p>
          <p>Join Code: {team.joinCode}</p>
          {renderFunctions(index)}
        </div>
      ))}
    </div>
  );
};

export default Manage;