const Team = artifacts.require("Team");

module.exports = function (deployer) {
  // List of options.
  const optionNames = ["Option1", "Option 2", "Option 3"];
  //Time limit. It is created one day from now in milliseconds.
  const endTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; 
  // Minimum participation number.
  const minimumParticipation = 1; 
  // Join code.
  const joinCode = "exampleJoinCode";
  // Team name.
  const teamName = "Name of team";
  /* 
  The deployer will deploy the Team contract.

  Then, the Team contract takes the other parameters into the constructor.

  Lastly, the Team contract is deployed on the blockchain with these parameters.
  
  */
  deployer.deploy(Team,teamName, optionNames, endTime, minimumParticipation, joinCode);
};