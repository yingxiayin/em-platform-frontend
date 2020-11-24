import { DvaModel, Effect, Reducer } from '@/models/connect';
import { fetchStyleImageByUid, fetchDeleteStyleImage } from '@/services/image';

export interface ImgStyle {
  style: string;
  num: number;
}

export interface ImgInfoType {
  id: number;
  url: string;
  styleList: ImgStyle[];
}

export interface ImgInfoModelState {
  styleImageList: ImgInfoType[];
}

export interface ImgTranModelStore extends DvaModel<ImgInfoModelState> {
  namespace: string;
  reducers: {
    save: Reducer;
  };
  effects: {
    fetchStyleList: Effect;
    deleteStyleImageById: Effect;
    addStyleImage: Effect;
  };
}

const Image: ImgTranModelStore = {
  namespace: 'image',
  state: {
    styleImageList: [],
  },
  effects: {
    *fetchStyleList({ payload }, { call, put }) {
      const { uid } = payload;
      const response = yield call(fetchStyleImageByUid, uid);

      if (response.code === 200 && response.statue === 1) {
        console.log("风格列表获取成功");
        // let styleImageList: ImgInfoType[] = [{ id: 0, url: '0', styleList: [] }];
        let styleImageList = response.data;
        console.log(styleImageList);
        yield put({
          type: 'save',
          payload: { styleImageList: styleImageList },
        });
      }
    },
    *deleteStyleImageById({ payload }, { call, put }) {
      const { uid, styleId } = payload;
      const response = yield call(fetchDeleteStyleImage, uid, styleId);

      if (response.code === 200 && response.statue === 1) {
        const response = yield call(fetchStyleImageByUid, uid);
        // let styleImageList: ImgInfoType[] = [{ id: 0, url: '0', styleList: [] }];
        let styleImageList = response.data;
        yield put({
          type: 'save',
          payload: { styleImageList: styleImageList },
        });
      }
    },
    *addStyleImage({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {},
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {},
};

export default Image;
