// pages/order/order.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [], // 订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getOrderList()
  },
  getOrderList() {
    wx.showLoading({
      title: '订单数据加载中',
    })
    qcloud.request({
      url: config.service.orderList,
      login: true,
      success: (result) => {
        console.log(result)
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            orderList: result.data.data
          })
          console.log(this.data.orderList)
        }
        else {
          wx.showToast({
            title: '加载失败',
          })
        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
        })
        console.log('error!');
      }
    });

  },
})