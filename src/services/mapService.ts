import maplibregl from 'maplibre-gl'

let mapInstance: maplibregl.Map | null = null

const createMapInstance = (container: HTMLDivElement) => {
  if (!mapInstance) {
    const centerLng = 103.7804
    const centerLat = 1.3

    mapInstance = new maplibregl.Map({
      container,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=Y2ulfx5mJnVYzPYtrCZm',
      center: [centerLng, centerLat],
      zoom: 16.5
    })

    // const delta = 0.0015 // Half the side length of the square area in degrees

    // const lng1 = centerLng - delta // Top-left longitude
    // const lat1 = centerLat + delta // Top-left latitude
    // const lng3 = centerLng + delta // Bottom-right longitude
    // const lat3 = centerLat - delta // Bottom-right latitude

    // const lng2 = lng3 // Top-right longitude
    // const lat2 = lat1 // Top-right latitude
    // const lng4 = lng1 // Bottom-left longitude
    // const lat4 = lat3 // Bottom-left latitude

    // mapInstance.on('load', async () => {
    //   const campusSim = await mapInstance?.loadImage('campus_sim.png')
    //   mapInstance?.addImage('campus-sim', campusSim?.data)
    //   console.log('campus sim', mapInstance?.getImage('campus-sim'))
    //   mapInstance?.addSource('campus', {
    //     type: 'image',
    //     url: 'campus_sim.png',
    //     coordinates: [
    //       [lng1, lat1],
    //       [lng2, lat2],
    //       [lng3, lat3],
    //       [lng4, lat4]
    //     ]
    //   })

    //   mapInstance?.addLayer({
    //     id: 'campus-layer',
    //     type: 'raster',
    //     source: 'campus',
    //     paint: {
    //       'raster-opacity': 0.7 // Set the opacity to 0.4
    //     }
    //   })
    // })
  }
  return mapInstance
}

const getMapInstance = () => mapInstance

export { createMapInstance, getMapInstance }
