import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../../utils/getWeb3";
import ipfs from '../../ipfs/ipfsApi.js'

import { Grid } from '@material-ui/core';
import { Loader, Button, Card, Input, Heading, Table, Form, Field } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../../config/webpack';

import styles from '../../../App.module.scss';


export default class Register extends Component {
    constructor(props) {    
        super(props);

        this.state = {
          /////// Default state
          storageValue: 0,
          web3: null,
          accounts: null,
          route: window.location.pathname.replace("/", ""),

          /////// NFT concern
          valueNFTName: '',
          valueNFTSymbol: '',
          valuegreenNFTPrice: '',

          /////// Ipfs Upload
          buffer: null,
          ipfsHash: ''
        };

        /////// Handle
        this.handleNFTName = this.handleNFTName.bind(this);
        this.handleNFTSymbol = this.handleNFTSymbol.bind(this);
        this.handlegreenNFTPrice = this.handlegreenNFTPrice.bind(this);

        /////// Ipfs Upload
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    ///--------------------------
    /// Handler
    ///-------------------------- 
    handleNFTName(event) {
        this.setState({ valueNFTName: event.target.value });
    }

    handleNFTSymbol(event) {
        this.setState({ valueNFTSymbol: event.target.value });
    }

    handlegreenNFTPrice(event) {
        this.setState({ valuegreenNFTPrice: event.target.value });
    }

    ///--------------------------
    /// Functions of ipfsUpload 
    ///-------------------------- 
    captureFile(event) {
        event.preventDefault()
        const file = event.target.files[0]
        
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)  // Read bufffered file

        // Callback
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('=== buffer ===', this.state.buffer)
        }
    }
      
    onSubmit(event) {
        const { web3, accounts, greenNFTFactory, greenNFTTMarketplace, GREEN_NFT_MARKETPLACE, valueNFTName, valueNFTSymbol, valuegreenNFTPrice } = this.state;

        event.preventDefault()

        ipfs.files.add(this.state.buffer, (error, result) => {
          // In case of fail to upload to IPFS
          if (error) {
            console.error(error)
            return
          }

          // In case of successful to upload to IPFS
          this.setState({ ipfsHash: result[0].hash });
          console.log('=== ipfsHash ===', this.state.ipfsHash);

          const nftName = valueNFTName;
          const nftSymbol = "NFT-MARKETPLACE";  /// [Note]: All NFT's symbol are common symbol
          //const nftSymbol = valueNFTSymbol;
          const _greenNFTPrice = valuegreenNFTPrice;
          console.log('=== nftName ===', nftName);
          console.log('=== nftSymbol ===', nftSymbol);
          console.log('=== _greenNFTPrice ===', _greenNFTPrice);
          this.setState({ 
            valueNFTName: '',
            valueNFTSymbol: '',
            valuegreenNFTPrice: ''
          });

          //let GREEN_NFT;  /// [Note]: This is a GreenNFT address created
          const greenNFTPrice = web3.utils.toWei(_greenNFTPrice, 'ether');
          const ipfsHashOfGreenNFT = this.state.ipfsHash;
          greenNFTFactory.methods.createNewGreenNFT(nftName, nftSymbol, greenNFTPrice, ipfsHashOfGreenNFT).send({ from: accounts[0] })
          .once('receipt', (receipt) => {
            console.log('=== receipt ===', receipt);

            const GREEN_NFT = receipt.events.GreenNFTCreated.returnValues.greenNFT;
            console.log('=== GREEN_NFT ===', GREEN_NFT);

            /// Get instance by using created GreenNFT address
            let GreenNFT = {};
            GreenNFT = require("../../../../../smart-contract/build/contracts/GreenNFT.json"); 
            let greenNFT = new web3.eth.Contract(GreenNFT.abi, GREEN_NFT);
            console.log('=== greenNFT ===', greenNFT);
     
            /// Check owner of greenNFTId==1
            const greenNFTId = 1;  /// [Note]: greenNFTId is always 1. Because each GreenNFT is unique.
            greenNFT.methods.ownerOf(greenNFTId).call().then(owner => console.log('=== owner of greenNFTId 1 ===', owner));
            
            /// [Note]: Promise (nested-structure) is needed for executing those methods below (Or, rewrite by async/await)
            greenNFT.methods.approve(GREEN_NFT_MARKETPLACE, greenNFTId).send({ from: accounts[0] }).once('receipt', (receipt) => {
                /// Put on sale (by a seller who is also called as owner)
                greenNFTTMarketplace.methods.openTradeWhenCreateNewGreenNFT(GREEN_NFT, greenNFTId, greenNFTPrice).send({ from: accounts[0] }).once('receipt', (receipt) => {})
            })
          })
        })
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
     
        let GreenNFTFactory = {};
        let GreenNFTTMarketplace = {};
        try {
          GreenNFTFactory = require("../../../../../smart-contract/build/contracts/GreenNFTFactory.json"); // Load ABI of contract of greenNFTFactory
          GreenNFTTMarketplace = require("../../../../../smart-contract/build/contracts/GreenNFTMarketplace.json");
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
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instanceGreenNFTFactory = null;
            let instanceGreenNFTTMarketplace = null;
            let GREEN_NFT_MARKETPLACE;
            let deployedNetwork = null;

            // Create instance of contracts
            if (GreenNFTFactory.networks) {
              deployedNetwork = GreenNFTFactory.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceGreenNFTFactory = new web3.eth.Contract(
                  GreenNFTFactory.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                console.log('=== instanceGreenNFTFactory ===', instanceGreenNFTFactory);
              }
            }

            if (GreenNFTTMarketplace.networks) {
              deployedNetwork = GreenNFTTMarketplace.networks[networkId.toString()];
              if (deployedNetwork) {
                instanceGreenNFTTMarketplace = new web3.eth.Contract(
                  GreenNFTTMarketplace.abi,
                  deployedNetwork && deployedNetwork.address,
                );
                GREEN_NFT_MARKETPLACE = deployedNetwork.address;
                console.log('=== instanceGreenNFTTMarketplace ===', instanceGreenNFTTMarketplace);
                console.log('=== GREEN_NFT_MARKETPLACE ===', GREEN_NFT_MARKETPLACE);
              }
            }

            if (instanceGreenNFTFactory) {
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
                    greenNFTFactory: instanceGreenNFTFactory,
                    greenNFTTMarketplace: instanceGreenNFTTMarketplace, 
                    GREEN_NFT_MARKETPLACE: GREEN_NFT_MARKETPLACE }, () => {
                      this.refreshValues(instanceGreenNFTFactory);
                      setInterval(() => {
                        this.refreshValues(instanceGreenNFTFactory);
                    }, 5000);
                });
            }
            else {
              this.setState({ web3, ganacheAccounts, accounts, balance, networkId, networkType, hotLoaderDisabled, isMetaMask });
            }
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

    refreshValues = (instanceGreenNFTFactory) => {
        if (instanceGreenNFTFactory) {
          console.log('refreshValues of instanceGreenNFTFactory');
        }
    }

    render()  {
        return (
            <div className={styles.left}>
                <Grid container style={{ marginTop: 20 }}>
                    <Grid item xs={10}>
                        <Card width={"420px"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h2>Register a project</h2>

                            <Form onSubmit={this.onSubmit}>
                                <Field label="Project Name">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) The National Planting Organization"
                                        required={true}
                                        value={this.state.valueNFTName} 
                                        onChange={this.handleNFTName} 
                                    />
                                </Field> 

                                <Field label="CO2 Emissions">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) 50"
                                        required={true}
                                        value={this.state.valuegreenNFTPrice} 
                                        onChange={this.handlegreenNFTPrice}                                        
                                    />
                                </Field>

                                <Button size={'medium'} width={1} type='submit'>Register a project</Button>
                            </Form>
                        </Card>
                    </Grid>

                    <Grid item xs={1}>
                    </Grid>

                    <Grid item xs={1}>
                    </Grid>
                </Grid>

                <Grid container style={{ marginTop: 20 }}>
                    <Grid item xs={10}>
                        <Card width={"420px"} 
                              maxWidth={"420px"} 
                              mx={"auto"} 
                              my={5} 
                              p={20} 
                              borderColor={"#E8E8E8"}
                        >
                            <h2>Register a auditor</h2>

                            <Form onSubmit={this.onSubmit}>
                                <Field label="Auditor address">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) Art NFT Token"
                                        required={true}
                                        value={this.state.valueNFTName} 
                                        onChange={this.handleNFTName} 
                                    />
                                </Field> 

                                <Button size={'medium'} width={1} type='submit'>Register a auditor</Button>
                            </Form>
                        </Card>
                    </Grid>

                    <Grid item xs={1}>
                    </Grid>

                    <Grid item xs={1}>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
