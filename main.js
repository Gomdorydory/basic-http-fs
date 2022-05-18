let http = require('http'); //invoke http module 
let fs = require('fs'); //invoke fs module.
let url = require('url');

// .. 은 상위 디렉토리
// cd (디렉토리 주소) 는 주소로 이동
// dir/w는 윈도우에서 현재 디렉토리 확인


let app = http.createServer(function(request, response){
  let _url = request.url; // /뒤의 값 나옴. /?id=index느낌..
  let queryData = url.parse(_url, true).query; //{ id: 'HTML'}
  // let queryData = new URL(_url, 'localhost:3000').query;
  if(_url == '/'){
    _url = '/index.html'; //home화면 출력하기
    console.log(_url);
  }
  if(_url == '/favicon.ico'){
    return response.writeHead(404);
  }
  response.writeHead(200);

  fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
    var template=`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jacvascript MDN Dictionary for Korean</title>
    <link rel="stylesheet" href="css/enroll.css">
    </head>
    <body>
    <header>
      <P class="maintitle">MDN Dictionary for Korean </P>
      <article>
        <a href="index.html">사용방법</a>
        <a herf="index.html">단어장</a>
        <a herf="/">단어등록</a>
      </article>
    </header>
    <content id="enroll">
      <input type="text" placeholder="영어단어">
      <input type="text" placeholder="단어 뜻">
      <textarea placeholder="예문"></textarea>
      <input type="text" placeholder="출처">
      <input type="submit">
    </content>
    <p>${description}</p>
    </body>
    </html>
    `
    console.log(template);
  })

  response.end(template);

});
app.listen(3000);