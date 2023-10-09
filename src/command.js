import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { newNote, getAllNotes, findNotes, findNotesByTag, removeNote, removeAllNotes } from './notes.js'
import { listNotes } from './utils.js'
import { start } from './server.js'

yargs(hideBin(process.argv))
  .command('new <note>', 'Create a new note',
    (yargs) => {
      return yargs.positional('note', {
        type: 'string',
        description: 'The content of the note to create',
      })
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(',') : [];
      let note = await newNote(argv.note, tags);

      console.log("New note!", note);
    })
  .option('tags',
    {
      alias: 't',
      type: 'string',
      description: 'tags to add to the note',
    })
  .command('all', 'Get all notes',
    () => {},
    async (argv) => {
      let notes = await getAllNotes();

      listNotes(notes);
    })
  .command('find <filter>', 'get matching notes',
    (yargs) => {
      return yargs.positional('filter', {
        describe: 'The search term to filter notes by, will be applied to note.content',
        type: 'string',
      })
    },
    async (argv) => {
      const matches = await findNotes(argv.filter);

      listNotes(matches);
    })
  .command('find tag <filter>', 'get matching notes by tag',
    (yargs) => {
      return yargs.positional('filter', {
        describe: 'The search tag to filter notes by, will be applied to note.tags',
        type: 'string',
      })
    },
    async (argv) => {
      const matches = await findNotesByTag(argv.filter);

      listNotes(matches);
    })
  .command('remove <id>', 'Remove a note by id', 
    yargs => {
      return yargs.positional('id', {
        type: 'number',
        description: 'The id of the note you want to remove'
      })
    },
    async (argv) => {
      let id = await removeNote(argv.id);
      console.log("Removed Note with Id:", id);

    })
  .command('web [port]', 'Launch website to see notes',
    yargs => {
      return yargs.positional('port', {
        describe: 'Port to bind on',
        default: 5000,
        type: 'number',
      })
    },
    async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port)
    })
  .command('clean', 'Remove all notes', 
    () => {}, 
    async (argv) => {
      await removeAllNotes()
      let notes = await getAllNotes();
      console.log('All notes removed: ', notes);
    })
  .demandCommand(1) 
  .parse()


