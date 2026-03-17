import * as fs from 'fs';

const data = JSON.parse(
  fs.readFileSync('../N88-scrapping/subjects.json', 'utf8'),
);

let dupCount = 0;
for (const subject of data) {
  const classCodes = subject.classes.map((c) => c.classcode);
  const uniqueClasses = new Set(classCodes);
  if (classCodes.length !== uniqueClasses.size) {
    console.log(
      `Duplicate classcodes found in subject ${subject.code}:`,
      classCodes,
    );
    dupCount++;
  }
}
console.log(`Total duplicate classcode arrays in same subject: ${dupCount}`);
