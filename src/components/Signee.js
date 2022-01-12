import zapgraph from "../ethereum/zapgraph";
import React, { Component } from "react";
import provider from "../ethereum/provider";
import Autographs from "./Autographs";
const { ethers } = require("ethers");

class Signee extends Component {
  state = {
    timestampValue: "",
    signerAddressValue: "",
    autographTokenValue: "",
    txValueInput: "",
    statusMessage: "",
    autographsKey: 1,
  };

  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callbacks
    this.onMintSubmit = this.onMintSubmit.bind(this);
  }

  async onVerifySubmit(evt) {
    evt.preventDefault();
    console.log(
      `Verifying with: \n timestampValue:${this.state.timestampValue} \n signerAddressValue:${this.state.signerAddressValue} \n autographTokenValue:${this.state.autographTokenValue} \n`
    );
    const signer = provider.getSigner();
    try {
      const res = await zapgraph
        .connect(signer)
        .verifySignature(
          this.state.timestampValue,
          this.state.signerAddressValue,
          this.state.autographTokenValue
        );
      const verificationMessage = res
        ? "Verification Successful!"
        : "Verification Failed.";
      this.setState({ statusMessage: verificationMessage });
    } catch (err) {
      this.setState({ statusMessage: `Error: ${err}` });
    }
  }

  async onMintSubmit(evt) {
    evt.preventDefault();
    console.log(
      `Minting with: \n timestampValue:${this.state.timestampValue} \n signerAddressValue:${this.state.signerAddressValue} \n autographTokenValue:${this.state.autographTokenValue} \n txValueInput:${this.state.txValueInput}`
    );
    try {
      var overrides = {};
      if (this.state.txValueInput !== "") {
        const parsedValue = ethers.utils.parseUnits(
          this.state.txValueInput,
          "wei"
        );
        overrides = {
          value: parsedValue,
        };
      }

      const signer = provider.getSigner();
      const tx = await zapgraph
        .connect(signer)
        .purchase(
          this.state.timestampValue,
          this.state.signerAddressValue,
          this.state.autographTokenValue,
          "0x00",
          overrides
        );
      this.setState({
        statusMessage: (
          <>
            <div className="ui active centered inline loader"></div>
            Transaction sent to Ethereum...
          </>
        ),
      });
      const txReciept = await tx.wait();
      const res = txReciept.status
        ? "Autograph successfully minted!"
        : "There was a problem minting the autograph.";
      const newKey = Math.floor(Math.random() * 100);
      this.setState({
        statusMessage: res,
        autographsKey: newKey,
      });
    } catch (err) {
      const errMessage = err.error.message ? err.error.message : err;
      this.setState({ statusMessage: `Error: ${errMessage}` });
    }
  }

  handleTimestampInput(evt) {
    const val = evt.target.value;
    this.setState({ timestampValue: val });
  }
  handleSignerAddressInput(evt) {
    const val = evt.target.value;
    this.setState({ signerAddressValue: val });
  }
  handleAutographTokenInput(evt) {
    const val = evt.target.value;
    this.setState({ autographTokenValue: val });
  }

  handleValueInput(evt) {
    const val = evt.target.value;
    this.setState({ txValueInput: val });
  }

  render() {
    return (
      <div
        className="ui main text container center aligned"
        style={{ marginTop: "100px", marginBottom: "100px" }}
      >
        <h3
          className="ui horizontal divider header"
          style={{ marginTop: "30px", marginBottom: "30px" }}
        >
          Claim a New Autograph!
        </h3>
        <div style={{ backgroundColor: "lightgrey" }}>
          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <div>
              Autograph Token
              <div
                className="ui input fluid "
                style={{ paddingLeft: "15px", paddingRight: "15px" }}
              >
                <input
                  type="text"
                  placeholder="Autograph Token"
                  onChange={(evt) => this.handleAutographTokenInput(evt)}
                  value={this.state.autographTokenValue}
                />
              </div>
            </div>

            <div>
              Signer Address
              <div
                className="ui input fluid "
                style={{ paddingLeft: "15px", paddingRight: "15px" }}
              >
                <input
                  type="text"
                  placeholder="Signer Address"
                  onChange={(evt) => this.handleSignerAddressInput(evt)}
                  value={this.state.signerAddressValue}
                />
              </div>
            </div>
            <div>
              Timestamp
              <div
                className="ui input fluid "
                style={{ paddingLeft: "15px", paddingRight: "15px" }}
              >
                <input
                  type="text"
                  placeholder="Timestamp"
                  onChange={(evt) => this.handleTimestampInput(evt)}
                  value={this.state.timestampValue}
                />
              </div>
            </div>
            <div>
              Autograph Price in Wei (Leave Empty for Free Autographs)
              <div
                className="ui input fluid "
                style={{ paddingLeft: "15px", paddingRight: "15px" }}
              >
                <input
                  type="text"
                  placeholder="Value to send in wei"
                  onChange={(evt) => this.handleValueInput(evt)}
                  value={this.state.txValueInput}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <button
                className="ui button primary"
                onClick={(evt) => this.onVerifySubmit(evt)}
              >
                Verify Signature
              </button>
              <button
                className="ui button green"
                onClick={(evt) => this.onMintSubmit(evt)}
              >
                Mint Autograph
              </button>
            </div>
            <div>{this.state.statusMessage}</div>
          </div>
        </div>
        <h3
          className="ui horizontal divider header"
          style={{ marginTop: "40px", marginBottom: "30px" }}
        >
          My Autographs
        </h3>
        <Autographs key={this.state.autographsKey} />
      </div>
    );
  }
}

export default Signee;
