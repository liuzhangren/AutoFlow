import React from 'react';
import { Menu, Dropdown } from 'antd';
import style from './index.less';
class Node extends React.Component {
  state = {

  }

  render() {
    const menu = (
      <Menu onClick={this.props.click}>
        <Menu.Item key="0">
          <a>条件分类</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a>审批节点</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className={style.box}>
        <div className={style.card}>
          <div className={style.cardTitle}>{this.props.title} <span onClick={this.props.close} style={{cursor: 'pointer', position: 'absolute', top: 0, right: 0}}>x</span></div>
          <div className={style.cardContent}>{this.props.content}</div>
        </div>
        <div className={style.line1}></div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div className={style.plus}>+</div>
        </Dropdown>
        <div className={style.line2} style={{height: 80 + 220*this.props.leftNodes}}></div>
      </div>
    )
  }
}

export default Node