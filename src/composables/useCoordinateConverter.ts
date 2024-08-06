import type { StyleImage } from 'maplibre-gl'
import { computed, ref } from 'vue'

type CoordinateArray = number[]
type CoordinateObject = { lng: number; lat: number }
type CoordinateBounds = {
  topLeft: CoordinateObject
  bottomRight: CoordinateObject
}
type Point = {
  x: number
  y: number
}

export function useAdjustCoordinate(localCoordinateImg: StyleImage) {
  const imageWidth = ref(localCoordinateImg.data.width)
  const imageHeight = ref(localCoordinateImg.data.height)

  const xPixelImg = ref(localCoordinateImg.data.width)
  const yPixelImg = ref(localCoordinateImg.data.height)

  const localToGlobal = (x: number, y: number, bounds: CoordinateBounds): CoordinateArray => {
    const lngDiff = bounds.bottomRight.lng - bounds.topLeft.lng
    const globalX = bounds.topLeft.lng + lngDiff * (x / imageWidth.value)

    const latDiff = bounds.bottomRight.lat - bounds.topLeft.lat
    const globalY = bounds.topLeft.lat + latDiff * (y / imageHeight.value)

    return [globalX, globalY]
  }

  const globalPoint = ref()
  const setGlobalCoordinate = (bounds: CoordinateBounds) => {
    globalPoint.value = [
      localToGlobal(0, 0, bounds),
      localToGlobal(xPixelImg.value, 0, bounds),
      localToGlobal(xPixelImg.value, yPixelImg.value, bounds),
      localToGlobal(0, yPixelImg.value, bounds)
    ]
  }

  const centerX = computed(() => (globalPoint.value[0][0] + globalPoint.value[1][0]) / 2)
  const centerY = computed(() => (globalPoint.value[0][1] + globalPoint.value[2][1]) / 2)

  const transform = (coordinate: CoordinateObject, angle: number, scale: number, offset: Point) => {
    const angleRadians = angle * (Math.PI / 180) // Convert to radians
    const cosTheta = Math.cos(angleRadians)
    const sinTheta = Math.sin(angleRadians)

    const translatedX = coordinate.lng - centerX.value
    const translatedY = coordinate.lat - centerY.value

    const rotatedX = translatedX * cosTheta - translatedY * sinTheta
    const rotatedY = translatedX * sinTheta + translatedY * cosTheta

    return [
      centerX.value + rotatedX * scale + offset.x,
      centerY.value + rotatedY * scale + offset.y
    ]
  }

  return {
    localToGlobal,
    globalPoint,
    setGlobalCoordinate,
    transform
  }
}
