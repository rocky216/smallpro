const app = getApp()
const baseUrl = 'https://smallcode.chenqingpu.cn/api'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function extend(settings , opt){
  for(var attr in opt){
    settings[attr] = opt[attr]
  }
}

function fetch(opt,next,type=false) {  //ajax请求
  
  var settings = {
    url: "",
    data: "",
    method: "get"
  }

  extend(settings, opt)

  var cache_key = settings.url + JSON.stringify(settings.data);
  var cache_data = wx.getStorageSync(cache_key)

  wx.showLoading({
    title: "加载中",
  })
  if (!cache_data || type){
    wx.request({
      url: baseUrl+settings.url,
      data: settings.data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: settings.method,
      success: function (res) {
        var data = res.data;
        wx.hideLoading()
        if (data.status) {
          next(data.res)
          wx.setStorageSync(cache_key, data.res)
        } else {
          wx.showToast({
            title: data.msg,
            duration: 1500
          })
        }

      },
      fail: function (res) {
        wx.showToast({
          title: "网路错误",
          icon: "none",
          duration: 1500
        })

      }
    })
  }else{
    
    wx.hideLoading()
    next(wx.getStorageSync(cache_key))
    console.log('%c' + cache_key, 'color:green');
  }
  
}


//更改数组中某一项的值

function ChangeArrayItem(arr,str){
  var index='';
  for(var i=0;i<arr.length;i++){
    for(var attr in arr[i]){
      if (arr[i][attr] == str){
        return i
      }
    }
  }
  return index
}
//获取当前页面的url
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

module.exports = {
  formatTime: formatTime,
  fetch: fetch,
  ChangeArrayItem,
  getCurrentPageUrl
}
