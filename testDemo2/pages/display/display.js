const app = getApp();
Page({

  
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isCard: true,
    _id:'',
    _openid:'',
    cdesc:'',
    cname:'',
    cneed:'',
    cphone:'',
    imgList:[],
    avatar:'',
    gender:'',
    nickname:'',
    datalist:[],
    imgList: [],
    index:'',

    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: "/images/4.jpg"
    }, {
      id: 1,
      type: 'image',
        url: "/images/5.jpg"
    }, {
      id: 2,
      type: 'image',
        url: "/images/6.jpg"
    }],

    // swiperList:[
    //   {url:"/../images/4.jpg"},
    //   { url: "/images/5.jpg"},
    //   { url: "/images/6.jpg"},
    // ]
  },

 
  onLoad() {
    let that = this;
    this.towerSwiper('swiperList');
    wx.cloud.database().collection('test')
      .orderBy('createTime', 'desc') //按发布视频排序
      .get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            datalist: res.data
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
    // console.log("===",options.id)
    // wx.cloud.database().collection('test')
    // .orderBy('createTime', 'cname') //按发布视频排序
    // .get()
    // .then(res=>{
    //   this.setData({
    //     datalist: res.data,
        
    //   })
     
    //   console.log("==", this.data.datalist)
    // }).catch(res=>{
    //   console.log("==", res)
    // })
    
  },
  previewImg: function (event) {
    let url = event.target.id;
    wx.previewImage({
      current: '',
      urls: [url]
    })
  },
  onPullDownRefresh() {

    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.hideNavigationBarLoading();//完成加载
    wx.stopPullDownRefresh();//停止下拉刷新
    this.onLoad(); //加载数据列表的函数——建议单独提出来写
  },

  onShow(){
    let that = this;
    wx.cloud.database().collection('test')
      .orderBy('createTime', 'desc') //按发布视频排序
      .get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            datalist: res.data
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },


// 滑动框
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },


})