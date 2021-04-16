import React from 'react';
import styles from './header.module.scss';
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";


const Header = () => (
    <div className={styles.header}>
        <nav id="menu" className="menu">
          <ul>
            <li><a href="/" className={styles.link}><span style={{ padding: "60px" }}></span></a></li>

            <li><a href="/register" className={styles.link}> Register</a></li>

            <li><a href="/claim" className={styles.link}> Claim</a></li>

            <li><a href="/audit" className={styles.link}> Audit</a></li>

            <li><a href="/my-green-nfts" className={styles.link}> My Green NFTs</a></li>

            <li><a href="/green-nft-marketplace" className={styles.link}> MarketPlace</a></li>
          </ul>
        </nav>
    </div>
)

export default Header;
