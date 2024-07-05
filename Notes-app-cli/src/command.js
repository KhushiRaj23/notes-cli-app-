import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { findNotes, getAllNotes, getAllNotesOnWeb, newNote, removeAllNotes, removeNote } from './notes.js'
import { listNotes } from './utils.js'
import express from 'express'


yargs(hideBin(process.argv))
  .command('new <note>', 'Create a new note', (yargs) => {
    return yargs.positional('note', {
      type: 'string',
      description: "The content of the note to create"
    })
  }, 
  async (argv) => {
    // 'note new "<note> " --tags "<tags>"' command is used to create a new note and insert it in the Database(currently in `db.json`).
    const tags=argv.tags ? argv.tags.split(','):[] 

    const note = await newNote(argv.note,tags);

    console.log("new note:" ,note);

  })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: "tags to add to the note"
  })
  .command('all', 'Get all notes', () => { }, async (argv) => {
    //'note all' command is used to log all the notes present in the database
    const notes =await getAllNotes();
    listNotes(notes);
  })
  .command('find <filter>', 'Get matching notes', (yargs) => {
    return yargs.positional('filter', {
      type: 'string',
      describe: "The search keyword to filter notes"
    })
  },async (argv) => {
    //'note find <filter>' command is used to filter the note which user is searching for.
    const notes=await findNotes(argv.filter);
    listNotes(notes);

  })
  .command('remove <id>', 'Remove a note by id', (yargs) => {
    return yargs.positional('id', {
      type: 'number',
      description: "The id of the note you want to delete"
    })
  }, 
 async (argv) => {

    //'note remove <id>' command is taking `id` as parameter and removing it from database(db.json);
    const id=await removeNote(argv.id);
    if(id){
      console.log("note removed: ",id);
    }else{
      console.log("note not found");
    }

  })
  .command('web [port]', 'launch website to see notes', (yargs) => {
    return yargs.positional('port', {
      type: 'number',
      describe: "Port to bind on",
      default: 5000
    })
  }, (argv) => {
    // which the help of express and 'note web <port>' command we are showing the notes on web (localhost);

    const app = express();
    const port = argv.port;

    app.get('/', async (req, res) => {
      const notes = await getAllNotesOnWeb();
      res.send(notes);
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  })
  .command('clean', 'Remove all the notes', () => { }, async (argv) => {
    
    await removeAllNotes();
    // 'note clean' command is used to clean all the data of database(db.json)
    console.log("All notes cleaned");

  })
  .demandCommand(1)
  .parse()