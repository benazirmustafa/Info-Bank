import React, { Component, Fragment } from "react";
import { Form, Input, Button } from "antd";
import { Redirect } from "react-router-dom";
import WelcomeSplash from "../../Common/Spinner/WelcomeSplash";
import Spinner from "../../Common/Spinner/Spinner";
import { Link } from "react-router-dom";
import { login } from "../../../actions/auth";
import { connect } from "react-redux";
import "./Login.css";
import "antd/dist/antd.css";

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  async handleSubmit(event) {
    this.props.login(event.email, event.Password);
  }

  render() {
    if (this.props.isLoading) {
      return <Spinner />;
    }
    if (this.props.isSplash) {
      return <WelcomeSplash />;
    }
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container-login100">
        <div className="wrap-login100 p-t-30 p-b-50">
          <span className="login100-form-title p-b-41">Login</span>
          <Form
            onFinish={(event) => this.handleSubmit(event)}
            onFinishFailed={this.onFinishFailed}
          >
            <FormItem
              name="email"
              rules={[
                {
                  type:'email',
                  required: true,
                  message: "Please input your email address!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Email Address"
              />
            </FormItem>

            <FormItem
              className="Inp"
              name="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                size="large"
                // prefix={<LockOutlined style={{ fontSize: 13 }} />}
                type="password"
                placeholder="Password"
              />
            </FormItem>
            <div style={{ position: "relative", height: 150 }}>
              <Fragment>
                <div style={{ position: "absolute", top: 0, width: "100%" }}>
                  <p
                    style={{
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    {this.props.credentials
                      ? ""
                      : "Incorrect Email or Password"}
                  </p>
                </div>
                <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
                  <div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      style={{background:'#d55333', color:'white', border:'#d55333'}}
                    >
                      Log in
                    </Button>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    Forgot Password?
                    <Link to={`/app/reset-password-request`}> Click here </Link>
                    to Reset Your Password.
                  </div>
                </div>
              </Fragment>
            </div>
         
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  credentials: state.auth.credentials,
  isLoading: state.auth.isLoading,
  isSplash: state.auth.isSplash,
});

export default connect(mapStateToProps, { login })(Login);
// export default Login
