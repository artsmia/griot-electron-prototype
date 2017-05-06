import { Component } from 'react'
import { ipcRenderer } from 'electron'

import { nextConnect } from '../store'
import { addImage } from '../ducks/images'

import Viewer from '../components/viewer'
import AnnotatedImage from '../components/annotated-image'

class Page extends Component {
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
    this.props.dispatch(addImage(newImage))
  }

  render() {
    const { images } = this.props
    return (
      <div>
        {images.length > 0
          ? images.map(image => <AnnotatedImage key={image.name} {...image} />)
          : 'drag an image file'}

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

export default nextConnect(state => state)(Page)
