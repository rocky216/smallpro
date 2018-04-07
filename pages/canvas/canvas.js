import util from "../../utils/util";

const app = getApp();

Page({
    data: {
        windowWidth: 0,
        windowHeight: 0,
        contentHeight: 0,
        thinkList: [],
        footer: "",
        offset: 0,
        lineHeight: 30,
        qrcode_temp: null,
        imgSrc: null,
        detailInfo: {}
    },

    onLoad: function(options) {
        let that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    offset: (res.windowWidth - 300) / 2
                });
            }
        });
        this.getDetail(options);
        //缓存canvas绘制小程序二维码
    },
    getDetail: function(opt) {
        var _this = this;
        const options = {
            url: "/benison/detail",
            data: {
                benison_id: opt.benison_id
            }
        };

        util.fetch(options, function(res) {
            res["template"]["top"] = res["template"]["top"] * 589 / 750;
            console.log(res, 8888);
            _this.setData({ detailInfo: res });
            _this.getTmeplateInfo(res);
            // _this.getCodeUrl(res);
        });
    },
    getCodeUrl: function(detail) {
        var _this = this;
        const options = {
            url: "/codeurl",
            data: {
                scane:
                    "?benison_id=" +
                    detail.id +
                    "&template_id=" +
                    detail.template_id,
                path: "/pages/detail/detail"
            },
            method: "get"
        };

        util.fetch(options, function(res) {
            console.log(res, 99999);
        });
    },
    onShow: function() {
        this.getData();
    },
    getTmeplateInfo: function(detail) {
        let that = this;
        console.log(detail, "this.data");
        let i = 0;
        let lineNum = 1;
        const bg_img = detail.template.bg_img;
        wx.downloadFile({
            url: bg_img,
            success: function(res2) {
                console.log("二维码：" + res2.tempFilePath);
                //缓存二维码
                that.setData({
                    qrcode_temp: res2.tempFilePath
                });
                console.log("开始绘制图片");
                that.createNewImg(lineNum, res2.tempFilePath);
                // that.drawImage();
                // wx.hideLoading();
                setTimeout(function() {
                    that.canvasToImage();
                }, 200);
            }
        });
    },
    getData: function() {
        // let that = this;
        // console.log(this.data, "this.data");
        // let i = 0;
        // let lineNum = 1;
        // const bg_img = this.data.detailInfo.template.bg_img;
        // wx.downloadFile({
        //     url: bg_img,
        //     success: function(res2) {
        //         console.log("二维码：" + res2.tempFilePath);
        //         //缓存二维码
        //         that.setData({
        //             qrcode_temp: res2.tempFilePath
        //         });
        //         console.log("开始绘制图片");
        //         that.createNewImg(lineNum, res2.tempFilePath);
        //         // that.drawImage();
        //         // wx.hideLoading();
        //         setTimeout(function() {
        //             that.canvasToImage();
        //         }, 200);
        //     }
        // });
    },

    drawSquare: function(ctx, height) {
        ctx.rect(0, 50, this.data.windowWidth, height);
        ctx.setFillStyle("#f5f6fd");
        ctx.fill();
    },

    drawFont: function(ctx, content, height) {
        ctx.setFontSize(16);
        ctx.setFillStyle("#484a3d");
        ctx.fillText(content, this.data.offset + 60, height);
    },

    drawLine: function(ctx, height) {
        ctx.beginPath();
        ctx.moveTo(this.data.offset, height);
        ctx.lineTo(this.data.windowWidth - this.data.offset, height);
        ctx.stroke("#eee");
        ctx.closePath();
    },
    canvasToImage: function() {
        const that = this;
        wx.canvasToTempFilePath({
            canvasId: "myCanvas",
            success: function(res) {
                console.log(res, "res");
                that.setData({
                    imgSrc: res.tempFilePath
                });
                // util.savePicToAlbum(res.tempFilePath);
            }
        });
    },
    createNewImg: function(lineNum, tempFilePath) {
        let that = this;
        let ctx = wx.createCanvasContext("myCanvas");
        console.log(app, "app111");
        let nick_name = wx.getStorageSync("userInfo").nick_name;
        nick_name = "【" + nick_name + "】";
        that.setData({ contentHeight: that.data.windowHeight - 100 });

        ctx.drawImage(
            "../../images/share_bg.jpg",
            0,
            0,
            that.data.windowWidth,
            that.data.windowHeight - 100
        );
        ctx.save();
        ctx.restore();
        ctx.setFontSize(16);
        ctx.setFillStyle("#484a3d");
        ctx.setTextAlign("center");
        ctx.fillText(nick_name, this.data.offset + 150, 30);
        ctx.fillText("给你送祝福啦", this.data.offset + 150, 70);
        ctx.drawImage(
            "../../images/share.jpg",
            that.data.windowWidth / 2 - 64,
            100,
            128,
            128
        );
        ctx.fillText(
            "分享此图到朋友圈吧",
            this.data.offset + 150,
            that.data.windowHeight - 120
        );
        ctx.draw();
    },

    savePic: function() {
        let that = this;
        wx.canvasToTempFilePath({
            canvasId: "myCanvas",
            success: function(res) {
                util.savePicToAlbum(res.tempFilePath);
            }
        });
    }
});
