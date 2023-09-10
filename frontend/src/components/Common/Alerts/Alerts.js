import React, { Component, Fragment } from "react";
// import { withAlert } from "react-alert";
import { connect } from "react-redux";
import { InIt } from "../../../actions/alerts";
import { message } from "antd";

class Alerts extends Component {
  constructor(props) {
    super(props);
    message.config({
      top: 10,
      duration: 3,
      maxCount: 3,
    });
  }

  componentDidUpdate(prevProps) {
    const { msg } = this.props;

    if (msg !== prevProps.msg) {
      if (msg) {
        if (msg.type === "success") {
          message.success(msg.msg).then(this.props.InIt());
        } else if (msg.type === "error") {
          message.error(msg.msg).then(this.props.InIt());
        }
      }
    }
  }
  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  msg: state.alerts.msg,
});

export default connect(mapStateToProps, { InIt })(Alerts);
