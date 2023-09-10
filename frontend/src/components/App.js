import React, { Component } from "react";
import axios from "axios";
import store from "../store";
import { Layout } from 'antd';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { loadUser } from "../actions/auth";
import { LOGIN_FAIL } from "../actions/types";
import PrivateRoute from "./Auth/PrivateRoute";
import Alert from "../components/Common/Alerts/Alerts";
import Page404 from "./Common/Page404/Page404";
import Login from './Pages/Login/Login'
import Home from './Pages/Home/Home'
import Contents from './Pages/Contents/Contents'
import ManageUsers from './Pages/ManageUsers/ManageUsers'

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost:8000";
}

class App extends Component {
  componentDidMount() {
    let token = localStorage.getItem("token");
    if (token) {
      store.dispatch(loadUser());
    } else {
      store.dispatch({ type: LOGIN_FAIL });
    }
  }

  render() {
    let appRoutes;
    if (this.props.user) {
      if (this.props.user.is_superuser) {
        appRoutes = (
          <Switch>
            <PrivateRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/app/:category_type/folder/:id" component={Contents} />
            <PrivateRoute exact path="/app/category/:category" component={Contents} />
            <PrivateRoute exact path="/app/manage-users" component={ManageUsers} />
            <PrivateRoute exact path="/app/unautherized" component={Page404} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
        );
      } else {
        appRoutes = (
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/app/:category_type/folder/:id" component={Contents} />
            <PrivateRoute exact path="/app/category/:category" component={Contents} />
            <PrivateRoute exact path="/app/manage-users" component={ManageUsers} />
            <PrivateRoute exact path="/app/unautherized" component={Page404} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
        );
      }
    } else {
      appRoutes = (

        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute component={Page404} />
        </Switch>
      );
    }
    return (
      // <Router>
      // <Layout className="layout">
      //   <TopNav/>
      //   <Layout>
      //     <Layout style={{ background:'white' }}>
      //       {appRoutes}
      //     <FooterSection/>
      //     </Layout>
      //     {/* <SidePannel collapsed={this.state.collapsed}/> */}
      //   </Layout>
      // </Layout>
      // </Router>
      <Router>
        <Alert />
        {appRoutes}
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(App);
