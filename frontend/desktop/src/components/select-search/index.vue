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
        @change="$emit('update:value', $event)"
    >
    </bk-select>
</template>

<script>
    import { getListDepartments, getListUsers } from '@/api/service/bk-service'
    import { GROUP_KEYNAME, GROUP_USERS_KEYNAME } from '@/constants'
    export default {
        name: 'select-search',
        props: {
            value: {
                type: Array || String
            },
            multiple: {
                type: Boolean,
                default: () => true
            },
            type: {
                type: 'user' || 'group',
                default: () => 'user'
            }
        },
        data () {
            return {
                config: {
                    'user': {
                        func: this.handleGetUserManageListUsers,
                        idKey: 'username',
                        displayKey: 'display_name'
                    },
                    'group': {
                        func: this.handleGetDepartment,
                        idKey: 'id',
                        displayKey: 'full_name'
                    }
                },
                groupUsers: [],
                loading: false
            }
        },
        computed: {
            list (self) {
                if (!self.groupUsers.filter) return []
                const config = self['config']
                const type = self['type']
                return self.groupUsers.filter(item => {
                    return item[config[type]['displayKey']]
                })
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
                    return getListDepartments({ page: 1, page_size: _.data.count })
                }).then(response => {
                    this.groupUsers = response.data.results
                    this.$http.cache.set(GROUP_KEYNAME, response.data.results)
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleGetUserManageListUsers () {
                this.loading = true
                const groupUsers = this.$http.cache.get(GROUP_USERS_KEYNAME)
                if (groupUsers) {
                    this.groupUsers = groupUsers
                    this.loading = false
                    return
                }

                // 第一个请求是为了获取总量，避免盲猜
                getListUsers({ page: 1, page_size: 1 }).then(_ => {
                    console.log(_)
                    return getListUsers({ page: 1, page_size: _.data.count })
                }).then(response => {
                    this.groupUsers = response.data.results.map(item => {
                        item['display_name'] = `${item['username']}(${item['display_name']})`
                        return item
                    })
                    this.$http.cache.set(GROUP_USERS_KEYNAME, response.data.results)
                }).finally(_ => {
                    this.loading = false
                })
            }
        }

    }
</script>

<style scoped>

</style>
