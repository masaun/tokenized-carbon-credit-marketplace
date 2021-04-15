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
1. Deploy contracts to private network of Ganache
```
(root directory)

$ npm run migrate:local
```

&nbsp;


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

