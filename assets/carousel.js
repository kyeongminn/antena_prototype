/* ANTENA prototype — 공용 캐러셀 (CSS scroll-snap 기반)
   사용법: 카드 묶음 컨테이너에 data-carousel 만 붙이면 기존 자식들이 슬라이드가 된다.
   - 표시 개수는 CSS 변수 --per, 간격은 --car-gap 으로 컨텍스트별 지정
   - 항목 수가 --per 이하면 컨트롤이 숨고 기존 그리드처럼 보인다
   - 옵션: data-autoplay="6000"(ms, 자동 순환) · data-arrows="0"(화살표 숨김) */
(function () {
  function init(root) {
    if (root.dataset.carReady) return;
    root.dataset.carReady = '1';

    // 기존 자식들을 트랙으로 이동
    var track = document.createElement('div');
    track.className = 'car-track';
    track.setAttribute('tabindex', '0');
    while (root.firstChild) track.appendChild(root.firstChild);
    root.appendChild(track);

    var items = Array.prototype.slice.call(track.children);

    var prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'car-arrow prev';
    prev.setAttribute('aria-label', '이전'); prev.textContent = '‹';
    var next = document.createElement('button');
    next.type = 'button'; next.className = 'car-arrow next';
    next.setAttribute('aria-label', '다음'); next.textContent = '›';
    var dots = document.createElement('div');
    dots.className = 'car-dots';
    if (root.dataset.arrows !== '0') { root.appendChild(prev); root.appendChild(next); }
    root.appendChild(dots);

    function per() {
      var v = parseFloat(getComputedStyle(track).getPropertyValue('--per'));
      return Math.max(1, Math.round(v || 1));
    }
    function pageW() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return Math.max(1, track.clientWidth + gap);
    }
    function pages() { return Math.max(1, Math.ceil(items.length / per())); }
    function page() {
      return Math.max(0, Math.min(pages() - 1, Math.round(track.scrollLeft / pageW())));
    }
    function goTo(p) {
      var n = pages();
      p = ((p % n) + n) % n;
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({ left: p * pageW(), behavior: reduce ? 'auto' : 'smooth' });
      paint(p);  // 스크롤 완료를 기다리지 않고 즉시 반영
    }
    function paint(forced) {
      var n = pages(), cur = typeof forced === 'number' ? Math.min(forced, n - 1) : page();
      root.classList.toggle('car-static', n <= 1);
      var html = '';
      for (var i = 0; i < n; i++) {
        html += '<button type="button" class="car-dot' + (i === cur ? ' on' : '') +
          '" data-p="' + i + '" aria-label="' + (i + 1) + ' / ' + n + '"></button>';
      }
      dots.innerHTML = html;
      prev.disabled = cur === 0;
      next.disabled = cur === n - 1;
    }

    prev.addEventListener('click', function () { goTo(page() - 1); });
    next.addEventListener('click', function () { goTo(page() + 1); });
    dots.addEventListener('click', function (event) {
      var dot = event.target.closest('.car-dot');
      if (dot) goTo(Number(dot.dataset.p));
    });
    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(page() - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(page() + 1); }
    });

    var pending = 0;
    track.addEventListener('scroll', function () {
      if (pending) return;
      pending = setTimeout(function () { pending = 0; paint(); }, 80);
    });
    if (window.ResizeObserver) new ResizeObserver(function () { paint(); }).observe(track);  // 숨김→표시 전환도 감지
    window.addEventListener('resize', function () { paint(); });

    // 자동 순환 — 마우스·포커스·터치 중에는 멈춘다
    var ms = Number(root.dataset.autoplay) || 0;
    if (ms) {
      var hold = false;
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (t) {
        root.addEventListener(t, function () { hold = true; });
      });
      ['mouseleave', 'focusout'].forEach(function (t) {
        root.addEventListener(t, function () { hold = false; });
      });
      setInterval(function () {
        if (!hold && !document.hidden) goTo(page() + 1);
      }, ms);
    }

    paint();
  }

  document.querySelectorAll('[data-carousel]').forEach(init);
})();
