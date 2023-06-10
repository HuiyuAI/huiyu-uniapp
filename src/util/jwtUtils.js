/**
 * 将jwt的payload部分转换为json对象
 * @param jwt
 * @returns {any}
 */
export function parseJwtPayload2Obj(jwt) {
  return JSON.parse(decodeURIComponent(escape(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))))
}

/**
 * 检查access_token是否到期
 * @returns {boolean}
 */
export function isAccessTokenExpires() {
  const accessTokenExpiresAt = uni.getStorageSync('access_token_expires_at')
  const now = ~~(Date.now() / 1000)
  return accessTokenExpiresAt && now > accessTokenExpiresAt
}

/**
 * 检查refresh_token是否到期
 * @returns {boolean}
 */
export function isRefreshTokenExpires() {
  const refreshTokenExpiresAt = uni.getStorageSync('refresh_token_expires_at')
  const now = ~~(Date.now() / 1000)
  return refreshTokenExpiresAt && now > refreshTokenExpiresAt
}

/**
 * 检查是否需要刷新access_token
 * @returns {boolean}
 */
export function isTimeToRefreshToken() {
  const refreshTokenExpiresAt = uni.getStorageSync('refresh_token_expires_at')
  const now = ~~(Date.now() / 1000)
  return refreshTokenExpiresAt && isAccessTokenExpires() && refreshTokenExpiresAt > now
}