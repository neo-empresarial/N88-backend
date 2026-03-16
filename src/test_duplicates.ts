import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('../N88-scrapping/subjects.json', 'utf8'));

let dupCount = 0;
for (const subject of data) {
  for (const c of subject.classes) {
    if (c.professors) {
      const profNames = c.professors.map(p => p.name);
      const uniqueProfs = new Set(profNames);
      if (profNames.length !== uniqueProfs.size) {
        console.log(`Duplicate professors found in subject ${subject.code}, class ${c.classcode}:`, profNames);
        dupCount++;
      }
    }
  }
}
console.log(`Total duplicate professor arrays: ${dupCount}`);
