import { Component } from 'react'
import { nextConnect } from '../store'

import Viewer from '../components/viewer'
import Note from '../components/note'
import { updateImageAnnotation, focusImageAnnotation } from '../ducks/images'

class ImageEditor extends Component {
  render() {
    const { notes } = this.props
    return (
      <div key={`edit-${name}`} style={{ position: 'relative' }}>
        <Viewer {...this.props} />

        <div id="notes">
          {notes
            ? <div>
                {notes.map(note => (
                  <Note
                    key={note.id}
                    {...{
                      note,
                      handleChange: this.handleChange.bind(this, note.id),
                      handleFocus: this.handleNoteFocus.bind(this, note)
                    }}
                  />
                ))}
              </div>
            : <p>use the drawing tools to add a note</p>}
        </div>

        <style>{`
          figure {
            margin: 0;
            padding: 0;
            width: 69vw;
          }

          #notes {
            width: 31vw;
            position: absolute;
            top: 0;
            right: 0;
            padding: 0 1em;
          }
        `}</style>
      </div>
    )
  }

  handleChange(id, e) {
    this.props.dispatch(
      updateImageAnnotation(
        this.props.name,
        {
          [e.target.name]: e.target.value
        },
        id
      )
    )
  }

  handleNoteFocus(note, e) {
    this.props.dispatch(focusImageAnnotation(this.props.name, note))
  }
}

export default nextConnect(state => state)(ImageEditor)
