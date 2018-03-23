const util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: {},
    visible: false,
    password:'',
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetailInfo(options)
    this.setData({ options: options })
    console.log(options,"options")
    if (options.password && options.password.length == 11){
      this.setData({ visible: true})
    }
  },
  openPage: function(){
    const { options, password} = this.data
    if (options.password == password){
      this.setData({ visible: false })
    }else{
      wx.showToast({
        title: '密码错误',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getPaassword: function (event) {
    this.setData({ password: event.detail.value })
  },
  //获取详情信息
  getDetailInfo(opt){
    
    var _this = this;
    const options = {
      url: "/benison/detail",
      data: {
        benison_id: opt.benison_id,
        template_id: opt.template_id
      }
    }
    
    util.fetch(options, function(data){
      console.log(data, 565)
      _this.setData({ detailData: data})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})