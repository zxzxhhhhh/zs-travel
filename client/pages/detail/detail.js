// pages/details/detail.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
// 在需要使用的js文件中，导入js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    date: '',
    count: 1,
    trueName: "",
    phone: "",
    isName: false,
    isPhone: false
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  onTapAdjust(event) {
    let dataset = event.currentTarget.dataset
    let adjustType = dataset.type

    let count = this.data.count

      if (adjustType == 'add') {
        count++
      }
      else if (adjustType == 'minus') {
        if (count <= 1) {
          count = 1
        } else {
          count--
        }
      }
    this.setData({
      count
    })

  },
  userNameInput(e) {
    //用户姓名
    if (e.detail.value) {
      console.log(e.detail.value)
      this.setData({
        isName: true,
        trueName: e.detail.value
      })
    } else {
      this.setData({
        isName: false
      })
    }
  },

  userTellInput(e) {
    //联系电话
    if (e.detail.value) {
      console.log(e.detail.value)
      this.setData({
        phone: e.detail.value,
        isPhone: true
      })
    } else {
      this.setData({
        isPhone: false
      })
    }
  },
  // 评论页面入口函数
  onCommentEntry(){
    if(this.data.product.commentCount>0)
    {
      let product = this.data.product
      wx.navigateTo({
        url: `/pages/comment/comment?id=${product.id}&price=${product.price}&name=${product.name}&image=${product.image}`,
      })
    }
  },
  
  getProduct(productID) {
    wx.showLoading({
      title: '数据加载中',
    })
    qcloud.request({
      url: config.service.productDetail + productID,
      success: (result) => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            product: result.data.data
          })
        }
        else {
          setTimeout(() => {
            wx.navigateBack(),
              2000
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        setTimeout(()=>{
          wx.navigateBack(),
          2000
        })
        console.log('error!' + result);
      }
    });

  },

  orderNow(){
    console.log('order now!')
  
    let date = this.data.date
    let count = this.data.count
    let name = this.data.trueName
    let tel = this.data.phone
    let product_id = this.data.product.id

    if(!this.data.isName || !this.data.isPhone){
      wx.showToast({
        icon: 'none',
        title: '请添加相关信息！',
      })
      return
    }

    wx.showLoading({
      title: '预定中..',
    })
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        product_id,
        date,
        count,
        name,
        tel
      },
      success: result => {
        console.log(result.data)
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '预定成功',
          })
       } else {
          wx.showToast({
            icon: 'none',
            title: '预定失败',
          })
        }
      },
      fail: (result) => {
        wx.hideLoading()
        console.log(result)
        wx.showToast({
          icon: 'none',
          title: '预定失败',
        })
      }
    })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let productID = options.id
    this.getProduct(productID)
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var date = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      date: date
    });

  },
})