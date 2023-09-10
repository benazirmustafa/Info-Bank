import React, { Component } from "react";
import { Upload, Modal, Row, Col, Progress } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import "./UploadFile.css";
const { Dragger } = Upload;

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadvisible: false,
            ProgressVisible: false,
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentDidUpdate(prevprops) {
        if (this.props.percentCompleted !== prevprops.percentCompleted) {
            if (this.props.percentCompleted === 100) {
                this.setState({
                    uploadvisible: false,
                });
                // message.success("Excel File Uploaded Successfully");
            }
        }
    }
    Request = (info) => {
        this.setState({
            ProgressVisible: true,
        });
        var formData = new FormData();
        formData.append(
            "filename",
            info.fileList[info.fileList.length - 1].originFileObj
        );

        this.props.actionupload(
            formData
        );

    };
    showModal() {
        this.setState({
            uploadvisible: true,
            ProgressVisible: false,
        });
    }
    onCancel = (e) => {
        this.setState({
            uploadvisible: false,
            ProgressVisible: false,
        });
    };
    render() {
        return (
            <Modal
                title="Upload Excel"
                visible={this.state.uploadvisible}
                // cancelButtonProps={{ style: { display: "none" } }}
                onCancel={this.onCancel}
                okButtonProps={{ style: { display: "none" } }}
            >
                <Row justify="center">
                    <Col>
                        <Dragger
                            onChange={this.Request}
                            beforeUpload={() => false}
                            showUploadList={false}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
              </p>
                            {/* <p className="ant-upload-hint">Support for a single or bulk upload.</p> */}
                        </Dragger>
                        {this.state.ProgressVisible ? (
                            <Progress
                                strokeLinecap="square"
                                percent={this.props.percentCompleted}
                            />
                        ) : null}
                    </Col>
                </Row>
            </Modal>
        );
    }
}
const mapStateToProps = (state) => ({
    percentCompleted: state.auth.percentCompleted,
});

export default connect(mapStateToProps)(UploadFile);
