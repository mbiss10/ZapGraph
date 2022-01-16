# ⚡️ZapGraph: NFT Autographs 🔏

https://user-images.githubusercontent.com/50077908/149664605-e7968b92-79fd-4b31-a022-85e06230108a.mp4


---  

### ZapGraph is a dapp for autograph NFTs. It enables:
*  Offline signing (manual or via QR code scans)
*  On-chain minting and storage/ownership of autographs
*  Custom pricing and minting period duration for autograph signers
*  Quick, verifiable, and immutable signing and collection of autographs

---  

### Why use the blockchain for autographs?

Phyiscal autographs can be lost or forged. At best, they're often messy scribles ("Does that <i>really</i> say 'LeBron James'? It's just a wavy Sharpie line!") and lack personalization.  

Digital autographs stored on the blockchain are:
* immutable
* backed by cryptography (making them verifiable and impossible to forge)
* easy to show off yet portable and impossible to lose
* personalized by default  

They also give signers more freedom to customize whether/how their autographs are priced and allow for creative graphic representations.

---  

### How it works:  

ZapGraph uses a smart contract to store autographs on the Ethereum blockchain. Each autograph is an NFT — more specifically, an ERC-1155 token. The current smart contract lives on the Rinkeby test network at the address: ```0x50b6723275BdA8594d671DDC31C64eCCE28c8577```  
          
To use ZapGraph, both the signer (the person creating the autograph, e.g. a celebrity) and the signee (the person receiving the autograph, e.g. a fan) must have set up their own Ethereum wallets. These wallets have a public address and a corresponding private key.  

Using the "Signers" tab, a signer can enter the signee's public address and generate a few key piece of data that the signee will use to redeem the autograph token. The signer can enter the signee's address manually, or by scanning a QR code. ZapGraph will output an "Autograph Token," the current timestamp, and the signer's public address. The signee must take note of these values (e.g. by copying and pasting).  

When the signee wants to redeem their autograph, they can use the "Signee" tab to enter these three values and "mint" the autograph NFT. The values must exactly match what was output from the signer, and the signee must be using the wallet who's address was entered/scanned by the signer, or else the verification will fail.  

The Autograph Token is a confusing string of numbers and letters that's generated using cryptography. It looks like gibberish, but it has an almost magical power to take any combination of ```Signer's address // Signee's address // Timestamp``` and say "yes, the signer did provide the signee at autograph at this time" or "nope, this is a forgery."  



<p align="center">
<img width="250" alt="ZapGraph Logo" src="https://user-images.githubusercontent.com/50077908/149664962-b9933a24-72f2-424d-b1b1-c2cd46e6aa55.png">
</p>
