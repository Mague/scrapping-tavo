const axios = require('axios');
const ua = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
]

const scraperObject = {
	url: 'https://www.elcorteingles.es/videojuegos/ps5/consolas/',
	async scraper(browser){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.setUserAgent( ua[Math.floor(Math.random() * 5)] );
		await page.goto(this.url);
        const ss = await page.screenshot({path: "./screenshot.png"});
        let coockieSelector = "#cookies-agree"
        await page.waitForSelector(coockieSelector)
		await page.click(coockieSelector)
        let modalClose = ".modal-close"
        await page.waitForSelector(modalClose)
        await page.click(modalClose)
        
        await page.waitForSelector(".products_list-container")
        
        
        let list = "ul > li > div > div > div.obverse > div.product_preview-body > div.product_preview-ppal > div.product_preview-buy.js-group-type-pack > div.product_preview-buy-ppal > div.pricing.js-preview-pricing"
        let linkSelector ="ul > li > div > div > div.obverse > div.product_preview-body > div.product_preview-ppal > div.product_preview-info.no-colors > div.title-box > h2 > a"
        let links = await page.evaluate(linkSelector=>{
            return [...document.querySelectorAll(linkSelector)].map((a)=>{
                console.log(a)
                return a.href;
            });
        },linkSelector)
        let prices = await page.evaluate(list => {
            return [...document.querySelectorAll(list)].map((li,index) => {
                const price = li.textContent.trim();
                
                return `${price}`;
              });
        },list,links)
        let stock=prices.map((price,index)=>{
            let msg="Agotado"
            if(price.length>0){
                msg=price
		    
               axios.post('https://api.pushover.net/1/messages.json', {
                    'token': 'aopr81iu8yz8whqx1ek8n5ubv5h46q',
                    'user': 'ugqje4tarbztkzht12kffusiq59fki',
                    'device': 'iphone',
                    'title': 'PS5 Disponible Corte Ingles',
                    'message': `Price: ${msg}, link: ${links[index]}`,
                    'url': links[index],
                    'priority': 2,
                    'retry': 30,
                    'expire': 3600
                }).then( resp => {
                    console.log(resp);
                }).catch( error => {
                    console.error(error)
                });
            }
            return `Price: ${msg}, link: ${links[index]}`
        })
        console.log(stock)
        await page.close();
        await browser.close();

	}
}

module.exports = scraperObject;
