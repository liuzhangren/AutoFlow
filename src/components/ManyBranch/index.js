import React from 'react';
import Node from '../Node';
import 'antd/dist/antd.less';
import StartNode from '../StartNode'
import EndNode from '../EndNode'
class App extends React.Component {
  state = {
    startClickCount: 0,
    nodes: {
      
    }
  }
  async startClick(e) {
    // console.log(e)
    await this.setState({
      startClickCount: this.state.startClickCount + 1
    })
    const { nodes } = this.state;
    if(e.key == 0) {
      nodes[`branch${this.state.startClickCount}`] = [
        {
          type: 0
        }
      ]
    }else {
      // nodes.branch1 = [{id: 111,type: 1}, ...nodes.branch1]
    }
    this.setState({
      nodes
    })
  }
  click({branchKey, branchIndex}, e) {
    // this.setState({
    //   type: e.key
    // })
    const { nodes } = this.state;
    if(e.key == 0) {
      nodes[branchKey].splice(branchIndex+1, 0, {type: 0})
    }else {
      nodes[branchKey].splice(branchIndex+1, 0, {type: 1})
    }
    this.setState({
      nodes
    })
  }
  close({branchKey, branchIndex}) {
    const { nodes } = this.state;
    if(nodes[branchKey].length === 1) {
      delete nodes[branchKey]
    }else {
      nodes[branchKey].splice(branchIndex-1, 1)
    }
    this.setState({
      nodes
    })
  }
  render() {
    const { nodes } = this.state;
    const  getMinNodes = (nodes) => {
      const sortAscArr = Object.keys(nodes).reduce((r, c) => {
        return [
          ...r,
          nodes[c].length
        ]
      }, []).sort((a, b) => a - b)
      const min = sortAscArr[0]
      const max = sortAscArr[sortAscArr.length - 1]
      const maxNodes = Object.keys(nodes).reduce((r, c) => {
        if(nodes[c].length === max) {
          r = nodes[c].length
        }
        return r
      }, '')
      const minNodes = Object.keys(nodes).reduce((r, c) => {
        if(nodes[c].length === min) {
          r = nodes[c].length
        }
        return r
      }, '')
      const leftNodesArr = Object.keys(nodes).reduce((r, c) => {
        return {
          ...r,
          [c]: maxNodes - nodes[c].length
        }
      }, {})
      return {
        minKey: Object.keys(nodes).reduce((r, c) => {
          if(nodes[c].length === min) {
            r.push(c)
          }
          return r
        } , []),
        leftNodes: leftNodesArr
      }
    }
    const { minKey, leftNodes } = getMinNodes(nodes)
    return (
      <div style={{marginLeft: '300px'}}>
        <StartNode 
          click={this.startClick.bind(this)}
          branches = {Object.keys(nodes).length}
        />
        <div style={{display: 'flex'}}>
          {
            Object.keys(nodes).reduce((r, c, i) => {
              return [
                ...r,
                <div key={`box_${i}`} style={{marginRight: '20px'}}>
                  {
                    nodes[c].reduce((_r, _c, _i) => {
                      const flag = _i + 1 === nodes[c].length && minKey.length !== Object.keys(nodes).length && minKey.includes(c) && Object.keys(nodes).length !== 1 ?true:false
                      return [
                        ..._r,
                        <Node leftNodes={leftNodes[c]} flag={flag}  type={this.state.type} close={this.close.bind(this, {branchKey: c, branchIndex: i})} click={this.click.bind(this, {branchKey: c, branchIndex: i})} key={`${c}_node_${i}_${_i}`} title={_c.type == 0?'条件':'审批'} content={_c.type == 0?'条件':'审批'} />
                      ]
                    }, [])
                  }
                </div>
              ]
            }, [])
          }
        </div>
        <EndNode 
          // click={this.startClick.bind(this)}
          branches = {Object.keys(this.state.nodes).length}
        />
      </div>
    )
  }
}

export default App;