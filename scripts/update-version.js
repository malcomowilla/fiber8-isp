// scripts/update-version.js
const fs = require('fs');
const path = require('path');

// Get the new version from package.json
const version = process.env.npm_package_version;

// Path to the version.js file
const versionFilePath = path.join(__dirname, '../src/version.js');

// Content to write to version.js
const content = `export const APP_VERSION = '${version}';\nexport const APP_NAME = 'AITechs';\nexport const APP_DESCRIPTION = 'Display, Designed, and Developed by AITechs';\n`;

// Write the new version to version.js
fs.writeFileSync(versionFilePath, content);
console.log(`Updated version to ${version}`);