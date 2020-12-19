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
            <Col span={16}>
              <Button type="primary">
                <OrderedListOutlined />
                Design Task
              </Button>
              <p>请设计师根据荷兰用户的具体需求，设计一款生活环境中使用的荷兰风格口罩。</p>
              <p>
                The designer is asked to design a Dutch style mask used in the living environment
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
          <Button type="primary">
            <OrderedListOutlined />
            Design Board
          </Button>
          <p>请自由完成设计。</p>
          <p>Please complete the design freely.</p>
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
            After completing the design, please click to upload the design results. Requirements:
            the image format is JPG, and the image size is less than 5MB. After the upload is
            successful, please finish the form.
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
      <Footer className={styles.footer}>Web Design ©ZJU 2020-2021</Footer>
    </Layout>
  );
};
export default NoTransferPage;
