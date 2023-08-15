module.exports = {
  /**
   * @type {string}
   * @description 后端接口地址
   */
  baseServerUrl: 'https://api.naccl.top/huiyu',

  /**
   * @type {number}
   * @description 每日赠送积分数量
   */
  dailyPointGive: 100,

  /**
   * @type {Array}
   * @description 尺寸比例
   */
  sizeList: [
    {ratio: '9:16', width: 30, height: 52, val: 1, desc: '手机壁纸', selected: true},
    {ratio: '16:9', width: 52, height: 30, val: 2, desc: '电脑壁纸', selected: false},
    {ratio: '2:3', width: 30, height: 44, val: 3, desc: '社交媒体', selected: false},
    {ratio: '3:2', width: 44, height: 30, val: 4, desc: '文章配图', selected: false},
    {ratio: '1:1', width: 40, height: 40, val: 5, desc: '头像', selected: false},
  ],

  /**
   * @type {Array}
   * @description 生成数量
   */
  countList: [
    {val: 1, selected: true},
    {val: 2, selected: false},
    {val: 3, selected: false},
    {val: 4, selected: false},
  ],

  /**
   * @type {Array}
   * @description 图片质量
   */
  qualityList: [
    {title: '高清', val: 1, selected: true},
    {title: '超清', val: 2, selected: false},
    {title: '超高清4K', val: 3, selected: false},
  ],
};
