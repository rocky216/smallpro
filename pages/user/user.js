const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    userDataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getUserData: function(){
    var _this = this
    const userInfo = app.globalData.userInfo
    const options = {
      url: "/userinfo",
      data: {
        user_id: userInfo.id,
        openid: userInfo.openid,
        is_created: 1,
      }
    }
    util.fetch(options, function(res){
      var arr = []
      for (var i=0;i<res.data.length;i++){
        res.data[i]["created_at"] = res.data[i]["created_at"].substring(0,10)
        arr.push(res.data[i])
      }
      _this.setData({ userData: res, userDataList: arr})
    },true)
  },
  getUserInfo(){
    setTimeout(function(){
      if (!app.globalData.userInfo) {
        wx.openSetting({
          success: function (data) {
            console.log(data, 999)
            if (data.authSetting["scope.userInfo"] == true) {
              app.goLogin(function (res) {
                console.log(res)
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
      }
    },500)
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
    this.getUserInfo()
    this.getUserData()
    if (!app.globalData.userInfo) {
      
      // wx.switchTab({
      //   url: '/pages/index/index'
      // })
    }
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

})