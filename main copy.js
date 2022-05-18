const http = require('http'); //invoke http module 
const fs = require('fs'); //invoke fs module
const url = require('url'); //invoke module
const qs = require('querystring'); //invoke querystring module
const path = require('path'); //invoke path module
const sanitizeHtml= require('sanitize-html') //invoke API
const template = require();

//서버 생성
const app = http.createServer(function(request,response){
  // url 정보를 가지고 온다.
  const _url = request.url;
  //url의 query를 queryData에 저장
  const queryData = new URL(_url).query;
  //url의 pathname를 pathname에 저장
  const pathname = new URL(_url).pathname;
  // 만약 pathname이 root이거나, querydata의 id가 정해지지 않았다면
  if(pathname === '/'||queryData.id === undefined){
      //./data의 디렉토리를 읽는다.
      fs.readdir('./data', function(error, filelist){
        //url의 id의 값을 파일이름으로 가지고 있는 파일을 filteredId로 저장
        const filteredId = path.parse(queryData.id).base;
        //비동기적으로 data폴더 안에 filteredId의 파일명을 가지고 있는 파일의 내용물을 읽는다. (utf8 형식으로.)
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          //queryData의 id값을 title로 저장한다.
          const title = queryData.id;
          //title을 sanitize해서 저장한다.
          const sanitizedTitle = sanitizeHtml(title);
          //discription을 sanitize한 것을 저장한다. [h1태그는 허용]
          const sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          });
          //template안의 list키의 filelist를 list로 저장한다.
          const list = template.list(filelist);
          //template안의 HTML키의 sanitizedTitle과 list와 다음과 같은 태그를 html로 저장한다.
          const html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
          );
          //writheHead에 200을 받는다.
          response.writeHead(200);
          //html을 보여준다.
          response.end(html);
        });
      });
    // 만약, pathname이 /create가 들어간다면
  } else if(pathname === '/create'){
    //fs 모듈을 이용하여 현재디렉토리/data의 내용을 읽는다.
    fs.readdir('./data', function(error, filelist){
      // title은 'WEB-create'로 저장한다.
      const title = 'WEB - create';
      // template의 list 메소드를 불러와서 list에 저장한다.
      const list = template.list(filelist);
      // template의 HTML 메소드를 불러와서 html로 저장한다.
      const html = template.HTML(title, list, `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      // writeHead200을 받는다.
      response.writeHead(200);
      // html을 사용자에게 송출한다.
      response.end(html);
    });
  //만약 pathname이 /create_process라면
  } else if(pathname === '/create_process'){
    //body에 공백을 넣고
    const body = '';
    //binds an event to a 'request' object. 
    request.on('data', function(data){
        // data를 받아서 body에 추가한다.
        body = body + data;
    });
    //binds an event to a 'request' object.
    request.on('end', function(){
        
        const post = qs.parse(body);
        const title = post.title;
        const description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
    });
  } else if(pathname === '/update'){
    fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if(pathname === '/update_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
        });
    });
  } else if(pathname === '/delete_process'){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        })
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);