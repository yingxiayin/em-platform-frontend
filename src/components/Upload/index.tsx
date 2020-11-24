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
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
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

      console.log("图像上传成功");
      
      if (id === 'rawImage') {
        // 获取图像预览url
        imgStatus.imgUrl = info.file.response.rawUrl;
        imgStatus.loading = false;
        handleCardEditing(imgStatus.loading);

        dispatch({
          type: 'transfer/save',
          payload: { rawUrl: imgStatus.imgUrl },
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
    buttonStyle,
  };

  return (
    <div>
      {isButton ? (
        <Upload {...uploadPara}>
          {loading ? (
            <Button style={buttonStyle} disabled>
              <LoadingOutlined />
              正在上传
            </Button>
          ) : (
            <Button style={buttonStyle}>
              <UploadOutlined />
              上传图片
            </Button>
          )}
        </Upload>
      ) : (
        <Upload {...uploadPara}>
          {loading ? (
            <div>
              <LoadingOutlined />
              <div>正在上传</div>
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div>上传风格</div>
            </div>
          )}
        </Upload>
      )}
    </div>
  );
}

export default memo(UploadComponent);
