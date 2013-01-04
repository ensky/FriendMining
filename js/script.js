window.isLogin = false;
    window.fbAsyncInit = function() {
      // init the FB JS SDK
      FB.init({
        appId      : '313564748761564', // App ID from the App Dashboard
        channelUrl : '//ensky.tw/FriendMining/channel.php', // Channel File for x-domain communication
        status     : true, // check the login status upon init?
        cookie     : true, // set sessions cookies to allow your server to access the session?
        xfbml      : true  // parse XFBML tags on this page?
      });
      $('#login-btn').attr('disabled', false);
    };

    // Load the SDK's source Asynchronously
    // Note that the debug version is being actively developed and might 
    // contain some type checks that are overly strict. 
    // Please report such bugs using the bugs tool.
    (function(d, debug){
       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement('script'); js.id = id; js.async = true;
       js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
       ref.parentNode.insertBefore(js, ref);
     }(document, /*debug*/ false));

var EFB = function () {
  var until, since;
  var Data = {
    msgs: {},
    users: {/*name, likes, comments*/},
    ranks: {
      like: PriorityQueue({low: true}),
      comment: PriorityQueue({low: true}),
      all: PriorityQueue({low: true})
    }
  };
  var T = {
    'page_user': _.template($('#t-page-user').html()),
    'user': _.template($('#t-user').html()),
    'like': _.template($('#t-like').html()),
    'comment': _.template($('#t-comment').html())
  };
  window.Data = Data;

  var parseCommentLike = function (type, row) {
      var initUser = function (userid, name) {
          if (typeof Data.users[userid] === 'undefined') {
              Data.users[userid] = {
                  name: name,
                  likes: [],
                  comments: {}
              }
          }
      };
      var msg_id = row.id;
      Data.msgs[msg_id] = Data.msgs[msg_id] || {
          picture: row.picture || '',
          link: row.link || '',
          message: row.message || '',
          created_time: new Date(row.created_time)
      };

      datas = type == 'comment' ? row.comments.data : row.likes.data;
      rankobj = Data.ranks;
      $.each(datas, function (index, d) {
          var user_id;
          if ( type == 'comment' ) {
              user_id = d.from.id;
              if (user_id != FBID) {
                initUser(user_id, d.from.name);
                userobj = Data.users[user_id];
                userobj['comments'][msg_id] = d.message;
                rankobj.comment.remove(user_id);
                rankobj.comment.push(user_id, Object.keys(userobj['comments']).length);
              }
          } else {
              user_id = d.id;
              if (user_id != FBID) {
                initUser(user_id, d.name);
                userobj = Data.users[user_id];
                userobj['likes'].push(msg_id);
                rankobj.like.remove(user_id);
                rankobj.like.push(user_id, Object.keys(userobj['likes']).length);
              }
          }

          if (user_id != FBID) {
            rankobj.all.remove(user_id);
            rankobj.all.push(user_id, Object.keys(userobj['comments']).length + Object.keys(userobj['likes']).length);
          }
      });
  }

  var joinData = function (datas) {
      $.each(datas, function (index, d) {
          if (typeof d.comments == "object" && d.comments.count != 0) {
              parseCommentLike("comment", d);
          }
          if (typeof d.likes == "object" && d.likes.count != 0) {
              parseCommentLike("like", d);
          }
      });
  }

  var init = function () {
      until = Math.floor(new Date().getTime() / 1000);
      since = new Date("2012/01/01 00:00:00");
      // since.setFullYear(2012);
      since = Math.floor(since.getTime() / 1000);
      call();
  }

  var render_user = function (id) {
    if ( typeof Data.users[id] === 'object' ) {
        var prepare = function (type) {
            var result = {
              msgs: Data.msgs
            };
            result.datas = Data.users[id][type];
            result.getLink = function (msg_id) {
                if (Data.msgs[msg_id].message == '' && Data.msgs[msg_id].link != '') {
                    return Data.msgs[msg_id].link;
                } else {
                    return 'http://www.facebook.com/' + msg_id;
                }
            };
            return result;
        }
        $("#page-user").html(T.page_user({id: id, name: Data.users[id].name}));
        $("#user-like").html(T.like(prepare('likes')));
        $("#user-comment").html(T.comment(prepare('comments')));
    }
  };

  var render = function () {
      var parse_result = function (results) {
          var r = [];
          _.each(results, function (result) {
              r.push({
                  id: result.object,
                  name: Data.users[result.object].name,
                  count: result.priority
              });
          });
          return r;
      };
      $("#main-like").html(T.user({users: parse_result(Data.ranks.like.result())}));
      $("#main-comment").html(T.user({users: parse_result(Data.ranks.comment.result())}));
      $("#main-all").html(T.user({users: parse_result(Data.ranks.all.result())}));
  };

  var loadingCount = 0,
      stop_loading = 0;

  $('#stop-loading').click(function () {
      stop_loading = 1;
  });
  var call = function () {
    $('#loading-gif').show();
    loadingCount++;
    FB.api('/me/posts?fields=message,likes,comments,link,picture&limit=100&until=' + until, function(d) {
        if (typeof d.paging.next !== 'undefined') {
            until = d.paging.next.match(/until=(\d+)/)[1];
            if ( /*until > since &&*/ !stop_loading) {
                call();
            }
        }
        joinData(d.data);
        render();

        $('#loading-date-wrapper').show();
        untilDate = new Date(until * 1000);
        untilDateString = untilDate.getFullYear() + "/" + (untilDate.getMonth()+1) + "/" + untilDate.getDate();
        $('#loading-date').text(untilDateString);
        loadingCount--;

        if (loadingCount == 0) {
          $('#loading-gif').hide();
        }
    });
  }

  return {
    init: init,
    render: render,
    render_user: render_user
  }
} ();

var WorkspaceRouter = Backbone.Router.extend({

  routes: {
    "main": "main",
    "user/:id":   "user"
  },

  main: function () {
    if (isLogin) {
      $("#page-index").hide();
      $("#page-user").hide();
      EFB.render();
      $('#page-main').show();
    }
  },

  user: function(id) {
    if (isLogin) {
      $("#page-index").hide();
      $('#page-main').hide();
      EFB.render_user(id);
      $("#page-user").show();
    }
  }

});
window.Router = new WorkspaceRouter;
Backbone.history.start();

$('#login-btn').click(function () {
  FB.login(function(response) {
   if (response.authResponse) {
      FB.api('/me?fields=id', function (d) {
          window.FBID = d.id;
      });
      
      window.isLogin = true;
      EFB.init();
      window.Router.navigate("#/main");
   } else {
      console.log('User cancelled login or did not fully authorize.');
   }
  }, {scope: 'read_stream'});
});