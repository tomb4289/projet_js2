const fs = require('fs');
const path = require('path');

function removeBlockComments(content) {
  // Remove block comments /* ... */ while preserving strings
  return content.replace(/\/\*[\s\S]*?\*\//g, '');
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = removeBlockComments(content);
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function findJSFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentDir}:`, error.message);
    }
  }
  
  traverse(dir);
  return files;
}

// Process all JS files in frontend/src
const jsFiles = findJSFiles('frontend/src');
console.log(`Found ${jsFiles.length} JavaScript files`);

jsFiles.forEach(processFile);
console.log('Comment removal completed');