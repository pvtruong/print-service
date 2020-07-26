const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
const ptp = require("pdf-to-printer");
const start =(port=8989)=>{
    app.get('/', (req, res) => res.send('Print service 1.0'));
    //allow cross domain
    app.options('/*', function(req, res) {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with,X-Access-Token,Authorization,Content-Encoding,Accept-Encoding');
        res.sendStatus(200);
    });
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with,X-Access-Token,Authorization,Content-Encoding,Accept-Encoding');
        next();
    });
    app.get(`/web-print`,async (req,res)=>{
        let p = req.query.url;
        if(!p){
            return res.status(400).send("Parameter url is required");
        }
        let buff = Buffer.from(p, 'base64');
        p = buff.toString('utf8');
        let width = req.query.width;
        //find default printer
        let defaultPrinter = await ptp.getDefaultPrinter()
        if(!defaultPrinter) return res.status(400).send("Please set a default printer");
        let fileReport = `reports/rp-${new Date().getTime()}.pdf`;
        //open page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log("open",p)
        try{
            await page.goto(p, {waitUntil: 'networkidle2'});
        }catch(e){
            console.error(e.message);
            await browser.close();
            return res.status(400).send(e.message);
        }
        await page.pdf({path: fileReport, width:width});
        await browser.close();
        const options = {
            printer: defaultPrinter
        };
        ptp.print(fileReport,options)
        .then(()=>{
            res.send("Report was sent to print");
        })
        .catch((e)=>{
            res.status(400).send(e.message);
        })
    })
    app.listen(port, () => console.log(`Print service is running at http://localhost:${port}`))
}
module.exports ={
    start
}