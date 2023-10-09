import fs from 'node:fs/promises';

const readPjson = async () => {
  // ES6 using type module doesn't have access to __dirname, which is the current directory working in. Can't read relative file so need to import absolute path and construct it.
  const pJsonPath = new URL('./package.json', import.meta.url).pathname;

  // read json file, parse into JSON object and log it
  // sync means won't do anything else until this file is read.
  // bad for real system. every other request will need to wait for this to finish.
  // return JSON.parse(fs.readFileSync(pJsonPath, 'utf-8'));
  return JSON.parse(await fs.readFile(pJsonPath, 'utf-8'));
};

const writeFile = async () => {
  const newFile = new URL('./demo.js', import.meta.url).pathname;

  await fs.writeFile(newFile, 'console.log("yoooo!")', 'utf-8');
}

readPjson().then((data) => console.log(data));

/* 
  prints:
    {
      name: 'intro-node-v3',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      type: 'module',
      bin: { note: './index.js' },
      scripts: { test: 'echo "Error: no test specified" && exit 1' },
      author: '',
      license: 'ISC',
      dependencies: { lodash: '^4.17.21', yargs: '^17.7.2' }
    }
*/

writeFile();

//  node test.js && node demo.js
// runs test..js and prints log in demo.js


const nums = [1,2,3, 4];
const [first,_,__, last] = nums;
console.log('last: ', last);
console.log('first: ', first);