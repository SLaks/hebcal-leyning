const hebcal = require('./index.js')
const Triennial = require('./triennial');
const parshiot = hebcal.parshiot;
// import {parshiot} from './sedra';

/**
 * Helper function to formats aliyah as a string
 * @param {Object} aliyot aliyot object
 * @param {string|number} num aliyah number such as 1, 7, or M
 * @return {string}
 */
function formatIt(aliyot, num) {
  const aliyah = aliyot[num];
  if (aliyah) {
    return `${aliyah.book} ${aliyah.begin}-${aliyah.end}`;
  }
  return undefined;
}

for (let i = 5758; i < 5822; i += 3) {
  const tri = new Triennial(i);
  const readings = tri.getReadings();
  for (const yr of [1, 2, 3]) {
    for (const parsha of parshiot) {
      const aliyot = readings[parsha][yr];
      const x = formatIt(aliyot, 1);
      if (x) {
        console.log(parsha, yr, x || aliyot.readTogether);
      } else {
        const aliyot2 = readings.get(aliyot.readTogether)[yr];
        const x2 = formatIt(aliyot2, 1);
        console.log(aliyot.readTogether, yr, x2);
      }
    }
  }
}

const tri0 = new Triennial();
const readings = tri0.getReadings();
console.log(readings.get('Bereshit')[1]);
