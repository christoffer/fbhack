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
      minSize = baseSize / 4;
  var total = data.you.score + data.global.score;
  var youRatio = data.you.score / total,
      globalRatio = 1 - youRatio;

  you.find('span.count').html(data.you.score + ' books per person');
  global.find('span.count').html(data.global.score + ' books per person');

  setCircleSize(you, (youRatio * varSize) + minSize);
  setCircleSize(global, (globalRatio * varSize) + minSize);
}

$(function() {
  you = $('#you');
  global = $('#global');

  initCircles(window.DATA);
  centerCircles();
});

$(window).resize(function() {
  initCircles(window.DATA);
  centerCircles();
});
