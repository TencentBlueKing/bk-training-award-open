<template>
    <bk-select :placeholder="$attrs['placeholder']"
        :ext-cls="$attrs['ext-cls']"
        :readonly="$attrs['readonly']"
        :disabled="$attrs['disabled']"
        :list="list"
        :id-key="config[type]['idKey']"
        :display-key="config[type]['displayKey']"
        :loading="loading"
        :clearable="clearable"
        :searchable="true"
        :enable-virtual-scroll="true"
        :multiple="multiple"
        :display-tag="true"
        :value="value"
        :z-index="9999999999"
        :is-tag-width-limit="false"
        @change="handleChange($event)"
        :behavior="$attrs['behavior']"
    >
    </bk-select>
</template>

<script>
    import { BK_GROUP_KEYNAME, SYS_KEYNAME } from '@/constants'
    import { getGroupAll, getGroupUser } from '@/api/service/group-service'
    import { formatUsernameAndDisplayName } from '@/common/util'

    export default {
        name: 'select-search',
        props: {
            value: {
                type: [Array, String, Number],
                default: () => []
            },
            data: {
                type: Array,
                default: () => []
            },
            multiple: {
                type: Boolean,
                default: () => true
            },
            type: {
                type: String,
                default: () => 'user'
            },
            idKey: {
                type: String,
                default: () => 'id'
            },
            displayKey: {
                type: String,
                default: () => 'id'
            },
            filterFn: {
                type: Function,
                default: () => () => true
            },
            clearable: {
                type: Boolean,
                default: () => false
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
                    'sys_group': {
                        func: self.handleGetSysGroup,
                        idKey: self.idKey || 'id',
                        displayKey: 'full_name'
                    },
                    'bk-group': {
                        func: self.handleGetBkGroup,
                        idKey: self.idKey || 'id',
                        displayKey: 'full_name'
                    },
                    'self': {
                        func: this.handleSetMySelfData,
                        idKey: self.idKey || 'id',
                        displayKey: self.displayKey
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
                const list = self.groupUsers?.filter?.(item => {
                    return item[config[type]['displayKey']]
                }).filter(self.filterFn) ?? []

                if (list && !self.value && !self.multiple) {
                    self.handleChange(list[0]?.[config[type]['idKey']] || '')
                }
                if (type === 'group') {
                    return self.$bus.groupList
                }
                if (type === 'self') {
                    return self.data
                }
                return list
            }
        },
        watch: {
            '$bus.curGlobalGroupId': {
                handler (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        this.handleInit()
                    }
                },
                immediate: true
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                const type = this.type
                this.config[type]?.['func']?.()
            },
            handleChange (event) {
                if (this.type === 'group') {
                    this.$bus.curGlobalGroupId = event
                }
                this.$emit('change', event)
                this.$emit('update:value', event)
            },
            handleGetBkGroup () {
                this.loading = true
                const groupUsers = this.$http.cache.get(BK_GROUP_KEYNAME)
                if (groupUsers) {
                    this.groupUsers = groupUsers
                    this.loading = false
                    return
                }
                return this.$store.dispatch('bkInfo', { fromCache: true }).then(
                    response => {
                        this.groupUsers = response['departments']
                        this.$http.cache.set(BK_GROUP_KEYNAME, response['departments'])
                    }
                ).finally(_ => {
                    this.loading = false
                })
            },
            handleGetDepartment () {
                this.groupUsers = this.$bus.groupList
            },
            // 获取用户列表信息
            handleGetUserManageListUsers () {
                this.loading = true
                const groupId = this.$bus.curGlobalGroupId

                return getGroupUser({ groupId: groupId }).then(response => {
                    if (!response.data) {
                        this.messageWarn('出错啦')
                        this.loading = false
                        return
                    }
                    this.groupUsers = response.data.map(item => {
                        item['display_name_for_display'] = formatUsernameAndDisplayName(item['username'], item['display_name'])
                        return item
                    })
                }).finally(_ => {
                    this.loading = false
                })
            },
            handleSetMySelfData () {
                this.groupUsers = this.data
            },
            handleGetSysGroup () {
                this.loading = true
                const groupUsers = this.$http.cache.get(SYS_KEYNAME)
                if (groupUsers) {
                    this.groupUsers = groupUsers
                    this.loading = false
                    return
                }
                return getGroupAll().then(response => {
                    console.log(response)
                    this.groupUsers = response.data
                    this.$http.cache.set(SYS_KEYNAME, response.data)
                }).finally(_ => {
                    this.loading = false
                })
            }

        }

    }
</script>

<style scoped>

</style>
