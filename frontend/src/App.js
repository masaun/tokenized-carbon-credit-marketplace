import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "./utils/getWeb3";
import Header from "./components/Header/index.js";
import Footer from "./components/Footer/index.js";
import CreateGreenNFT from "./components/Pages/CreateGreenNFT/index.js";
import MyGreenNFTs from "./components/Pages/MyGreenNFTs/index.js";
import GreenNFTMarketplace from "./components/Pages/GreenNFTMarketplace/index.js";
import ipfs from './components/ipfs/ipfsApi.js'

import { Loader, Button, Card, Input, Heading, Table, Form, Flex, Box, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';

import styles from './App.module.scss';
//import './App.css';


class App extends Component {
  constructor(props) {    
    super(props);

    this.state = {
      /////// Default state
      storageValue: 0,
      web3: null,
      accounts: null,
      route: window.location.pathname.replace("/", ""),
    };
  }
 
  //////////////////////////////////// 
  ///// Ganache
  ////////////////////////////////////
  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  componentDidMount = async () => {
    const hotLoaderDisabled = zeppelinSolidityHotLoaderOptions.disabled;
 
    try {
      /// [Todo]:
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  renderDeployCheck(instructionsKey) {
    return (
      <div className={styles.setup}>
        <div className={styles.notice}>
          Your <b> contracts are not deployed</b> in this network. Two potential reasons: <br />
          <p>
            Maybe you are in the wrong network? Point Metamask to localhost.<br />
            You contract is not deployed. Follow the instructions below.
          </p>
        </div>
      </div>
    );
  }

  renderCreateGreenNFT() {
    return (
      <div className={styles.wrapper}>
        <CreateGreenNFT />
      </div>
    );
  }

  renderMyGreenNFTs() {
    return (
      <div className={styles.wrapper}>
        <MyGreenNFTs />
      </div>
    );
  }

  renderGreenNFTMarketplace() {
    return (
      <div className={styles.wrapper}>
        <GreenNFTMarketplace />
      </div>    
    );
  }

  render() {
    return (
      <div className={styles.App}>
        <Header />
          {this.state.route === 'create-green-nft' && this.renderCreateGreenNFT()}
          {this.state.route === 'my-green-nfts' && this.renderMyGreenNFTs()}
          {this.state.route === 'green-nft-marketplace' && this.renderGreenNFTMarketplace()}
        <Footer />
      </div>
    );
  }
}

export default App;
