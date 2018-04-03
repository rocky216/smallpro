//app.js
const util = require('./utils/util.js')
App({
  
  data:{
    userInfo: {}
  },
  onLaunch: function () {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo){
      wx.reLaunch({
        url: '/pages/index/index'
      })
    }
  },

  //用户登录获取用户信息
  login: function (cb) {
    var _this = this;
    console.log(_this.globalData.userInfo)
    if (_this.globalData.userInfo){
      wx.openSetting({
        success: function(data){
          if(data && data.authSetting["scope.userInfo"] == false){
            this.goLogin(cb)
          }
        }
      })
    }else{
      this.goLogin(cb)
    }
    
  },
  goLogin: function (cb){
    var _this = this
    wx.login({
      success: function (res) {
        var code = res.code
        wx.getUserInfo({
          success: function (data) {
            var userInfo = data.userInfo;
            console.log(data, 666)
            const options = {
              url: "/openid",
              data: {
                code: code,
                user_info: userInfo,
                iv: data.iv,
                encryptedData: data.encryptedData
              }
            }
            util.fetch(options, function (res) {
              if (res) {
                console.log(_this)
                _this.globalData.userInfo = res
                cb ? cb(res) : null;
              }
            }, true)
          }
        })
      },
      fail: function (res) {
      },
      complete: function (res) {
      },
    })
  },
  globalData: {
    userInfo: null
  }
})