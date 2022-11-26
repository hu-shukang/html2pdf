import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { Student } from './model/student.model';
import puppeteer from 'puppeteer';

const main = async () => {
  const filePath = path.join(__dirname, './html/demo.ejs');
  const str = fs.readFileSync(filePath, {
    encoding: 'utf8',
  });
  const studentList: Student[] = [];
  for (let i = 0; i < 20; i++) {
    const student: Student = {
      name: `${i}さん`,
      address: '東京都江戸川区',
      age: i,
      likes: i % 2 == 0 ? [] : ['foo', 'bar', 'baz'],
    };
    studentList.push(student);
  }
  const result = ejs.compile(str)({
    studentList: studentList,
  });
  const outHtml = path.join(__dirname, '../out/demo.html');
  fs.writeFileSync(outHtml, result, {
    encoding: 'utf8',
  });

  const outPdf = path.join(__dirname, '../out/demo.pdf');
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(`file://${outHtml}`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('screen');
  await page.pdf({
    path: outPdf,
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    width: '2480px',
    height: '3472px',
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `
    <div style="width: 100%; font-size: 20px; text-align: center;">
        <div><span class="pageNumber"></span>/<span class="totalPages"></span></div>
    </div>
  `,
  });
  await browser.close();
};

main();
