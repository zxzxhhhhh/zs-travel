// pages/details/detail.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    date: '',
    trueName: "",
    phone: "",
    isName: false,
    isPhone: false
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
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
    // product 中包含this.data.product 所有属性以及count属性
    let product = Object.assign({
      count: 1
    }, this.data.product)
    wx.showLoading({
      title: '预定中。。。',
    })
    qcloud.request({
      url: config.service.addOrder,
      login: true,
      method: 'POST',
      data: {
        list: [product],
        isInstantBuy: true
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
          title: '商品购买失败',
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
  },
})