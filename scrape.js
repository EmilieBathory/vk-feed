const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://vk.com/rh_production', { waitUntil: 'networkidle2' });

  const posts = await page.evaluate(() => {
    const nodes = document.querySelectorAll('.wall_post_text');
    const result = [];
    nodes.forEach(node => {
      const text = node.innerText.trim();
      const image = node.closest('.Post')?.querySelector('img')?.src || '';
      const link = node.closest('.Post')?.querySelector('a[href*="/wall"]')?.href || '#';
      result.push({ text, image, link });
    });
    return result;
  });

  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
  await browser.close();
})();
