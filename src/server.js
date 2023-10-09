import fs from 'node:fs/promises';
import http from 'node:http';
import open from 'open';

// takes in a html string and object with data on it and replace every instance of {{ notes }} -> data.notes
export const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
};

// convert notes get from db into divs
export const formatNotes = (notes) => {
  return notes.map((note, index) => {
    return `
      <div class="note">
        <p>${index}</p>
        <p>${note.content}</p>
        <div class="tags">
          ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `
  }).join('\n')
}

export const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL('./template.html', import.meta.url).pathname;
    const template = await fs.readFile(HTML_PATH, 'utf-8');
    // convert template into real html want to use
    const html = interpolate(template, {notes: formatNotes(notes)});
    
    // send status and headers at the same time
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(html);
  })
};

export const start = (notes, port) => {
  const server = createServer(notes);

  server.listen(port, () => {
    const address = `http://localhost:${port}`
    console.log(`Server listening on ${address}`);
    open(address);
  });
}

