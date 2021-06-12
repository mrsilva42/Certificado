'use strict'

//importando os modulos
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function criaPDF(data){

    try {
        //chamando o arquivo HTML
        var templateHtml = fs.readFileSync(path.join(process.cwd(), 'gerador.html'), 'utf8');
        //compilando o templateHtml usando handlebars
	    var template = handlebars.compile(templateHtml);
	    var html = template(data);

	    var milis = new Date();
	    milis = milis.getTime();

	    var pdfPath = path.join('pdf', `${data.name}-${milis}.pdf`);

	    var options = {
	    	width: '1230px',
	    	headerTemplate: "<p></p>",
	    	footerTemplate: "<p></p>",
	    	displayHeaderFooter: false,
	    	margin: {
	    		top: "10px",
		    	bottom: "30px"
	    	},
		    printBackground: true,
	    	path: pdfPath
    	}

	    const browser = await puppeteer.launch({
	    	args: ['--no-sandbox'],
	    	headless: true
	    });

	    var page = await browser.newPage();
	
	    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
	    	waitUntil: 'networkidle0'
	    });

	    await page.pdf(options);
	    await browser.close();       

        //pegar exceções
      } catch (error) {
        throw Error(error);
      }
}

//dados do aluno
const data = {
	title: "Certificado de conclusão de curso",
	date: "10/06/2021",
	name: "Cristovaldo de Souza Brandão",
    courseData: "21/10/2020",
	age: 28,
	obs: "Graduado em Ciência da Computaçâo."
}

criaPDF(data);