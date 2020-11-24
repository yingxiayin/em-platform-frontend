import { DvaModel, Reducer, Effect } from '@/models/connect';
import { ImgInfoModelState } from '@/models/connect';
import { accountLogin } from '@/services/login';
import router from 'umi/router';

export interface UserInfoModelState {
  uid: string;
  password: string;
}

export interface LoginParams {
  uid: string;
  password: string;
}

export interface UserInfoModelStore extends DvaModel<UserInfoModelState> {
  namespace: string;
  state: LoginParams;
  reducers: {
    save: Reducer;
  };
  effects: {
    login: Effect;
    logout: Effect;
  };
}

const User: UserInfoModelStore = {
  namespace: 'user',

  state: {
    uid: '0',
    password: '0',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      if (response.code === 200) {
        if (response.statue === 1) {
          console.log(response);
          yield put({
            type: 'save',
            payload: response,
          });
          router.push('/transfer/' + response.data.uid);
        }
      }
    },
    logout() {
      localStorage.removeItem('uid');
      // 不是login界面的话跳转到login界面
    },
  },

  reducers: {
    // effect获取数据处理方法
    save(state, { payload }) {
      localStorage.setItem('uid', payload.data.uid);
      console.log(localStorage.getItem('uid'));

      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default User;
