import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../../utils/getWeb3";

import { Loader, Button, Card, Input, Table, Form, Field, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../../config/webpack';

import styles from '../../../App.module.scss';


export default class GreenNFTMarketplace extends Component {
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          currentAccount: null,          
          route: window.location.pathname.replace("/", ""),

          /////// NFT
          allGreens: []
        };

        //this.handleGreenNFTAddress = this.handleGreenNFTAddress.bind(this);

        this.buyGreenNFT = this.buyGreenNFT.bind(this);
    }

    ///--------------------------
    /// Handler
    ///-------------------------- 
    // handleGreenNFTAddress(event) {
    //     this.setState({ valueGreenNFTAddress: event.target.value });
    // }


    ///---------------------------------
    /// Functions of buying a photo NFT 
    ///---------------------------------
    buyGreenNFT = async (e) => {
        const { web3, accounts, greenNFTTMarketplace, greenNFTData } = this.state;
        //const { web3, accounts, greenNFTTMarketplace, GreenNFTData, valueGreenNFTAddress } = this.state;

        console.log('=== value of buyGreenNFT ===', e.target.value);

        const GREEN_NFT = e.target.value;
        //const GREEN_NFT = valueGreenNFTAddress;
        //this.setState({ valueGreenNFTAddress: "" });

        /// Get instance by using created GreenNFT address
        let GreenNFT = {};
        GreenNFT = require("../../../../../smart-contract/build/contracts/GreenNFT.json"); 
        let greenNFT = new web3.eth.Contract(GreenNFT.abi, GREEN_NFT);

        /// Check owner of greenNFTId
        const greenNFTId = 1;  /// [Note]: greenNFTId is always 1. Because each GreenNFT is unique.
        const owner = await greenNFT.methods.ownerOf(greenNFTId).call();
        console.log('=== owner of greenNFTId ===', owner);  /// [Expect]: Owner should be the greenNFTTMarketplace.sol (This also called as a proxy/escrow contract)

        const green = await greenNFTData.methods.getGreenByNFTAddress(GREEN_NFT).call();
        const buyAmount = await green.greenNFTPrice;
        const txReceipt1 = await greenNFTTMarketplace.methods.buyGreenNFT(GREEN_NFT).send({ from: accounts[0], value: buyAmount });
        console.log('=== response of buyGreenNFT ===', txReceipt1);
    }


    ///------------------------------------- 
    /// NFT（Always load listed NFT data）
    ///-------------------------------------
    getAllGreens = async () => {
        const { greenNFTData } = this.state

        const allGreens = await greenNFTData.methods.getAllGreens().call()
        console.log('=== allGreens ===', allGreens)

        this.setState({ allGreens: allGreens })
        return allGreens
    }


    //////////////////////////////////// 
    /// Ganache
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
     
        let GreenNFTTMarketplace = {};
        let GreenNFTData = {};
        try {
          GreenNFTTMarketplace = require("../../../../../smart-contract/build/contracts/GreenNFTMarketplace.json");
          GreenNFTData = require("../../../../../smart-contract/build/contracts/GreenNFTData.json");
        } catch (e) {
          console.log(e);
        }

        try {
          const isProd = process.env.NODE_ENV === 'production';
          if (!isProd) {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            let ganacheAccounts = [];

            try {
              ganacheAccounts = await this.getGanacheAddresses();
            } catch (e) {
              console.log('Ganache is not running');
            }

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const currentAccount = accounts[0];

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instanceGreenNFTTMarketplace = null;
            let instanceGreenNFTData = null;
            let deployedNetwork = null;

            // Create instance of contracts
            if (GreenNFTTMarketplace.networks) {
              deployedNetwork = GreenNFTTMarketplace.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceGreenNFTTMarketplace = new web3.eth.Contract(
                  GreenNFTTMarketplace.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceGreenNFTTMarketplace ===', instanceGreenNFTTMarketplace);
              }
            }

            if (GreenNFTData.networks) {
              deployedNetwork = GreenNFTData.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceGreenNFTData = new web3.eth.Contract(
                  GreenNFTData.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceGreenNFTData ===', instanceGreenNFTData);
              }
            }

            if (instanceGreenNFTTMarketplace) {
                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                this.setState({ 
                    web3, 
                    ganacheAccounts, 
                    accounts, 
                    balance, 
                    networkId, 
                    networkType, 
                    hotLoaderDisabled,
                    isMetaMask, 
                    currentAccount: currentAccount, 
                    greenNFTTMarketplace: instanceGreenNFTTMarketplace,
                    greenNFTData: instanceGreenNFTData }, () => {
                      this.refreshValues(instanceGreenNFTTMarketplace);
                      setInterval(() => {
                        this.refreshValues(instanceGreenNFTTMarketplace);
                    }, 5000);
                });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }

            ///@dev - NFT（Always load listed NFT data
            const allGreens = await this.getAllGreens();
            this.setState({ allGreens: allGreens })
          }
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };

    componentWillUnmount() {
        if (this.interval) {
          clearInterval(this.interval);
        }
    }

    refreshValues = (instanceGreenNFTTMarketplace) => {
        if (instanceGreenNFTTMarketplace) {
          console.log('refreshValues of instanceGreenNFTTMarketplace');
        }
    }

    render() {
        const { web3, allGreens, currentAccount } = this.state;

        return (
            <div className={styles.contracts}>
              <h2>NFT based Photo MarketPlace</h2>

              { allGreens.map((green, key) => {
                return (
                  <div key={key} className="">
                    <div className={styles.widgets}>

                        { currentAccount != green.ownerAddress && green.status == "Open" ?
                            <Card width={"360px"} 
                                      maxWidth={"360px"} 
                                      mx={"auto"} 
                                      my={5} 
                                      p={20} 
                                      borderColor={"#E8E8E8"}
                            >
                                <Image
                                  alt="random unsplash image"
                                  borderRadius={8}
                                  height="100%"
                                  maxWidth='100%'
                                  src={ `https://ipfs.io/ipfs/${green.ipfsHashOfGreenNFT}` }
                                />

                                <span style={{ padding: "20px" }}></span>

                                <p>Photo Name: { green.GreenNFTName }</p>

                                <p>Price: { web3.utils.fromWei(`${green.greenNFTPrice}`, 'ether') } ETH</p>

                                {/* <p>NFT Address: { green.GreenNFT }</p> */}

                                <p>Owner: { green.ownerAddress }</p>

                                {/* <p>Reputation Count: { green.reputation }</p> */}
                                
                                <br />

                                {/* <hr /> */}

                                {/* 
                                <Field label="Please input a NFT Address as a confirmation to buy">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) 0x6d7d6fED69E7769C294DE41a28aF9E118567Bc81"
                                        required={true}
                                        value={this.state.valueGreenNFTAddress} 
                                        onChange={this.handleGreenNFTAddress}                                        
                                    />
                                </Field>
                                */}

                                <Button size={'medium'} width={1} value={ green.greenNFT } onClick={this.buyGreenNFT}> Buy </Button>

                                {/* <Button size={'small'} value={ green.GreenNFT } onClick={this.buyGreenNFT}> Buy </Button> */}

                                {/* <span style={{ padding: "5px" }}></span> */}

                                {/* <Button size={'small'} onClick={this.addReputation}> Rep </Button> */}

                                <span style={{ padding: "5px" }}></span>
                            </Card>
                        :
                            "" 
                        }

                    </div>
                  </div>
                )
              }) }
            </div>
        );
    }
}
