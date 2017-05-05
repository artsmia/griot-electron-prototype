import { Component } from 'react'

export default class extends Component {
  render() {
    const { width, height, name } = this.props

    return (
      <div key={name} id={name}>
        {name}
        <div ref="map">
          <style jsx>{`
          div {
            width: 99vw;
            height: 800px;
          }
        `}</style>
        </div>
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
    console.info(width, height)
    this.map.setView([width / 2, height / 2], 0)

    this.tiles = L.museumTileLayer(`/static/tiles/${name}/{z}/{x}/{y}.jpg`, {
      width: width,
      height: height,
      tileSize: 512
    })
    this.tiles.addTo(this.map)

    console.info('viewer mounted', width, height, name)
    window.map = this.map
    window.tiles = this.tiles
  }
}
