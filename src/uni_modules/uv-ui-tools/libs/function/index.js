import { number, empty } from './test.js'

/**
 * @description 进行延时，以达到可以简写代码的目的 比如: await uni.$uv.sleep(20)将会阻塞20ms
 * @param {number} value 堵塞时间 单位ms 毫秒
 * @returns {Promise} 返回promise
 */
function sleep(value = 30) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve()
		}, value)
	})
}

/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
 */
function sys() {
	return uni.getSystemInfoSync()
}

/**
* @description 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
   this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
   这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
   值(默认为undefined)，就是查找最顶层的$parent
*  @param {string|undefined} name 父组件的参数名
*/
function $parent(name = undefined) {
	let parent = this.$parent
	// 通过while历遍，这里主要是为了H5需要多层解析的问题
	while (parent) {
		// 父组件
		if (parent.$options && parent.$options.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent
		} else {
			return parent
		}
	}
	return false
}

/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
function addStyle(customStyle, target = 'object') {
	// 字符串转字符串，对象转对象情形，直接返回
	if (empty(customStyle) || typeof(customStyle) === 'object' && target === 'object' || target === 'string' &&
		typeof(customStyle) === 'string') {
		return customStyle
	}
	// 字符串转对象
	if (target === 'object') {
		// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
		customStyle = trim(customStyle)
		// 根据";"将字符串转为数组形式
		const styleArray = customStyle.split(';')
		const style = {}
		// 历遍数组，拼接成对象
		for (let i = 0; i < styleArray.length; i++) {
			// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
			if (styleArray[i]) {
				const item = styleArray[i].split(':')
				style[trim(item[0])] = trim(item[1])
			}
		}
		return style
	}
	// 这里为对象转字符串形式
	let string = ''
	for (const i in customStyle) {
		// 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
		const key = i.replace(/([A-Z])/g, '-$1').toLowerCase()
		string += `${key}:${customStyle[i]};`
	}
	// 去除两端空格
	return trim(string)
}

/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
function addUnit(value = 'auto', unit = uni?.$uv?.config?.unit ? uni?.$uv?.config?.unit : 'px') {
	value = String(value)
	// 用uvui内置验证规则中的number判断是否为数值
	return number(value) ? `${value}${unit}` : value
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @param cache 缓存
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
function deepClone(obj, cache = new WeakMap()) {
	if (obj === null || typeof obj !== 'object') return obj;
	if (cache.has(obj)) return cache.get(obj);
	let clone;
	if (obj instanceof Date) {
		clone = new Date(obj.getTime());
	} else if (obj instanceof RegExp) {
		clone = new RegExp(obj);
	} else if (obj instanceof Map) {
		clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]));
	} else if (obj instanceof Set) {
		clone = new Set(Array.from(obj, value => deepClone(value, cache)));
	} else if (Array.isArray(obj)) {
		clone = obj.map(value => deepClone(value, cache));
	} else if (Object.prototype.toString.call(obj) === '[object Object]') {
		clone = Object.create(Object.getPrototypeOf(obj));
		cache.set(obj, clone);
		for (const [key, value] of Object.entries(obj)) {
			clone[key] = deepClone(value, cache);
		}
	} else {
		clone = Object.assign({}, obj);
	}
	cache.set(obj, clone);
	return clone;
}

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
function deepMerge(target = {}, source = {}) {
	target = deepClone(target)
	if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) return target;
	const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target);
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue;
		const sourceValue = source[prop];
		const targetValue = merged[prop];
		if (sourceValue instanceof Date) {
			merged[prop] = new Date(sourceValue);
		} else if (sourceValue instanceof RegExp) {
			merged[prop] = new RegExp(sourceValue);
		} else if (sourceValue instanceof Map) {
			merged[prop] = new Map(sourceValue);
		} else if (sourceValue instanceof Set) {
			merged[prop] = new Set(sourceValue);
		} else if (typeof sourceValue === 'object' && sourceValue !== null) {
			merged[prop] = deepMerge(targetValue, sourceValue);
		} else {
			merged[prop] = sourceValue;
		}
	}
	return merged;
}

/**
 * @description 去除空格
 * @param String str 需要去除空格的字符串
 * @param String pos both(左右)|left|right|all 默认both
 */
function trim(str, pos = 'both') {
	str = String(str)
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, '')
	}
	if (pos == 'left') {
		return str.replace(/^\s*/, '')
	}
	if (pos == 'right') {
		return str.replace(/(\s*$)/g, '')
	}
	if (pos == 'all') {
		return str.replace(/\s+/g, '')
	}
	return str
}


export {
	sleep,
	sys,
	$parent,
	addStyle,
	addUnit,
	deepClone,
	deepMerge,
	trim,
}
