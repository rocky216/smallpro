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
  adjustKey: function(obj,key){
    var bBtn = false
    for(var attr in obj){
      if(attr == key){
        bBtn = true
      }
    }
    return bBtn
  },
  onLoad: function (options) {
    
    var _this = this;
    this.getDetailInfo(options, function(){
      if (_this.adjustKey(options, "password")) {
        
        app.goLogin(function (res) {
          wx.setStorageSync('userInfo', res)
        })
        if (options.password && options.password.length == 11) {
          _this.setData({ visible: true })
          console.log(_this.data.visible, 78788)

        }
        if (options.password == '') {
          _this.adjustBless()
        }
      }
    })
    this.setData({ options: options })
    
  },
  adjustBless: function(){
    var _this=this
    const userInfo = wx.getStorageSync("userInfo")

    const options = {
      url: '/user/benison',
      method: 'post',
      data:{
        user_id: userInfo.id,
        bension_id: _this.data.detailData.id,
        is_created: 0
      }
    }
    util.fetch(options, function(res){
      console.log(res, "8989")
    })
  },
  openPage: function(){
    const { options, password} = this.data
    if (options.password == password){
      this.setData({ visible: false })
      this.adjustBless()
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
  getDetailInfo(opt,fn){
    var _this = this;
    const options = {
      url: "/benison/detail",
      data: {
        benison_id: opt.benison_id,
        template_id: opt.template_id
      }
    }
    
    util.fetch(options, function (data) {
      _this.setData({ detailData: data })
      if (fn) fn(data);
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