export default ({ note, handleChange, handleFocus }) => {
  return (
    <div key={note.id} onMouseEnter={handleFocus}>
      {note.editing
        ? <form>
            <input name="title" value={note.title} onChange={handleChange} />
            <br />
            <textarea
              name="description"
              value={note.description}
              onChange={handleChange}
            />
          </form>
        : <li>
            <strong>{note.title}</strong>
            <p>{note.description}</p>
          </li>}
    </div>
  )
}
