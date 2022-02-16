<template>
    <keep-alive :include="['canawards']">
        <router-view :key="$route.path"></router-view>
    </keep-alive>
</template>
