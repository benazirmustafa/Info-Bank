import React, { Component } from 'react';
import { Layout, Table, Breadcrumb, Button, Col, Row, Avatar, Space, Skeleton } from 'antd';
import { UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { get_users, create_user, edit_user, deleteuser, uploadExcel } from "../../../actions/users"
import TopNav from '../../Layout/TopNav/TopNav'
// import EditModal from '../../Common/Modals/EditModal';
import TableCommon from "../../Common/TableCommon/TableCommon"
import UploadFile from "../../Common/Modals/UploadFile"
import DeleteModal from './DeleteModal'
import FooterSection from '../../Layout/FooterSection/FooterSection'
import CreateUser from './CreateUser';
import UpdateModal from './UpdateModal'
const { Content } = Layout;

export class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            offset: 0,
            page: 1,
            currentpage: 1,
        };
    }
    componentDidMount() {
        this.props.get_users(this.state.limit, this.state.offset)
    }
    // componentDidUpdate(prevProps) {
    //     if (this.props.match.params.category != prevProps.match.params.category ||
    //       this.props.match.params.id != prevProps.match.params.id) {
    //         this.props.get_users(this.state.limit, this.state.offset)
    //     }
    // }
    edit = (record) => {
        this.refs.childupdate.showModal(record);
    }
    delete_mod = (record) => {
        this.refs.childdeletemod.showModal(record);
    }
    updateValues = (id, body) => {
        var offset = (this.state.page - 1) * this.state.limit;
        this.props.edit_user(id, body, this.state.limit, offset);
        this.refs.childupdate.onCancel();
    };
    deleteValues = (id) => {
        var afterDeleteCount = this.props.allusers.count - 1;
        var totalpage = Math.ceil(afterDeleteCount / this.state.limit);
        var offset = (this.state.page - 1) * this.state.limit;
        if (this.state.page > totalpage && this.state.page !== 1) {
            offset = offset - this.state.limit;
            this.setState({
                page: this.state.page - 1,
                currentpage: this.state.page - 1,
            });
        }
        this.props.deleteuser(id, this.state.limit, offset)
        this.refs.childdeletemod.onCancel();

    }
    CreateUser_mod = () => {
        this.refs.childcreateuser.showModal();
    }
    Create_User = (body) => {
        var offset = (this.state.page - 1) * this.state.limit;
        this.props.create_user(body, this.state.limit, offset)
        this.refs.childcreateuser.onCancel();
    }
    pagechange = (page, pageSize) => {
        this.setState({
            page,
            currentpage: page,
        });
        var offset = (page - 1) * pageSize;
        this.props.get_users(pageSize, offset);
    };
    uploadusers = () => {
        this.child.showModal();
        // this.props.get_users(this.state.limit, this.state.offset)
    }
    uploadExcel = () => {
        this.props.uploadExcel()
        // this.props.get_users(this.state.limit, this.state.offset)
    }
    render() {
        const columns = [
            {
                title: 'Employee',
                dataIndex: 'employee',
                width: '25%',
                key: 'employee',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                width: '25%',
                key: 'email',
            },
            {
                title: 'Permissions',
                dataIndex: 'permissions',
                width: '25%',
                key: 'permissions',
                // render: (text, record) => (
                //     Array.isArray(record)
                //         ? record.map(
                //         (per, i) =>
                //                 `${per.name}${i === value.length - 1 ? "" : ", "}`
                //     )
                //         : record
                // ),

            },
            {
                title: '',
                key: 'action',
                width: '20%',
                render: (text, record) => (
                    <Space size="middle">
                        <Button onClick={() => this.edit(record.action)}>Edit</Button>
                        <Button onClick={() => this.delete_mod(record.action)}>Delete</Button>
                    </Space>
                ),
            },
        ];

        let data = [];
        // var serial = (this.state.page - 1) * this.state.limit;
        if (this.props.allusers) {
            this.props.allusers.results.map((item, i) => {
                data.push({
                    key: item.id,
                    employee: item.first_name,
                    email: item.email,
                    permissions: item.is_superuser
                        ? "Admin"
                        : item.user_permissions.length > 0
                            ? item.user_permissions
                            : null,
                    action: item
                });
                return null;
            });
        }

        return (
            <Layout style={{ minHeight: "100%" }}>
                <TopNav banner={false} />
                <Layout>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: '24px 5%',
                            margin: 0,
                            minHeight: 'auto'
                        }}
                    >
                        {this.props.allusers ?
                            <div style={{ fontSize: 16 }}>
                                <h1>All Users</h1>
                                <Button onClick={this.uploadusers} style={{ float: 'right', margin: 5, background: 'gray', color: 'white' }} icon={<UsergroupAddOutlined />}>Upload Users</Button>
                                <Button onClick={this.CreateUser_mod} style={{ float: 'right', margin: 5, background: '#71a29a', color: 'white' }} icon={<UserAddOutlined />}>Create User</Button>
                            </div>
                            : <Skeleton paragraph={true} loading={true} />
                        }
                        <TableCommon
                            loading={this.props.allusers ? false : true}
                            data={data}
                            columns={columns}
                            count={this.props.allusers ? this.props.allusers.count : null}
                            pageSize={this.state.limit}
                            currentpage={this.state.currentpage}
                            pagechange={this.pagechange}
                        />
                        <UpdateModal
                            ref={"childupdate"}
                            updateValues={this.updateValues}
                        />
                        <CreateUser
                            ref={"childcreateuser"}
                            Create_User={this.Create_User}
                        />
                        <DeleteModal
                            ref={"childdeletemod"}
                            deleteValues={this.deleteValues}
                        />
                    </Content>
                </Layout>
                <UploadFile
                    actionupload={this.props.uploadExcel}
                    onRef={(ref) => (this.child = ref)}
                />
                <FooterSection />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    allusers: state.users.allusers
})



export default connect(mapStateToProps, { get_users, create_user, edit_user, deleteuser, uploadExcel })(ManageUsers)
