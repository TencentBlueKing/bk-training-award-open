/**
 * @file service group
 * @author couriourc
 */
import http from '@/api'

export function getUserInfo (config) {
    const url = USER_INFO_URL

    return http.get(url, {}, config)
}
