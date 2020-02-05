const app = getApp();  
var util = require('../../utils/util.js');
Page({ 
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    
    fileIDs:[],
    imgList: [],
    cloudPath: [], 
    modalName: null,
    name:'',
    desc:'',
    need:'',
    phone:'',
    imageArray: [],
    attachments: [],
    filePath:[],
    comment:[]
  },

onLoad(){
  // 调用函数时，传入new Date()参数，返回值是日期和时间
  var time = util.formatTime(new Date());
  // 再通过setData更改Page()里面的data，动态更新页面的数据
  this.setData({
    time: time
  });

  wx.getUserInfo({
    success: res => {
      console.log(res)    //获取的用户信息还有很多，都在res中，看打印结果
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
  })
},


addimg(){
  wx.chooseImage({
    count: 4, //默认9
    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有

    sourceType: ['album', 'camera'], //从相册选择
    success: (res) => {
      this.setData({
        filePath: res.tempFilePaths   //图片临时地址
      })

      if (this.data.imgList.length != 0) {
        this.setData({
          // imgList: this.data.imgList.concat(res.tempFilePaths)
          imgList: this.data.imgList.concat(this.data.filePath)
        })
      } else {
        this.setData({
          imgList: this.data.filePath
        })
      }
    }
  });

  var cloudPath = [];
  //上传文件只能单个上传
  for (let i = 0; i < this.data.filePath.length; i++) {
    //获取数据库中图片数量count，通过“count.后缀”来添加图片保证图片不覆盖
    var url = "imgTest/" + app.globalData.userInfo.nickName + "/" + res._id + uptime + i + '.png';
    // 
    //cloudPath.push(url);    //记录下云文件的位置

    wx.cloud.uploadFile({
      // 指定上传到的云路径
      // cloudPath: path,   //cloud://work-087dce.776f-work-087dce-1259138893
      cloudPath: url,
      // 指定要上传的文件的小程序临时文件路径
      //filePath: imgList[0],
      filePath: this.data.filePath[i],

      // 成功回调
      success: res => {
        console.log('上传成功', res)
        wx.hideLoading();

        console.log('w', res.errMsg);
        // 文件上传成功
        if (res.errMsg == "cloud.uploadFile:ok") {
          var fileid = res.fileID
          // 
          console.log(res.fileID)
          let imglist = this.data.imglist
          imglist.push(res.fileID)
          console.log(imglist)
          that.setData({
            imglist: imglist
          })
          // 
          app.globalData.reloadHome = true;
          wx.navigateBack({
            comeBack: true
          });

        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 1500)
        }
        wx.hideLoading();

      },

    })
  }//
},


  
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        this.setData({
          filePath: res.tempFilePaths   //图片临时地址
        })
       
        if (this.data.imgList.length != 0) {
          this.setData({
            // imgList: this.data.imgList.concat(res.tempFilePaths)
            imgList: this.data.imgList.concat(this.data.filePath)
          })
        } else {
          this.setData({
            imgList: this.data.filePath
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  getName: function (event) {
    let value = event.detail.value;
    this.setData({
      name: value
    });
  },

  getDesc: function (event) {
    let value = event.detail.value;
    this.setData({
      desc:value
    });
    console.log("===", this.data.desc)
  },

  getNeed: function (event) {
    let value = event.detail.value;
    this.setData({
      need:value
    });
   
  },

  getPhone: function (event) {
    let value = event.detail.value;
    this.setData({
      phone: value
    });
  },
  
  


  /** 提交 */
  post: function () {

    var date = new Date
    const year = date.getFullYear().toString()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    // const minute = date.getMinutes()
    const minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
    const second = date.getSeconds()
    var uptime = year + '年' + month.toString() + '月' + day.toString() + '日' + '  ' + hour + ':' + minute + ':'+ second

    var that = this
    // 时间
    //  var nowtime = app.getnowtime()
    //  console.log(nowtime)
    this.setData({
      canPost: false
    })
    let imgList = this.data.imgList;
    let filePath = this.data.filePath;
    let cdesc = this.data.desc;
    let cname = this.data.name;
    let cneed = this.data.need;
    let cphone = this.data.phone;
    // let fileIDs = this.data.fileIDs
    if (cdesc == '') {
      wx.showLoading({
        title: '内容不能为空！',
      });
      this.setData({
        canPost: true
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)
      return false;
    }

    wx.showLoading({
      title: '发送中..'
    });
    var cloudPath = [];
    
 const promiseArr = []
    
    //上传文件只能单个上传
    for (let i = 0; i < this.data.filePath.length; i++) {
      let cloudPath = this.data.filePath[i]
      var url = "imgTest/" + app.globalData.userInfo.nickName + "/" + new Date().getTime()  + i + '.png';
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: url,
          filePath: cloudPath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有图片都上传成功
    let db = wx.cloud.database()
   
    Promise.all(promiseArr).then(res => {
      db.collection('test').add({
        data: {
          "poster": {
            "avatar": app.globalData.userInfo.avatarUrl,
            "gender": app.globalData.userInfo.gender,
            "nickname": app.globalData.userInfo.nickName,
            
          },
          // "poster_id":wx.getStorageSync('userId'),
          //"poster_id": app.globalData.userId,
          "poster_id": app.globalData.userOpenid, 
          "imgList": imgList,
          "fileIDs": this.data.fileIDs,
          "cname": cname,
          "cdesc": cdesc,
          "cneed": cneed,
          "cphone": cphone,
          "createTime": db.serverDate(),
          "uptime": uptime,
          "comment":this.data.comment,
       
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          console.log('发布成功', res)
          // wx.navigateTo({
          //   url: '/pages/display/display',
          // })
          app.globalData.reloadHome = true;
      wx.navigateBack({
        comeBack: true
      });
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  },
})
      
//       wx.cloud.uploadFile({
//         // 指定上传到的云路径
//         // cloudPath: path,   //cloud://work-087dce.776f-work-087dce-1259138893
        
//         cloudPath: url,
//         // 指定要上传的文件的小程序临时文件路径
//         filePath: this.data.filePath[i],
//       }).then(res=>{
//         console.log("上传结果", res.fileID)
//         this.setData({
//             fileIDs : this.data.fileIDs.concat(res.fileID)
            
//           })
//         // reslove()
//         console.log("上传结果==", this.data.fileIDs)
//         }).catch (error => {
//         console.log("上传失败", error)
//       })  
      
//       wx.hideLoading();
//       // console.log('w', res.errMsg);
//       app.globalData.reloadHome = true;
//       wx.navigateBack({
//         comeBack: true
//       });
//           // 文件上传成功
//         //   if (res.errMsg == "cloud.uploadFile:ok") {
//         //     var fileid = res.fileID
           

//         //   } else {
//         //     wx.showToast({
//         //       title: res.errMsg,
//         //       icon: 'none'
//         //     });
//         //     setTimeout(function () {
//         //       wx.hideLoading();
//         //     }, 1500)
//         //   wx.hideLoading();
//         // }   
//     }//for循环结束

//     // Promise.all(promiseArr).then(res =>{
//     console.log("上传结果===", this.data.fileIDs)

      
//     // }
//     Promise.all(promiseArr).then(res=>{
//       console.log("=====", this.data.fileIDs)
//       wx.cloud.database().collection('test').add({
//         data: {
//           "poster": {
//             "avatar": app.globalData.userInfo.avatarUrl,
//             "gender": app.globalData.userInfo.gender,
//             "nickname": app.globalData.userInfo.nickName
//           },

//           "poster_id": app.globalData.userId,
//           "imgList": imgList,
//           "fileIDs": this.data.fileIDs,
//           "cname": cname,
//           "cdesc": cdesc,
//           "cneed": cneed,
//           "cphone": cphone

//         },

//       })
//     })
    
//   }

// })





  // < view class="bg-img" >
  //   <image wx: for="{{item.fileIDs}}" wx: key="index" wx: for-item="imglist" wx: for-index="imgindex" data-index="{{index}}" data-imglist="{{imgindex}}" src="{{imglist}}"></image>