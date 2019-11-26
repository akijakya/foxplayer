'use strict';

// requiring path
const path = require('path');

// requiring fs
const fs = require('fs');
const files = fs.readdirSync(path.join(__dirname, 'public/assets/music'));
console.log(files);