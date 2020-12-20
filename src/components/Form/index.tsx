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
          <p>请确定全组人员都完成了问卷，再点击进入下一步。</p>
          <p>
            Please make sure that the whole group has completed the questionnaire, and then click to
            go to the next step
          </p>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/CN-with AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>问卷（中国设计师）</p>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/EN-with AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>questionnaire (for Dutch participant)</p>
          </div>
        </>
      ) : (
        <>
          <p>请确定全组人员都完成了问卷，再点击进入下一步。</p>
          <p>
            Please make sure that the whole group has completed the questionnaire, and then click to
            go to the next step
          </p>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/CN-without AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>问卷（中国设计师）</p>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center' }}>
            <img
              src="http://culture.designist.cn/static/img/QR/EN-without AI.jpg"
              alt="QR"
              style={{ width: '10vw' }}
            />
            <p>questionnaire (for Dutch participant)</p>
          </div>
        </>
      )}
    </div>
  );
}

export default FormComponent;
