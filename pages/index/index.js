//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  onShareAppMessage: function (res) {
    return {
      title: '112'
    }
  },
  data: {
    avatar: '/images/icon/icon_home.png',
    //首页分类列表
    navList: [  
      {
        catalog_name: "全部",
        id: '0'
      }
    ],
    //点击是否选中
    isSelect: '0',
    //祝福列表
    followList: [],
    page: 1,
    catalogId: 0,
    totalPage: 0,

  },
  onLoad: function(){
    this.getNavList()
    this.getFollowList()
    app.login()
  },
  
  getNavList: function(){
    var _this = this;
    const options = {
      url: "/catalog"
    }
    util.fetch(options, function (data) {
      _this.setData({ navList: _this.data.navList.concat(data) })
    })
  },
  //获取祝福列表
  getFollowList: function (page = 1, catalog_id=0,type=false){
    var _this = this;
    const options = {
      url: "/benison/all",
      data:{
        page: page,
        per_page: 5,
        catalog_id: catalog_id
      }
    }
    util.fetch(options, function (data) {
      _this.setData({ followList: _this.data.followList.concat(data.data), totalPage: Math.ceil(data.total / data.per_page) })
    }, type)
  },

  bindNavClick: function (event){ 
    this.setData({ isSelect: event.currentTarget.id, followList: [], page: 1})
    this.getFollowList(1, event.currentTarget.id)
  },
  //上拉加载
  pullLoading: function(e){
    if (this.data.page > this.data.totalPage) return;
    this.setData({ page: this.data.page+1})
    this.getFollowList(this.data.page, this.data.isSelect)
  },
  //下拉刷新
  dropRefresh: function(){
    this.getFollowList(1, this.data.isSelect,true)
  },
  //点击关注
  cliclFollow: function(event){
    var _this = this
    const user_id = app.globalData.userInfo ? app.globalData.userInfo.id:'';
    const {followList} = this.data;
    var index = util.ChangeArrayItem(followList, event.currentTarget.dataset.item.id)
    const options = {
      url: '/benison/liked/2',
      method: 'patch',
      data:{
        liked_total_type: followList[index]["isFollow"] ?'decrement':'increment', //increment+ decrement-
        user_id: user_id,
        template_id: event.currentTarget.dataset.item.template_id
      }
    }
    
    util.fetch(options, function(res){
      followList[index]["isFollow"] = !followList[index]["isFollow"];
      _this.setData({ followList })
    },true)

  },
  ClickShare: function(event){
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/bless/bless?benison_id=' + item.id
    })
  },
  errorImage: function(event){
    const { followList} = this.data
    var index = util.ChangeArrayItem(followList, event.currentTarget.dataset.item.id)
    followList[index]["template"]["bg_imgsumb"] = '/images/icon/icon_home.png'
    this.setData({
      followList: followList
    }) 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(2)
  }
})
