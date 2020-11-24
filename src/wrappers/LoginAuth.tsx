import React, { FC } from 'react';
import router from 'umi/router';

const LoginAuth: FC = (props: any) => {
  console.log(props);
  console.log('123');

  const isLogin = localStorage.getItem('uid') !== null;

  if (isLogin) {
    return <div>{props.children}</div>;
  } else {
    router.push('/login'); // 权限不匹配跳至指定的页面
    return null;
  }
};

export default LoginAuth;
