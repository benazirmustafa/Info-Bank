import React, { Fragment } from "react";
import { Result, Button, Layout } from "antd";
import { Link } from "react-router-dom";
const { Content } = Layout;
class Page404 extends React.Component {
  render() {
    return (
      <Fragment>
        <Content>
          <div className="col-sm-11" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  {/* <div className="container-fluid">
                <div className="row content"> */}
                  <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exists or you are not authorized to see contents of this page."
                    extra={
                      <Button
                        type="primary"
                        // onClick={() => this.props.history.push("/")}
                      >
                        <Link to="/">Go Back to Home</Link>
                      </Button>
                    }
                  />
                  {/* </div>
              </div> */}
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default Page404;
