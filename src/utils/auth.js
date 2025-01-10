import Cookies from 'js-cookie'

const TokenKey = 'X-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setCookie(key, value) {
  return Cookies.set(key, value)
}

export function getCookie(key) {
  return Cookies.get(key)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function localSet(key, value) {
  return localStorage.setItem(key, JSON.stringify(value))
}

export function localGet(key) {
  var tmp = localStorage.getItem(key)
  try {
    tmp = JSON.parse(tmp)
  } catch (e) {}
  return tmp
}

export function localRemove(key) {
  return localStorage.removeItem(key)
}
