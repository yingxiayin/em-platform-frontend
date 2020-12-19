import React, { FC, useState, useEffect } from 'react';
import styles from './styles.less';
import { Avatar, Button, Dropdown, Layout, Menu, Row, Col, Modal } from 'antd';
import { OrderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, useRouteMatch } from 'dva';
import TransferComponent from '@/components/Transfer';
import UploadComponent from '@/components/Upload';
import TimerComponent from '@/components/Timer';
import FormComponent from '@/components/Form';
import { ConnectState } from '@/models/connect';
import router from 'umi/router';

const { Header, Content, Footer } = Layout;

const TransferPage: FC = () => {
  const match = useRouteMatch('/transfer/:id');
  const { transfer } = useSelector<ConnectState, ConnectState>(state => state);
  const [isVideoPlayDone, handleVideoPlayDone] = useState<boolean>(false);
  const [isResultImageDone, handleResultImageDone] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { resultUrl } = transfer;
  const dispatch = useDispatch();
  let uid: string = '0';
  if (match !== null) {
    uid = match.params.id;
  }

  useEffect(() => {
    if (resultUrl !== '0') {
      handleResultImageDone(true);
    }
  }, [resultUrl]);

  const handleLoginMenuClick = () => {
    window.location.href = '/login';
    dispatch({
      type: 'user/logout',
      payload: {},
    });
  };

  const handleStartExperimentBtn = () => {
    handleVideoPlayDone(true);
    window.localStorage.clear();
  };

  const handleNextStepBtn = () => {
    if (Number(uid) % 2 === 0) {
      router.push('/notransfer/' + uid);
      window.localStorage.clear();
      dispatch({
        type: 'transfer/save',
        payload: { resultUrl: '0' },
      });
    } else {
      setIsModalVisible(true);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => handleLoginMenuClick()}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className={styles.layout}>
      <Modal title="Next Step" visible={isModalVisible} footer={null} closable={false}>
        <p>请参与实验访谈</p>
        <p>Please take part in the experiment interview</p>
      </Modal>
      <Header className={styles.header}>
        <div className={styles.logo} />
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar className={styles.avatar} icon={<UserOutlined />} />
        </Dropdown>
      </Header>
      {isVideoPlayDone ? (
        <>
          <Content className={styles.task_content}>
            <div className={styles.in_content}>
              <Row>
                <Col span={16}>
                  <Button type="primary">
                    <OrderedListOutlined />
                    Design Task
                  </Button>
                  <p>请设计师根据荷兰用户的具体需求，设计一款工作环境中使用的荷兰风格口罩。</p>
                  <p>
                    The designer is asked to design a Dutch style mask used in the work environment
                    according to the specific needs of Dutch users.
                  </p>
                </Col>
                <Col span={8}>
                  <Button type="primary">
                    <OrderedListOutlined />
                    Timer
                  </Button>
                  <p>请注意实验时间！/ Please pay attention to the experiment time!</p>
                  <TimerComponent allTime={1800000} />
                </Col>
              </Row>
            </div>
          </Content>
          <Content className={styles.content}>
            <div className={styles.in_content}>
              <TransferComponent />
            </div>
          </Content>
          <Content className={styles.result_content}>
            <div className={styles.in_content}>
              <Button type="primary">
                <OrderedListOutlined />
                Result Upload
              </Button>
              <p>
                完成设计后，请点击上传设计结果，要求：图片格式为JPG，图片大小小于5MB，上传成功后，完成表单填写。
              </p>
              <p>
                After completing the design, please click to upload the design results.
                Requirements: the image format is JPG, and the image size is less than 5MB. After
                the upload is successful, please finish the form.
              </p>
              <UploadComponent
                data={{ uid, type: 'transfer' }}
                id="resultImage"
                className={styles.upload_res}
                listType="picture"
                action="/api/image/result"
                showUploadList={false}
                isButton={true}
                buttonStyle={{ width: '7.5vw' }}
                accept=".jpg,.png"
              />
            </div>
          </Content>
          {isResultImageDone ? (
            <Content className={styles.form_content}>
              <div className={styles.in_content}>
                <Button type="primary">
                  <OrderedListOutlined />
                  Form Pages
                </Button>
                <FormComponent />
                <Button
                  className={styles.next_btn}
                  type="primary"
                  disabled={!isResultImageDone}
                  onClick={() => handleNextStepBtn()}
                >
                  Next Step
                </Button>
              </div>
            </Content>
          ) : (
            ''
          )}
        </>
      ) : (
        <Content className={styles.video_content}>
          <div className={styles.in_content}>
            <Button type="primary">
              <OrderedListOutlined />
              Introduction
            </Button>
            <p>
              该文化风格迁移工具分为左右两侧，左侧为风格迁移工具，右侧为风格学习工具。如操作所示，在右侧可以上传风格图片，识别其风格类型，并通过管理、筛选等操作管理风格库；在左侧可以上传待迁移的原始图片，在选中右侧的风格图后，可以实施风格迁移，同时可以查看原图或下载迁移结果辅助设计。
            </p>
            <p>
              The cultural style transfer tool is divided into left and right sides, with style
              transfer tool on the left and style learning tool on the right. As shown in the
              operation, the style image can be uploaded on the right side to identify its style
              type, and manage the style library through management, filtering and other operations;
              the original image to be migrated can be uploaded on the left side, and the style
              migration can be implemented after the style map on the right side is selected, and
              the original image can be viewed or the migration result can be downloaded to assist
              design.
            </p>
            <div className={styles.video}>
              <iframe
                id="video"
                src="http://culture.designist.cn/static/video.mp4"
                scrolling="no"
                width="100%"
                height="600vw"
              ></iframe>
            </div>
            <Button
              className={styles.start_experiment_btn}
              type="primary"
              onClick={() => handleStartExperimentBtn()}
            >
              Start
            </Button>
          </div>
        </Content>
      )}
      <Footer className={styles.footer}>Web Design ©ZJU 2020-2021</Footer>
    </Layout>
  );
};
export default TransferPage;
