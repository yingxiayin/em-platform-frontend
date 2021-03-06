import React, { FC, useState, useEffect } from 'react';
import styles from './styles.less';
import {
  Affix,
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Card,
  Popover,
  Tag,
  List,
  Row,
  Col,
  message,
  Tooltip,
} from 'antd';
import {
  OrderedListOutlined,
  UserOutlined,
  ZoomInOutlined,
  RedoOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  StopOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch, useLocation, useRouteMatch } from 'dva';
import { ConnectState, ImgTranModelState } from '@/models/connect';
import { ImgInfoType } from '@/models/image';
import UploadComponent from '@/components/Upload';

const { Header, Content, Footer } = Layout;

const _ = require('lodash');

const TransferPage: FC = () => {
  const { transfer } = useSelector<ConnectState, ConnectState>(state => state);
  const { image } = useSelector<ConnectState, ConnectState>(state => state);
  const { user } = useSelector<ConnectState, ConnectState>(state => state);
  const { rawUrl, styleUrl, transferUrl } = transfer;
  const { styleImageList } = image;
  const match = useRouteMatch('/transfer/:id');
  const [isCardEditing, handleCardEditing] = useState<boolean>(false);
  const [isTransferring, handleTransferring] = useState<boolean>(false);
  const [isTransferred, handleTransferResult] = useState<boolean>(false);
  const [cardSelectedId, handleCardSelected] = useState<number>(-1);
  const [isEmptyPreForTrans, handlePreForTrans] = useState<boolean>(false);
  const [currentStyleImageList, handleTypeSelected] = useState<ImgInfoType[]>([
    { id: 0, url: '0', styleList: [] },
  ]);
  const dispatch = useDispatch();
  let uid: string = '0';

  if (match !== null) {
    uid = match.params.id;
  }

  // 请求文件
  useEffect(() => {
    if (uid && uid !== '0') {
      dispatch({
        type: 'image/fetchStyleList',
        payload: { uid: uid },
      });
    }
  }, [uid]);

  useEffect(() => {
    if (transferUrl !== '0') {
      handleTransferring(false);
      handleTransferResult(true);
    }
  }, [transferUrl]);

  useEffect(() => {
    let midStyleImageList: ImgInfoType[] = [{ id: 0, url: '0', styleList: [] }];
    handleTypeSelected(midStyleImageList.concat(styleImageList));
    console.log(currentStyleImageList);
  }, [styleImageList]);

  useEffect(() => {
    if (rawUrl === '0' || styleUrl === '0') {
      handlePreForTrans(false);
    }
    if (rawUrl !== '0' && styleUrl !== '0') {
      handlePreForTrans(true);
    }
  }, [rawUrl, styleUrl]);

  const handleTransferClick = (): void => {
    handleTransferring(true);
    dispatch({
      type: 'transfer/handleImageTransfer',
      payload: { uid: uid, rawUrl: rawUrl, styleUrl: styleUrl },
    });
  };

  const handleDownloadClick = (): void => {
    console.log(
      transferUrl.substring(transferUrl.lastIndexOf('/') + 1, transferUrl.length),
      transferUrl,
    );
  };

  const handleCardClick = (id: number, url: string): void => {
    console.log(id, url);
    handleCardSelected(id);
    dispatch({
      type: 'transfer/save',
      payload: { styleId: id, styleUrl: url },
    });
  };

  const handleDeleteCardClick = (id: number, uid: string): void => {
    dispatch({
      type: 'image/deleteStyleImageById',
      payload: { styleId: id, uid: uid },
    });
  };

  function handleMenuClick(e) {
    let changeList: ImgInfoType[] = [{ id: 0, url: '0', styleList: [] }];

    if (styleImageList.length === 0 && e.key !== '0') {
      message.info('Please upload style images');
    } else {
      switch (e.key) {
        case '1':
          changeList = changeList.concat(
            styleImageList.filter(item => {
              return item.styleList[0].style === 'netherlands';
            }),
          );
          handleTypeSelected(changeList);
          break;
        case '2':
          changeList = changeList.concat(
            styleImageList.filter(item => {
              return item.styleList[0].style === 'others';
            }),
          );
          handleTypeSelected(changeList);
          break;
        case '0':
          handleTypeSelected(changeList.concat(styleImageList));
          break;
      }
    }
  }

  const menuStyle = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">De stijl</Menu.Item>
      <Menu.Item key="2">Others</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="0">All</Menu.Item>
    </Menu>
  );

  const handleLoginMenuClick = () => {
    window.location.href = '/login';
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleLoginMenuClick()}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo} />
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar className={styles.avatar} icon={<UserOutlined />} />
        </Dropdown>
      </Header>
      <Content className={styles.content}>
        <div className={styles.in_content}>
          <Row>
            <Col span={10}>
              <div className={styles.left}>
                <Affix>
                  <Button type="primary">
                    <OrderedListOutlined />
                    Cultural Style Transfer
                  </Button>
                </Affix>
                <p>Please upload your design draft (content image)</p>
                <div className={styles.image}>
                  <div className={styles.image_transfer}>
                    {transferUrl !== '0' ? (
                      <img src={transferUrl} alt="image_transfer" />
                    ) : rawUrl !== '0' ? (
                      <img src={rawUrl} alt="image_raw" />
                    ) : (
                      <div className={styles.image_text}>
                        Please upload your draft (content image)
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.transfer_button_group}>
                  <UploadComponent
                    data={{ uid }}
                    id="rawImage"
                    className={styles.upload_transfer}
                    listType="picture"
                    action="/api/image/raw"
                    showUploadList={false}
                    isButton={true}
                    buttonStyle={{ width: '7.5vw' }}
                    accept=".jpg,.png"
                    disabled={isTransferring}
                  />
                  {isTransferring ? (
                    <Button className={styles.start_transfer} disabled>
                      <LoadingOutlined />
                      Waiting
                    </Button>
                  ) : isEmptyPreForTrans ? (
                    <Button
                      className={styles.start_transfer}
                      type="primary"
                      onClick={() => handleTransferClick()}
                    >
                      <RedoOutlined />
                      Transfer
                    </Button>
                  ) : (
                    <Tooltip
                      placement="topLeft"
                      title="Please upload a image, and then select one of the style images for style transfer"
                    >
                      <Button
                        className={styles.stop_transfer}
                        type="primary"
                        style={{ width: '7.5vw', marginLeft: '1vw' }}
                        disabled
                      >
                        <StopOutlined />
                        Transfer
                      </Button>
                    </Tooltip>
                  )}
                  <Popover
                    placement="rightBottom"
                    content={
                      rawUrl !== '0' ? (
                        <div className={styles.small_raw_area}>
                          <img className={styles.small_raw} src={rawUrl} alt="image_raw" />
                        </div>
                      ) : (
                        <div>Please upload your draft (content image)</div>
                      )
                    }
                    trigger="hover"
                  >
                    <Button className={styles.show_raw} type="dashed" style={{ width: '9.5vw' }}>
                      <ZoomInOutlined />
                      Content image
                    </Button>
                  </Popover>
                </div>
                <a
                  href={transferUrl}
                  download="transfer-res"
                >
                  <Button
                    className={styles.download_btn}
                    type="primary"
                    style={{ width: '9.5vw' }}
                    disabled={!isTransferred||isTransferring}
                    onClick={() => handleDownloadClick()}
                  >
                    <DownloadOutlined />
                    Download
                  </Button>
                </a>
              </div>
            </Col>
            <Col span={14}>
              <div className={styles.right}>
                <Affix>
                  <Button type="primary">
                    <OrderedListOutlined />
                    Cultural Style Dataset
                  </Button>
                </Affix>
                <p className={styles.style_select_text}>
                  Please upload style images, you can select one of the images for style transfer
                </p>
                <Button
                  id="style_edit_button"
                  type="primary"
                  size="small"
                  className={styles.style_edit_button}
                  onClick={() => {
                    handleCardEditing(!isCardEditing);
                  }}
                >
                  {isCardEditing ? 'Close' : 'Manage'}
                  <EditOutlined />
                </Button>
                <Dropdown overlay={menuStyle} placement="bottomRight" trigger={['click']}>
                  <Button
                    id="style_select_button"
                    type="primary"
                    size="small"
                    className={styles.style_select_button}
                  >
                    Select
                    <DownOutlined />
                  </Button>
                </Dropdown>
                <div className={styles.style}>
                  <Col>
                    <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 3,
                        lg: 3,
                        xl: 6,
                      }}
                      dataSource={currentStyleImageList}
                      renderItem={item => (
                        <List.Item>
                          {item.id === 0 ? (
                            <Card
                              className={styles.card_upload_style}
                              key={item.id}
                              hoverable={false}
                              loading={false}
                            >
                              <UploadComponent
                                id="styleImage"
                                className={styles.upload_style}
                                data={{ uid }}
                                listType="picture-card"
                                action="/api/image/style/add"
                                showUploadList={false}
                                isButton={false}
                                buttonStyle={{}}
                                accept=".jpg,.png"
                                disabled={false}
                              />
                            </Card>
                          ) : isCardEditing ? (
                            <Card
                              className={styles.card}
                              key={item.id}
                              loading={false}
                              cover={
                                <div>
                                  <img
                                    className={styles.card_image}
                                    style={{ opacity: 0.3 }}
                                    src={item.url}
                                    alt="style"
                                  />
                                </div>
                              }
                              actions={[
                                <DeleteOutlined
                                  key="delete"
                                  onClick={() => handleDeleteCardClick(item.id, uid)}
                                />,
                              ]}
                            />
                          ) : (
                            <Popover
                              placement="bottom"
                              content={
                                <div>
                                  <p>
                                    <List
                                      dataSource={item.styleList}
                                      renderItem={item => (
                                        <Tag color="blue">
                                          {(item.style === 'netherlands' ? 'De stijl' : 'Others') +
                                            ': ' +
                                            item.num * 100 +
                                            '%'}
                                        </Tag>
                                      )}
                                    ></List>
                                  </p>
                                </div>
                              }
                            >
                              {cardSelectedId === item.id ? (
                                <Card
                                  className={styles.card_selected}
                                  key={item.id}
                                  hoverable={true}
                                  onClick={() => handleCardClick(item.id, item.url)}
                                  loading={false}
                                  cover={
                                    <div>
                                      <img
                                        className={styles.card_image}
                                        src={item.url}
                                        alt="style"
                                      />
                                    </div>
                                  }
                                />
                              ) : (
                                <Card
                                  className={styles.card}
                                  key={item.id}
                                  hoverable={true}
                                  onClick={() => handleCardClick(item.id, item.url)}
                                  loading={false}
                                  cover={
                                    <div>
                                      <img
                                        className={styles.card_image}
                                        src={item.url}
                                        alt="style"
                                      />
                                    </div>
                                  }
                                />
                              )}
                            </Popover>
                          )}
                        </List.Item>
                      )}
                    />
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className={styles.footer}>Web Design ©2020 Created by Seth</Footer>
    </Layout>
  );
};
export default TransferPage;
