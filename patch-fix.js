const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'node_modules', 'react-remove-scroll', 'dist', 'es2015');

if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(dirPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            // Match relative imports and add .js if missing
            // Example: from './aggresiveCapture' -> from './aggresiveCapture.js'
            content = content.replace(/from '(\.\/|(\.\.\/)+)([a-zA-Z0-9_-]+)'/g, "from '$1$3.js'");
            fs.writeFileSync(filePath, content);
        }
    });
    console.log('Patched all files in react-remove-scroll successfully.');
} else {
    console.log('react-remove-scroll es2015 dir not found.');
}
