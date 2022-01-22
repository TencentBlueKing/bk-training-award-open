/**
 * @file mock index module
 * @author wheel-w
 */

import moment from 'moment'
import faker from 'faker'
import chalk from 'chalk'

import { randomInt, sleep } from './util'

export async function response (getArgs, postArgs, req) {
    console.log(chalk.cyan('req', req.method))
    console.log(chalk.cyan('getArgs', JSON.stringify(getArgs, null, 0)))
    console.log(chalk.cyan('postArgs', JSON.stringify(postArgs, null, 0)))
    console.log()
    const invoke = getArgs.invoke
    if (invoke === 'get_award_list' ){
        let res = []
        for (let i = 0; i < 20; i++) {
            res.push({
                id:i,
            })
        }
        return res
    }

    return {
        code: 0,
        data: {}
    }
}
