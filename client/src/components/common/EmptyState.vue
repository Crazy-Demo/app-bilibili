<template><div class="empty-state"><van-empty :description="message" :image="image" /></div></template>
<script setup lang="ts">defineProps<{ message?: string; image?: string }>()</script>
