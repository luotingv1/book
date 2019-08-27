const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID; //获取openID
  let collect = await db.collection('user').where({
    _openid: openId
  }).field({
    "collect": true
  }).get();
  collect = collect.data[0].collect;
  const _ = db.command
  let arr=[];
  arr=collect.map(val=>{
    return val.collect_id;
  })
  return db.collection('bookLists').where({
      _id: _.in(arr)
    })
    .get().then(res => {
      return res.data;
    })
}
