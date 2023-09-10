import React, { Component, useEffect } from "react";
import { Modal, Form, Select, Button, Input, Space, Spin } from "antd";
import { MinusCircleOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { usersearch } from "../../../actions/users"
import { get_share_details } from "../../../actions/infobank"

import "./Modals.css"

class ShareMod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalvisible: false,
            record: null,
            prevsuser_list: [],
            permissions_required: false,
            prevsusers: []
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    formRef = React.createRef();

    showModal = (record) => {
        let type = record.name.file ? "file" : "folder"
        this.props.get_share_details(record.name.id, type)
        this.setState({
            modalvisible: true,
            record,
            componentSize: "default",
            setComponentSize: "default",
        });
    }

    onCancel() {
        this.setState({
            modalvisible: false,
            permissions_required: false,
        });
    }

    onSubmit = (values) => {
        let type = this.state.record.name.file ? "file" : "folder"
        console.log(values, 'values')
        let shareupdate = JSON.stringify(values.prevsusers) === JSON.stringify(this.state.prevsusers)

        if (shareupdate) {
            delete values['prevsusers']
        }
        else {
            values['prevsusers'].push({
                prevuser: values.owner,
                userpermission: "edit"
            })
        }
        this.props.share(values, this.state.record.name.id, type);
    };

    onSearch = (value) => {
        this.props.usersearch(value)
    }

    componentDidUpdate(prevProps) {
        if (this.props.sharewith) {
            if (prevProps.sharewith != this.props.sharewith) {
                let prevsuser_list = []
                let owner
                this.props.sharewith.map((user, i) => {
                    if (!user.owner) {
                        prevsuser_list.push({
                            prevuser: user.user.email,
                            userpermission: user.permissions
                        })
                    } else {
                        owner = user.user.email
                    }
                })
                this.setState({
                    prevsusers: prevsuser_list,
                })
                if (this.formRef.current) {
                    this.formRef.current.setFieldsValue({
                        prevsusers: prevsuser_list,
                        owner: owner
                    });
                }

            }
        }
    }

    onChange = (value) => {
        if (value.length > 0) {
            this.setState({
                permissions_required: true
            })
        } else {
            this.setState({
                permissions_required: false
            })
        }
    }
    remove = (name) => {
        console.log(name)
    }
    render() {
        const children = [];
        if (this.props.searchuser) {
            this.props.searchuser.map((user, i) => (
                children.push(<Select.Option key={i} value={user.id} >{user.email}</Select.Option>)
            ))
        }
        return (
            <Modal
                destroyOnClose={true}
                title={`Share with people`}
                visible={this.state.modalvisible}
                onCancel={() => this.onCancel()}
                okText="Share"
                okButtonProps={{
                    form: "createfolder",
                    key: "submit",
                    htmlType: "submit",
                    style: {
                        background: '#d24826',
                        border: '#d24826'
                    }
                }}
            >

                <Form
                    preserve={false}
                    ref={this.formRef}
                    id="createfolder"
                    onFinish={this.onSubmit}
                    labelAlign="left"
                    layout="horizontal"
                    size={this.state.componentSize}

                >
                    <Form.Item name="users" label="Share with" rules={[{ required: false }]}>
                        <Select
                            onSearch={this.onSearch}
                            mode="multiple"
                            placeholder="Please select people"
                            onChange={this.onChange}
                            // onSelect={this.onSelect}
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {children}
                        </Select>
                    </Form.Item>
                    <Form.Item name="permission" label="Permission" rules={[{ required: this.state.permissions_required }]}>
                        <Select
                            placeholder="Please select permission"
                            // onChange={handleChange}
                            style={{ width: '100%' }}
                        >
                            <Select.Option value={"view"}>View</Select.Option>
                            <Select.Option value={"edit"}>Edit</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="owner" label="Owner" >
                        <Input readOnly={true} />
                    </Form.Item>
                    <Form.List name="prevsusers">
                        {(fields, { add, remove }) => {
                            return (
                                <div style={{ overflow: "auto" }}>
                                    {fields.map((field) => (
                                        <Space
                                            id={field.key}
                                            key={field.key}
                                            style={{ display: "flex", marginBottom: 8 }}
                                            align="start"
                                            className="formusers"
                                        >
                                            <Form.Item
                                                {...field}
                                                name={[field.name, "prevuser"]}
                                                fieldKey={[field.fieldKey, "prevuser"]}
                                                rules={[
                                                    { required: true, message: "Missing user name" },
                                                ]}
                                            >
                                                <Input style={{ width: '292px' }} readOnly={true} />
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                name={[field.name, "userpermission"]}
                                                fieldKey={[field.fieldKey, "userpermission"]}
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: "Missing Selected values",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Please select permission"
                                                    // onChange={handleChange}
                                                    style={{ width: '150px' }}
                                                >
                                                    <Select.Option value={"view"}>View</Select.Option>
                                                    <Select.Option value={"edit"}>Edit</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        </Space>
                                    ))}

                                    {/* <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            block
                                        >
                                            <PlusOutlined /> Add Filter
                                        </Button>
                                    </Form.Item> */}
                                </div>
                            );
                        }}
                    </Form.List>

                </Form>
                {!this.props.loading_sharewith ? null : <p style={{ textAlign: 'center' }}><Spin size="small" /></p>}
            </Modal>
        );
    }
}
const mapStateToProps = (state) => ({
    searchuser: state.users.searchuser,
    sharewith: state.infobank.sharewith,
    loading_sharewith: state.infobank.loading_sharewith,
});

export default connect(mapStateToProps, { usersearch, get_share_details })(ShareMod)
