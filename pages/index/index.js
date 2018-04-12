//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");

var touchDot = 0; //触摸时的原点
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = null; // 记录/清理时间记录
var timer = null;

Page({
  onShareAppMessage: function(res) {
    return {
      title: "112"
    };
  },
  data: {
    avatar: "/images/icon/icon_home.png",
    //首页分类列表
    navList: [
      {
        catalog_name: "全部",
        id: "0"
      }
    ],
    //点击是否选中
    isSelect: "0",
    //祝福列表
    followList: [],
    page: 1,
    catalogId: 0,
    totalPage: 0,
    timer: null,
    bStop: true,
    bStopPull: true
  },
  onLoad: function() {
    util.isLogin();
    this.getNavList();
    this.getFollowList();
  },
  onShow() {
    util.clearStorage();
  },
  getNavList: function() {
    var _this = this;
    const options = {
      url: "/catalog"
    };
    util.fetch(options, function(data) {
      _this.setData({ navList: _this.data.navList.concat(data) });
    });
  },
  //获取祝福列表
  getFollowList: function(page = 1, catalog_id = 0, type = false) {
    var _this = this;
    var userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo });
    const options = {
      url: "/benison/all",
      data: {
        page: page,
        per_page: 5,
        catalog_id: catalog_id,
        user_id: userInfo ? userInfo.id:'',
        password: ""
      }
    };
    util.fetch(
      options,
      function(data) {
        _this.setData({
          followList: _this.data.followList.concat(data.data),
          totalPage: Math.ceil(data.total / data.per_page)
        });
      },
      type
    );
  },

  bindNavClick: function(event) {
    this.setData({ isSelect: event.currentTarget.id, followList: [], page: 1 });
    this.getFollowList(1, event.currentTarget.id);
  },
  //上拉加载
  pullLoading: function(e) {
    var _this = this;
    if (this.data.page > this.data.totalPage) return;
    if (this.data.bStop) {
      this.setData({ page: this.data.page + 1 });
      this.getFollowList(this.data.page, this.data.isSelect);
      _this.setData({ bStop: false });
      clearTimeout(interval);
      interval = setTimeout(function() {
        _this.setData({ bStop: true });
      }, 500);
    }
  },
  //下拉刷新
  dropRefresh: function() {
    var _this = this;
    if (this.data.bStopPull) {
      this.getFollowList(1, this.data.isSelect, true);
      this.setData({ bStopPull: false });
      clearTimeout(timer);
      timer = setTimeout(function() {
        _this.setData({ bStopPull: true });
      }, 500);
    }
  },
  //点击关注
  cliclFollow: function(event) {
    var _this = this;
    const userInfo = wx.getStorageSync("userInfo") || "";
    const user_id = userInfo ? userInfo.id : "";
    const { followList } = this.data;
    var index = util.ChangeArrayItem(
      followList,
      event.currentTarget.dataset.item.id
    );
    const options = {
      url: "/benison/liked/" + event.currentTarget.dataset.item.id,
      method: "put",
      data: {
        liked_total_type: followList[index]["is_liked_bension"]
          ? "decrement"
          : "increment", //increment+ decrement-
        user_id: user_id,
        template_id: event.currentTarget.dataset.item.template_id
      }
    };

    util.fetch(
      options,
      function(res) {
        if (followList[index]["is_liked_bension"]) {
          followList[index]["liked_total"] =
            followList[index]["liked_total"] - 1;
          followList[index]["is_liked_bension"] = 0;
        } else {
          followList[index]["liked_total"] =
            followList[index]["liked_total"] + 1;
          followList[index]["is_liked_bension"] = 1;
        }

        _this.setData({ followList });
      },
      true
    );
  },
  ClickShare: function(event) {
    const item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/bless/bless?benison_id=" + item.id
    });
  },
  errorImage: function(event) {
    const { followList } = this.data;
    var index = util.ChangeArrayItem(
      followList,
      event.currentTarget.dataset.item.id
    );
    followList[index]["template"]["bg_imgsumb"] = "/images/icon/icon_home.png";
    this.setData({
      followList: followList
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    console.log(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(2);
  }

  // touchStart: function(e){
  //   touchDot = e.touches[0].pageX;
  //   interval = setInterval(function () {
  //     time++;
  //   }, 100);
  // },
  // touchMove: function(e){
  //   var touchMove = e.touches[0].pageX;
  //   if (touchMove - touchDot <= -40 && time < 10){
  //     wx.switchTab({
  //       url: '/pages/follow/follow'
  //     });
  //   }
  // },
  // touchEnd: function(){
  //   clearInterval(interval); // 清除setInterval
  //   time = 0;
  // }
});
