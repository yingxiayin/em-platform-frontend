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
  const [isVideoPlayDone, handleVideoPlayDone] = useState<boolean>(() => {
    const isVideoPlayDoneRecord = window.localStorage.getItem('isVideoPlayDone');
    if (isVideoPlayDoneRecord) {
      return true;
    } else {
      return false;
    }
  });
  const [isResultImageDone, handleResultImageDone] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimeOut, handleTimeOut] = useState<boolean>(false);
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
    window.localStorage.setItem('isVideoPlayDone', 'true')
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
                <Col span={10}>
                  <Button type="primary">
                    <OrderedListOutlined />
                    Design Task
                  </Button>
                  <p>
                    请中国设计师和荷兰被试沟通，合作为荷兰用户设计一款能够在工作时使用的口罩。口罩设计需要满足荷兰用户的普遍需求，并具有荷兰风格派的艺术风格。
                    （荷兰风格派又称新造型主义画派，由蒙德里安等人在荷兰创立，多用单纯的色彩和几何形象来表现纯粹的精神。）
                  </p>
                  <p>
                    Chinese designers and Dutch participant are invited to communicate and
                    collaborate to design a mask that can be used at work for Dutch users. Mask
                    design should meet the general needs of Dutch users and have the artistic style
                    of DeStijl. (DeStijl, also known as Neo-plasticism, was founded by Mondrian and
                    others in Netherlands. It normally uses simple colors and geometric images to
                    express the pure spirit.)
                  </p>
                </Col>
                <Col span={13} offset={1}>
                  <Button type="primary">
                    <OrderedListOutlined />
                    Design Tips
                  </Button>
                  <p>
                    设计师需要使用此文化风格迁移设计工具来完成设计任务，也可以结合使用其他熟悉的设计工具。
                    至少一位设计师需要共享屏幕以让荷兰被试了解设计的全流程，并给出建议。
                    任务限时30分钟，倒计时结束将无法再设计，必须提交设计作品，请管理好时间。
                  </p>
                  <p>
                    Designers need to use this cultural style transfer design tool to complete the
                    design task, and can also combine with other familiar design tools. At least one
                    designer needs to share the screen to let Dutch subjects watch the whole design
                    process and give suggestions. The task is limited to 30 minutes. You will not be
                    able to design after the countdown. You must submit the design work. Please
                    manage the time.
                  </p>
                  <p style={{ fontWeight: 'bold' }}>
                    如果您在设计过程中遇到系统错误或者运算超时，请刷新网页重试。任何情况下，请不要关闭网页或者返回，这将导致任务失败。
                  </p>
                  <p style={{ fontWeight: 'bold' }}>
                    If you encounter a system error or operation timeout during the design process,
                    please refresh the web page and try again. In any case, please do not close the
                    web page or go back, which will cause the task to fail.
                  </p>
                  <a
                    style={{ fontWeight: 'bold' }}
                    href="https://culture.designist.cn/static/img/transfer-template.psd"
                    download="transfer-template.psd"
                  >
                    下载 / Download
                  </a>
                  <p style={{ fontWeight: 'bold' }}>
                    请注意任务时间！ Please pay attention to the time for the task!
                  </p>
                  <TimerComponent allTime={1800000} handleTimeOut={handleTimeOut} />
                </Col>
              </Row>
            </div>
          </Content>
          <Content className={styles.content}>
            <div className={styles.in_content}>
              <TransferComponent />
            </div>
          </Content>
          {isTimeOut ? (
            <Content className={styles.result_content}>
              <div className={styles.in_content}>
                <Button type="primary">
                  <OrderedListOutlined />
                  Upload Outcome
                </Button>
                <p>
                  完成设计任务后，请点击上传设计结果，要求：图片格式为JPG，图片尺寸小于5MB。上传成功后，请填写问卷。
                </p>
                <p>
                  After completing the design task, please click to upload the design outcome.
                  Requirements: the image format is JPG, and the image size is less than 5MB. After
                  the upload is successful, please fill in the questionnaire.
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
          ) : (
            ''
          )}
          {isResultImageDone ? (
            <Content className={styles.form_content}>
              <div className={styles.in_content}>
                <Button type="primary">
                  <OrderedListOutlined />
                  Questionnaires
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
              您可以多次观看视频以充分了解该AI辅助设计工具的使用流程。如您确定已经了解，请点击"start"进入设计任务。
            </p>
            <p>
              You can watch the video many times to fully understand the process of using the
              AI-supported design tool. If you are sure you understand the usage, please click
              "start" to enter the design task.
            </p>
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
                src="https://culture.designist.cn/static/video/teach-video.mp4"
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
