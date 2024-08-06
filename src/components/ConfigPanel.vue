<script setup lang="ts">
import { useMaplibreStore } from '@/stores/maplibre'
import { computed } from 'vue'

const maplibreStore = useMaplibreStore()
const map = computed(() => maplibreStore.getMapInstance)

type Layers = {
  label: string
  layerId: string
}

const toggleLayer = (layer: Layers) => {
  if (!map.value.getLayer(layer.layerId)) {
    maplibreStore.addPolygonLayerById(layer.layerId)
  } else {
    maplibreStore.removePolygonLayerById(layer.layerId)
  }
}

const layers = computed((): Layers[] => {
  return [
    {
      label: 'Robot Map Area Size',
      layerId: 'area-size-layer'
    },
    {
      label: 'Robot Map Perimeter',
      layerId: 'perimeter-layer'
    }
  ]
})
</script>

<template>
  <div class="config-container">
    <section class="config-card">
      <h1 class="config-card__title">Configuration Panel</h1>
      <div class="config-item" v-for="(layer, index) in layers" :key="index">
        <label class="switch">
          <input type="checkbox" @change="toggleLayer(layer)" />
          <span class="slider round"></span>
        </label>
        <p>{{ layer.label }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.config-container {
  position: absolute;
  top: calc(50vh - 107.5px);
  left: 16px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.config-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  width: 320px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  box-shadow: 0 0 50px -25px black;
}

.config-card__title {
  margin-bottom: 16px;
}

.config-item {
  display: flex;
  gap: 8px;
  width: 100%;
}

.switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 16px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:disabled + .slider {
  cursor: not-allowed;
  opacity: 0.3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
