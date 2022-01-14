import React, { Component } from "react";
import QrReader from "react-qr-reader";
import provider from "../ethereum/provider";
const { ethers } = require("ethers");
const keccak256 = require("keccak256");

class QrScan extends Component {
  state = {
    signature: "",
    timestamp: "",
    signerAddress: "",
    qrHidden: true,
    addressInput: "",
  };

  signer = provider.getSigner();

  handleScan = (data) => {
    if (data && data.length === 51 && data.slice(0, 9) === "ethereum:") {
      const signeeAddress = data.slice(9);
      this._handleSubmission(signeeAddress);
    }
  };

  onSubmit(evt) {
    evt.preventDefault();
    const rawAddress = this.state.addressInput;
    if (rawAddress && rawAddress.length === 42) {
      this._handleSubmission(rawAddress);
    } else {
      this.setState({ signature: "Invalid Input" });
    }
  }

  async _handleSubmission(signeeAddress) {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const signature = await this._computeSignature(timestamp, signeeAddress);
    const signerAddress = await this.signer.getAddress();
    this.setState({
      signature: signature,
      timestamp: timestamp,
      signerAddress: signerAddress,
    });
  }

  handleError = (err) => {
    console.error(err);
  };

  onQrToggle(evt) {
    evt.preventDefault();
    this.setState((prevState) => ({ qrHidden: !prevState.qrHidden }));
  }

  handleAddressInput(evt) {
    const val = evt.target.value;
    this.setState({ addressInput: val });
  }

  _computeSignature = async (timestamp, signeeAddress) => {
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint", "string", "address"],
      ["timestamp:", timestamp, " signee:", signeeAddress]
    );
    const hashedEncodedData = keccak256(encodedData);
    const signature = await this.signer.signMessage(hashedEncodedData);
    return signature;
  };

  render() {
    return (
      <div className="ui main text container center aligned">
        {this.state.qrHidden ? (
          <>
            <button
              className="ui button primary"
              onClick={(evt) => this.onQrToggle(evt)}
            >
              Click to Scan Signee's QR Code
            </button>
          </>
        ) : (
          <>
            <button
              className="ui button primary"
              onClick={(evt) => this.onQrToggle(evt)}
            >
              Hide QR Code Scanner
            </button>
            <QrReader
              delay={2000}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: "40%", margin: "auto" }}
            />
          </>
        )}
        <div>
          <h4 style={{ marginTop: "20px" }}>Or Enter Address Manually:</h4>
          <div
            className="ui input fluid "
            style={{
              marginBottom: "20px",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Signee Address"
              onChange={(evt) => this.handleAddressInput(evt)}
              value={this.state.addressInput}
            />
            <button
              className="ui button green"
              onClick={(evt) => this.onSubmit(evt)}
            >
              Generate Token
            </button>
          </div>
          <div style={{ marginLeft: "15px", marginRight: "15px" }}>
            <p
              className="ui label"
              style={{ wordBreak: "break-all", marginBottom: "8px" }}
            >
              <u>Autograph Token:</u>
              <br />
              {this.state.signature}
            </p>
            <br />
            <p
              className="ui label"
              style={{ wordBreak: "break-all", marginBottom: "8px" }}
            >
              <u>Timestamp:</u> <br />
              {this.state.timestamp}
            </p>
            <br />
            <p className="ui label" style={{ wordBreak: "break-all" }}>
              <u>Signer Address:</u> <br />
              {this.state.signerAddress}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default QrScan;
