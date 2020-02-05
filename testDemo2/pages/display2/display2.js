const app = getApp();
Page({


  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isCard: true,
    _id: '',
    _openid: '',
    cdesc: '',
    cname: '',
    cneed: '',
    cphone: '',
    imgList: [],
    avatar: '',
    gender: '',
    nickname: '',
    datalist: [],
    imgList: [],
    index: ''
  },


  onLoad: function (options) {
    console.log("===", options.id)
    wx.cloud.database().collection('test')
      .get()
      .then(res => {
        this.setData({
          // _id:res.data._id,
          // _openid:res.data._openid
          // cdesc:
          // cname:
          // cneed:
          // cphone:
          // imgList:
          // avatar:
          // gender:
          // nickname:
          datalist: res.data,

        })

        console.log("==", this.data.datalist)
      }).catch(res => {
        console.log("==", res)
      })

  },

})