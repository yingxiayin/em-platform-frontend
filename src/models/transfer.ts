import { DvaModel, Effect, Reducer } from '@/models/connect';
import { fetchImageTransfer } from '@/services/transfer';

export interface ImgStatus {
  uid: string;
  loading: boolean;
  imgUrl: string;
  imgUid: string;
}

export interface ImgTranModelState {
  rawUrl: string;
  styleId: number;
  styleUrl: string;
  transferUrl: string;
}

export interface ImgTranModelStore extends DvaModel<ImgTranModelState> {
  namespace: string;
  reducers: {
    save: Reducer;
  };
  effects: {
    updateRawImage: Effect;
    handleImageTransfer: Effect;
  };
}

const Transfer: ImgTranModelStore = {
  namespace: 'transfer',
  state: {
    rawUrl: '0',
    styleId: 0,
    styleUrl: '0',
    transferUrl: '0',
  },
  effects: {
    //这里是做异步处理的
    *updateRawImage({ rawUrl }, {  put }) {
      yield put({
        type: 'save',
        payload: { rawUrl: rawUrl },
      });
    },
    *handleImageTransfer({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { transferUrl: '0' },
      });

      const { uid, rawUrl, styleUrl } = payload;
      const response = yield call(fetchImageTransfer, uid, rawUrl, styleUrl);

      if (response.code === 200 && response.statue === 1) {
        console.log(response.transferUrl);

        const transferUrl = response.transferUrl;
    
        yield put({
          type: 'save',
          payload: { transferUrl: transferUrl },
        });

      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {},
};

export default Transfer;
