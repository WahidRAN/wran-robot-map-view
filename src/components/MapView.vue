<template>
  <div id="map" ref="mapContainer"></div>
  <div id="mouse" ref="mouseContainer"></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useMaplibreStore } from '@/stores/maplibre'

const maplibreStore = useMaplibreStore()
const mapContainer = ref(null)

const map = computed(() => maplibreStore.getMapInstance)

const mouseContainer = ref<HTMLDivElement | null>(null)

type CoordinateArrayType = [[number, number], [number, number], [number, number], [number, number]]

onMounted(async () => {
  if (mapContainer.value) {
    maplibreStore.setMapInstance(mapContainer.value)
  }
  // Immideatly return if map instance is not available
  if (!map.value) return

  const campusImg = await map.value.loadImage('/campus_sim.png')
  if (!map.value.getImage('campus-sim')) {
    map.value.addImage('campus-sim', campusImg.data)
  }
  const campusSimImg = map.value.getImage('campus-sim')
  console.log(
    'campus sim img',
    map.value.unproject([campusSimImg.data.width, campusSimImg.data.height]),
    map.value.unproject([0, 0])
  )

  map.value.on('mousemove', (e) => {
    if (mouseContainer.value) {
      mouseContainer.value.innerHTML = `${JSON.stringify(e.point)}<br />${JSON.stringify(e.lngLat.wrap())}`
    }
  })

  const originalCoordinates: CoordinateArrayType = [
    [103.77384035112135, 1.3018459532349027],
    [103.78619865004106, 1.3018459532349027],
    [103.78619865004106, 1.2924032648350448],
    [103.77384035112135, 1.2924032648350448]
  ]

  const centerX = (originalCoordinates[0][0] + originalCoordinates[1][0]) / 2
  const centerY = (originalCoordinates[0][1] + originalCoordinates[2][1]) / 2

  const scaleFactor = 0.3
  const xOffset = 0.00024
  const yOffset = 0.00326
  const angleDegrees = 10
  const angleRadians = angleDegrees * (Math.PI / 180) // Convert to radians

  const rotateCoordinate = ([x, y]: number[], centerX: number, centerY: number, angle: number) => {
    const cosTheta = Math.cos(angle)
    const sinTheta = Math.sin(angle)

    const translatedX = x - centerX
    const translatedY = y - centerY

    const rotatedX = translatedX * cosTheta - translatedY * sinTheta
    const rotatedY = translatedX * sinTheta + translatedY * cosTheta

    return [
      centerX + rotatedX * scaleFactor + xOffset,
      centerY + rotatedY * scaleFactor + yOffset // Apply the y-offset after rotation
    ]
  }

  const newCoordinates = originalCoordinates.map((coordinate) =>
    rotateCoordinate(coordinate, centerX, centerY, angleRadians)
  )

  console.log('ori coordinate', originalCoordinates)
  console.log('new coordinate', newCoordinates)
  map.value.on('load', () => {
    if (map.value) {
      map.value.addSource('campus', {
        type: 'image',
        url: '/campus_sim.png',
        coordinates: newCoordinates as CoordinateArrayType
      })

      map.value.addLayer({
        id: 'campus-layer',
        type: 'raster',
        source: 'campus',
        paint: {
          'raster-opacity': 0.5 // Set the opacity to 0.4
        }
      })
    }
  })
})
</script>

<style>
#map {
  width: 100%;
  height: 100vh;
}
#mouse {
  display: block;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  width: 50%;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  text-align: center;
  color: #222;
  background: #fff;
}
</style>
