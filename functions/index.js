    const pt = require('puppeteer');
    let authenticateLicense = async ()=>{

        let licenseID = '54563';
        let name = 'pan';
        let surname = 'muangasaen';
    
        const browser = await pt.launch({headless:'false',args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          ]})
        const p = await browser.newPage();
        //set viewpoint of browser page
        await p.setViewport({ width: 1000, height: 500 })
        await p.goto('https://www.pharmacycouncil.org/index.php?option=com_pharmacist_list');
        await p.type('#txtfind_id', licenseID);
        const f = await p.$('[name="cmdFindPH"]')
        await Promise.all([
          f.click(),
          p.waitForNavigation()
        ]);
        let g = await p.$(".contentright > table")
        //obtain text
        const texted = (await g.getProperty('textContent')).toString()
        console.log(texted)
        // let flag;
        // flag = texted.includes(name) && texted.includes(surname)
        // await p.close()
        // await browser.close()
        // response.statusCode = 200;
        // response.setHeader('Content-Type', "application/json");
        // response.send({
        //   result: flag
        // });
    }
    authenticateLicense()