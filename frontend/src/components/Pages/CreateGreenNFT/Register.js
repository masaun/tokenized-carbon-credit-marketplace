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

          /////// Input values from form
          valueProjectName: '',
          valueCO2Emissions: '',
          valueAuditorAddress: '',

          /////// Ipfs Upload
          buffer: null,
          ipfsHash: ''
        };

        /////// Handle
        this.handleProjectName = this.handleProjectName.bind(this);
        this.handleCO2Emissions = this.handleCO2Emissions.bind(this);
        this.handleAuditorAddress = this.handleAuditorAddress.bind(this);

        /////// Ipfs Upload
        this.captureFile = this.captureFile.bind(this);
        this.onSubmitRegisterProject = this.onSubmitRegisterProject.bind(this)
        this.onSubmitRegisterAuditor = this.onSubmitRegisterAuditor.bind(this)
    }


    ///--------------------------
    /// Handler
    ///-------------------------- 
    handleProjectName(event) {
        this.setState({ valueProjectName: event.target.value });
    }

    handleCO2Emissions(event) {
        this.setState({ valueCO2Emissions: event.target.value });
    }

    handleAuditorAddress(event) {
        this.setState({ valueAuditorAddress: event.target.value });
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
      
    async onSubmitRegisterProject(event) {
        const { web3, accounts, greenNFTFactory, valueProjectName, valueCO2Emissions } = this.state

        event.preventDefault()

        const projectName = valueProjectName
        const co2Emissions = valueCO2Emissions
        this.setState({ 
            valueProjectName: '',
            valueCO2Emissions: ''
        })

        let txReceipt = await greenNFTFactory.methods.registerProject(projectName, co2Emissions).send({ from: accounts[0] })
    }

    async onSubmitRegisterAuditor(event) {
        const { web3, accounts, greenNFTFactory, valueAuditorAddress } = this.state

        event.preventDefault()

        const auditorAddress = valueAuditorAddress
        this.setState({ valueAuditorAddress: '' })

        let txReceipt = await greenNFTFactory.methods.registerAuditor(auditorAddress).send({ from: accounts[0] })
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

                            <Form onSubmit={this.onSubmitRegisterProject}>
                                <Field label="Project Name">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) The National Planting Organization"
                                        required={true}
                                        value={this.state.valueProjectName} 
                                        onChange={this.handleProjectName} 
                                    />
                                </Field> 

                                <Field label="CO2 Emissions">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) 50"
                                        required={true}
                                        value={this.state.valueCO2Emissions} 
                                        onChange={this.handleCO2Emissions}                                        
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

                            <Form onSubmit={this.onSubmitRegisterAuditor}>
                                <Field label="Auditor address">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) 0x0264518b20e1042264F0B55687cEAA450EEfc312"
                                        required={true}
                                        value={this.state.valueAuditorAddress} 
                                        onChange={this.handleAuditorAddress} 
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
