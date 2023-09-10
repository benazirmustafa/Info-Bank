import React, { Component } from 'react';
import { Layout } from 'antd';
import FooterSection from '../../Layout/FooterSection/FooterSection'
import TopNav from '../../Layout/TopNav/TopNav'
import { connect } from "react-redux";

class Base extends Component {

  render() {
    return (
      <Layout style={{ minHeight: "100%" }}>
        <TopNav banner={false} />
        {this.props.children}
        <FooterSection />
      </Layout>


    );
  }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null
)(Base);
