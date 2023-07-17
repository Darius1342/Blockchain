import React, { Component } from "react";
import Web3 from "web3";
import teamJSON from "./contracts/Team.json";
import TeamWrapper from "./wrapper/TeamWrapper";
import HomePage from "./components/HomePage";
import InfoPage from "./components/InfoPage";
import TeamsPage from "./components/TeamsPage";
import NavBar from "./components/NavBar";
import "./App.css";
import Manage from "./components/Manage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      ethBalance: 0,
      contract: null,
      teamWrapper: null,
      joinedTeams: [],
      networkError: false,
      currentPage: "home",
      web3: null,
    };
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    let web3;

    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }

    this.setState({ web3 });
  }

  async loadBlockchainData() {
    const { web3 } = this.state;
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts", accounts);
    accounts.forEach((account, index) => {
      console.log(`Account ${index}:`, account, " is valid?", web3.utils.isAddress(account));
    });
    this.setState({ account: accounts[0] });

    if (web3.utils.isAddress(accounts[0])) {
      console.log("Getting balance for account:", accounts[0]);
      const ethBalance = await web3.eth.getBalance(accounts[0]);
      this.setState({ ethBalance });
    } else {
      console.error("Invalid address:", accounts[0]);
    }

    const idOfNetwork = await web3.eth.net.getId();
    const dataOfNetwork = teamJSON.networks[idOfNetwork];

    if (dataOfNetwork) {
      const contract = new web3.eth.Contract(
        teamJSON.abi,
        dataOfNetwork.address
      );
      const teamWrapper = new TeamWrapper(web3, idOfNetwork, dataOfNetwork.address);
      this.setState({ contract, teamWrapper });
    } else {
      this.setState({ networkError: true });
      window.alert("The contract has not been deployed to the blockchain network.");
    }
  }

  changePage = (page) => {
    this.setState({ currentPage: page });
  };

  addTeam = (newTeam) => {
    this.setState((prevState) => ({
      joinedTeams: [...prevState.joinedTeams, newTeam],
    }));
  };

  render() {
    if (this.state.networkError) {
      return (
        <div>
          <h1>Error: Please connect to the correct Ethereum network.</h1>
        </div>
      );
    }

    let currentPageComponent;
    switch (this.state.currentPage) {
      case "home":
        currentPageComponent = (
          <HomePage
            account={this.state.account}
            changePage={this.changePage}
            teamWrapper={this.state.teamWrapper}
          />
        );
        break;
      case "info":
        currentPageComponent = (
          <InfoPage
            account={this.state.account}
            ethBalance={this.state.ethBalance}
            changePage={this.changePage}
            web3={this.state.web3}
            privateKey={this.state.privateKey}
          />
        );
        break;
        case "teams":
          currentPageComponent = (
            <TeamsPage
              account={this.state.account}
              teamWrapper={this.state.teamWrapper}
              changePage={this.changePage}
              addTeam={this.addTeam}
            />
          );
          break;
        case "manage":
          currentPageComponent = (
            <Manage
            teams={this.state.joinedTeams}
            teamWrapper={this.state.teamWrapper}
            account={this.state.account}
            />
          )
        break;
        default:
          currentPageComponent = <div>Error: Invalid page</div>;
  }



  return (
    <div className="App">
      <header>
        <h1>Ethereum Based Voting System</h1>
        <NavBar changePage={this.changePage} />
      </header>
  
      <main>{currentPageComponent}</main>
  
      <footer>
        <p>Copyright -  Darius Pop Sebastian</p>
      </footer>
    </div>
  );
}
}

export default App;