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
                <FormComponent type={true} />
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
              该文化风格迁移工具主要分为两个部分：左侧的风格迁移工具和右侧的风格图片管理工具。如视频所示，用户可以上传任意风格图片至右侧风格图片库。系统会对上传的风格图片进行风格分类并给出参考数值。用户可以筛选和管理风格图片库。用户可以上传任意内容图片至左侧，选择右侧的风格图片并点击“迁移”，系统将实施风格迁移，过程持续几秒钟。迁移完成后，用户可以查看原图或者下载迁移后的图片。用户可以使用任意图片进行风格迁移辅助设计，比如产品草图。
            </p>
            <p>
              The cultural style transfer tool is mainly divided into two parts: the style transfer
              tool on the left side and the style image management tool on the right side. As shown
              in the video, users can upload any style image to the style image library on the right
              side. The system will classify the uploaded style image and provide a reference value.
              Users can filter and manage the style image library. Users can upload any content
              image on the left, select the style image on the right and click "Transfer". The
              system will implement the style transfer, and the process lasts for several seconds.
              After the transfer, users can view the original image or download the transferred
              image. Users can use any image for style transfer to facilitate the design process,
              such as product sketch.
            </p>
            <div className={styles.video}>
              <iframe
                id="video"
                src="http://culture.designist.cn/static/video/teach-video.mp4"
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
