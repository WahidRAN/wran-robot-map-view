<template>
  <div id="map" ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre'

const maplibreStore = useMaplibreStore()
const mapContainer = ref(null)

onMounted(async () => {
  if (mapContainer.value) {
    maplibreStore.setMapInstance(mapContainer.value)
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
