import React, { Component } from "react";
import getWeb3, { getGanacheWeb3, Web3 } from "../../../utils/getWeb3";
import ipfs from '../../ipfs/ipfsApi.js'

import { Grid } from '@material-ui/core';
import { Loader, Button, Card, Input, Heading, Table, Form, Field } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../../../../config/webpack';

import styles from '../../../App.module.scss';


export default class Audit extends Component {
    constructor(props) {    
        super(props);

        this.state = {
            /////// Default state
            storageValue: 0,
            web3: null,
            accounts: null,
            route: window.location.pathname.replace("/", ""),

            /////// Input values from form
            valueClaimId: '',

            /////// Ipfs Upload
            buffer: null,
            ipfsHash: ''
        };

        /////// Handle
        this.handleClaimId = this.handleClaimId.bind(this);

        /////// Ipfs Upload
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }


    ///--------------------------
    /// Handler
    ///-------------------------- 
    handleClaimId(event) {
        this.setState({ valueClaimId: event.target.value });
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
        const { web3, accounts, greenNFTFactory, greenNFTTMarketplace, greenNFTData, GREEN_NFT_MARKETPLACE, valueClaimId } = this.state

        event.preventDefault()

        ipfs.files.add(this.state.buffer, (error, result) => {
            // In case of fail to upload to IPFS
            if (error) {
                console.error(error)
                return
            }

            // In case of successful to upload to IPFS
            this.setState({ ipfsHash: result[0].hash })
            console.log('=== ipfsHash ===', this.state.ipfsHash)

            const auditor = accounts[0]
            const claimId = valueClaimId
            const auditedReport = this.state.ipfsHash
            this.setState({ valueClaimId: '', ipfsHash: '' })

            let claim = greenNFTData.methods.getClaim(claimId).call()
            .then((claim) => { 
                console.log('=== claim ===', claim)
                const _projectId = claim.projectId
                const _co2Reductions = claim.co2Reductions 

                let project = greenNFTData.methods.getProject(_projectId).call()
                .then((project) => {
                    const _projectOwner = project.projectOwner
                    const _co2Emissions = project.co2Emissions
                    
                    const carbonCredits = Number(_co2Emissions) - Number(_co2Reductions)
                    const _carbonCredits = String(carbonCredits)
                    //const _carbonCredits = web3.utils.fromWei(String(carbonCredits), 'ether')
                    console.log('=== _carbonCredits ===', _carbonCredits)

                    greenNFTFactory.methods.auditClaim(claimId, auditedReport).send({ from: auditor })
                    .then((receipt) => {
                        console.log('=== receipt ===', receipt)

                        /// Retrieve GREEN_NFT address from event of "GreenNFTCreated"                        
                        let GREEN_NFT = receipt.events.GreenNFTCreated.returnValues.greenNFT
                        console.log('=== GREEN_NFT ===', GREEN_NFT)

                        greenNFTFactory.methods.saveGreenNFTData(_projectId, claimId, GREEN_NFT, _projectOwner, auditor,  _co2Emissions, _co2Reductions, _carbonCredits, auditedReport).send({ from: auditor })
                        .then((receipt) => {
                            console.log('=== receipt ===', receipt)
                        })
                    })
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
        let GreenNFTData = {};
        try {
          GreenNFTFactory = require("../../../../../smart-contract/build/contracts/GreenNFTFactory.json"); // Load ABI of contract of greenNFTFactory
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
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const networkType = await web3.eth.net.getNetworkType();
            const isMetaMask = web3.currentProvider.isMetaMask;
            let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
            balance = web3.utils.fromWei(balance, 'ether');

            let instanceGreenNFTFactory = null;
            let instanceGreenNFTTMarketplace = null;
            let instanceGreenNFTData = null;
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
                    greenNFTData: instanceGreenNFTData,
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
                            <h2>Audit a CO2 reduction claim</h2>

                            <Form onSubmit={this.onSubmit}>
                                <Field label="Claim ID">
                                    <Input
                                        type="text"
                                        width={1}
                                        placeholder="e.g) 1"
                                        required={true}
                                        value={this.state.valueClaimId} 
                                        onChange={this.handleClaimId}                                        
                                    />
                                </Field>

                                <Field label="Audited-Report (Verification Report)">
                                    <input 
                                        type='file' 
                                        onChange={this.captureFile} 
                                        required={true}
                                    />
                                </Field>

                                <Button size={'medium'} width={1} type='submit'>Audit</Button>
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
