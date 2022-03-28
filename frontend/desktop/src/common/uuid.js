/**
 * @description 用于创建唯一 uuid
 *
 * */
class Uuid {
    constructor () {
        this.id = 0
    }

    get () {
        if (typeof this.id === typeof 0) {
            this.id++
        } else {
            this.id = 0
        }
        return this.id
    }

    clear () {
        this.id = null
    }
}

export const uuid = new Uuid()

export default { uuid }
