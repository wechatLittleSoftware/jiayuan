// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
       const textid = event.textid
       const comment = event.comment
  return await cloud.database().collection('test').doc(textid)
      .update({
        data: {
          comment: comment
        }
      })
  
}