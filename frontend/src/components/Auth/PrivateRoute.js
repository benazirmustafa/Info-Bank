import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../Common/Spinner/Spinner";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isLoading) {
        return <Spinner />;
      } else if (auth.isAuthenticated) {
        return <Component {...props} />;
      } else {
        return <Redirect to="/login" />;
        // return <Redirect to="/" />;
      }
    }}
  />
);

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PrivateRoute);
