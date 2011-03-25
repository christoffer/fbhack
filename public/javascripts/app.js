(function() {
  var you, global;
  var BASE_CIRCLE_SIZE = 500; // px

  function centerCircles() {
    centerCircleInPlace(you, 'left');
    centerCircleInPlace(global, 'right');
  }

  function centerCircleInPlace(circleEl, position) {
    var cw = circleEl.width(),
        ch = circleEl.height();

    var positionX = position == 'left' ? (window.innerWidth - cw) * 0.5 - 25 :(window.innerWidth  + cw) * 0.5 + 25  ;

    circleEl.css({ top: '50%', left: positionX })
    circleEl.css({
      'top': circleEl.offset().top - (ch / 2),
      'left': circleEl.offset().left - (cw / 2)
    });
  }

  function setCircleSize(el, size) {
    el.css({
      width: size,
      height: size,
      borderRadius: Math.floor(size * 0.5)
    });
    el.find('span.title').css('margin-top', el.height() / 2 - (75 / 2));
  }

  function initCircles(data) {
    var baseSize = window.innerHeight,
        varSize = baseSize / 2,
        minSize = baseSize / 3;
    var total = data.you.score + data.global.score;
    var youRatio = data.you.score / total,
        globalRatio = 1 - youRatio;

    you.find('span.count').html('Your friends\' literary score is '+data.you.score);
    global.find('span.count').html('Average is ' + data.global.score);

    setCircleSize(you, (youRatio * varSize) + minSize);
    setCircleSize(global, (globalRatio * varSize) + minSize);
  }

  function updateVisual() {
    initCircles(window.DATA);
    centerCircles();
  }

  window.collectIntellectualsAsync = function(userId) {
    FB.api('/me/friends', function(resp) {
      if(resp.error) {
        // handle error.message
        console.error(resp.error.message);
        return;
      }

      var friends = [],
          len = resp.data.length,
          d = resp.data;

      for(var i = 0; i < len; i ++) {
        friends.push(parseInt(d[i].id, 10));
      }

      var friendsCount = friends.length;

      var batches = [];
      var thisBatch = friends.slice(0, 10);
      while(thisBatch.length) {
        batches.push(thisBatch);
        thisBatch = friends.splice(0, 10);
      }

      console.log(batches);

      var bookCount = 0,
          completedSegments = 0,
          expectedSegments = batches.length;

      for(var i = 0, len = batches.length; i < len; i++) {
        console.log('Processing batch:' + i);
        updateProgress(i / len);
        FB.api('/books', 'GET', { ids: batches[i].join(','), access_token: fb_token }, function(resp) {
          for(var personId in resp) {
            if(resp.hasOwnProperty(personId)) {
              var person = resp[personId];
              bookCount = bookCount + person.data.length;
              console.log('Bookcount is currently: ' + bookCount);
              if(person.data.length > 0) {
                console.log('Has ' + person.data.length + ' books');
              }
            }
          }
          completedSegments++;
        });
      }

      function completeOrWait() {
        if(completedSegments !== expectedSegments) {
          setTimeout(completeOrWait, 50);
          return;
        }

        saveToServer(userId, friendsCount, bookCount);
      }

      setTimeout(completeOrWait, 100);

    });
  }

  function saveToServer(userId, friendCount, bookCount) {
    $.post('/users/' + userId, { user: { friend_count: friendCount, book_count: bookCount } });
  }

  function updateProgress(pct) {
    console.log(pct + '%');
  }


  $(function() {
    you = $('#you');
    global = $('#global');
    window.DATA = { you: { score: 0 }, global: { score: 0 }};
    updateVisual();
  });

  $(window).resize(updateVisual);
})();
