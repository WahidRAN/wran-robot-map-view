<script setup lang="ts">
import MapView from './components/MapView.vue'
import RobotMap from './components/RobotMap.vue'
import ConfigPanel from './components/ConfigPanel.vue'
</script>

<template>
  <div class="app-container">
    <MapView />
    <RobotMap />
    <ConfigPanel />
  </div>
</template>

<style>
.app-container {
  display: block;
  width: 100%;
  height: 100vh;
}
</style>
