const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Backgrounds
    content = content.replace(/bg-\[\#06141B\]/gi, 'bg-fbsb-bg-deep');
    content = content.replace(/bg-\[\#11212D\]/gi, 'bg-fbsb-bg-main');
    content = content.replace(/bg-\[\#253745\]/gi, 'bg-fbsb-surface-100');
    content = content.replace(/bg-\[\#4A5C6A\]/gi, 'bg-fbsb-surface-200');
    content = content.replace(/bg-\[\#9BA8AB\]/gi, 'bg-fbsb-surface-300');
    content = content.replace(/bg-\[\#CCD0CF\]/gi, 'bg-fbsb-primary-light');

    // Texts
    content = content.replace(/text-\[\#06141B\]/gi, 'text-fbsb-bg-deep');
    content = content.replace(/text-\[\#11212D\]/gi, 'text-fbsb-bg-main');
    content = content.replace(/text-\[\#253745\]/gi, 'text-fbsb-surface-100');
    content = content.replace(/text-\[\#4A5C6A\]/gi, 'text-fbsb-text-muted');
    content = content.replace(/text-\[\#9BA8AB\]/gi, 'text-fbsb-text-secondary');
    content = content.replace(/text-\[\#CCD0CF\]/gi, 'text-fbsb-text-primary');

    // Borders
    content = content.replace(/border-\[\#06141B\]/gi, 'border-fbsb-bg-deep');
    content = content.replace(/border-\[\#11212D\]/gi, 'border-fbsb-bg-main');
    content = content.replace(/border-\[\#253745\]/gi, 'border-fbsb-surface-100');
    content = content.replace(/border-\[\#4A5C6A\]/gi, 'border-fbsb-border');
    content = content.replace(/border-\[\#9BA8AB\]/gi, 'border-fbsb-text-secondary');
    content = content.replace(/border-\[\#CCD0CF\]/gi, 'border-fbsb-text-primary');

    // Rings
    content = content.replace(/ring-\[\#9BA8AB\]/gi, 'ring-fbsb-cyan');
    content = content.replace(/ring-\[\#CCD0CF\]/gi, 'ring-fbsb-primary-light');

    // Gradients
    content = content.replace(/from-\[\#253745\]/gi, 'from-fbsb-surface-100');
    content = content.replace(/to-\[\#11212D\]/gi, 'to-fbsb-bg-main');

    fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            replaceInFile(filePath);
        }
    }
}

walk(srcDir);
console.log('Theme applied successfully.');
