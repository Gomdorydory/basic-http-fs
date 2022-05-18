module.exports = {
  HTML:function(word, meaning, egs, ref){
    return `
    <!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
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
  
  <content id="note">
    <div id="noteL">
      <article id="note1" class="noteBox">${word}</article>
      <article id="note2" class="noteBox">${meaning}</article>
    </div>
    <div id="noteR">
      <article id="note3" class="noteBox">${egs}
      </article>
      <article id="note4" class="noteBox">${ref}</article>
    </div>
  </content>

</body>
</html>`;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}

