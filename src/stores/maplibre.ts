import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import maplibregl from 'maplibre-gl'

export const useMaplibreStore = defineStore('maplibre', () => {
  const mapInstance = ref<maplibregl.Map>()
  const setMapInstance = (container: HTMLDivElement) => {
    if (!mapInstance.value) {
      mapInstance.value = new maplibregl.Map({
        container,
        style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=Y2ulfx5mJnVYzPYtrCZm',
        center: [103.7789574, 1.3005528],
        zoom: 17
      })
    }
  }
  const getMapInstance = computed(() => mapInstance.value)

  return { getMapInstance, setMapInstance }
})
