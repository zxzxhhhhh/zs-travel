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

    let list = await DB.query('SELECT order_user.id AS `id`, order_user.user AS `user`, order_user.create_time AS `create_time`, order_product.product_id AS `product_id`, order_product.count AS `count`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM order_user LEFT JOIN order_product ON order_user.id = order_product.order_id LEFT JOIN product ON order_product.product_id = product.id WHERE order_user.user = ? ORDER BY order_product.order_id', [user])

    // 将数据库返回的数据组装成页面呈现所需的格式

    let ret = []
    let cacheMap = {}
    let block = []
    let id = 0

   list.forEach(order => {
      if (!cacheMap[order.id]) {
        block = []
        ret.push({
          id: ++id,
          list: block
       })

      cacheMap[order.id] = true
      }
      block.push(order)
    })

    ctx.state.data = ret
  },
}