/**
 * 验证十进制数字
 */
function number(value) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}

/**
 * 判断是否为空
 */
function empty(value) {
    switch (typeof value) {
    case 'undefined':
        return true
    case 'string':
        if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
        break
    case 'boolean':
        if (!value) return true
        break
    case 'number':
        if (value === 0 || isNaN(value)) return true
        break
    case 'object':
        if (value === null || value.length === 0) return true
        for (const i in value) {
            return false
        }
        return true
    }
    return false
}

/**
 * 是否数组
 */
function array(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value)
    }
    return Object.prototype.toString.call(value) === '[object Array]'
}

export {
    number,
    empty,
    array,
}
