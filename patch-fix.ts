 
 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Since this is a TypeScript/ESM environment, we polyfill __dirname 
 * to locate the node_modules folder accurately.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target the ESM distribution folder of the problematic package
const dirPath = path.join(__dirname, 'node_modules', 'react-remove-scroll', 'dist', 'es2015');

/**
 * Patches relative imports in the react-remove-scroll package
 * to include .js extensions, required for strict ESM resolution.
 */
const patchPackage = () => {
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        files.forEach((file) => {
            if (file.endsWith('.js')) {
                const filePath = path.join(dirPath, file);
                const content = fs.readFileSync(filePath, 'utf8');

                /**
                 * Regex Breakdown:
                 * 1. ((?:from|import)\s+['"]) -> Matches 'from ' or 'import ' followed by a quote.
                 * 2. (\.\.?\/[^'"]+?)         -> Matches relative paths starting with ./ or ../.
                 * 3. (?<!\.js)                -> Lookbehind: Ensures we don't add .js if it's already there.
                 * 4. (['"])                   -> Matches the closing quote.
                 */
                const pattern = /((?:from|import)\s+['"])(\.\.?\/[^'"]+?)(?<!\.js)(['"])/g;
                
                const newContent = content.replace(pattern, '$1$2.js$3');

                if (content !== newContent) {
                    fs.writeFileSync(filePath, newContent);
                    console.log(`✨ Patched extensions in: ${file}`);
                }
            }
        });
        console.log('✅ react-remove-scroll patched successfully.');
    } else {
        console.warn('⚠️ react-remove-scroll es2015 directory not found. Skipping patch.');
    }
};

patchPackage();