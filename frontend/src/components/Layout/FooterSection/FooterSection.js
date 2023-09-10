import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import "./FooterSection.css"

const { Footer } = Layout;
class FooterSection extends Component {
    render() {
        return (
            <Footer style={{ color: '#8a8a8a', background: 'black', padding: '24px 5%' }}>
                <Row>
                    <Col xs={24} sm={12}>
                        <h1 style={{ color: '#8a8a8a', margin: 0 }} className="footerlogo"><span className="u-color">U</span>LKASEMI</h1>
                        <p>We are integrating your ideas.</p>
                    </Col>
                    <Col xs={24} sm={12} style={{ alignSelf: 'flex-end' }}>
                        <p className="copyright">
                            Copyright © 2020 Ulkasemi Private Limited
                    </p>
                    </Col>
                </Row>
            </Footer>
        );
    }
}

export default FooterSection;