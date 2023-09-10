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
        console.log('oooooo', record)
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
        this.props.deleteValues(this.state.record.id);
    };
    render() {
        if (!this.state.record) {
            return null
        }


        return (
            <Modal
                destroyOnClose={true}
                title={`Delete User`}
                visible={this.state.modalvisible}
                onCancel={() => this.onCancel()}
                okText="Delete"
                onOk={this.onOk}
                okButtonProps={{ style: { background: '#c10618', border: '#c10618' } }}
            >
                {`Do you Really Want to delete this user ? `}
            </Modal>
        );
    }
}

export default DeleteModal;
