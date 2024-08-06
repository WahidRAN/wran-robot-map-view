<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre'
import { useAdjustCoordinate } from '@/composables/useCoordinateConverter'

const maplibreStore = useMaplibreStore()
const map = computed(() => maplibreStore.getMapInstance)

const localCoordinateImg = computed(() => maplibreStore.getLocalCoordinateImg)

onMounted(async () => {
  if (!map.value) return

  await maplibreStore.setLocalCoordinateImg('campus-sim-img', '/campus_sim.png')
  if (!localCoordinateImg.value) return

  const adjustCoordinate = useAdjustCoordinate(localCoordinateImg.value)
  // Set boundary for image in global coordinate
  const topLeft = { lng: 103.77854702202285, lat: 1.3017648458709914 }
  const bottomRight = { lng: 103.78165302006164, lat: 1.2991905884640857 }
  const bounds = { topLeft, bottomRight }
  adjustCoordinate.setGlobalCoordinate(bounds)

  const angleDegrees = 10
  const scaleFactor = 1.18
  const offsetPoint = { x: 0.00016, y: -0.00013 }

  const translatedCoordinates = adjustCoordinate.globalPoint.value.map((coordinate: number[]) => {
    return adjustCoordinate.transform(
      { lng: coordinate[0], lat: coordinate[1] },
      angleDegrees,
      scaleFactor,
      offsetPoint
    )
  })

  if (!map.value.getSource('robot-map')) {
    map.value.addSource('robot-map', {
      type: 'image',
      url: '/campus_sim.png',
      coordinates: translatedCoordinates
    })
    map.value.addLayer({
      id: 'robot-map-layer',
      type: 'raster',
      source: 'robot-map',
      paint: {
        'raster-opacity': 0.5
      }
    })
  }

  function createRobotMarker() {
    const marker = document.createElement('div')
    marker.className = 'robot-marker'
    return marker
  }

  const robots = [
    { id: 'Robot 001', x: 366, y: 294, heading: 0 },
    { id: 'Robot 002', x: 1101, y: 613, heading: 60 },
    { id: 'Robot 003', x: 922, y: 946, heading: 240 },
    { id: 'Robot 004', x: 863, y: 324, heading: 330 }
  ]

  robots.forEach((robot) => {
    const [lng, lat] = adjustCoordinate.localToGlobal(robot.x, robot.y, bounds)
    const coordinatePoint = { lng, lat }

    const robotResult = adjustCoordinate.transform(
      coordinatePoint,
      angleDegrees,
      scaleFactor,
      offsetPoint
    )
    const robotElement = createRobotMarker()
    maplibreStore.createMarker(robotResult, robotElement, robot)
  })
})
</script>

<template>
  <div></div>
</template>

<style>
.robot-marker {
  cursor: pointer;
  content: url('../../public/robots-arrow-no-bg.png');
  width: 32px;
  height: 32px;
  object-fit: contain;
}
</style>
