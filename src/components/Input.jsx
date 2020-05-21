import React from 'react';
import {
  Input
} from 'antd';

export default (props) => {
  return (
    <Input onChange={props.onChange} placeholder='请输入' type='number' />
  )
}