const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;
exports.main = async (event, context) => {
  try {
    // wxContext内包含用户的openId
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID; //获取openID
    let record = await db.collection('bookLists').doc(event.id).get() //查询符合id的书单记录
    record=record.data;
    let arrName = event.name;
    // 定义空数组
    let arr = [];
    if (record[arrName] && record[arrName].length > 0) {
      // 让定义的数组等于用户操作的当前日记下的like数组
      arr = record[arrName];
      // 定义一个计数变量
      let count = 0
      // 循环遍历，当openId相同时替换like数组中的相同项，并存储对应的type
      arr.forEach((item, index) => {
        if (item.openId === openId) {
          count++;
          arr.splice(index, 1, {
            openId: openId,
            type: event.type,
          })
        }
      })
      // 当计数变量为0时，说明在这条日记中，like数组中未存储过此用户，直接push此用户并存储type
      if (count === 0) {
        arr.push({
          openId: openId,
          type: event.type
        })
      }
    } else {
      // 如果此条日记like数组本身就为空，直接push当前用户并存储type
      arr.push({
        openId: openId,
        type: event.type
      })
    }
    // 通过云开发操作数据库的相关api,即update通过_id来更新集合中某条数据
    let obj = {
      data: {
        [arrName]: arr,
        [arrName + '_num']: event.type == 1 ? _.inc(1) : _.inc(-1)
      }
    };
    let collect=await db.collection('user').where({_openid:openId}).get();//获取用户记录
    //判断用户是否存储过该操作信息
    collect=collect.data[0];
    let arr2=[];
    if(collect[arrName]&&collect[arrName].length>0){
          // 循环遍历 如果有记录删除 如果没有记录添加  因为只有type为1才会添加
          arr2=collect[arrName];
          let count = 0
          arr2.forEach((item, index) => {
            if (item[arrName+'_id'] === event.id) {
              count++;
              if(event.type==1){
                arr2.splice(index, 1,{
                  [arrName+'_id']: event.id
                })
              }else{
                arr2.splice(index, 1)
              }
            }
          })
          if (count === 0&&event.type==1) {
            arr2.push({
              [arrName+'_id']: event.id
            })
          }
    }else if(event.type==1){
      arr2.push({
        [arrName+'_id']: event.id
      })
    }
    db.collection('user').doc(collect._id).update({data:{[arrName]:arr2}});
     await db.collection('bookLists').doc(event.id).update(obj);
     return await db.collection('bookLists').doc(event.id).get();
  } catch (e) {
    console.error(e)
  }
}
