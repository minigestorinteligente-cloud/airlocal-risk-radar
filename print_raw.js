const fs = require('fs');
const reports = JSON.parse(fs.readFileSync('all_malena_reports.json', 'utf8'));

const repLow = reports.find(r => r.id === '3781fc81-0c20-46cc-a20c-68d1529992c7');
const repMed = reports.find(r => r.id === '537edfc0-8711-401b-af21-1e3c8257d988');

function parseData(r) {
  let d = r.report_data;
  if (typeof d === 'string') d = JSON.parse(d);
  if (typeof d === 'string') d = JSON.parse(d);
  return d;
}

console.log("=== LOW REPORT RAW ===");
console.log(JSON.stringify(parseData(repLow), null, 2));

console.log("\n=== MEDIUM REPORT RAW ===");
console.log(JSON.stringify(parseData(repMed), null, 2));
