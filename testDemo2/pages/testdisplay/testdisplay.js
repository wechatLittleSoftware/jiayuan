const app = getApp(); 
var util = require('../../utils/util.js');
Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    comment:[],   //评论
    tcomment:'',
    show:false,
    testcomment:'',
    StatusBar: app.globalData.StatusBar,
    
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
    index: '',
    posts:[],


    commenterid:app.globalData.userOpeid,
    textid:'',
    textindex:'',

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
  },

onLoad(){
  wx.cloud.database().collection('testComment')
  .get()
  .then(res=>{
    console.log('okk', res)
     this.setData({
        testcomment:res.data
     })
  }).catch(res=>{
    console.log('err',res)
  })
  this.towerSwiper('swiperList');
  var that = this

  wx.cloud.database().collection('test')
    .orderBy('createTime', 'desc') //按发布先后排序，即为倒序
    .get({
      success(res) {
        // console.log("请求成功==", res.data)
        that.setData({
          datalist: res.data
        }),
        console.log("请求post==66", this.data.datalist)
        // this.setData({
        //   posts:[]
        // })
        let posts = that.data.posts;
        if (res.errMsg == "collection.get:ok") {
          const datalength = res.data.length
          let item
          for (var i = 0; i < datalength; i++) {
            var data = res.data[i]
            item = {
              "_id": data._id,
              "_openid": data._openid,
              "cdesc": data.cdesc,
              "cname": data.cname,
              "cneed": data.cneed,
              "cphone": data.cphone,
              "imgList": data.imgList,
              "avatar": data.poster.avatar,
              "gender": data.poster.name,
              "nickname": data.poster.nickname,
              "createTime": data.createTime,
              "comment": data.comment,
              "poster_id": data.poster_id,
            }
            posts.push(item)
          }
          
          that.setData({
            posts: posts
          })
          
        }
        //console.log("请求post==", this.data.posts)
      },
      fail(res) {
        console.log("请求失败", res)
      }
    })
  
  
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

  onShow() {

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


getComment(e){

   this.setData({
     tcomment:e.detail.value
   })
},


postComment(e){ 
  var newcomment = {
    "textid": this.data.textid,
    "can_delete": false,
    "ref_comment": {
      "refCommenter": ''
    },
    "commenter": {
      "nickname": app.globalData.userInfo.nickName,
      "avatar": app.globalData.userInfo.avatarUrl
    },
    "content": this.data.tcomment
  }
  console.log("请求comment", this.data.comment)
  let comment = this.data.datalist[this.data.textindex].comment
  comment.push(newcomment)
  console.log("请求post999", this.data.datalist[0].comment)
  console.log("===", e)
  let tcomment = this.data.tcomment
  if (tcomment.length < 0 || tcomment.length == 0) {
    wx.showToast({
      icon: "none",
      title: '你还没有输入内容哦~',
    })
    return
  }

    wx.showLoading({
      title: '发表中.....',
    })
    wx.cloud.database().collection('testComment').add({
      data:{ 
        "poster": {
          "avatar": app.globalData.userInfo.avatarUrl,
          "gender": app.globalData.userInfo.gender,
          "nickname": app.globalData.userInfo.nickName,

        },
        "ccomment":this.data.tcomment,
        "userOpeid": app.globalData.userOpenid,   //发送评论的ID，即为用户id
        "textid":this.data.textid,     //帖子的ID
        "textindex":this.data.textindex,    //文章的序列index
      }
    })
  
    wx.cloud.callFunction({
      name:'postComment',
      data:{
            textid:this.data.textid,
            comment:comment,
      } 
    }).then(res => {
     
      wx.cloud.database().collection('test')
        .orderBy('createTime', 'desc')
        .get({
          success: res => {
            
            this.setData({
              datalist: res.data
            })
            
          },fail:res=>{

          }
         
        })

     
      console.log("评论成功", res)
      this.setData({
        input: '',
        modalName: null
      })
      wx.hideLoading()

    })
      .catch(res => {
        console.log("评论失败", res)
        wx.hideLoading()
      })

  
},














  showModal(e) { 

    

    this.setData({
      modalName: e.currentTarget.dataset.target,
      commenterid: e.currentTarget.dataset.posterid,
      textid: e.currentTarget.dataset.postid,
      textindex: e.currentTarget.dataset.index,
    })
    console.log("e",e)
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },



getPost(){

  this.setData({
    posts: []
  })
  wx.showLoading({
    title: '加载中...',
  });

  const db = wx.cloud.database()
  let that = this;
  db.collection('test')
    .orderBy('createTime', 'desc') //按发布先后排序，即为倒序
    .get({
      success(res) {
        let posts = that.data.posts;

        if (res.errMsg == "collection.get:ok") {
          const datalength = res.data.length
          let item
          for (var i = 0; i < datalength; i++) {
            var data = res.data[i]



            item = {
              "_id": data._id,
              "_openid": data._openid,
              "cdesc": data.cdesc,
              "cname": data.cname,
              "cneed": data.cneed,
              "cphone": data.cphone,
              "imgList": data.imgList,
              "avatar": data.poster.avatar,
              "gender": data.poster.name,
              "nickname": data.poster.nickname,
              "createTime": data.createTime,
              "comment": data.comment,
              "poster_id": data.poster_id,
            }
            posts.push(item)
          }
        }
        that.setData({
          posts: posts
        })
      },
      fail(res) {
        console.log("请求失败", res)
      }
    })

  
},
  
  
})