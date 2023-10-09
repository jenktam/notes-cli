import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/db.js', () => ({
  insertDB: jest.fn(),
  getDB: jest.fn(),
  saveDB: jest.fn(),
}));

const { insertDB, getDB, saveDB } = await import('../src/db.js');
const { newNote, getAllNotes, findNotes, removeNote, removeAllNotes } = await import('../src/notes.js');

beforeEach(() => {
  insertDB.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
});

describe('CLI App', () => {
  describe('newNote', () => {
      test('inserts data and returns it', async () => {
      const note = 'Test note';
      const tags = ['tag1', 'tag2'];;
      const data = {
        tags,
        content: note,
        id: Date.now(),
      };
  
      // resolve insertDB promise with data
      insertDB.mockResolvedValue(data);
  
      const result = await newNote(note, tags);
      expect(result).toEqual(data);
    });
  });
  
  describe('getAllNotes', () => {
      test('gets all notes and returns them', async () => {
  
      const db = { 
        notes: [
          {
            id: 1,
            tags: ['tag1', 'tag2'],
            content: 'Note 1',
          },
          {
            id: 2,
            tags: ['tag1', 'tag2'],
            content: 'Note 2',
          },
          {
            id: 3,
            tags: ['tag1', 'tag3'],
            content: 'Note 3',
          },
      ],
    };
      getDB.mockResolvedValue(db);
  
      const result = await getAllNotes();
      expect(result).toEqual(db.notes);
    });
  });
  
  describe('findNotes', () => {
    let db = {};
    beforeEach(() => {
      db = { 
        notes: [
          {
            id: 1,
            tags: ['tag1', 'tag2'],
            content: 'Note 1',
          },
          {
            id: 2,
            tags: ['tag1', 'tag2'],
            content: 'Note 2',
          },
          {
            id: 3,
            tags: ['tag1', 'tag3'],
            content: 'Note 3',
          },
        ],
      };
    });
      test('finds matching notes based on search term and returns them', async () => {
        const filter = 'note 1';
       
        getDB.mockResolvedValue(db);
  
        const result = await findNotes((filter));
  
        let filteredNotes = db.notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()));
  
        expect(result).toEqual(filteredNotes);
        expect(result.length).toEqual(1);
     });
      test('returns empty array if filter has no matches', async () => {
        const filter = 'hello';
      
        getDB.mockResolvedValue(db);
  
        const result = await findNotes((filter));
  
        let filteredNotes = db.notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()));
        console.log('result: ', result);
  
        expect(result.length).toEqual(0);
    });
  });
  
  describe('removeNote', () => {
    test('does nothing if id is not found', async () => {
      const notes = [
        { id: 1, content: 'note1', },
        { id: 2, content: 'note2', },
        { id: 3, content: 'note1', },
      ];
  
      saveDB.mockResolvedValue(notes);
  
      const idToRemove = 4;
      const result = await removeNote(idToRemove);
      expect(result).toBeUndefined();
    })
  });

});

