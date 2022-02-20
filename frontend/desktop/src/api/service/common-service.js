/**
 * @file service common
 * @author couriourc
 */

import http from '@/api'

export function postUpload (fileObj) {
    return http.post('/upload/', fileObj)
}
