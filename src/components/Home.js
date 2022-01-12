import "./Home.css";
import logo from "../assets/zapGraph_Logo.png";
import { contractAddress } from "../ethereum/contractAddress.json";

function Home() {
  return (
    <div
      className="ui main text container center aligned"
      style={{ marginTop: "100px", marginBottom: "70px" }}
    >
      <h1 className="my-font">Welcome to ZapGraph!</h1>
      <img
        src={logo}
        alt="logo"
        style={{ marginRight: "8px", width: "50%" }}
      ></img>
      <br></br>
      <br></br>
      <h3 className="my-font">ZapGraph is a dapp for autograph NFTs:</h3>
      <div style={{ textAlign: "left" }}>
        <ul>
          <li> Offline signing (manual or via QR code scans) </li>
          <li> On-chain minting and storage/ownership of autographs </li>
          <li>
            Custom pricing and minting period duration for autograph signers
          </li>
          <li>
            Quick, verifiable, and immutable signing and collection of
            autographs
          </li>
        </ul>
      </div>
      <h3 className="my-font">Why use the blockchain for autographs?</h3>
      <div style={{ textAlign: "left" }}>
        <p>
          Phyiscal autographs can be lost or forged. At best, they're often
          messy scribles ("Does that <i>really</i> say 'LeBron James'? It's just
          a wavy Sharpie line!") and lack personalization. <br />
          <br />
          Digital autographs stored on the blockchain are:
        </p>
        <ul>
          <li> immutable </li>
          <li>
            backed by cryptography (making them verifiable and impossible to
            forge)
          </li>
          <li>easy to show off yet portable and impossible to lose</li>
          <li>personalized by default</li>
        </ul>
        <p>
          They also give signers more freedom to customize whether/how their
          autographs are priced and allow for creative graphic representations.
        </p>
      </div>
      <h3 className="my-font">How it works:</h3>
      <div style={{ textAlign: "left" }}>
        <p>
          ZapGraph uses a smart contract to store autographs on the Ethereum
          blockchain. Each autograph is an NFT — more specifically, an ERC-1155
          token. The current smart contract lives on the Rinkeby test network at
          the address: <code>{contractAddress}</code>.
          <br /> <br /> To use ZapGraph, both the signer (the person creating
          the autograph, e.g. a celebrity) and the signee (the person receiving
          the autograph, e.g. a fan) must have set up their own Ethereum
          wallets. These wallets have a public address and a corresponding
          private key. <br /> <br />
          Using the "Signers" tab, a signer can enter the signee's public
          address and generate a few key piece of data that the signee will use
          to redeem the autograph token. The signer can enter the signee's
          address manually, or by scanning a QR code. ZapGraph will output an
          "Autograph Token," the current timestamp, and the signer's public
          address. The signee must take note of these values (e.g. by copying
          and pasting). <br /> <br /> When the signee wants to redeem their
          autograph, they can use the "Signee" tab to enter these three values
          and "mint" the autograph NFT. The values must exactly match what was
          output from the signer, and the signee must be using the wallet who's
          address was entered/scanned by the signer, or else the verification
          will fail.
          <br /> <br />
          The Autograph Token is a confusing string of numbers and letters
          that's generated using cryptography. It looks like gibberish, but it
          has an almost magical power to take any combination of{" "}
          <code>[Signer's address // Signee's address // Timestamp]</code> and
          say "yes, the signer <i>did</i> provide the signee at autograph at
          this time" or "nope, this is a forgery."
        </p>
      </div>
    </div>
  );
}

export default Home;
