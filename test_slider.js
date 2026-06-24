const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': mime.lookup(filePath) || 'application/octet-stream' });
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(8002, async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8002', { waitUntil: 'networkidle0' });
    
    for (let time = 0; time < 5; time++) {
        await new Promise(r => setTimeout(r, 1000));
        
        const sliderData = await page.evaluate(() => {
            const containers = document.querySelectorAll('.carousel-container');
            if (containers.length === 0) return 'No carousel containers found.';
            const first = containers[0];
            const slides = first.querySelectorAll('.carousel-slide');
            return {
                activeIdx: first.getAttribute('data-active'),
                slides: Array.from(slides).map(s => s.style.transform)
            };
        });
        console.log('Slider Data:', JSON.stringify(sliderData, null, 2));
    }
    
    await browser.close();
    server.close();
});
