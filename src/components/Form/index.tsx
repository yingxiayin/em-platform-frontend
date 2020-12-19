import React, { FC, useState } from 'react';
import styles from './styles.less';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { ConnectState } from '@/models/connect';

import { UserInfoModelState } from '@/models/connect';

interface UserType {
  type: boolean;
}

function FormComponent(props: UserType) {
  const { type } = props;

  return (
    <div>
      {type ? (
        <>
          <p>请完成问卷 / Please complete the questionnaire</p>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/CN-with AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>问卷</p>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/EN-with AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>questionnaire</p>
          </div>
        </>
      ) : (
        <>
          <p>请完成问卷 / Please complete the questionnaire</p>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/CN-without AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>问卷</p>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/EN-without AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>questionnaire</p>
          </div>
        </>
      )}
    </div>
  );
}

export default FormComponent;
