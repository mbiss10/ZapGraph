import React, { Component } from "react";
import QrScan from "./QrScan";
import zapgraph from "../ethereum/zapgraph";
import provider from "../ethereum/provider";

class Signer extends Component {
  state = {
    timeInputVal: "",
    priceInputVal: "",
    priceMessage: "",
    timeMessage: "",
    currentPrice: "",
    currentTime: "",
  };

  signer = provider.getSigner();

  componentDidMount() {
    this.updateTimeAndPrice();
  }

  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callbacks
    this.onSetTimeButtonClick = this.onSetTimeButtonClick.bind(this);
    this.onSetPriceButtonClick = this.onSetPriceButtonClick.bind(this);
  }

  async updateTimeAndPrice() {
    const Zapgraph = await zapgraph.connect(this.signer);
    const currentUserAddress = await this.signer.getAddress();
    let currentPrice = await Zapgraph.prices(currentUserAddress);
    currentPrice = `(Current Price: ${currentPrice.toString()})`;
    let currentTime = await Zapgraph.timeAllotments(currentUserAddress);
    currentTime =
      currentTime._hex === "0x00"
        ? "(Current Token Expiry Time: No expiry set)"
        : `(Current Token Expiry Time: ${currentTime.toString()})`;
    this.setState({ currentPrice, currentTime });
  }

  async onSetTimeButtonClick(evt) {
    evt.preventDefault();
    try {
      const tx = await zapgraph
        .connect(this.signer)
        .setAllotment(Number(this.state.timeInputVal));
      this.setState({
        timeMessage: (
          <>
            <div className="ui active centered inline loader"></div>
            Update sent to Ethereum...
          </>
        ),
      });
      const txReciept = await tx.wait();
      const verificationMessage = txReciept.status
        ? "Time Update Successful!"
        : "Failed to Update Time";
      await this.updateTimeAndPrice();
      this.setState({
        timeMessage: verificationMessage,
      });
    } catch (err) {
      this.setState({
        timeMessage: `Error: ${err}`,
      });
    }
  }

  async onSetPriceButtonClick(evt) {
    evt.preventDefault();
    try {
      const tx = await zapgraph
        .connect(this.signer)
        .setPrice(Number(this.state.priceInputVal));
      this.setState({
        priceMessage: (
          <>
            <div className="ui active centered inline loader"></div>
            Update sent to Ethereum...
          </>
        ),
      });
      const txReciept = await tx.wait();
      const verificationMessage = txReciept.status
        ? "Price Update Successful!"
        : "Failed to Update Price";
      await this.updateTimeAndPrice();
      this.setState({
        priceMessage: verificationMessage,
      });
    } catch (err) {
      console.log(err);
      const errMessage = err.message ? err.message : err;
      this.setState({
        priceMessage: `Error: ${errMessage}`,
      });
    }
  }

  handlePriceInput(evt) {
    const val = evt.target.value;
    this.setState({ priceInputVal: val });
  }

  handleTimeInput(evt) {
    const val = evt.target.value;
    this.setState({ timeInputVal: val });
  }

  render() {
    return (
      <div className="ui main text container center aligned">
        <div
          style={{
            marginTop: "100px",
            marginBottom: "100px",
          }}
        >
          <h3 className="ui horizontal divider header">
            Generate Autograph Token
          </h3>

          <div style={{ backgroundColor: "lightgrey" }}>
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <QrScan></QrScan>
            </div>
          </div>
          <h3
            className="ui horizontal divider header"
            style={{ marginTop: "30px", marginBottom: "30px" }}
          >
            Configurations
          </h3>
          <div style={{ backgroundColor: "lightgrey" }}>
            <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
              <div
                style={{
                  marginBottom: "8px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <h4>Set Autograph Price:</h4>
                <div className="ui input fluid action">
                  <input
                    type="text"
                    placeholder="Price (wei)"
                    onChange={(evt) => this.handlePriceInput(evt)}
                    value={this.state.priceInputVal}
                  />
                  <button
                    className="ui button primary"
                    onClick={(evt) => this.onSetPriceButtonClick(evt)}
                  >
                    Submit
                  </button>
                </div>
              </div>
              <div>
                {this.state.currentPrice}
                <br />
                {this.state.priceMessage}
              </div>
              <div
                style={{
                  marginTop: "30px",
                  marginBottom: "10",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <h4>Set Autograph Token Expiry:</h4>
                <div className="ui input fluid action">
                  <input
                    type="text"
                    placeholder="Expiration time (seconds)"
                    onChange={(evt) => this.handleTimeInput(evt)}
                    value={this.state.timeInputVal}
                  />
                  <button
                    className="ui button primary"
                    onClick={(evt) => this.onSetTimeButtonClick(evt)}
                  >
                    Submit
                  </button>
                </div>
                <div>
                  {this.state.currentTime}
                  <br />
                  {this.state.timeMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signer;
