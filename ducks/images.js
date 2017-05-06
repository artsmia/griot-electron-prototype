import { v4 } from 'node-uuid'

const initialState = []

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_IMAGE':
      return state.concat(action.image)
    case 'CREATE_IMAGE_ANNOTATION':
      const newNote = {
        title: 'new note',
        description: 'what a night!',
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
    case 'UPDATE_IMAGE_ANNOTATION':
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
    case 'FOCUS_IMAGE_ANNOTATION':
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
    default:
      return state
  }
}

export function addImage(image) {
  return { type: 'ADD_IMAGE', image }
}

export function addImageAnnotation(image, note) {
  return { type: 'CREATE_IMAGE_ANNOTATION', image, note }
}

export function updateImageAnnotation(image, note, id) {
  return { type: 'UPDATE_IMAGE_ANNOTATION', image, note, id }
}

export function focusImageAnnotation(image, note) {
  return { type: 'FOCUS_IMAGE_ANNOTATION', image, note }
}
