# Tokenized Carbon Credit Wrapped NFT Marketplace

***

## 【Introduction of the Tokenized Carbon Credit wrapped NFT marketplace】
- This is a smart contract and dApp that allow to be able to claim, audit, trade carbon credits in a single platform. 
  - By that whole process is executed on this platform, it is able to keep `transparency` and `traceability` .
  - This smart contract is deployed on Polygon (previously Matic Network) in order to save cost of transaction and realize faster transactions. 

&nbsp;

## 【Workflow】
- ① A project owner (e.g. organizations, corporations, etc...) register themself on this dApp.
- ② A auditor (e.g. the institutions to issue carbon credit) is registered on this dApp.
  - Only deployer can register a auditor.

- ③ A project owner claim CO2 reductions to a auditor.
- ④ Auditor audit (=approve) a claim from a project owner.
  - Once a claim is audited, the `Green NFT` and the Carbon Credit Tokens (CCTs) are given (=charged) into a project owner's wallet.
  - A `Green NFT` represents a `proof of audit` of CO2 reductions for a project that is claimed.
  - Given-Carbon Credit Tokens (CCTs) are same amount with audited-amount of CO2 reductions.

- ⑤ A project owner put a Green NFT (=audited-claim) on sale.
- ⑥ A buyer can buy the Carbon Credit Tokens (CCTs) based on GreenNFT in the carbon credit marketplace.
  - Once buying process is successful, CCTs that are bought by a buyer will be transferred into a buyer's wallet.
    (※ At that time, a Green NFT is not transferred. A Green NFT is kept in the project owner's wallet as a proof of audit)
  - That buyer can sell CCTs bought in the marketplace as secondary sales.
  - Price rate of the Carbon Credit Tokens (CCTs) is `1 CCT = 1 MATIC`

<br>

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


2. Adjust appropriate newwork below (In case of deploying smart contract on local)
```
http://127.0.0.1:8545
```

3. Adjust appropriate newwork below (In case of deploying smart contract on Polygon's Mumbai testnet)
```
https://rpc-mumbai.maticvigil.com/
```
(More configuration detail is here: https://docs.matic.network/docs/develop/metamask/config-matic/ )
![Screen Shot 2021-04-18 at 13 20 46](https://user-images.githubusercontent.com/19357502/115134313-124d1e00-a04a-11eb-99bb-901d86477111.png)



&nbsp;


### Setup backend
1. Deploy contracts on private network of Ganache
```
$ npm run migrate:local
```

&nbsp;

1. Deploy contracts on local
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
$ cd frontend
$ npm install
```

2. Execute command below in root directory.
```
$ npm run start
```

3. Access to browser by using link 
```
http://127.0.0.1:3000
```

&nbsp;

***

## 【References】
- Polygon (Previously Matic)
  - Mumbai testnet (with Truffle)
    https://docs.matic.network/docs/develop/truffle

  - Matic Fancet (include for Mumbai testnet)
    https://faucet.matic.network/

  - Set up MetaMask for Mumbai testnet:  
    https://docs.matic.network/docs/develop/metamask/config-matic/

  - Workshop
    https://youtu.be/BT-UZBInh7w?t=697  

  - Deposit ETH into Matic
    https://docs.matic.network/docs/develop/ethereum-matic/plasma/eth
