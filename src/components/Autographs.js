import React, { Component } from "react";
import zapgraph from "../ethereum/zapgraph";
import provider from "../ethereum/provider";
import logo from "../assets/zapGraph_Logo.png";
let Zapgraph = zapgraph.connect(provider);

class Autographs extends Component {
  state = {
    address: "",
    autographs: [],
    loading: true,
  };

  async componentDidMount() {
    try {
      const signer = await provider.getSigner();
      const signeeAddress = await signer.getAddress();
      const myFilter = Zapgraph.filters.Purchase(null, signeeAddress);
      const results = await Zapgraph.queryFilter(myFilter);
      let autographs = [];
      console.log(`Searching for ${signeeAddress}'s autographs...`);
      for (const info of Object.values(results)) {
        let imageUrl = logo;
        try {
          const response = await fetch(
            `https://ipfs.io/ipfs/QmPwvH9EKw4oxK7Xt2RxjCKabud88wUDJov5EyMMSL61gs/000000000000000000000000${info.args._signer
              .slice(2)
              .toLowerCase()}.json`
          );
          const jsonResponse = await response.json();
          imageUrl = jsonResponse.image;
        } catch (err) {
          console.log(`No image found for autograph. Using default.`);
        }
        autographs.push({
          signer: info.args._signer,
          price: info.args._price.toString(),
          timestamp: info.args._timestamp.toString(),
          image: imageUrl,
        });
      }
      this.setState({
        address: await zapgraph.address,
        autographs,
        loading: false,
      });
      console.log(`Autograph search complete.`);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const res = this.state.loading ? (
      <div className="ui segment">
        <p></p>
        <div className="ui active dimmer">
          <div className="ui loader"></div>
        </div>
      </div>
    ) : (
      <div>
        {this.state.autographs.map((a, i) => {
          return (
            <div className="ui centered card" key={i}>
              <div className="image">
                <img
                  src={a.image}
                  alt="autograph"
                  onClick={() => window.open(a.image)}
                ></img>
              </div>
              <div className="content">
                Signer: {`${a.signer.slice(0, 7)}...${a.signer.slice(-5)}`}{" "}
                <br />
                Price: {a.price} <br />
                Timestamp:{" "}
                {new Date(a.timestamp * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
    return res;
  }
}

export default Autographs;
