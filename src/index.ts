import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';
import { Student } from './model/student.model';

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
  const options: pdf.CreateOptions = {
    border: {
      top: '30px',
      bottom: '30px',
      left: '30px',
      right: '30px',
    },
    footer: {
      height: '20px',
      contents: {
        default: '<div style="text-align: center;">{{page}}/{{pages}}</div>',
      },
    },
  };
  pdf.create(result, options).toFile(outPdf, (err, res) => {
    if (err) return console.log(err);
    console.log(res);
  });
};

main();
