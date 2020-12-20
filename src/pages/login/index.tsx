import React, { FC, useState } from 'react';
import styles from './styles.less';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { ConnectState } from '@/models/connect';

import { UserInfoModelState } from '@/models/connect';

interface UserLoginType {
  uid: string;
  password: string;
}

const LoginPage: FC = () => {
  const { uid, password } = useSelector<ConnectState, UserInfoModelState>(state => state.user);
  const dispatch = useDispatch();

  console.log(uid);

  let currentUserLoginInfo: UserLoginType = {
    uid: " ",
    password: " ",
  };

  const handleInputUid = (value: string) => {
    currentUserLoginInfo.uid = value
  };

  const handleInputPassword = (value: string) => {
    currentUserLoginInfo.password = value
  };

  // 发起请求
  const handleSubmit = (values: UserLoginType) => {
    console.log(values)
    window.localStorage.clear();
    dispatch({
      type: 'user/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>
        Study of Cross-cultural Design with AI-supported Design Tool
      </div>
      <Form className={styles.from} name="basic">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input onChange={() => handleInputUid(event.target.value)} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password onChange={() => handleInputPassword(event.target.value)} />
        </Form.Item>
        <Form.Item>
          <p>
            在实验之前，请确保网络正常工作，并且屏幕已经通过Skype与设计团队的所有成员共享。一旦您登录，您需要始终打开这个网页。您既不能返回也不能再次登录，任何这些活动都会导致实验失败。
          </p>
          <p>
            Before the experiment, please make sure the network is working well, and this screen is
            shared with all members of the design team via Skype. Once you login, you should always
            keep this website online. You can neither go back nor login again, any these activities
            will result the fail of the experiment.
          </p>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.button}
            onClick={() => handleSubmit(currentUserLoginInfo)}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
