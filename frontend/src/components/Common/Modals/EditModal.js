import React, { Component } from "react";
import { Modal, Form, Input } from "antd";

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalvisible: false,
      record: null
    };
  }

  showModal(record) {
    this.setState({
      modalvisible: true,
      record: record,
      componentSize: "default",
      setComponentSize: "default",
    });
  }
  onCancel() {
    this.setState({
      modalvisible: false,
    });
  }

  onSubmit = (body) => {
    let type = this.state.record.name.file ? "file" : "folder"
    this.props.edit(body, type, this.state.record.name.id);
  };
  render() {
    if (!this.state.record) {
      return null
    }
    return (
      <Modal
        destroyOnClose={true}
        title={`Update ${this.state.record.name.file ? "File" : "Folder"}`}
        visible={this.state.modalvisible}
        onCancel={() => this.onCancel()}
        okText="Update"
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
          initialValues={{
            name: this.state.record.name.name,
            description: this.state.record.description
          }}
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

export default EditModal;
