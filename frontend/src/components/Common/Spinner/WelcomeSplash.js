import React, { Component, Fragment } from "react";
import "./Spinner.css";
class WelcomeSplash extends Component {
  render() {
    return (
      <Fragment>
        <div id="loader-wrapper">
          <div id="loader"></div>
          <div className="loader-section section-left"></div>
          <div className="loader-section section-right"></div>
        </div>
      </Fragment>
    );
  }
}

export default WelcomeSplash;
