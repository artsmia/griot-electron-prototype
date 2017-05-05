import { Component } from 'react'
import { ipcRenderer } from 'electron'

import Viewer from '../components/viewer'

export default class extends Component {
  state = {
    input: '',
    images: []
  }

  componentDidMount() {
    ipcRenderer.on('newImage', this.handleNewImage)

    document.ondragover = document.ondrop = ev => {
      ev.preventDefault()
    }

    document.body.ondrop = ev => {
      const source = ev.dataTransfer.files[0].path
      source && ipcRenderer.send('newImage', source)
      ev.preventDefault()
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('newImage', this.handleNewImage)
  }

  handleNewImage = (event, newImage) => {
    console.info(newImage)
    this.setState({ images: this.state.images.concat(newImage) })
  }

  render() {
    return (
      <div>
        {this.state.images &&
          this.state.images.map(image => (
            <Viewer key={image.name} {...image} />
          ))}

        <style>{`
          body {
            margin: 0;
            padding: 0 1em;
            min-height: 100vh;
            min-width: 100vw;
        `}</style>
      </div>
    )
  }
}
