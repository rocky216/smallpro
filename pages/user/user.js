const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    userDataList: [],
    numArr:[],
    blessList:[],
    userInfo: wx.getStorageSync("userInfo")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.isLogin()
    this.getBlessNum()
    this.getBlessList(1)
  },
  getBlessNum: function(event){
    var _this = this
    var userInfo = wx.getStorageSync("userInfo")
    this.setData({userInfo: userInfo})    
    const options = {
      url: '/userinfo/benison/count',
      data:{
        user_id: userInfo.id,
        openid: userInfo.openid
      }
    }
    util.fetch(options, function(res){
      _this.setData({ numArr: res})
    })
    
  },
  getUserInfo: function(event){
    console.log(event)
    var id = event.currentTarget.dataset.id
    this.getBlessList(id)
  },
  getBlessList: function(isCreated){
    var _this = this
    var userInfo = wx.getStorageSync("userInfo")
    this.setData({ userInfo: userInfo })   

    console.log(this.data.userInfo)
    const options = {
      url: '/userinfo',
      data: {
        user_id: userInfo.id,
        openid: userInfo.openid,
        is_created: isCreated
      }
    }
    util.fetch(options, function(res){
      console.log(res)
      _this.setData({ blessList: res})
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
    util.isLogin()
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