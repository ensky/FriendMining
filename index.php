<!doctype html>
<html lang="zh_tw" xmlns:fb="http://ogp.me/ns/fb#">
<head>
  <meta charset="utf-8">
  <title>FriendMining by Ensky</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/css/bootstrap-combined.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/flick/jquery-ui-1.9.2.custom.min.css">
  <link rel="stylesheet" href="css/chosen.css">
  <link rel="stylesheet" href="css/style.css">
</head>

<body>
  <div id="content" class="container">
      <div class="masthead">
        <ul class="nav nav-pills pull-right">
          <li><a href="#/main">Home</a></li>
          <li><a href="#/help">這是什麼?</a></li>
        </ul>
        <div class="pull-right">
          <fb:like send="true" width="450" show_faces="true"></fb:like>
        </div>
        <h3 class="muted">
            Friend Mining
        </h3>
      </div>
      
      <div class="display-when-login row" style="display:none">
            <div class="span6">
              <form action="#" id="setting-form">
                <p>
                  <br>
                  設定抓取時間
                  <label style="display:inline"><input type="radio" name="since" value="week" checked="checked">一週前</label>
                  <label style="display:inline"><input type="radio" name="since" value="month">一個月前</label>
                  <label style="display:inline"><input type="radio" name="since" value="year">一年前</label>
                  <label style="display:inline"><input type="radio" name="since" value="forever">抓完所有塗鴉牆訊息</label>
                </p>
                <p>
                  抓誰的塗鴉牆 / 按讚的專頁
                  <select id="wall-source">
                    <option value="me">我</option>
                  </select>
                  <button id="start-loading" class="btn btn-success" type="submit">開始</button>
                  <button id="stop-loading" class="btn btn-danger" style="display:none" type="button">停止</button>
                  <span id="loading-gif" style="display:none">
                    <img src="img/loading.gif" alt="">讀取中...
                  </span>
                </p>
              </form>
            </div>
            <div class="display-when-render span5" style="display:none">
              <h4>
                資料來源：從<span id="loading-date"></span>到現在的塗鴉牆訊息
              </h4>
              <form id="search-form" action="#">
                搜尋好友的推文：<input id="search-input" type="search" class="input-medium search-query" placeholder="要找的好朋友名字">
                <button type="submit" class="btn btn-primary">搜尋</button>
              </form>
            </div>
      </div>
      <hr>

      <div id="page-index" class="page">
          <div class="jumbotron">
            <h1>Facebook Friend Mining</h1>
            <p class="lead">
              找出最喜歡點你讚/回應你的朋友XD <br>
            </p>
            <a href="#/main" id="login-btn" disabled="disabled" class="btn btn-large btn-success"><i class="icon-white icon-play"></i> 開始玩</a>
            <a href="#/help" class="btn btn-large btn-primary"><i class="icon-white icon-question-sign"></i> 這是什麼？</a>
          </div>
      </div>
      <div id="page-main" style="display:none" class="page">
        <div class="display-when-render row" style="display:none">
          <div class="span3">
            <h3><i data-fold="main-comment" class="icon-minus"></i>最多回應(<span id="comment-count"></span>) <i class="icon-comment"></i></h3>
            <div id="main-comment"></div>
          </div>

          <div class="span3">
            <h3><i data-fold="main-like" class="icon-minus"></i>最多讚(<span id="like-count"></span>) <i class="icon-thumbs-up"></i></h3>
            <div id="main-like"></div>
          </div>

          <div class="span3">
            <h3><i data-fold="main-all" class="icon-minus"></i>最關心你(<span id="all-count"></span>) <i class="icon-star"></i></h3>
            <div id="main-all"></div>
          </div>

          <div class="span3">
            <h3><i data-fold="main-dislike" class="icon-minus"></i>沒在follow你(<span id="dislike-count"></span>) <i class="icon-star-empty"></i></h3>
            <div id="main-dislike"></div>
          </div>
        </div>
      </div>
      <div id="page-user" style="display:none" class="page"></div>
      <div id="page-help" style="display:none" class="marked page">
### 這是什麼？
一個像是「我的好朋友拼圖」、「誰最關心我」之類的<strike>APP</strike> 網站

可以幫你找出你最好的朋友喔！（事實上是最喜歡留言、最喜歡按讚的朋友）

### 那和它們差在哪裡？
它們通常會有漂亮的圖片、還有很想讓你分享的自動貼文功能等等，

這些我都沒有。

取而代之的是你可以真的找出誰留了多少留言、誰按了多少讚等等資訊。

### 我的資料會不會被你偷走？
不會啦，放心。

