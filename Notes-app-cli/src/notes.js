//all the Create,Update, Read, Delete operations related to the notes

import { getDB, insertDB, saveDB } from "./db.js";

export const newNote=async (note,tags)=>{
    const newNote={
        tags,
        id:Date.now(),
        content:note 
    };
    await insertDB(newNote);
    return newNote;
}

export const getAllNotes=async ()=>{
   const {notes}= await getDB();
   return notes;
}

export const getAllNotesOnWeb = async () => {
    const { notes } = await getDB();
    let html = '<h1><em>Note Details:-</em></h1>';
    notes.forEach(note => {
      html += `<p><strong>ID:</strong> ${note.id}<br/><strong>Content:</strong> ${note.content}<br/><strong>Tags:</strong> ${note.tags.join(', ')}</p>`;
    });
    return html;
  };

export const findNotes=async (search)=>{
    const {notes}= await getDB();
    return notes.filter((note)=>{
        return note.content.toLowerCase().includes(search.toLowerCase());
    })
 }

 export const removeNote=async (id)=>{
    const {notes}= await getDB();
    const noteFound=notes.find((note)=>note.id ===id);
    if(noteFound){
        const newNote=notes.filter(note=>note.id!=id);
        await saveDB({notes:newNote});
        return id;

    }
 }

 export const removeAllNotes=async ()=>{
    await saveDB({notes:[]});
 }