import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

interface TimerProps {
  allTime: number;
  handleTimeOut: any;
}

// 转化为时分秒
const formatSeconds = (second: Number): String => {
  let result = parseInt(String(second));
  let h =
    Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  let m =
    Math.floor((result / 60) % 60) < 10
      ? '0' + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60);
  let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60);

  let res = '';
  if (h !== '00') res += `${h} h`;
  if (m !== '00') res += ` ${m} mins`;
  res += ` ${s}s`;
  return res;
};

const config = {
  title: 'Attention',
  content: (
    <div>
      <p>30分钟设计任务已结束，请按要求上传设计成果。</p>
      <p>The 30-minutes design task has ended, please upload the design outcome as required.</p>
    </div>
  ),
  onOk() {},
};

function UploadComponent(props: TimerProps) {
  const { allTime, handleTimeOut } = props;
  const [nowTime, setTime] = useState(() => {
    const time = window.localStorage.getItem('recordLastTime');
    if (Number(time) > 0) {
      return Number(time);
    } else {
      return allTime;
    }
  });
  const [trueTime, setTrueTime] = useState<String>('00:00:00');
  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('recordLastTime', String(nowTime));
    setTimeout(() => {
      setTime((c: number) => c - 1000);
    }, 1000);
    setTrueTime(formatSeconds(nowTime / 1000));
    if (nowTime === 0) {
      setIsTimeOut(true);
      handleTimeOut(true);
      Modal.info(config);
    }
  }, [nowTime]);

  return (
    <div>
      {isTimeOut ? (
        <p style={{ fontWeight: 'bold' }}>当前设计任务已结束 / The current design task has ended</p>
      ) : (
        <p style={{ fontWeight: 'bold' }}>任务时间剩余 / Remaining time :{trueTime} </p>
      )}
    </div>
  );
}

export default UploadComponent;
