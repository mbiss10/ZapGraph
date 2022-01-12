import logo from "../assets/zapGraph_Logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="ui fixed inverted massive menu">
      <div className="ui container my-font">
        <Link to="/" className="header item">
          <img src={logo} alt="logo" style={{ marginRight: "12px" }}></img>
          ZapGraph: Autograph NFTs
        </Link>
        <Link to="/signer" className="item">
          For Signers
        </Link>
        <Link to="/signee" className="item">
          For Signees
        </Link>
      </div>
    </div>
  );
}

export default Header;
