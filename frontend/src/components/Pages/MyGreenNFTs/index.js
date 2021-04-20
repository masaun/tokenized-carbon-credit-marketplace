import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../../utils/getWeb3";

import { Loader, Button, Card, Input, Table, Form, Field, Image } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../../config/webpack';

import styles from '../../../App.module.scss';


export default class MyGreenNFTs extends Component {
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
          greenNFTMetadatas: []
        };


        this.openToPutOnSale = this.openToPutOnSale.bind(this);
        this.cancelToPutOnSale = this.cancelToPutOnSale.bind(this);
    }

    ///--------------------------
    /// Handler
    ///-------------------------- 
    // handleGreenNFTAddress(event) {
    //     this.setState({ valueGreenNFTAddress: event.target.value });
    // }


    ///---------------------------------------------------------
    /// Functions put a photo NFT on sale or cancel it on sale 
    ///---------------------------------------------------------
    openToPutOnSale = async (e) => {
        const { web3, accounts, greenNFTTMarketplace, greenNFTData, carbonCreditToken, GREEN_NFT_MARKETPLACE, GREEN_NFT_DATA } = this.state;

        console.log('=== value of openToPutOnSale ===', e.target.value);
        console.log('=== GREEN_NFT_MARKETPLACE ===', GREEN_NFT_MARKETPLACE);

        const GREEN_NFT = e.target.value;

        /// Get instance by using created GreenNFT address
        let GreenNFT = {};
        GreenNFT = require("../../../../../smart-contract/build/contracts/GreenNFT.json"); 
        let greenNFT = new web3.eth.Contract(GreenNFT.abi, GREEN_NFT);
            
        /// Get amount of carbon credits
        const greenNFTEmissonData = await greenNFTData.methods.getGreenNFTEmissonDataByNFTAddress(GREEN_NFT).call()
        console.log('=== greenNFTEmissonData ===', greenNFTEmissonData)
        const _carbonCredits = greenNFTEmissonData.carbonCredits

        /// Approve the locked-CCTs amount
        let txReceipt1 = await carbonCreditToken.approve(GREEN_NFT_MARKETPLACE, _carbonCredits).send({ from: accounts[0] })

        /// Open to put on sale
        let txReceipt2 = await greenNFTTMarketplace.methods.openToPutOnSale(GREEN_NFT_DATA, GREEN_NFT).send({ from: accounts[0] })
        console.log('=== response of openToPutOnSale ===', txReceipt2)
    }

    cancelToPutOnSale = async (e) => {
        const { web3, accounts, greenNFTTMarketplace, greenNFTData, GREEN_NFT_MARKETPLACE, GREEN_NFT_DATA } = this.state;

        console.log('=== value of cancelToPutOnSale ===', e.target.value);

        const GREEN_NFT = e.target.value;

        /// Get instance by using created GreenNFT address
        let GreenNFT = {};
        GreenNFT = require("../../../../../smart-contract/build/contracts/GreenNFT.json"); 
        let greenNFT = new web3.eth.Contract(GreenNFT.abi, GREEN_NFT);
            
        /// Cancel to put on sale
        const txReceipt = await greenNFTTMarketplace.methods.cancelToPutOnSale(GREEN_NFT_DATA, GREEN_NFT).send({ from: accounts[0] });
        console.log('=== response of cancelToPutOnSale ===', txReceipt);
    }


    ///------------------------------------- 
    /// NFT（Always load listed NFT data）
    ///-------------------------------------
    getGreenNFTMetadatas = async () => {
        const { greenNFTData } = this.state

        const greenNFTMetadatas = await greenNFTData.methods.getGreenNFTMetadatas().call()
        console.log('=== greenNFTMetadatas ===', greenNFTMetadatas)

        this.setState({ greenNFTMetadatas: greenNFTMetadatas })
        return greenNFTMetadatas
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
     
        let GreenNFTTMarketplace = {}
        let GreenNFTData = {}
        let CarbonCreditToken = {}
        try {
          GreenNFTTMarketplace = require("../../../../../smart-contract/build/contracts/GreenNFTMarketplace.json")
          GreenNFTData = require("../../../../../smart-contract/build/contracts/GreenNFTData.json")
          CarbonCreditToken = require("../../../../../smart-contract/build/contracts/CarbonCreditToken.json")
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
            let instanceCarbonCreditToken = null;
            let GREEN_NFT_MARKETPLACE;
            let GREEN_NFT_DATA;
            let deployedNetwork = null;

            // Create instance of contracts
            if (GreenNFTTMarketplace.networks) {
              deployedNetwork = GreenNFTTMarketplace.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceGreenNFTTMarketplace = new web3.eth.Contract(
                  GreenNFTTMarketplace.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                GREEN_NFT_MARKETPLACE = deployedNetwork.address;
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
                GREEN_NFT_DATA = deployedNetwork.address;
                console.log('=== instanceGreenNFTData ===', instanceGreenNFTData);
              }
            }

            if (CarbonCreditToken.networks) {
              deployedNetwork = CarbonCreditToken.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceCarbonCreditToken = new web3.eth.Contract(
                  CarbonCreditToken.abi,
                  deployedNetwork && deployedNetwork.address,
                )
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
                    greenNFTData: instanceGreenNFTData,
                    carbonCreditToken: instanceCarbonCreditToken,
                    GREEN_NFT_MARKETPLACE: GREEN_NFT_MARKETPLACE,
                    GREEN_NFT_DATA: GREEN_NFT_DATA }, () => {
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
            const greenNFTMetadatas = await this.getGreenNFTMetadatas()
            this.setState({ greenNFTMetadatas: greenNFTMetadatas })
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
        const { web3, greenNFTMetadatas, currentAccount } = this.state;

        return (
            <div className={styles.contracts}>
              <h2>My Green NFTs</h2>

              { greenNFTMetadatas.map((greenNFTMetadata, key) => {
                return (
                  <div key={key} className="">
                    <div className={styles.widgets}>

                        { currentAccount == greenNFTMetadata.projectOwner ? 
                            <Card width={"360px"} 
                                    maxWidth={"360px"} 
                                    mx={"auto"} 
                                    my={5} 
                                    p={20} 
                                    borderColor={"#E8E8E8"}
                            >
                              <span style={{ padding: "20px" }}></span>

                              <p>Project ID: { greenNFTMetadata.projectId }</p>

                              <p>Claim ID: { greenNFTMetadata.claimId }</p>

                              <p>Green NFT: { greenNFTMetadata.greenNFT }</p>

                              <p>Project Owner: { greenNFTMetadata.projectOwner }</p>

                              <p>Auditor: { greenNFTMetadata.auditor }</p>

                              <p>Audited Report: <a href={ `https://ipfs.io/ipfs/${greenNFTMetadata.auditedReport}` }>{ greenNFTMetadata.auditedReport }</a></p>

                              {/***** [Todo]: Display the GreenNFTEmissonData struct-related data *****/}

                              {/* <p>CO2 Emissions: { web3.utils.fromWei(`${greenNFTEmissonData.co2Emissions}`, 'ether') } ETH</p> */}

                              {/* <p>CO2 Reductions: { web3.utils.fromWei(`${greenNFTEmissonData.co2Reductions}`, 'ether') } ETH</p> */}

                              {/* <p>Carbon Credits: { web3.utils.fromWei(`${greenNFTEmissonData.carbonCredits}`, 'ether') } ETH</p> */}

                              {/* <p>Buyable Carbon Credits: { web3.utils.fromWei(`${greenNFTEmissonData.buyableCarbonCredits}`, 'ether') } ETH</p> */}

                              <br />

                              { greenNFTMetadata.greenNFTStatus == "0" || greenNFTMetadata.greenNFTStatus == "2" ? 
                                  <Button size={'medium'} width={1} value={ greenNFTMetadata.greenNFT } onClick={this.openToPutOnSale}> Put on sale </Button>
                              :
                                  <Button size={'medium'} width={1} value={ greenNFTMetadata.greenNFT } onClick={this.cancelToPutOnSale}> Cancel on sale </Button>
                              }

                              <span style={{ padding: "5px" }}></span>
                            </Card>
                        :
                            ''
                        }

                    </div>
                  </div>
                )
              }) }
            </div>
        );
    }
}
