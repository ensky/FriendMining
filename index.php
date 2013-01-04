<!doctype html>
<html lang="zh_tw" xmlns:fb="http://ogp.me/ns/fb#">
<head>
  <meta charset="utf-8">
  <title>FriendMining by Ensky</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/css/bootstrap-combined.min.css" rel="stylesheet">
  <style type="text/css">
      body {
        padding-top: 20px;
        padding-bottom: 40px;
      }

      .footer {
          text-align: center;
      }

      .left {
        float: left;
      }

      .clear {
        clear: left;
      }

      .head-pic {
        width: 70px;
      }
  </style>
</head>

<body>
  <div id="content" class="container">
      <div class="masthead">
        <ul class="nav nav-pills pull-right">
          <li><a href="#/main">Home</a></li>
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

      <div id="page-index">
          <div class="jumbotron">
            <h1>Facebook Friend Mining</h1>
            <p class="lead">
                找出最喜歡點你讚/回應你的朋友XD
            </p>
            <a id="login-btn" disabled="disabled" class="btn btn-large btn-success" href="#">Start</a>
          </div>
      </div>
      <div id="page-main" style="display:none">
          <h3>朋友的回應</h3>
          <div id="main-comment"></div>

          <h3>朋友的讚</h3>
          <div id="main-like"></div>

          <h3>最關心你的朋友</h3>
          <div id="main-all"></div>
      </div>
      <div id="page-user" style="display:none"></div>

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
          <p>Count: <%= user.count %></p>
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