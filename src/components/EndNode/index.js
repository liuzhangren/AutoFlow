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
          width: branches%2 ===1? 121+220*i: 11 + 220*i,
          left: branches%2 ===1?-121 - 220*i: -11 - 220*i,
        })
        jugeRightArr.push({
          width:  branches%2 ===1? 121+220*i: 11 + 220*i
        })
      }
      this.setState({
        jugeLeftArr,
        jugeRightArr
      })
    }
  }
  componentDidMount() {
    
  }
  render() {
    const { branches } = this.props
    const { jugeLeftArr, jugeRightArr } = this.state;
    return (
      <div className={style.box} style={{left: (branches-1)*110}}>
        {
          jugeLeftArr.reduce((r, c, i) => {
            return [
              ...r,
              <div  key={`left_${i}`} className={style.linkLineLeft} style={{width: c.width, left: c.left}}></div>
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
        
        <div className={style.startCard}>流程结束</div>
        {/* <div className={style.line1}></div>
        <div className={style.line2}></div> */}
      </div>
    )
  }
}