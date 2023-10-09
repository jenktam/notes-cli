export const listNotes = (notes) => {
  if(!notes.length) {
    console.log("No notes found!");
  }
  notes.forEach(({id, content, tags}) => {
    console.log('id:', id);
    console.log('tags:', tags);
    console.log('content:', content);
    console.log('\n');
  });
}