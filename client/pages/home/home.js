// pages/home/home.js
const config = require('../../config.js')
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productList: [], // 商品列表
    imgUrls: [
      'https://posters-1257314924.cos.ap-shanghai.myqcloud.com/beach.jpg',
      'https://posters-1257314924.cos.ap-shanghai.myqcloud.com/sea.jpg',
      'https://posters-1257314924.cos.ap-shanghai.myqcloud.com/sky.jpg',
      'https://posters-1257314924.cos.ap-shanghai.myqcloud.com/noodle.jpg',
      'https://posters-1257314924.cos.ap-shanghai.myqcloud.com/stone.jpg'
    ],
  },
  getProductList(){
    wx.showLoading({
      title: '商品数据加载中',
    })
    qcloud.request({
      url: config.service.productList,
      success: (result) => {
        console.log(result)
        wx.hideLoading()
        if(!result.data.code){
          this.setData({
            productList: result.data.data
          })}
          else{
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList()

  },

})