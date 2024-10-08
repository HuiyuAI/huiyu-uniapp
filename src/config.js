module.exports = {
  /**
   * @type {string}
   * @description 后端接口地址
   */
  baseServerUrl: 'http://localhost:8000',

  /**
   * @type {number}
   * @description 修脸消耗点数
   */
  restoreFacePoint: 2,

  /**
   * @type {number}
   * @description 超分消耗点数
   */
  superResolutionPoint: 1,

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

  /**
   * @type {number}
   * @description 描述词最大输入长度
   */
  promptMaxInput: 1000,

  /**
   * @type {number}
   * @description 昵称最大输入长度
   */
  nicknameMaxInput: 8,

  /**
   * @type {number}
   * @description 投稿标题最大输入长度
   */
  shareTitleMaxInput: 20,

  /**
   * @type {Array}
   * @description 分享小程序显示的图片url
   */
  shareAppImageUrlList: [
    'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
  ],
};
