import React, { FC, useState, useEffect } from 'react';
import styles from './styles.less';
import { Avatar, Button, Dropdown, Layout, Menu, Row, Col, Modal } from 'antd';
import { OrderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, useRouteMatch } from 'dva';
import UploadComponent from '@/components/Upload';
import TimerComponent from '@/components/Timer';
import FormComponent from '@/components/Form';
import { ConnectState } from '@/models/connect';
import router from 'umi/router';
const { Header, Content, Footer } = Layout;

const NoTransferPage: FC = () => {
  const match = useRouteMatch('/notransfer/:id');
  const { transfer } = useSelector<ConnectState, ConnectState>(state => state);
  const { resultUrl } = transfer;
  const [isResultImageDone, handleResultImageDone] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimeOut, handleTimeOut] = useState<boolean>(false);
  const dispatch = useDispatch();

  let uid: string = '0';
  console.log(window.localStorage.getItem('recordLastTime'));

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
  };

  const handleNextStepBtn = () => {
    if (Number(uid) % 2 === 0) {
      setIsModalVisible(true);
    } else {
      router.push('/transfer/' + uid);
      window.localStorage.clear();
      dispatch({
        type: 'transfer/save',
        payload: { resultUrl: '0' },
      });
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
      <Content className={styles.task_content}>
        <div className={styles.in_content}>
          <Row>
            <Col span={10}>
              <Button type="primary">
                <OrderedListOutlined />
                Design Task
              </Button>
              <p>
                请中国设计师和荷兰被试沟通，合作为荷兰用户设计一款能够在休闲和娱乐时使用的口罩。口罩设计需要满足荷兰用户的普遍需求，并具有荷兰风格派的艺术风格。
                （荷兰风格派又称新造型主义画派，由蒙德里安等人在荷兰创立，多用单纯的色彩和几何形象来表现纯粹的精神。）
              </p>
              <p>
                Chinese designers and Dutch participant are invited to communicate and collaborate
                to design a mask that can be used in leisure and entertainment scenarios for Dutch
                users. Mask design should meet the general needs of Dutch users and have the
                artistic style of DeStijl. (DeStijl, also known as Neo-plasticism, was founded by
                Mondrian and others in Netherlands. It normally uses simple colors and geometric
                images to express the pure spirit.)
              </p>
            </Col>
            <Col span={13} offset={1}>
              <Button type="primary">
                <OrderedListOutlined />
                Design Tips
              </Button>
              <p>
                设计师可以自由地使用各种熟悉的设计工具来完成设计任务。
                至少一位设计师需要共享屏幕以让荷兰被试了解设计的全流程，并给出建议。
                任务限时30分钟，倒计时结束将无法再设计，必须提交设计作品，请管理好时间。
              </p>
              <p>
                Designers can freely use various familiar design tools to complete the design task.
                At least one designer needs to share the screen to let Dutch subjects watch the
                whole design process and give suggestions. The task is limited to 30 minutes. You
                will not be able to design after the countdown. You must submit the design work.
                Please manage the time.
              </p>
              <p style={{ fontWeight: 'bold' }}>
                如果您在设计过程中遇到系统错误或者运算超时，请刷新网页重试。If you encounter a
                system error or operation timeout during the design process, please refresh the web
                page and try again.
              </p>
              <p style={{ fontWeight: 'bold' }}>
                任何情况下，请不要关闭网页或者返回，这将导致任务失败。 In any case, please do not
                close the web page or go back, which will cause the task to fail.
              </p>
              <p style={{ fontWeight: 'bold' }}>
                请下载设计作品模板PSD文件！Please download this PSD file of design outcome! template
              </p>
              <p style={{ fontWeight: 'bold' }}>下载 / Download</p>
              <p style={{ fontWeight: 'bold' }}>
                请注意任务时间！Please pay attention to the time for the task!
              </p>
              <TimerComponent allTime={1800000} handleTimeOut={handleTimeOut} />
            </Col>
          </Row>
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
              Requirements: the image format is JPG, and the image size is less than 5MB. After the
              upload is successful, please fill in the questionnaire.
            </p>
            <UploadComponent
              data={{ uid, type: 'notransfer' }}
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
            <FormComponent type={false} />
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
      <Footer className={styles.footer}>Web Design ©ZJU 2020-2021</Footer>
    </Layout>
  );
};
export default NoTransferPage;
