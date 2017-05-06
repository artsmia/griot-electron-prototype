import { Component } from 'react'
import { ipcRenderer } from 'electron'

import { nextConnect } from '../store'
import { addImage, imageAdded } from '../ducks/images'

import Viewer from '../components/viewer'
import AnnotatedImage from '../components/annotated-image'

class Page extends Component {
  componentDidMount() {
    ipcRenderer.on('newImage', this.handleNewImage)
    this.props.images.length == 0 && this.loadInitialState()

    document.ondragover = document.ondrop = ev => {
      ev.preventDefault()
    }

    document.body.ondrop = ev => {
      const source = ev.dataTransfer.files[0].path
      this.props.dispatch(addImage(source))
      ev.preventDefault()
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('newImage', this.handleNewImage)
  }

  handleNewImage = (event, newImage) => {
    this.props.dispatch(imageAdded(newImage))
  }

  render() {
    const { images } = this.props
    return (
      <div>
        {images.length > 0
          ? images.map(
              (image, index) =>
                (image.loading
                  ? <p key={index + '-loading-' + image.path}>…loading</p>
                  : <AnnotatedImage key={image.name} {...image} />)
            )
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

  loadInitialState() {
    this.props.dispatch(
      addImage(
        '/Users/kolsen/Documents/mediabin-deployment/web/001000/200/10/1218/mia_5001702_full.jpg'
      )
    )
  }
}

export default nextConnect(state => state)(Page)
