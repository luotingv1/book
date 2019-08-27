const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    let id=event.id;
    let detail=await db.collection('bookLists').doc(id).get();
    detail=detail.data;
    return detail;
}
