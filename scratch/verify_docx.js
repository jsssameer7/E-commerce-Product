const fs = require('fs');

// Simple check in the zip buffer for 'w:val="both"'
const buf = fs.readFileSync('C:\\Users\\SAMEER\\Downloads\\Electronics_Shopping_Portal_Project_Report.docx');
const str = buf.toString('latin1');
const occurrences = (str.match(/w:val="both"/g) || []).length;
console.log('Occurrences of w:val="both" (Justified Alignment) found in docx:', occurrences);
