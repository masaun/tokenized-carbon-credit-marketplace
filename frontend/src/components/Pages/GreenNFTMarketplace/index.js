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
          greenNFTMetadatas: []
        }

        this.handleGreenNFT = this.handleGreenNFT.bind(this)
        this.handleOrderOfCarbonCredits = this.handleOrderOfCarbonCredits.bind(this)
        this.buyCarbonCredits = this.buyCarbonCredits.bind(this)
    }

    ///--------------------------
    /// Handler
    ///-------------------------- 
    handleGreenNFT(event) {
        this.setState({ valueGreenNFT: event.target.value });
    }

    handleOrderOfCarbonCredits(event) {
        this.setState({ valueOrderOfCarbonCredits: event.target.value });
    }


    ///---------------------------------
    /// Functions of buying a photo NFT 
    ///---------------------------------
    buyCarbonCredits = async (e) => {
        const { web3, accounts, greenNFTTMarketplace, greenNFTData, valueGreenNFT, valueOrderOfCarbonCredits } = this.state;

        console.log('=== valueGreenNFT ===', valueGreenNFT)
        console.log('=== valueOrderOfCarbonCredits ===', valueOrderOfCarbonCredits)
        //console.log('=== value of buyCarbonCredits ===', e.target.value)

        const GREEN_NFT = valueGreenNFT
        //const GREEN_NFT = e.target.value
        const orderOfCarbonCredits = web3.utils.toWei(valueOrderOfCarbonCredits, 'ether')
        const ethAmountToBuyCarbonCredits = await greenNFTTMarketplace.methods.getPurchaseAmountOfCarbonCredits(GREEN_NFT, orderOfCarbonCredits).call()
        this.setState({ valueOrderOfCarbonCredits: "" })

        /// Get instance by using created GreenNFT address
        let GreenNFT = {};
        GreenNFT = require("../../../../../smart-contract/build/contracts/GreenNFT.json")
        let greenNFT = new web3.eth.Contract(GreenNFT.abi, GREEN_NFT)

        const txReceipt = await greenNFTTMarketplace.methods.buyCarbonCredits(GREEN_NFT, orderOfCarbonCredits).send({ from: accounts[0], value: ethAmountToBuyCarbonCredits })
        console.log('=== response of buyCarbonCredits ===', txReceipt)
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
              <h2>Green NFT (Carbon Credits) MarketPlace</h2>

              <Card width={"360px"} 
                        maxWidth={"360px"} 
                        mx={"auto"} 
                        my={5} 
                        p={20} 
                        borderColor={"#E8E8E8"}
              >
                    <h2>Buy Carbon Credits</h2>

                    <Field label="Green NFT's address">
                        <Input
                            type="text"
                            width={1}
                            placeholder="e.g) 0x0224588b20e1042264F0B55687cEAA450EEfc300"
                            required={true}
                            value={this.state.valueGreenNFT} 
                            onChange={this.handleGreenNFT}                                        
                        />
                    </Field>

                    <Field label="Order of carbon credits">
                        <Input
                            type="text"
                            width={1}
                            placeholder="e.g) 10"
                            required={true}
                            value={this.state.valueOrderOfCarbonCredits} 
                            onChange={this.handleOrderOfCarbonCredits}                                        
                        />
                    </Field>

                    <Button size={'medium'} width={1} onClick={this.buyCarbonCredits}> Buy Carbon Credits </Button>

                    <span style={{ padding: "5px" }}></span>
              </Card>

              { greenNFTMetadatas.map((greenNFTMetadata, key) => {
                return (
                  <div key={key} className="">
                    <div className={styles.widgets}>
                        { currentAccount != greenNFTMetadata.projectOwner && greenNFTMetadata.greenNFTStatus == "1" ?
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

                                <p>Issued by (Auditor): { greenNFTMetadata.auditor }</p>

                                <p>Issued to (Project Owner): { greenNFTMetadata.projectOwner }</p>

                                <p>Issued at (Timestamp): { 
                                    `${ new Date(Number(greenNFTMetadata.timestampOfissuedDate) * 1000).getFullYear() }` + "/" +
                                    `${ new Date(Number(greenNFTMetadata.timestampOfissuedDate) * 1000).getMonth() + 1 }` + "/" +
                                    `${ new Date(Number(greenNFTMetadata.timestampOfissuedDate) * 1000).getDate() }` + " " +
                                    `${ new Date(Number(greenNFTMetadata.timestampOfissuedDate) * 1000).getHours() }` + ":" +
                                    `${ new Date(Number(greenNFTMetadata.timestampOfissuedDate) * 1000).getMinutes() }` + ":" +
                                    `${ new Date(Number(greenNFTMetadata.timestampOfissuedDate) * 1000).getSeconds() }`
                                }</p>

                                <p>Verification period is started from: { 
                                    `${ new Date(Number(greenNFTMetadata.startOfPeriod) * 1000).getFullYear() }` + "/" +
                                    `${ new Date(Number(greenNFTMetadata.startOfPeriod) * 1000).getMonth() + 1 }` + "/" +
                                    `${ new Date(Number(greenNFTMetadata.startOfPeriod) * 1000).getDate() }`
                                }</p>

                                <p>Verification period is ended until: { 
                                    `${ new Date(Number(greenNFTMetadata.endOfPeriod) * 1000).getFullYear() }` + "/" +
                                    `${ new Date(Number(greenNFTMetadata.endOfPeriod) * 1000).getMonth() + 1 }` + "/" +
                                    `${ new Date(Number(greenNFTMetadata.endOfPeriod) * 1000).getDate() }`
                                }</p>

                                <p>Audited Report: <a href={ `https://ipfs.io/ipfs/${greenNFTMetadata.auditedReport}` }>{ greenNFTMetadata.auditedReport }</a></p>

                                {/***** [Todo]: Display the GreenNFTEmissonData struct-related data *****/}

                                {/* <p>CO2 Emissions: { web3.utils.fromWei(`${greenNFTEmissonData.co2Emissions}`, 'ether') } ETH</p> */}

                                {/* <p>CO2 Reductions: { web3.utils.fromWei(`${greenNFTEmissonData.co2Reductions}`, 'ether') } ETH</p> */}

                                {/* <p>Carbon Credits: { web3.utils.fromWei(`${greenNFTEmissonData.carbonCredits}`, 'ether') } ETH</p> */}

                                {/* <p>Buyable Carbon Credits: { web3.utils.fromWei(`${greenNFTEmissonData.buyableCarbonCredits}`, 'ether') } ETH</p> */}

                                <br />

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
