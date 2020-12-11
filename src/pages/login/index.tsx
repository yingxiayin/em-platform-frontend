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
      <div className={styles.title}>Style Transfer Tool</div>
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
