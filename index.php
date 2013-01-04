<!doctype html>
<html lang="zh_tw" xmlns:fb="http://ogp.me/ns/fb#">
<head>
  <meta charset="utf-8">
  <title>FriendMining by Ensky</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/css/bootstrap-combined.min.css" rel="stylesheet">
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
            <span id="loading-gif" style="display:none">
              <img src="img/loading.gif" alt="">讀取中... <button id="stop-loading" class="btn btn-danger">停止</button>
            </span>
        </h3>
      </div>
      
      <div id="loading-date-wrapper" style="display:none">
        <h4>資料來源：從<span id="loading-date"></span>到現在的塗鴉牆訊息</h4>
      </div>
      <hr>

      <div id="page-index" class="page">
          <div class="jumbotron">
            <h1>Facebook Friend Mining</h1>
            <p class="lead">
                找出最喜歡點你讚/回應你的朋友XD
            </p>
            <a href="#/help" class="btn btn-large btn-primary"><i class="icon-white icon-question-sign"></i> 這是什麼？</a>
            <a id="login-btn" disabled="disabled" class="btn btn-large btn-success" href="#"><i class="icon-white icon-play"></i> Start</a>
          </div>
      </div>
      <div id="page-main" style="display:none" class="page">
          <h3><i data-fold="main-comment" class="icon-minus"></i>朋友的回應 <i class="icon-comment"></i> <small>數字為留言筆數</small></h3>
          <div id="main-comment"></div>

          <h3><i data-fold="main-like" class="icon-minus"></i>朋友的讚 <i class="icon-thumbs-up"></i> <small>數字為按讚次數</small></h3>
          <div id="main-like"></div>

          <h3><i data-fold="main-all" class="icon-minus"></i>最關心你的朋友 <i class="icon-heart"></i> <small>數字為留言數+按讚數</small></h3>
          <div id="main-all"></div>
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
+ Underscore.js => for template
+ BackBone.js => for router
+ Showdown.js => 本help頁面

### 你還會更新嗎？
看情況，我哪天心血來潮會寫一下

想要增加什麼功能可以在下面留言板許願喔!

      </div>

      <hr>

      <div class="footer">
        <div class="fb-comments" data-href="http://ensky.tw/FriendMining" data-width="1170" data-num-posts="5"></div>
        <p>&copy; Ensky Lin 2012</p>
      </div>
  </div>
<script type="text/template" id="t-page-user">
  <h3><%= name %> 的回應</h3>
  <div id="user-comment"></div>

  <h3><%= name %> 說的讚</h3>
  <div id="user-like"></div>
</script>
<script id="t-user" type="text/template">
    <% _.each(users, function (user) { %>
      <div class="left head-pic">
          <p><a href="#/user/<%= user.id %>"><img title="<%= user.name %>" src="https://graph.facebook.com/<%= user.id %>/picture" alt=""></a></p>
          <p><%= user.count %></p>
      </div>
    <% }); %>
    <div class="clear"></div>
</script>
<script id="t-like" type="text/template">
    <table class="table table-striped">
        <tbody>
          <% _.each(datas, function(id) { %>
          <tr>
            <td><a href="<%= getLink(id) %>"><%= (msgs[id].message || ("<img src='" + msgs[id].picture + "'>")) %></a></td>
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
            <td><a href="<%= getLink(msg_id) %>"><%= (msgs[msg_id].message || ("<img src='" + msgs[msg_id].picture + "'>")) %></a></td>
            <td><%= comment %></td>
            <!--td><%= msgs[msg_id].created_time %></td-->
          </tr>
          <% }); %>
        </tbody>
    </table>
</script>

  <div id="fb-root"></div>
  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/js/bootstrap.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/showdown/0.3.1/showdown.min.js"></script>
  <script type="text/javascript" src="js/plugins.js"></script>
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