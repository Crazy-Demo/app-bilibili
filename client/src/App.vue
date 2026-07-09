<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'slide-right'" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
