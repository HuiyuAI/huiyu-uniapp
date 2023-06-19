// 显示Toast
/*
@title 最多汉字数量7个
@icon success loading none
*/
function showToast(title, icon = 'none', obj = {}, duration = 1500) {
	if (typeof title !== 'string') {
		return
	}
	let toastData = {
		title: title,
		duration: duration,
		position: 'center',
		mask: true,
		icon: icon ? icon : 'none',
		...obj
	};
	uni.showToast(toastData);
}


//序列化对象和数组
function serialize(data) {
	if (data != null && data != '') {
		try {
			return JSON.parse(JSON.stringify(data));
		} catch (e) {
			if (data instanceof Array) {
				return [];
			}
			return {};
		}
	}
	return data;
}
Date.prototype.format = function(fmt) {
	let o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds() //毫秒
	};

	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
		}
	}
	return fmt;
};



function base64ToPath(base64) {
	return new Promise(function(resolve, reject) {
		if (typeof window === 'object' && 'document' in window) {
			base64 = base64.split(',')
			var type = base64[0].match(/:(.*?);/)[1]
			var str = atob(base64[1])
			var n = str.length
			var array = new Uint8Array(n)
			while (n--) {
				array[n] = str.charCodeAt(n)
			}
			return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], {
				type: type
			})))
		}
		var extName = base64.match(/data\:\S+\/(\S+);/)
		if (extName) {
			extName = extName[1]
		} else {
			reject(new Error('base64 error'))
		}
		var fileName = Date.now() + '.' + extName
		if (typeof plus === 'object') {
			var bitmap = new plus.nativeObj.Bitmap('bitmap' + Date.now())
			bitmap.loadBase64Data(base64, function() {
				var filePath = '_doc/uniapp_temp/' + fileName
				bitmap.save(filePath, {}, function() {
					bitmap.clear()
					resolve(filePath)
				}, function(error) {
					bitmap.clear()
					reject(error)
				})
			}, function(error) {
				bitmap.clear()
				reject(error)
			})
			return
		}
		if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
			var filePath = wx.env.USER_DATA_PATH + '/' + fileName
			wx.getFileSystemManager().writeFile({
				filePath: filePath,
				data: base64.replace(/^data:\S+\/\S+;base64,/, ''),
				encoding: 'base64',
				success: function() {
					resolve(filePath)
				},
				fail: function(error) {
					reject(error)
				}
			})
			return
		}
		reject(new Error('not support'))
	})
}

// 删除数组中重复数据
function unique(data) {
	data = data || [];
	var n = {}; //存放新的数据
	for (var i = 0; i < data.length; i++) {
		var v = JSON.stringify(data[i]);
		if (typeof(v) == "undefined") {
			n[v] = 1;
		}
	}
	data.length = 0;
	for (var i in n) {
		data[data.length] = i;
	}
	return data;
}

/**
 * @description 获取元素节点信息（在组件中的元素必须要传ctx）
 *  在组件js首行添加： const ctx = getCurrentInstance()
 * @param  { String } selector 选择器 '.app' | '#app'
 * @param  { Boolean } all 是否多选
 * @param  { ctx } context 当前组件实例
 *  this.$utils.getRect('#list-el').then(res=>{
		console.log('rk_ui===>xxxx:' + JSON.stringify(res));
	});
 */
const getRect = (selector, all = false, context) => {
	return new Promise((resolve, reject) => {
		let qurey = uni.createSelectorQuery()
		if (context) {
			qurey = uni.createSelectorQuery().in(context)
		}
		qurey[all ? 'selectAll' : 'select'](selector)
			.boundingClientRect(function(rect) {
				if (all && Array.isArray(rect) && rect.length) {
					return resolve(rect)
				}
				if (!all && rect) {
					return resolve(rect)
				}
				reject('找不到元素')
			})
			.exec()
	})
}

/**
 * @description 是否为空
 * @param {unknown} value
 * @return {Boolean}
 */
const isEmpty = (value) => {
	return value == null && typeof value == 'undefined'
}

module.exports = {
	showToast,
	serialize,
	base64ToPath,
	unique,
	getRect,
	isEmpty,
}
