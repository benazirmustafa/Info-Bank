import React, { Component } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';


class AddFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalvisible: false,
      filename: null
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
      filename: null,
    });
  }
  FileChange = (info) => {
    console.log(info.file.name)
    this.setState({
      filename: info.file.name,
    });
  }
  onSubmit = (values) => {
    this.props.addFile(values);
  };
  render() {

    return (
      <Modal
        destroyOnClose={true}
        title={`Upload File`}
        visible={this.state.modalvisible}
        onCancel={() => this.onCancel()}
        okText="Upload"
        okButtonProps={{
          form: "createfile",
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
          id="createfile"
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
          <Form.Item name="name" label="Name"
            rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="file"
            label="Select File"
          >
            <Upload
              beforeUpload={() => false}
              showUploadList={false}
              onChange={this.FileChange}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
              <p style={{ marginTop: 10 }}>{this.state.filename}</p>
            </Upload>
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default AddFile;
