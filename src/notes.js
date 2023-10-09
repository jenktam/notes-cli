import { getDB, saveDB, insertDB } from './db.js';

export const newNote = async (note, tags = []) => {
  const newNote = {
    tags,
    content: note,
    id: Date.now(),
  }
  await insertDB(newNote);

  return newNote;
};

export const getAllNotes = async () => {
  const { notes } = await getDB();

  return notes;
}

export const findNotes = async (filter) => {
  const { notes } = await getDB()

  return notes.filter(note => note.content.toLowerCase()
  .includes(filter.toLowerCase()));
}

class Note {
  constructor(id, content, tags) {
    this.id = id || Date.now();
    this.content = content || '';
    this.tags = tags || [];
  }
}
export const findNotesByTag = async (filter) => {
  const { notes } = await getDB();

  const tagsMap = {};
  
  for(let note of notes) {
    for(let tag of note.tags) {
      if(!tagsMap[tag]) {
        tagsMap[tag] = [];
      }
      tagsMap[tag].push(note);
    }
  }

  for(let tag in tagsMap) {
    if(tag.toLowerCase() === filter.toLowerCase()) {
      return tagsMap[tag];
    }

    return [];
  }
}

export const removeNote = async(id) => {
  const notes = await getAllNotes();
  const match = notes.find((note) => note.id === id);

  if(match) {
    // create a new array without including note that matches id
    // immutable approach. avoids side effects
    const newNotes = notes.filter((note) => note.id !== id);

    await saveDB({ notes: newNotes });
    return id;
  }
}

// don't need to async await because no code running after so don't need to wait for it to finish
export const removeAllNotes = () => saveDB({ notes: []});