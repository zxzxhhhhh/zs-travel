const DB = require('../utils/db.js')
module.exports = {
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let product_id = ctx.request.body.product_id || ''
    let date = ctx.request.body.date || ''
    let count = ctx.request.body.count || 1
    let name = ctx.request.body.name || ''
    let tel = ctx.request.body.tel || ''
    //插入 user字段 order_user 的ID自增加

    try{
      await DB.query("insert into orders (user, name, tel, order_date, product_id, count) values (?, ?, ?,?,?,?)", [user, name, tel, date, product_id, count])
    }catch(e){
      ctx.state.data = e
    }
  },
  /**
   * 获取已购买订单列表
   * 
   */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let list = await DB.query('SELECT orders.id AS `id`, orders.user AS `user`, orders.create_time AS `create_time`, orders.product_id AS `product_id`, orders.count AS `count`,orders.tel AS `tel`,orders.name AS `name`,orders.order_date AS `order_date`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM orders  LEFT JOIN product ON orders.product_id = product.id WHERE orders.user = ? ORDER BY orders.id', [user])

 
    ctx.state.data = list
  },
}