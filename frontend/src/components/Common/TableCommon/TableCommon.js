import React, { Component } from "react";
import { Table } from "antd";
import "./TableCommon.css";
class TableCommon extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (

            <Table
                columns={this.props.columns}
                dataSource={this.props.data}
                tableLayout="auto"
                size="small"
                scroll={{ x: "max-content" }}
                loading={this.props.loading}
                bordered
                // onChange={this.handleTableChange}
                pagination={{
                    pageSize: this.props.pageSize,
                    position: ["topRight"],
                    total: this.props.count,
                    onChange: this.props.pagechange,
                    size: "large",
                    hideOnSinglePage: true,
                    // simple: true,
                    current: this.props.currentpage,
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
            />
        );
    }
}

export default TableCommon;
