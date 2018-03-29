const util = require('../../utils/util.js')
Page({
  data: {
    cardList: [1,2,3,4,5],
    smallIamges: [1,2,3,4,5,6],
    isSelect:'0',
    navList: [{
      catalog_name: "全部",
      id: '0'
    }],

  },
  onLoad: function(){
    this.getNavList()
    this.getFollowList(1, 0)
  },
  bindNavClick: function(event){
    console.log(event)
    var id = event.currentTarget.dataset.id 
    this.setData({ isSelect: id })
    this.getFollowList(1, id)
  },
  //获取祝福列表
  getFollowList: function (page = 1, catalog_id = 0, type = false) {
    var _this = this;
    var userInfo = wx.getStorageSync("userInfo")
    const options = {
      url: "/benison/all",
      data: {
        page: page,
        per_page: 100,
        catalog_id: catalog_id,
        is_belong_template: 1,
        user_id: userInfo.id
      }
    }
    util.fetch(options, function (data) {
      _this.setData({ cardList: data.data })
    }, type)
  },
  //导航列表
  getNavList: function () {
    var _this = this;
    const options = {
      url: "/catalog"
    }
    util.fetch(options, function (data) {
      _this.setData({ navList: _this.data.navList.concat(data) })
    })
  },
  toDetail: function (event){ //调转详情
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/bless/bless?benison_id=' + item.id
    })
  },
  scrollToRed: function (e) {
    this.setData({
      toView: 'green'
    })
  },
  scrollTo100: function (e) {
    this.setData({
      scrollLeft: 100
    })
  },

  upper: function (e) {
    console.log('滚动到顶部')
  },
  lower: function (e) {
    console.log('滚动到底部')
  },
  scroll: function (e) {
    console.log(e)
  },
})
