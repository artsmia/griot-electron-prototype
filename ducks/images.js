import { ipcRenderer } from 'electron'
import { v4 } from 'node-uuid'

const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_IMAGE':
      const source = action.source
      source && ipcRenderer.send('newImage', source)
      return state.concat({ loading: true, path: action.imagePath })
    case 'IMAGE_ADDED':
      return state
        .filter(image => {
          return !image.loading
        })
        .concat(action.image)
    case 'CREATE_NOTE':
      const newNote = {
        id: v4(),
        layer: action.image.note.layer,
        editing: true
      }

      return state.map(image => {
        if (image.name == action.image.image) {
          return {
            ...image,
            notes: (image.notes || []).concat(newNote),
            focusLayer: newNote.layer
          }
        }

        return image
      })
    case 'UPDATE_NOTE':
      return state.map(image => {
        if (image.name == action.image) {
          return {
            ...image,
            notes: image.notes.map(
              note =>
                (note.id == action.id ? { ...note, ...action.note } : note)
            )
          }
        }

        return image
      })
    case 'FOCUS_NOTE':
      return state.map(image => {
        if (image.name == action.image) {
          const note =
            image &&
            image.notes &&
            image.notes.find(n => n.id == action.note.id)
          return { ...image, focusLayer: note.layer }
        }

        return image
      })
    case 'IMAGE_DRAWS_EDITED':
      // because `image.notes[].layer references the leaflet layer, this updates automatically…
      // but it's mutating things which is bad in redux
      return state
    case 'IMAGE_DRAWS_DELETED':
      return state.map(image => {
        if (image.name == action.image) {
          const remainingNotes = image.notes.filter(existingNote => {
            return Object.values(action.layers._layers).find(
              deletedLayer => deletedLayer !== existingNote.layer
            )
          })

          return {
            ...image,
            notes: remainingNotes
          }
        }

        return image
      })
    default:
      return state
  }
}

export function addImage(source) {
  return { type: 'ADD_IMAGE', source }
}

export function imageAdded(image) {
  return { type: 'IMAGE_ADDED', image }
}

export function addImageAnnotation(image, note) {
  return { type: 'CREATE_NOTE', image, note }
}

export function updateImageAnnotation(image, note, id) {
  return { type: 'UPDATE_NOTE', image, note, id }
}

export function focusImageAnnotation(image, note) {
  return { type: 'FOCUS_NOTE', image, note }
}

export function drawnLayersEdited(image, layers) {
  return { type: 'IMAGE_DRAWS_EDITED', image, layers }
}

export function drawnLayersDeleted(image, layers) {
  return { type: 'IMAGE_DRAWS_DELETED', image, layers }
}
