import React from 'react';
import style from './index.less';
import { Menu, Dropdown } from 'antd';

export default class StartNode extends React.Component {
  state = {
    jugeLeftArr: [],
    jugeRightArr: []
  }
  componentWillReceiveProps(nextProps) {
    const { branches } = nextProps
    const jugeLeftArr = []
    const jugeRightArr = []
    if(branches) {
      const num = branches%2===1?(branches -1)/2 :branches/2
      
      for(let i = 0; i < num; i++) {
        jugeLeftArr.push({
          width: branches%2 ===1? 220+230*i: 100 + 230*i,
          left: branches%2 ===1?-120 - 220*i: 0 - 230*i,
        })
        jugeRightArr.push({
          width:  branches%2 ===1? 220+230*i: 100 + 230*i
        })
      }
      this.setState({
        jugeLeftArr,
        jugeRightArr
      })
    }
  }
  // componentDidMount() {
    
  // }
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
    const { branches } = this.props
    const { jugeLeftArr, jugeRightArr } = this.state;
    
    return (
      <div className={style.box} style={{left: (branches-1)*110}}>
        <div className={style.startCard}>流程开始</div>
        {
          jugeLeftArr.reduce((r, c, i) => {
            return [
              ...r,
              <div key={`left_${i}`} className={style.linkLineLeft} style={{width: c.width, left: c.left}}></div>
            ]
          }, [])
        }
        {
          jugeRightArr.reduce((r, c, i) => {
            return [
              ...r,
              <div  key={`right_${i}`} className={style.linkLineRight} style={{width: c.width}}></div>
            ]
          }, [])
        }
        {/* <div className={style.lineRight} style={{ width: 560}}></div> */}
        <div className={style.line1}></div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div className={style.plus}>+</div>
        </Dropdown>
        <div className={style.line2} style={{height: branches%2===0?35:70}}></div>
      </div>
    )
  }
}