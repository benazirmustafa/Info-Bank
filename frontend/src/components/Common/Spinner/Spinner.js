import React, { Component, Fragment } from "react";
import "./Spinner.css";


class Spinner extends Component {
  render() {

    return (
      <Fragment>
        <div className="loading">
          <div className="spin spinner" />
        </div>
      </Fragment>
    );
  }
}

export default Spinner;