這網站我只是寫好玩的，並沒有其他目的XD

不相信的話可以問問看你會網頁設計的朋友，他們看看原始碼應該就可以幫我作證了。

（本網站完全經由前端javascript處理，不會對後端server送資料）

### 這個網站用了什麼技術？
其實沒什麼技術...的說

+ Facebook JS SDK
+ Twitter Bootstrap => CSS Framework
+ jQuery => for DOM
+ jQuery UI => for AutoComplete
+ Underscore.js => for template
+ BackBone.js => for router
+ Showdown.js => 本help頁面
+ Chosen => 朋友塗鴉牆選擇
+ Require.js => 專案AMD管理

### 你還會更新嗎？
看情況，我哪天心血來潮會寫一下

想要增加什麼功能可以在下面留言板許願喔!
PS: 刪除好友的功能FB沒開放所以辦不到

### 開發紀錄
+ v0.6 - add 找出沒有在follow你的朋友
+ v0.5 - add 看朋友塗鴉牆功能
+ v0.4 - fix Firefox and IE9 bug
+ v0.3 - add 抓取時間範圍
+ v0.2 - add 本說明文件、搜尋好友功能
+ v0.1 - add 基本功能
      </div>

      <hr>

      <div class="footer">
        <div class="fb-comments" data-href="http://ensky.tw/FriendMining" data-width="1170" data-num-posts="5"></div>
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh_TW">
          <img alt="創用 CC 授權條款" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a>
          <br />
          <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">FriendMining</span>由<a xmlns:cc="http://creativecommons.org/ns#" href="http://www.ensky.tw" property="cc:attributionName" rel="cc:attributionURL">Ensky Lin</a>製作。
      </div>
  </div>
<script type="text/template" id="t-page-user">
  <h3><%= name %> 的回應</h3>
  <div id="user-comment"></div>

  <h3><%= name %> 說的讚</h3>
  <div id="user-like"></div>
</script>

<script id="t-user" type="text/template">
  <table class="table table-striped">
    <thead>
      <tr>
        <th width="60px"></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    <% _.each(users, function (user, i) { %>
      <tr>
        <td>
          <p>No. <%= (i+1) %></p>
          <p><a href="https://www.facebook.com/<%= user.id %>" target="_blank" title="去<%= user.name %>的塗鴉牆"><%= user.name %></a></p>
        </td>
        <td><img title="<%= user.name %>" src="https://graph.facebook.com/<%= user.id %>/picture" alt=""></td>
        <td>
          <%= user.comments %><i class="icon-comment"></i><br>
          <%= user.likes %><i class="icon-thumbs-up"></i>
        </td>
        <td><% if (user.sum > 0) { %><a class="btn btn-primary" href="#/user/<%= user.id %>">檢視</a><% } %></td>
      </tr>
    <% }); %>
    </tbody>
  </table>
</script>
<script id="t-like" type="text/template">
    <table class="table table-striped">
        <tbody>
          <% _.each(datas, function(id) { %>
          <tr>
            <td><a target="_blank" href="<%= getLink(id) %>"><%= (msgs[id].message || ("<img src='" + msgs[id].picture + "'>")) %></a></td>
            <!--td><%= msgs[id].created_time %></td-->
          </tr>
          <% }); %>
        </tbody>
    </table>
</script>
<script id="t-comment" type="text/template">
    <table class="table table-striped">
        <thead>
          <tr>
            <th class="span7">哪篇文章</th>
            <th>他回什麼</th>
          </tr>
        </thead>
        <tbody>
          <% _.each(datas, function(comment, msg_id) { %>
          <tr>
            <td><a target="_blank" href="<%= getLink(msg_id) %>"><%= (msgs[msg_id].message || ("<img src='" + msgs[msg_id].picture + "'>")) %></a></td>
            <td><%= comment %></td>
            <!--td><%= msgs[msg_id].created_time %></td-->
          </tr>
          <% }); %>
        </tbody>
    </table>
</script>

  <div id="fb-root"></div>
  <script src="js/lib/require.min.js"></script>
  <script src="js/lib/jquery.min.js"></script>
  <script src="js/lib/jquery-ui.min.js"></script>
  <script src="js/lib/bootstrap.min.js"></script>
  <script src="js/lib/underscore-min.js"></script>
  <script src="js/lib/backbone-min.js"></script>
  <script src="js/lib/showdown.min.js"></script>
  <script src="js/lib/chosen.jquery.min.js"></script>
  <script type="text/javascript" src="js/script.js"></script>
  <script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-37421141-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</body>
