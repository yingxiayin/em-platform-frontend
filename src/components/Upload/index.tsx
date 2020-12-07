import React, { memo, useState } from 'react';
import { Upload, message, Button, Card } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ImgStatus } from '@/models/transfer';
import { UploadProps, UploadChangeParam } from 'antd/lib/upload';
import ImgCrop from 'antd-img-crop';

interface NewUploadProps extends UploadProps {
  isButton: boolean;
  buttonStyle: any;
}

function UploadComponent(props: NewUploadProps) {
  const {
    action,
    listType,
    showUploadList,
    accept,
    className,
    isButton,
    disabled,
    buttonStyle,
    id,
    data,
  } = props;
  const dispatch = useDispatch();
  const [loading, handleCardEditing] = useState<boolean>(false);
  
  const imgStatus: ImgStatus = {
    uid: '',
    loading: false,
    imgUrl: '',
    imgUid: '',
  };

  // 限制类型及大小
  const beforeUpload = (file: any): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Only images in JPG / PNG format can be uploaded');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image size must be less than 5MB');
    }
    return isJpgOrPng && isLt5M;
  };

  // 上传处理
  const handleChange = (info: UploadChangeParam): void => {
    
    console.log(info.file.status);

    if (info.file.status === 'uploading') {
      imgStatus.loading = true;
      handleCardEditing(true);
      return;
    }

    if (info.file.status === 'done') {

      console.log('Raw image uploaded successfully');
      
      if (id === 'rawImage') {
        // 获取图像预览url
        imgStatus.imgUrl = info.file.response.rawUrl;
        imgStatus.loading = false;
        handleCardEditing(imgStatus.loading);

        dispatch({
          type: 'transfer/save',
          payload: { rawUrl: imgStatus.imgUrl, transferUrl: '0'},
        });
      }

      if (id === 'styleImage') {
        // 获取图像预览url
        imgStatus.imgUrl = info.file.response.styleUrl;
        imgStatus.uid = info.file.response.uid;
        imgStatus.loading = false;
        handleCardEditing(imgStatus.loading);

        dispatch({
          type: 'image/fetchStyleList',
          payload: { uid: imgStatus.uid },
        });
      }
    }
  };

  const uploadPara: NewUploadProps = {
    onChange: handleChange,
    beforeUpload: beforeUpload,
    name: 'image',
    data,
    id,
    action,
    listType,
    showUploadList,
    accept,
    className,
    isButton,
    disabled,
    buttonStyle,
  };

  return (
    <div>
      {isButton ? (
        <Upload {...uploadPara}>
          {loading || disabled ? (
            <Button style={buttonStyle} disabled>
              <LoadingOutlined />
              Waiting
            </Button>
          ) : (
            <Button style={buttonStyle}>
              <UploadOutlined />
              Upload
            </Button>
          )}
        </Upload>
      ) : (
        <Upload {...uploadPara}>
          {loading ? (
            <div>
              <LoadingOutlined />
              <div>Waiting</div>
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div>Upload</div>
            </div>
          )}
        </Upload>
      )}
    </div>
  );
}

export default memo(UploadComponent);
