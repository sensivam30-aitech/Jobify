const fs = require('fs');
const src = "C:\\Users\\Gobinath M\\.gemini\\antigravity\\brain\\5c4eddd6-55f1-4928-ad0b-22d297c866f2\\jobify_demo_overview_1775935104768.webp";
const dest = "c:\\Users\\Gobinath M\\Desktop\\jobify\\Jobify\\demo.webp";
try {
    fs.copyFileSync(src, dest);
    console.log('File copied successfully');
} catch (err) {
    console.error('Error copying file:', err);
}
