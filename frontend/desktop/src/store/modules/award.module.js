/**
 * @file app store
 * @author couriourc
 */

/**
 * 奖项模块 奖项等级选择等地方使用
 * */
export default {
    namespaced: true,
    state: {
        awardLevels: []
    },
    mutations: {
        setAwardLevels (state, awardLevels) {
            state.awardLevels = awardLevels
        }
    },
    getters: {
        awardLevels: (state) => {
            return state.awardLevels
        }
    },
    actions: {
        getAwardLevels (state) {
            state.commit('setAwardLevels', [
                { id: 0, level: '公司' },
                { id: 1, level: '小组' }
            ])
        }
    }
}
