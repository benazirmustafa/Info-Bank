import React, { Component } from "react";
import { Modal, Form, Input, Select } from "antd";
import { connect } from "react-redux";
import { get_groups, get_designations } from "../../../actions/auth"
import { usersearch } from "../../../actions/users"

class CreateUser extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            modalvisible: false,
            row_id: null,
            serial: null,
            admin: null,
        };
    }
    componentDidMount() {
        this.props.get_groups()
        this.props.get_designations()
    }
    componentDidUpdate(prevprops) {
        if ((this.props.groups != prevprops.groups || this.props.designations != prevprops.designations) & this.state.modalvisible) {
            this.props.get_groups()
            this.props.get_designations()
        }
    }
    showModal() {
        this.setState({
            modalvisible: true,
            componentSize: "default",
            setComponentSize: "default",
        });
    }

    onCancel() {
        this.setState({
            modalvisible: false,
        });
    }
    Isadmin = (e) => {
        this.setState({
            admin: e.target.checked,
        });
    };
    onSubmit = (values) => {
        this.props.Create_User(values);
    };
    onSearch = (value) => {
        this.props.usersearch(value)
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
                width={596}
                destroyOnClose={true}
                title={`Create User`}
                visible={this.state.modalvisible}
                onCancel={() => this.onCancel()}
                okText="Create"
                okButtonProps={{
                    form: "updateform",
                    key: "submit",
                    htmlType: "submit",
                    style: {
                        background: '#d24826',
                        border: '#d24826'
                    }
                }}
            >
                <Form
                    ref={this.formRef}
                    preserve={false}
                    id="updateform"
                    onFinish={this.onSubmit}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    labelAlign="left"
                    layout="horizontal"

                >
                    <Form.Item
                        label="Email address"
                        name="email"
                        rules={[{ required: true, type: 'email', message: "Please input user name!" }]}
                    >
                        <Input placeholder="Email address" />
                    </Form.Item>
                    <Form.Item label="Employee Name" style={{ marginBottom: 0 }}  >
                        <Form.Item
                            name="first_name"
                            rules={[{ required: true, message: "Please input first name!" }]}
                            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                        >
                            <Input placeholder="Fisrt Name" />
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            rules={[{ required: false }]}
                            style={{
                                display: "inline-block",
                                width: "calc(50% - 8px)",
                                margin: "0 8px",
                            }}
                        >
                            <Input placeholder="Last Name" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Employee ID"
                        name="employee_id"
                        rules={[{ required: true, message: "Please input Employee ID!" }]}
                    >
                        <Input placeholder="Employee ID" />
                    </Form.Item>
                    <Form.Item
                        label="Department"
                        name="groups"
                        rules={[{ required: true, message: "Please input Department!" }]}
                    >
                        <Select allowClear mode="multiple">
                            {this.props.groups ? this.props.groups.results.map((grp, i) => (
                                <Select.Option key={i} value={grp.id}>
                                    {grp.name}
                                </Select.Option>
                            )) : null}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[{ required: true, message: "Please input Designation!" }]}
                    >
                        <Select allowClear>
                            {this.props.designations ? this.props.designations.results.map((des, i) => (
                                <Select.Option key={i} value={des.id}>
                                    {des.title}
                                </Select.Option>
                            )) : null}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Reports To"
                        name="reports_to"
                        rules={[{ required: true, message: "Please input Reports to!" }]}
                    >
                        <Select
                            onSearch={this.onSearch}
                            showSearch
                            allowClear
                            placeholder="Please select user"
                            // onChange={this.onChange}
                            // onSelect={this.onSelect}
                            style={{ width: '100%' }}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {children}
                        </Select>
                    </Form.Item>
                    {/* {this.state.admin ? null : ( */}
                    {/* <Form.Item
                        label="Choose Permission Type"
                        name="perm_type"
                        rules={[
                            {
                                required: true,
                                message: "Please input user group permission!",
                            },
                        ]}
                    >
                        <Select mode="multiple">
                            <Select.Option value={'y'}>
                                Select Permission Type
                                        </Select.Option>

                        </Select>
                    </Form.Item> */}

                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => ({
    groups: state.auth.groups,
    designations: state.auth.designations,
    searchuser: state.users.searchuser,
});

export default connect(mapStateToProps, { get_groups, get_designations, usersearch }, null, {
    forwardRef: true,
})(CreateUser);