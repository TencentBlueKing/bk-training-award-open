<template>
    <bk-select :placeholder="$attrs['placeholder']"
        :ext-cls="$attrs['ext-cls']"
        :readonly="$attrs['readonly']"
        :disabled="$attrs['disabled']"
        :list="list"
        :id-key="config[type]['idKey']"
        :display-key="config[type]['displayKey']"
        :loading="loading"
        :clearable="true"
        :searchable="true"
        :enable-virtual-scroll="true"
        :multiple="multiple"
        :display-tag="true"
        :value="value"
        :z-index="100000"
        :is-tag-width-limit="false"
        @change="$emit('update:value', $event)"
    >
    </bk-select>
</template>

<script>
    import { getListDepartments, getListUsers, getSecretaryDepartment } from '@/api/service/bk-service'
    import { GROUP_KEYNAME, GROUP_SECRETARY_KEYNAME, GROUP_USERS_KEYNAME } from '@/constants'

    export default {
        name: 'select-search',
        props: {
            value: {
                type: Array || String,
                default: () => []
            },
            multiple: {
                type: Boolean,
                default: () => true
            },
            type: {
                type: 'user' || 'group' || 'secretary',
                default: () => 'user'
            },
            idKey: {
                type: String,
                default: () => 'id'
            },
            filterFn: {
                type: Function,
                default: () => true
            }
        },
        data (self) {
            return {
                config: {
                    'user': {
                        func: self.handleGetUserManageListUsers,
                        idKey: self.idKey || 'id',
                        displayKey: 'display_name_for_display'
                    },
                    'group': {
                        func: self.handleGetDepartment,
                        idKey: self.idKey || 'id',
                        displayKey: 'full_name'
                    },
                    'secretary': {
                        func: self.handleGetSecretaryDepartment,
                        idKey: self.idKey || 'id',
                        displayKey: 'full_name'
                    }
                },
                groupUsers: [],
                loading: false
            }
        },
        computed: {
            list (self) {
                const config = self['config']
                const type = self['type']
                return self.groupUsers?.filter?.(item => {
                    return item[config[type]['displayKey']]
                }).filter(self.filterFn) ?? []
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                const type = this.type
                this.config[type]['func']()
            },
            handleGetDepartment () {
                this.loading = true
                const groupUsers = this.$http.cache.get(GROUP_KEYNAME)
                if (groupUsers) {
                    this.groupUsers = groupUsers
                    this.loading = false
                    return
                }
                return getListDepartments({ page: 1, page_size: 1 }).then(_ => {
                    if (!_.data?.count) {
                        this.messageWarn('出错啦')
                        this.loading = false
                        return
                    }
                    return getListDepartments({ page: 1, page_size: _.data.count })
                }).then(response => {
                    this.groupUsers = response.data.results
                    this.$http.cache.set(GROUP_KEYNAME, response.data.results)
                }).finally(_ => {
                    this.loading = false
                })
            },
            // 获取用户列表信息
            handleGetUserManageListUsers () {
                this.loading = true
                const groupUsers = this.$http.cache.get(GROUP_USERS_KEYNAME)
                if (groupUsers) {
                    this.groupUsers = groupUsers
                    this.loading = false
                    return
                }

                // 第一个请求是为了获取总量，避免盲猜
                return getListUsers({ page: 1, page_size: 1 }).then(_ => {
                    if (!_.data?.count) {
                        this.messageWarn('出错啦')
                        this.loading = false
                        return
                    }
                    return getListUsers({ page: 1, page_size: _.data.count })
                }).then(response => {
                    if (!response.data.results) {
                        this.messageWarn('出错啦')
                        this.loading = false
                        return
                    }
                    this.groupUsers = response.data.results.map(item => {
                        item['display_name_for_display'] = `${item['username']}(${item['display_name']})`
                        return item
                    })
                    this.$http.cache.set(GROUP_USERS_KEYNAME, response.data.results)
                }).finally(_ => {
                    this.loading = false
                })
            },
            // 获取秘书可管理的组
            handleGetSecretaryDepartment () {
                return getSecretaryDepartment().then(response => {
                    if (!response.data) {
                        this.messageWarn('出错啦')
                        this.loading = false
                    }
                    this.groupUsers = response.data
                    this.$http.cache.set(GROUP_SECRETARY_KEYNAME, response.data)
                })
            }
        }

    }
</script>

<style scoped>

</style>
