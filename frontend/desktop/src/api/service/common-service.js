/**
 * @file service common
 * @author couriourc
 */

import http from '@/api'
/**
 * @description 二进制文件
 * @param fileObj
 * */
export function postUpload (fileObj) {
    return http.post('/upload/', fileObj)
}
