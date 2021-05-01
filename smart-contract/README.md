# Tokenized Carbon Credit wrapped NFT marketplace

***

## 【Introduction of the Tokenized Carbon Credit wrapped NFT marketplace】
- 

&nbsp;

## 【Workflow】
- ① Creator apply their project to Auditor.
- ② Auditor approve a project that a creator applied.
  => Whole process is executed on this platform to keep `transparency` and `traceability` .
- ③ Creator receive a GreenNFT.
- ④ Creator buy/sell a GreenNFT on the marketplace.


***

## 【Versions】
- Versions are following below:
  - Solidity (Solc): v0.6.12
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.4.1
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)
  - Node.js: v11.15.0

&nbsp;

***

## 【Setup】

### Setup private network by using Ganache-CLI
1. Download Ganache-CLI from link below  
https://www.trufflesuite.com/ganache  


2. Execute Ganache   
```
$ ganache-cli -d
```
※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time.

&nbsp;


### Setup wallet by using Metamask
1. Add MetaMask to browser (Chrome or FireFox or Opera or Brave)    
https://metamask.io/  


2. Adjust appropriate newwork below 
```
http://127.0.0.1:8545
```

&nbsp;


### Setup backend
1. Deploy contracts on private network of Ganache
```
$ npm run migrate:local
```

&nbsp;

1. Deploy contracts on Goerli testnet
```
$ npm run migrate:local
```

&nbsp;

1. Deploy contracts on Matic's Mumbai testnet
```
$ npm run migrate:polygon_testnet
```

&nbsp;

<br>


### Setup frontend
1. NPM modules install
```
$ cd client
$ npm install
```

2. Execute command below in root directory.
```
$ cd ..
$ npm run client
```

3. Access to browser by using link 
```
http://127.0.0.1:3000
```

&nbsp;

***

## 【References】
- 

