const fs = require('fs');
const path = require('path');

function removeComments(code) {
    // A robust regex to remove comments but keep URLs and strings intact is tricky, 
    // but the standard approach is replacing this pattern:
    return code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1');
}

const walkSync = function (dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            // Exclude standard build/library folders
            if (!['node_modules', '.git', 'android', 'ios', 'build', 'dist'].includes(file)) {
                filelist = walkSync(path.join(dir, file), filelist);
            }
        }
        else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
                filelist.push(path.join(dir, file));
            }
        }
    });
    return filelist;
};

const projectRoot = 'C:\\projects\\hackxamrita\\FinApp';
const files = walkSync(projectRoot, []);

let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Removing block comments
    let newContent = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // Removing line comments, avoiding URLs (http://, https://)
    // Positive lookbehind not supported in older runtimes, so we use string replacement
    const lines = newContent.split('\n');
    const cleanedLines = lines.map(line => {
        // Simple check: if there is a // and it's not preceded by : (like http://)
        // This won't perfectly handle // inside strings, but for standard code it works.
        const idx = line.indexOf('//');
        if (idx !== -1) {
            if (idx === 0 || line[idx - 1] !== ':') {
                // Check if it's inside quotes? simplified: just cut the line
                // But what if it's in a string? "path//to//file"
                // Let's use a safer regex:
                // Match // followed by anything, but only if not preceded by :
                return line.replace(/(?<![:"'])\/\/.*/, '').trimEnd();
            }
        }
        return line.trimEnd(); // Remove trailing spaces
    });

    newContent = cleanedLines.join('\n');

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        modifiedCount++;
        console.log(`Cleaned: ${file}`);
    }
});

console.log(`\nFinished removing comments. Modified ${modifiedCount} files.`);
