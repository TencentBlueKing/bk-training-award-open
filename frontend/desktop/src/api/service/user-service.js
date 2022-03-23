/**
 * @file service group
 * @author couriourc
 */
import http from '@/api'

export function getUserInfo (config) {
    const url = '/userinfo/'

    return http.get(url, {}, { canNewer: true, ...config })
}
