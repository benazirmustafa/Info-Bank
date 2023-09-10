import React, { Component } from "react";
import { Modal, Form, Input } from "antd";

class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalvisible: false,
    };
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

  onSubmit = (values) => {
    this.props.addFolder(values, this.state.record);
  };
  render() {

    return (
      <Modal
        destroyOnClose={true}
        title={`Create New Folder`}
        visible={this.state.modalvisible}
        onCancel={() => this.onCancel()}
        okText="Create"
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
          id="createfolder"
          onFinish={this.onSubmit}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          labelAlign="left"
          layout="horizontal"
          size={this.state.componentSize}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AddFolder;
