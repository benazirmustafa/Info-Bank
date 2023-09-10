import React, { Component } from "react";
import { Modal, Form, Input, Select } from "antd";
import { get_groups, get_designations } from "../../../actions/auth"
import { usersearch } from "../../../actions/users"
import { connect } from "react-redux";

class UpdateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalvisible: false,
            record: null,
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
    showModal(record) {
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
        });
    }

    onSubmit = (values) => {
        this.props.updateValues(this.state.record.id, values);
    };
    render() {
        if (!this.state.record) {
            return null;
        }
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
                title={`Edit User`}
                visible={this.state.modalvisible}
                onCancel={() => this.onCancel()}
                okText="Update"
                okButtonProps={{
                    form: "updateform",
                    key: "submit",
                    htmlType: "submit",
                }}
            >
                <Form
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
                    initialValues={{
                        email: this.state.record.email,
                        first_name: this.state.record.first_name,
                        last_name: this.state.record.last_name,
                        employee_id: this.state.record.employee_id,
                        groups: this.state.record.groups,
                        designation: this.state.record.designation,
                        reports_to: this.state.record.reports_to,
                    }}
                >
                    <Form.Item
                        label="Email address"
                        name="email"
                        rules={[{ required: true, type: 'email', message: "Please input user name!" }]}
                    >
                        <Input placeholder="Email address" />
                    </Form.Item>
                    <Form.Item label="Employee Name" style={{ marginBottom: 0 }}>
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
})(UpdateModal);