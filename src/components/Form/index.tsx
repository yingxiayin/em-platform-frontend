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

const FormComponent: FC = () => {
  
  return (
    <div>
      <p>表单二维码 1</p>
      <p>表单二维码 2</p>
    </div>
  );
};

export default FormComponent;
