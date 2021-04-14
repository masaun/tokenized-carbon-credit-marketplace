import React from 'react';
import styles from './header.module.scss';
import getWeb3, { getGanacheWeb3, Web3 } from "../../utils/getWeb3";


const Header = () => (
    <div className={styles.header}>
        <nav id="menu" className="menu">
          <ul>
            <li><a href="/" className={styles.link}><span style={{ padding: "60px" }}></span></a></li>

            <li><a href="/apply" className={styles.link}> Apply</a></li>

            <li><a href="/approve" className={styles.link}> Approve</a></li>

            <li><a href="/my-green-nfts" className={styles.link}> My Green NFTs</a></li>

            <li><a href="/green-nft-marketplace" className={styles.link}> MarketPlace</a></li>
          </ul>
        </nav>
    </div>
)

export default Header;
