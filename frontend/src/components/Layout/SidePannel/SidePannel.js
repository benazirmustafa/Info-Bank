import React, { Component, Fragment } from 'react';
import { Layout, Avatar, Tooltip, Spin, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import moment from 'dayjs';
import "./SidePannel.css"
const { Sider } = Layout;

class SidePannel extends Component {
    render() {
        if (!this.props.sharewith) {
            return null
        }
        return (
            <Fragment>
                {/* <Sider width={200} className="site-layout-background" collapsed={this.state.collapsed}> */}
                <Sider className="sidepannel" collapsedWidth={0} width={200} trigger={null} collapsible collapsed={this.props.collapsed}>
                    <div style={{ float: 'right', margin: 10 }}>
                        <Button onClick={this.props.closeSidebar} icon={<CloseOutlined />} />

                    </div>
                    {this.props.loading_sharewith ?
                        <p style={{ textAlign: 'center', marginTop: 20 }}><Spin /></p>
                        :
                        <div style={{ margin: '40px 15px' }}>

                            <Avatar.Group
                                maxCount={5}
                                maxStyle={{
                                    color: '#f56a00',
                                    backgroundColor: '#fde3cf',
                                }}
                            >

                                {/* <p key={i}>{user.user.full_name}</p> */}
                                {this.props.sharewith ?
                                    this.props.sharewith.map((user, i) => (
                                        <Tooltip key={i} title={`${user.user.full_name} ${user.owner ? "is Owner" : `can ${user.permissions}`}`} placement="top">
                                            <Avatar
                                                key={i}
                                                style={{
                                                    backgroundColor: '#87d068',
                                                }}

                                            >
                                                {user.user.full_name.charAt(0)}
                                            </Avatar>
                                        </Tooltip>
                                    )) : null}

                            </Avatar.Group>
                        </div>
                    }
                    {this.props.details ?
                        <div style={{ padding: '10px 15px' }}>
                            <div>
                                <p id="sidepanel_label" >
                                    Name
                                </p>
                                <p>
                                    {this.props.details.name}
                                </p>
                            </div>
                            <div>
                                <p id="sidepanel_label" >
                                    Description
                                </p>
                                <p>
                                    {this.props.details.description ? this.props.details.description : "NA"}
                                </p>
                            </div>
                            <div>
                                <p id="sidepanel_label">
                                    Created By/Owner
                                </p>
                                <p >
                                    {this.props.details.created_by_name}
                                </p>
                            </div>
                            <div>
                                <p id="sidepanel_label">
                                    Created Date
                        </p>
                                <p>
                                    {moment(this.props.details.created_date).format("DD-MM-YYYY")}
                                </p>
                            </div>
                        </div> : null}

                </Sider>
            </Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    sharewith: state.infobank.sharewith,
    loading_sharewith: state.infobank.loading_sharewith,
});

export default connect(mapStateToProps, null)(SidePannel)
