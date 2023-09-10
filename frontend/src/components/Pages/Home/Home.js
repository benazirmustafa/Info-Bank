import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { Link } from "react-router-dom";
import CategoryCard from "../../Common/CategoryCard/CategoryCard"
import { connect } from "react-redux";
import "./Home.css"
import TopNav from '../../Layout/TopNav/TopNav'
import FooterSection from '../../Layout/FooterSection/FooterSection'
import Engineering from "../icons/cpu.png";
import HumanResource from "../icons/human-resources.png";
import FinanceAccounts from "../icons/finance.png";
import ITEDA from "../icons/diagram.png";

const { Content } = Layout;

class Home extends Component {
    render() {
        return (
            <Layout style={{ height: '100%' }} className="layout">
                <TopNav banner={true} />
                <Layout >
                    <Layout style={{ background: 'white' }}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: '24px 5%',
                                // margin: '0px 112px',
                                minHeight: 'auto'
                            }}
                        >
                            {/* <h2 className="section-title">Categories</h2> */}
                            <Row gutter={{ xs: 8, sm: 32, md: 32, lg: 132 }}>
                                <Col className="gutter-row" xs={24} sm={12}>
                                    <Link to="app/category/personal/" >
                                        <CategoryCard CategoryName={"Personal"} src={Engineering} />
                                    </Link>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12}>
                                    <Link to="app/category/shared/" >
                                        <CategoryCard CategoryName={"Shared"} src={Engineering} />
                                    </Link>
                                </Col>
                                {/* <Col className="gutter-row" xs={24} sm={12}>
                                    <Link to="app/category/engineering/" >
                                        <CategoryCard CategoryName={"Engineering"} src={Engineering} />
                                    </Link>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12}>
                                    <Link to="app/category/human-resource/" >
                                        <CategoryCard CategoryName={"Human Resource"} src={HumanResource} />
                                    </Link>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12}>
                                    <Link to="app/category/finance-accounts/" >
                                        <CategoryCard CategoryName={"Finance & Accounts"} src={FinanceAccounts} />
                                    </Link>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={12}>
                                    <Link to="app/category/it-eda/" >
                                        <CategoryCard CategoryName={"IT & EDA"} src={ITEDA} />
                                    </Link>
                                </Col> */}
                            </Row>
                        </Content>
                        <FooterSection />
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(Home);
