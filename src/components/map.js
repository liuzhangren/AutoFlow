import React from 'react';
import { SketchPicker } from 'react-color';
import {transform} from 'ol/proj';
import DragPan from 'ol/interaction/DragPan';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import ImageLayer from 'ol/layer/Image';
import {getCenter} from 'ol/extent';
import Image from 'ol/layer/Image';
import {defaults} from 'ol/control'
import {createStringXY} from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import ImageStatic from 'ol/source/ImageStatic';
import Projection from 'ol/proj/Projection';
import style from './index.css';
import img from '../assets/container.jpg';
import room1 from '../assets/room1.jpg';
import room2 from '../assets/room2.jpg';

import {
  Modal,
  Button,
  Form,
  Input,
  Popover
} from 'antd';

@Form.create()

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      center: [0, 0],
      zoom: 1,
      currentId: 0,
      visible: false,
      popVisible: false
    };
    this.dataSource = [
      {x: 100,y: 770, imgW: 50, imgH: 50, color: '' }, 
      {x: 100,y: 670, imgW: 50, imgH: 50, color: '' }, 
      {x: 100,y: 570, imgW: 50, imgH: 50, color: ''  }, 
      {x: 55, y: 440, imgW: 50, imgH: 50, color: ''  }, 
      {x: 35, y: 220, imgW: 27, imgH: 140, color: ''  },
      {x: 80, y: 220, imgW: 27, imgH: 140, color: ''  },
      {x: 145, y: 140, imgW: 40, imgH: 67, color: ''  },
      {x: 145, y: 250, imgW: 40, imgH: 43, color: ''  }
    ]
    this.extent = [0, 0, 1024, 968];
    this.projection = new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: [0, 0, 1024, 0]
    });
    this.map = new Map({
      layers: [
        new ImageLayer({
          source: new ImageStatic({
            url: img,
            projection: this.projection,
            imageExtent: this.extent
          })
        })
      ],
      view: new View({ 
        projection: this.projection,
        center: getCenter(this.extent),
        zoom: 1,
        maxZoom: 2,
        zIndex: -1
      }),
      target: null,
    });
  }
  componentDidMount() {
    this.map.setTarget("map");
    this.addOverlay(this.dataSource)
    this.map.getInteractions().forEach(function(element,index,array){  
    if(element instanceof DragPan)
//       var pan = element; 
//       pan.setActive(true);
      console.log('this is pan', element)
     });  
  }
  addOverlay(arr) {
    arr.forEach((item, i) => {
      var marker = new Overlay({
        position: [item.x, item.y],
        positioning: 'center-center',
        autoPan: false,
        element: document.getElementById(`marker${i}`),
        zIndex: 100
      });
      this.map.addOverlay(marker);
    })
  }
  click(i) {
    // alert('hello')
    const { resetFields } = this.props.form
    this.setState({
      visible: true,
      currentId: i
    })
    resetFields()
  }
  modalConfirm() {
    const { getFieldsValue } = this.props.form
    const values = {
      ...getFieldsValue(),
      radiationZone: this.dataSource[this.state.currentId].color,
      currentId: this.state.currentId
    }
    console.log(values)
    this.setState({
      visible: false
    })
  }
  modalCancel() {
    this.setState({
      visible: false
    })
  }
  handleColorChange(hex) {
    this.setState({
      color: hex.hex
    })
    const { currentId } = this.state
    this.dataSource[currentId].color = hex.hex
    this.setState({
      popVisible: false
    })
  }
  handleVisibleChange(visible) {
    this.setState({
      popVisible: visible
    })
  }
  render() {
    // console.log('this.dataSource --->>>', this.dataSource)
    let that = this;
    this.map.on("moveend",function(e){
      var zoom = that.map.getView().getZoom();  //获取当前地图的缩放级别
      console.log({zoom})
      if (zoom>1) {
        that.dataSource.forEach((c) => {
          c.x = c.x*zoom
          c.y = c.y*zoom
          c.imgW = c.imgW*zoom
          c.imgH = c.imgH*zoom
        })
      }	   
    }); 
    console.log('this.dataSource --->>>', that.dataSource)
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <div id="map" style={{ width: "100%", height: "400px" }}>
        {
          this.dataSource.reduce((r, c, i) => {
            return [
              ...r,
              <> 
                <div style={{width: c.imgW-3, height: c.imgH, backgroundColor: c.color}} onClick={this.click.bind(this, i)} key={`key${i}`} id={`marker${i}`}  title={`Marker${i}`}>
                  <img style={{opacity: '0.5'}} width={c.imgW} height={c.imgH} src={room1} />
                </div>
              </>
            ]
          }, [])
        }
        <Modal
          visible={this.state.visible}
          title='编辑房间信息'
          onOk={this.modalConfirm.bind(this)}
          onCancel={this.modalCancel.bind(this)}
        >
          <Form>
            <Form.Item style={{display: 'flex'}} label='辐射分区'>
              {getFieldDecorator('radiationZone', {
                rules: [{ required: true, message: 'Please select your radiationZone!' }],
              })(
                <Popover
                  content={<SketchPicker color={this.state.color} onChangeComplete={this.handleColorChange.bind(this)} />}
                  title="颜色选择器"
                  trigger="click"
                  visible={this.state.popVisible}
                  onVisibleChange={this.handleVisibleChange.bind(this)}
                >
                  <a style={{color: this.dataSource[this.state.currentId].color}}>选择颜色</a>
                </Popover>
              )}
            </Form.Item>
            <Form.Item style={{display: 'flex'}} label='房间编号'>
              {getFieldDecorator('roomNo', {
                rules: [{ required: true, message: 'Please input your roomNo!' }],
              })(
                <Input 
                  placeholder='请输入房间编号'
                />
              )}
            </Form.Item>
            <Form.Item style={{display: 'flex'}} label='房间名称'>
              {getFieldDecorator('roomName', {
                rules: [{ required: true, message: 'Please input your roomName!' }],
              })(
                <Input 
                  placeholder='请输入房间名称'
                />
              )}
            </Form.Item>
            <Form.Item style={{display: 'flex'}} label='额外信息'>
              {getFieldDecorator('extra', {
                rules: [{ required: true, message: 'Please input your extra!' }],
              })(
                <Input 
                  placeholder='请输入额外信息'
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default App