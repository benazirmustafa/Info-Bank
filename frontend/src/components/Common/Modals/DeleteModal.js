import React, { Component } from "react";
import { Modal } from "antd";

class DeleteModal extends Component {
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
      record
    });
  }
  onCancel() {
    this.setState({
      modalvisible: false,
    });
  }
  onOk = () => {
    let type = this.state.record.name.file ? "file" : "folder"
    this.props.deleteValues(this.state.record.name.id, type);
  };
  render() {
    if (!this.state.record) {
      return null
    }

    let type = this.state.record.name.file ? "file" : "folder"

    return (
      <Modal
        destroyOnClose={true}
        title={`Delete ${type}: ${this.state.record.name.name}`}
        visible={this.state.modalvisible}
        onCancel={() => this.onCancel()}
        okText="Delete"
        onOk={this.onOk}
        okButtonProps={{ style: { background: '#c10618', border: '#c10618' } }}
      >
        {`Do you Really Want to delete this ${type} `}<b>{this.state.record.name.name}</b> {` ?`}
      </Modal>
    );
  }
}

export default DeleteModal;
