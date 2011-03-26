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

  function initCircles(myScore) {
    var baseSize = window.innerHeight,
        varSize = baseSize / 2,
        minSize = baseSize / 3;
    var total = myScore + window.GLOBAL_SCORE;
    var youRatio = myScore / total,
        globalRatio = 1 - youRatio;

    you.find('span.count').html('Your friends\' literary score is '+ myScore);
    global.find('span.count').html('Average is ' + window.GLOBAL_SCORE);

    setCircleSize(you, (youRatio * varSize) + minSize);
    setCircleSize(global, (globalRatio * varSize) + minSize);
  }

  function updateVisuals(myScore) {
    initCircles(myScore || 0);
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

      var bookCount = 0,
          completedSegments = 0,
          expectedSegments = batches.length;

      for(var i = 0, len = batches.length; i < len; i++) {
        FB.api('/books', 'GET', { ids: batches[i].join(',') }, function(resp) {
          updateProgress(Math.floor((completedSegments / expectedSegments) * 100));
          for(var personId in resp) {
            if(resp.hasOwnProperty(personId)) {
              var person = resp[personId];
              bookCount = bookCount + person.data.length;
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

        you.show();
        global.show();
        updateVisuals(Math.floor((bookCount / friendsCount) * 100));
        progress.fadeOut();
        saveToServer(userId, friendsCount, bookCount);

      }

      setTimeout(completeOrWait, 100);

    });
  }

  function saveToServer(userId, friendCount, bookCount) {
    $.ajax({
      type: 'PUT',
      url: '/users/' + userId,
      data: { user: { friend_count: friendCount, book_count: bookCount } },
      dataType: 'json'
    });
  }

  function updateProgress(pct) {
    console.log('Progress is ' + pct + '%');
    $('#bar').css('width', pct + '%');
  }

  $(function() {
    you = $('#you');
    global = $('#global');
    progress = $('#progress');

    you.hide();
    global.hide();
    progress.show();
    progress.css('margin-top', (window.innerHeight - progress.height()) * 0.4 + 'px' );
    
    updateVisuals();
  });

  $(window).resize(updateVisuals);
})();
