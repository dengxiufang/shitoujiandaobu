//index.js
//获取应用实例
const app = getApp()
var timer
Page({
  data: {
    //控制按钮是否可点击
    btnState: false,
    //记录获胜次数
    winNum: 0,
    //中间的话语 'Ho~ You Win'
    gameOfPlay: '',
    //用户选择的图片
    imageUserSrc: '/pages/image/wenhao.png',
    //电脑随机选择的图片
    imageAiSrc: '',
    //石头剪刀步图片数组
    srcs: [
      '/pages/image/shitou.png',
      '/pages/image/jiandao.png',
      '/pages/image/bu.png'
    ],
    userStatus: 0,
    aiStatus: 0,
    stone: 0,
    scissor: 1,
    bag: 2
  },
  //生命周期，页面加载完成
  onLoad() {
    // 获取本地缓存 "已经获胜的次数"
    var oldWinNum = wx.getStorageSync('winNum');
    // 如果有缓存，那么给获胜次数赋值, 否则置零
    if (oldWinNum != null && oldWinNum != '') {
      this.data.winNum = oldWinNum
    }
    this.timerGo();
  },
  //开启计时器
  timerGo() {
    timer = setInterval(this.move, 100);
  },
  //ai 滚动方法
  move() {
    //生成 0-2 之间的随机数
    var numAi = Math.floor(Math.random()*3)
    this.setData({
      imageAiSrc: this.data.srcs[numAi],
      aiStatus: numAi
    })
  },
  //点击按钮
  changeForChoose(e) {
    if (this.data.btnState) {
      return;
    }
    //清除定时器
    clearInterval(timer);
    //获取数组中用户对应的图片
    this.setData({
      imageUserSrc: this.data.srcs[e.currentTarget.id],
      userStatus: e.currentTarget.id
    })
    // 获取数据源
    var num = this.data.winNum;
    var str = ''
    var respCode = this.judge(this.data.userStatus, this.data.aiStatus);
    if (respCode === 1) {
      str = '胜'
      ++num
      wx.setStorageSync('winNum', num)
    } else if (respCode === 0) {
      str = '平'
    } else {
      str = '败'
    }
    this.setData({
      gameOfPlay: str,
      btnState: true,
      winNum: num
    })
  },
  //判断输赢
  judge(userStatus, aiStatus) {
    if ((userStatus == this.data.stone && aiStatus == this.data.scissor) ||
      (userStatus == this.data.scissor && aiStatus == this.data.bag) ||
      (userStatus == this.data.bag && aiStatus == this.data.stone)) {
      return 1
    } else if (userStatus == aiStatus) {
      return 0
    } else {
      return -1
    }
  },
  //控制按钮
  again() {
    if (!this.data.btnState) {
      return;
    }
    //从新开始计时器
    this.timerGo()
    //刷新数据
    this.setData({
      btnState: false,
      gameOfPlay: '',
      imageUserSrc: '/pages/image/wenhao.png'
    })
  }
})


