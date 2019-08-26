const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  var dbName = event.dbName; //集合名称
  var filter = event.filter ? event.filter : null; //筛选条件,默认为空 格式{_id:'XXXXXX'}
  var pageIndex = event.pageIndex ? event.pageIndex : 1; //当前第几页,默认为第一页
  var perPage = event.perPage ? event.perPage : 10;
  const countResult = await db.collection(dbName).where(filter).count(); //获取集合中总记录数
  const total = countResult.total; //得到总记录数
  const totalPage = Math.ceil(total / perPage); //计算需要多少页
  var hasMore;//提示前端是否还有数据
  if(pageIndex>totalPage||pageIndex==totalPage){//如果没有数据了,就返回false
    hasMore=false;
  }else{
    hasMore=true;
  }
  // 最后查询数据冰返回给前端
  return db.collection(dbName).where(filter).skip((pageIndex-1)*perPage).limit(perPage).get().then(res=>{
    res.hasMore=hasMore;
    return res;
  })
}
