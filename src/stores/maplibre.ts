import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import maplibregl from 'maplibre-gl'

export const useMaplibreStore = defineStore('maplibre', () => {
  // map instance
  const mapInstance = ref()
  const setMapInstance = (container: HTMLDivElement) => {
    if (!mapInstance.value) {
      mapInstance.value = new maplibregl.Map({
        container,
        style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=Y2ulfx5mJnVYzPYtrCZm',
        center: [103.7803011867162, 1.300539392411153],
        pitch: 40,
        zoom: 17
      })

      initPolygonSource()
      mapInstance.value.addControl(new maplibregl.NavigationControl())
    }
  }
  const getMapInstance = computed(() => mapInstance.value)

  // local coordinate image
  const localCoordinateImg = ref<maplibregl.StyleImage>()
  const setLocalCoordinateImg = async (imageId: string, imageUrl: string) => {
    if (!mapInstance.value) return

    if (!mapInstance.value.getImage(imageId)) {
      const campusImg = await mapInstance.value.loadImage(imageUrl)
      mapInstance.value.addImage(imageId, campusImg.data)
    }
    localCoordinateImg.value = mapInstance.value.getImage(imageId)
  }
  const getLocalCoordinateImg = computed(() => localCoordinateImg.value)

  // create marker
  const createMarker = (
    [lng, lat]: number[],
    itemELement: HTMLDivElement,
    robotProp: { id: string; x: number; y: number; heading: number }
  ) => {
    if (!mapInstance.value) return

    const popup = new maplibregl.Popup({ offset: 8 }).setText(robotProp.id)

    return new maplibregl.Marker({
      element: itemELement,
      anchor: 'center',
      rotation: robotProp.heading,
      rotationAlignment: 'map'
    })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(mapInstance.value)
  }

  // Polygon source
  const initPolygonSource = () => {
    if (!mapInstance.value) return

    const polygonCoordinate = [
      [103.78047287304742, 1.3017155758059715],
      [103.77890236801045, 1.301275231313312],
      [103.77861217001248, 1.3007862373961672],
      [103.77925499433127, 1.3004951723227123],
      [103.77958699478813, 1.3005039940815237],
      [103.7803601134666, 1.299997066733809],
      [103.78010977049121, 1.2995347815292888],
      [103.78092423309181, 1.2989920374195094],
      [103.7812912055117, 1.299116693312797],
      [103.78175297852727, 1.300168219573436],
      [103.78047287304742, 1.3017155758059715]
    ]

    const polygonGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [polygonCoordinate]
      },
      properties: {}
    }

    mapInstance.value.on('load', () => {
      mapInstance.value.addSource('polygon-source', {
        type: 'geojson',
        data: polygonGeoJSON
      })
    })
  }
  // Polygon layer
  const addPolygonLayerById = (layerId: string) => {
    switch (layerId) {
      case 'area-size-layer':
        addAreaSizeLayer()
        break
      case 'perimeter-layer':
        addPerimeterLayer()
        break

      default:
        break
    }
  }
  const addAreaSizeLayer = () => {
    mapInstance.value.addLayer({
      id: 'area-size-layer',
      type: 'fill',
      source: 'polygon-source',
      paint: {
        'fill-color': 'blue',
        'fill-opacity': 0.2
      }
    })
  }
  const addPerimeterLayer = () => {
    mapInstance.value.addLayer({
      id: 'perimeter-layer',
      type: 'line',
      source: 'polygon-source',
      paint: {
        'line-color': 'yellow',
        'line-width': 3
      }
    })
  }

  const removePolygonLayerById = (layerId: string) => {
    mapInstance.value.removeLayer(layerId)
  }

  return {
    getMapInstance,
    setMapInstance,
    getLocalCoordinateImg,
    setLocalCoordinateImg,
    createMarker,
    addPolygonLayerById,
    removePolygonLayerById
  }
})
