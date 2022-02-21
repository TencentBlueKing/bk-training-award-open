<template>
    <keep-alive :include="['canawards','award-manager']">
        <router-view :key="$route.path"></router-view>
    </keep-alive>
</template>
