import React, { Component } from 'react';
import { Layout, Table, Breadcrumb, Button, Space, Avatar, Skeleton } from 'antd';
import { InfoCircleOutlined, ShareAltOutlined, DeleteOutlined, EditOutlined, FileAddOutlined, FolderAddOutlined, FolderOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { category_details, get_share_details, addFolder, addFile, folder_details, editFile, editFolder, deleteFolder, deleteFile, share, downloadFile } from "../../../actions/infobank"
import TopNav from '../../Layout/TopNav/TopNav'
import AddFolder from "../../Common/Modals/AddFolder"
import AddFile from "../../Common/Modals/AddFile"
import DeleteModal from "../../Common/Modals/DeleteModal"
import SidePannel from '../../Layout/SidePannel/SidePannel'
import EditModal from '../../Common/Modals/EditModal';
import ShareMod from '../../Common/Modals/ShareMod';
import FooterSection from '../../Layout/FooterSection/FooterSection'
import pdf from "../icons/pdf.png";
import word from "../icons/word.png";
import powerpoint from "../icons/powerpoint.png";
import "./Contents.css"
const { Content } = Layout;

class Contents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      limit: 5,
      offset: 0,
      page: 1,
      currentpage: 1,
      sharewith: [],
      show_share_mod: false,
      sidepannel_details: null
    };
  }
  toggle = (record) => {
    let details
    // if (this.state.collapsed) {
    let type = "folder"
    let id
    if (record) {
      id = record.name.id
      type = record.name.file ? "file" : "folder"
      details = record.name
    } else {
      id = this.props.match.params.id
      details = this.props.details.folder
    }
    this.props.get_share_details(id, type)
    // }
    this.setState({
      // collapsed: !this.state.collapsed,
      collapsed: false,
      sidepannel_details: details
    });
  };
  CreateFolder = () => {
    this.refs.childaddfolder.showModal();
  }
  UploadFile = () => {
    this.refs.childaddfile.showModal();
  }
  share = (body, id, type) => {
    body.id = id
    var details_type = this.props.match.params.category ? "category" : "folder"
    var details_value = this.props.match.params.category ? this.props.match.params.category : this.props.match.params.id
    this.props.share(body, type, details_type, details_value)
    this.childsharemod.onCancel();
  }
  closeSidebar = () => {
    this.setState({
      collapsed: true,
    });
  }
  share_mod(record) {
    this.setState({
      collapsed: true,
    });
    this.childsharemod.showModal(record);
  }
  delete_mod = (record) => {
    this.setState({
      collapsed: true,
    });
    this.refs.childdeletemod.showModal(record);
  }
  Edit(record) {
    this.setState({
      collapsed: true,
    });
    this.refs.childedit.showModal(record);
  }
  deleteValues = (id, type) => {
    let content_type, content_value
    if (this.props.match.params.category) {
      content_type = "category"
      content_value = this.props.match.params.category
    }
    else {
      content_type = "folder"
      content_value = this.props.match.params.id
    }
    if (type === "file") {
      this.props.deleteFile(id, content_type, content_value)
    }
    if (type === "folder") {
      this.props.deleteFolder(id, content_type, content_value)
    }
    this.refs.childdeletemod.onCancel();

  }
  editdata = (body, type, id) => {
    if (body.description == null) {
      delete body['description']
    }
    let content_type, content_value
    if (this.props.match.params.category) {
      content_type = "category"
      content_value = this.props.match.params.category
    }
    else {
      content_type = "folder"
      content_value = this.props.match.params.id
    }
    if (type === "file") {
      this.props.editFile(body, id, content_type, content_value)
    }
    if (type === "folder") {
      this.props.editFolder(body, id, content_type, content_value)
    }
    this.refs.childedit.onCancel();
  }
  addFolder = (body) => {
    body.category = this.props.details.category ? this.props.details.category.id : this.props.details.folder ? this.props.details.folder.category : null
    body.parent_directory = this.props.details.folder ? this.props.details.folder.id : null;
    body.owners = [this.props.user.id]
    body.created_by = this.props.user.id
    let content_type, content_value
    if (this.props.match.params.category) {
      content_type = "category"
      content_value = this.props.match.params.category
    }
    else {
      content_type = "folder"
      content_value = this.props.match.params.id
    }
    this.props.addFolder(body, content_type, content_value)
    this.refs.childaddfolder.onCancel();
  }
  addFile = (body) => {
    var formData = new FormData();
    formData.append("name", body.name);
    if (body.description != null) {
      formData.append("description", body.description);
    }

    formData.append("file", body.file.fileList[body.file.fileList.length - 1].originFileObj);
    if (!this.props.details.category) {
      formData.append("folder", this.props.details.folder ? this.props.details.folder.id : null);

    }
    formData.append("category", this.props.details.category ? this.props.details.category.id : this.props.details.folder ? this.props.details.folder.category : null);
    formData.append("created_by", this.props.user.id);
    let content_type, content_value
    if (this.props.match.params.category) {
      content_type = "category"
      content_value = this.props.match.params.category
    }
    else {
      content_type = "folder"
      content_value = this.props.match.params.id
    }
    this.props.addFile(formData, content_type, content_value)
    this.refs.childaddfile.onCancel();
  }
  componentDidMount() {
    if (this.props.match.params.category) {
      this.props.category_details(this.props.match.params.category)
    }
    else {
      this.props.folder_details(this.props.match.params.id)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.category != prevProps.match.params.category ||
      this.props.match.params.id != prevProps.match.params.id) {
      this.setState({
        collapsed: true,
      });
      if (this.props.match.params.category) {
        this.props.category_details(this.props.match.params.category)
      }
      else {
        this.props.folder_details(this.props.match.params.id)
      }
      if (prevProps.details != this.props.details) {
        if (this.props.match.params.category) {
          this.props.category_details(this.props.match.params.category)
        }
        else {
          this.props.folder_details(this.props.match.params.id)
        }
      }
    }


  }
  download(path) {
    this.props.downloadFile(path.file, path.name)
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '30%',
        key: 'name',
        render: (text, record) => (
          console.log(this.props.match.params),
          // <Button type="link" onClick={() => this.download(text.file)}>{text.name}</Button></div>
          text.file ?
            <div>{text.file.split('.').pop() === "pdf" ? <Avatar size={15} src={pdf} /> :
              text.file.split('.').pop() === "docx" ? <Avatar size={15} src={word} /> :
                text.file.split('.').pop() === "pptx" ? <Avatar size={15} src={powerpoint} /> : null
            } <Button type="link" onClick={() => this.download(text)}>{text.name}</Button></div>
            : <Link to={`/app/${this.props.match.params.category ? this.props.match.params.category : this.props.match.params.category_type}/folder/${text.id}`}><FolderOutlined style={{ marginRight: 5 }} /> {text.name}</Link>
        )
      },
      {
        title: 'Description',
        dataIndex: 'description',
        width: '50%',
        key: 'description',
      },
      {
        title: 'Action',
        key: 'action',
        width: '20%',
        render: (text, record) => (
          record.name.permission == "edit" ?
            <Space size="middle">
              <Button icon={<ShareAltOutlined />} onClick={() => this.share_mod(record)}>Share</Button>
              <Button icon={<EditOutlined />} onClick={() => this.Edit(record)}>Edit</Button>
              <Button icon={<DeleteOutlined />} onClick={() => this.delete_mod(record)}>Delete</Button>
              <Button onClick={() => this.toggle(record)} style={{ float: 'right', marginLeft: 5 }} shape="circle" icon={<InfoCircleOutlined />} />
            </Space>
            : null
        ),
      },
    ];
    let type, data;
    if (this.props.details) {
      type = this.props.details.category ? this.props.details.category : this.props.details.folder ? this.props.details.folder : []
      data = type.folders.map((folder, i) => {
        return {
          key: i,
          name: folder,
          description: folder.description,
        }
      })
      let count = type.folders.length
      type.files.map((file, i) => {
        data.push({
          key: i + count,
          name: file,
          description: file.description,
        })
      })
    }

    console.log(this.props.match.params.category, "this.props.match.params.category")
    return (
      <Layout style={{ minHeight: "100%" }}>
        <TopNav banner={false} />
        <Layout>
          <Content
            className="site-layout-background"
            style={{
              padding: '24px 5%',
              margin: 0,
              minHeight: 'auto'
            }}
          >
            {this.props.details ?
              <div>
                <Breadcrumb style={{ overflowWrap: 'anywhere', fontSize: 16 }} separator=">">
                  <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                  {/* <Breadcrumb.Item><Link to={`/app/category/${type.category_slug}`}>{this.props.match.params.category == "shared" ? "Shared" : type.category_name}</Link></Breadcrumb.Item> */}
                  <Breadcrumb.Item><Link to={`/app/category/${this.props.match.params.category ? this.props.match.params.category : this.props.match.params.category_type}`}>{this.props.match.params.category ? this.props.match.params.category.charAt(0).toUpperCase() + this.props.match.params.category.slice(1) : this.props.match.params.category_type.charAt(0).toUpperCase() + this.props.match.params.category_type.slice(1)}</Link></Breadcrumb.Item>
                  {this.props.details.breadcumbs ?
                    this.props.details.breadcumbs.map((item, i) => (
                      item.permission ?
                        <Breadcrumb.Item key={i}><Link to={`/app/${this.props.match.params.category ? this.props.match.params.category : this.props.match.params.category_type}/folder/${item.id}`}>{item.name}</Link></Breadcrumb.Item> : null
                    )) :
                    null
                  }
                </Breadcrumb>
                <div style={{
                  padding: '8px 0px',
                  float: 'right'
                }}>

                  {(this.props.details.can_upload && this.props.match.params.category_type) || this.props.match.params.category == "personal" ?
                    <Button onClick={this.UploadFile} style={{}} icon={<FileAddOutlined />}><span id="mob_title">Upload File</span></Button>
                    : null}
                  {(this.props.details.can_add_folder && this.props.match.params.category_type) || this.props.match.params.category == "personal" ?
                    <Button onClick={this.CreateFolder} style={{ marginLeft: 5, background: '#71a29a', color: 'white' }} icon={<FolderAddOutlined />}><span id="mob_title">New Folder</span></Button>
                    : null}
                  {
                    this.props.match.params.category ? null : <Button onClick={() => this.toggle(null)} style={{ marginLeft: 5 }} shape="circle" icon={<InfoCircleOutlined />} />
                  }
                </div>
              </div>

              : <Skeleton paragraph={true} loading={true} />

            }

            <Table tableLayout="auto"
              size="small"
              scroll={{ x: "max-content" }}
              columns={columns}
              loading={this.props.details ? false : true}
              pagination={false}
              dataSource={data} />

            <AddFolder
              ref={"childaddfolder"}
              addFolder={this.addFolder} />

            <AddFile
              ref={"childaddfile"}
              addFile={this.addFile} />

            <EditModal
              ref={"childedit"}
              edit={this.editdata} />
            <DeleteModal
              ref={"childdeletemod"}
              deleteValues={this.deleteValues}
            />
            <ShareMod
              onRef={ref => (this.childsharemod = ref)}
              share={this.share}
            // sharewith={this.props.sharewith}
            // usersearch={this.usersearch}
            />
          </Content>
          <SidePannel
            closeSidebar={this.closeSidebar}
            collapsed={this.state.collapsed}
            details={this.state.sidepannel_details} />
        </Layout>
        <FooterSection />
      </Layout>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  details: state.infobank.details,
  sharewith: state.infobank.sharewith
});

export default connect(mapStateToProps, { downloadFile, share, get_share_details, folder_details, category_details, addFolder, addFile, editFile, editFolder, deleteFile, deleteFolder })(Contents);
