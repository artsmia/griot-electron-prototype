import { Component } from 'react'
import { nextConnect } from '../store'

import {
  addImageAnnotation,
  drawnLayersEdited,
  drawnLayersDeleted
} from '../ducks/images'

class Viewer extends Component {
  render() {
    const { width, height, name, notes } = this.props

    return (
      <div key={name} id={name}>
        <figure>
          <div ref="map">
            <style jsx>{`
            div {
              width: 100%;
              min-height: 600px;
            }
          `}</style>
          </div>
          <figcaption>
            {name} - {`contains ${notes ? notes.length : 0} notes`}
          </figcaption>
        </figure>
      </div>
    )
  }

  componentDidMount() {
    const { width, height, name } = this.props
    var L = require('museum-tile-layer')

    this.map = L.map(this.refs.map, {
      crs: L.CRS.Simple,
      zoomControl: false
    })
    this.map.setView([width / 2, height / 2], 0)

    this.tiles = L.museumTileLayer(`/static/tiles/${name}/{z}/{x}/{y}.jpg`, {
      width: width,
      height: height,
      tileSize: 512
    })
    this.tiles.addTo(this.map)

    window.map = this.map
    window.tiles = this.tiles

    // set up drawing
    require('leaflet-draw')
    this.drawnItems = new L.FeatureGroup()
    map.addLayer(this.drawnItems)
    var drawControl = new L.Control.Draw({
      draw: {
        polyline: false,
        circle: false
      },
      edit: {
        featureGroup: this.drawnItems
      },
      position: 'topright'
    })

    map.addControl(drawControl)
    map.on('draw:created', this.dispatchDraw.bind(this))
    map.on('draw:edited', this.dispatchDraw.bind(this))
    map.on('draw:deleted', this.dispatchDraw.bind(this))

    this.updateMap()
  }

  dispatchDraw(drawEvent) {
    const { dispatch: d } = this.props
    console.info(drawEvent)
    if (drawEvent.type == 'draw:created')
      d(
        addImageAnnotation({
          image: this.props.name,
          note: drawEvent
        })
      )
    if (drawEvent.type == 'draw:edited')
      d(drawnLayersEdited(this.props.name, drawEvent.layers))
    if (drawEvent.type == 'draw:deleted')
      d(drawnLayersDeleted(this.props.name, drawEvent.layers))
  }

  componentDidUpdate(prevProps, prevState) {
    const notesChanged = this.props.notes !== prevProps.notes
    const focusLayerChanged = this.props.focusLayer !== prevProps.focusLayer

    if (notesChanged || focusLayerChanged) {
      this.updateMap(notesChanged, focusLayerChanged)
    }
  }

  updateMap(notesChanged, focusLayerChanged) {
    this.updateDrawnMapLayers()
    if (focusLayerChanged) this.updateFocusedLayer()
  }

  updateDrawnMapLayers() {
    const { notes } = this.props
    notes &&
      notes.map(note => {
        if (!this.drawnItems.hasLayer(note.layer))
          this.drawnItems.addLayer(note.layer)
      })
  }

  updateFocusedLayer() {
    const image = this.props.images.find(img => img.name == this.props.name)
    if (image.focusLayer) {
      const nextBounds = image.focusLayer.getBounds()
      if (nextBounds) {
        this.map.flyToBounds(nextBounds)
      }
    }
  }
}

export default nextConnect(state => state)(Viewer)
