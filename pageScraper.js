const scraperObject = {
	url: 'https://www.elcorteingles.es/videojuegos/ps5/consolas/#',
	async scraper(browser){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
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
            }
            return `Price: ${msg}, link: ${links[index]}`
        })
        console.log(stock)
        await page.close();
        await browser.close();

	}
}

module.exports = scraperObject;