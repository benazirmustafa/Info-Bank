import React, { Component, Fragment } from 'react'
import { Layout, Menu, Dropdown, Button } from 'antd';
import { connect } from "react-redux";
import { logout } from "../../../actions/auth";
import { DownOutlined, UsergroupAddOutlined, LogoutOutlined } from '@ant-design/icons';
import "./TopNav.css"
import { Link } from 'react-router-dom';
const { Header } = Layout;

class TopNav extends Component {
  handleMenuClick = (e) => {
    const key = parseInt(e.key);
    if (key === 3) {
      this.props.logout();
    }
  };

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {this.props.user.is_superuser ?
          <Menu.Item key="1">
            <Link to="/app/manage-users"> <UsergroupAddOutlined /> Manage Users</Link>
          </Menu.Item> : null
        }
        <Menu.Divider />
        <Menu.Item key="3"><LogoutOutlined /> Logout</Menu.Item>
      </Menu>
    );
    return (
      <Fragment>
        <Header className={this.props.banner ? "header" : "header1"}>
          <Link to="/"><h1 className={this.props.banner ? "logoTxt" : "logoTxt1"}>ULKASEMI</h1></Link>
          <div className="TopMenu">
            {/* <Link style={{ color: this.props.banner ? "white" : "black", marginRight: 5 }} to="/" >
              Home
            </Link> */}
            <span id="user-name" style={{ color: this.props.banner ? "white" : "black" }}>{this.props.user.email}</span>
            <Dropdown overlay={menu} trigger={['click']}>
              <DownOutlined style={{ marginLeft: 10, color: this.props.banner ? "white" : "black" }} />
            </Dropdown>
          </div>
        </Header>
        {this.props.banner ?
          <div className="TitileSection">
            <div className="banner">
              <h3 className="banner-h3">Welcome to</h3>
              <h1 className="banner-title">Ulkasemi Info Bank</h1>
            </div>
          </div> : null
        }


      </Fragment>

    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(TopNav);