/* ANTENA prototype — 공용 셸(상단바 + 사이드바) 렌더러
   각 페이지는 <body data-mode="insight|sim" data-nav="<key>"> 만 지정하면 된다. */
(function () {
  var ICON = {
    home:      '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
    stocks:    '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    market:    '<path d="M12 3v18"/><path d="M5 8h9a3 3 0 0 1 0 6H5"/><path d="M5 8H3"/><path d="M19 14h2"/>',
    report:    '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/><path d="M9 12h6M9 16h6"/>',
    portfolio: '<path d="M3 7h18v13H3z"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
    community: '<path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M22 20v-2a4 4 0 0 0-3-3.87"/>',
    star:      '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
    play:      '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5z"/>',
    trophy:    '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/><path d="M10 19h4M12 14v5M8 21h8"/>'
  };

  var MODES = {
    insight: {
      label: 'ANTENA',
      home: 'index.html',
      nav: [
        { key: 'home',      icon: 'home',      text: '홈',        href: 'index.html' },
        { key: 'stocks',    icon: 'stocks',    text: '종목 보기',  href: 'stocks.html' },
        { key: 'market',    icon: 'market',    text: '예측가',    href: 'market.html' },
        { key: 'report',    icon: 'report',    text: '리포트',     href: 'reports.html' },
        { key: 'portfolio', icon: 'portfolio', text: '포트폴리오', href: 'portfolio.html' },
        { key: 'community', icon: 'community', text: '커뮤니티',   href: 'community.html' },
        { key: 'watchlist', icon: 'star',      text: '찜',        href: 'watchlist.html' }
      ]
    },
    sim: {
      label: '모의 투자',
      home: 'sim-index.html',
      nav: [
        { key: 'home',      icon: 'home',      text: '모의 투자 홈', href: 'sim-index.html' },
        { key: 'play',      icon: 'play',      text: '모의 투자',    href: 'sim-setup.html' },
        { key: 'portfolio', icon: 'portfolio', text: '내 포트폴리오', href: 'sim-portfolio.html' },
        { key: 'ranking',   icon: 'trophy',    text: '랭킹',        href: 'sim-ranking.html' }
      ]
    }
  };

  // index.html 은 루트, 나머지 화면은 screens/ 에 있다.
  var IN_SCREENS = location.pathname.indexOf("/screens/") !== -1;
  function url(file) {
    return file === "index.html"
      ? (IN_SCREENS ? "../" : "") + file
      : (IN_SCREENS ? "" : "screens/") + file;
  }

  function svg(name, size) {
    return '<svg width="' + (size || 19) + '" height="' + (size || 19) + '" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + ICON[name] + '</svg>';
  }

  function topbar(modeKey) {
    var tabs = ['insight', 'sim'].map(function (k) {
      return '<a href="' + url(MODES[k].home) + '" class="' + (k === modeKey ? 'on' : '') + '">' +
        MODES[k].label + '</a>';
    }).join('');

    return '' +
      '<header class="topbar">' +
        '<button class="rail-toggle" id="rail-toggle" aria-label="메뉴 열기/닫기" aria-controls="rail" aria-expanded="false">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">' +
            '<path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
        '</button>' +
        '<a class="brand" href="' + url("index.html") + '">' +
          '<svg class="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">' +
            '<rect width="40" height="40" rx="11" fill="currentColor"/>' +
            '<path d="M11.5 29.5 20 11.5l8.5 18" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M15.8 24.2h8.4" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/></svg>' +
          '<span class="brand-name">ANTENA</span>' +
        '</a>' +
        '<div class="search">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input type="search" placeholder="종목명 또는 키워드를 검색하세요 (예: 삼성전자, 2차전지, 반도체)">' +
        '</div>' +
        '<nav class="modeswitch">' + tabs + '</nav>' +
        '<div class="topbar-right">' +
          '<div class="wallet"><i></i><span class="num">1,250</span> ANT</div>' +
          '<button class="iconbtn" aria-label="알림">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M18 8a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>' +
            '<span class="badge">2</span>' +
          '</button>' +
          '<button class="iconbtn" aria-label="설정">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="12" cy="12" r="3"/>' +
              '<path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3.4a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.7 6.3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1"/></svg>' +
          '</button>' +
          '<a class="avatar" href="' + url("portfolio.html") + '" aria-label="내 계정"></a>' +
        '</div>' +
      '</header>';
  }

  function rail(modeKey, navKey) {
    var items = MODES[modeKey].nav.map(function (n) {
      return '<a href="' + url(n.href) + '" class="' + (n.key === navKey ? 'on' : '') + '">' +
        svg(n.icon) + '<span>' + n.text + '</span></a>';
    }).join('');

    return '' +
      '<aside class="rail" id="rail">' +
        '<nav class="nav">' + items + '</nav>' +
        '<div class="rail-foot"><a class="btn-login" href=' + '"' + url("login.html") + '">로그인 / 회원가입</a></div>' +
      '</aside>' +
      '<div class="rail-backdrop" id="rail-backdrop"></div>';
  }

  var body = document.body;
  var mode = MODES[body.dataset.mode] ? body.dataset.mode : 'insight';
  var nav = body.dataset.nav || 'home';

  body.insertAdjacentHTML('afterbegin', topbar(mode) + rail(mode, nav));

  // ── 사이드바 열고 닫기 ────────────────────────────────
  // 넓은 화면은 기본 열림(선택 상태를 기억), 좁은 화면은 기본 닫힘.
  var WIDE = '(min-width: 901px)';
  var KEY = 'antena.rail';
  var toggle = document.getElementById('rail-toggle');
  var backdrop = document.getElementById('rail-backdrop');

  function isWide() { return window.matchMedia(WIDE).matches; }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setOpen(open, remember) {
    body.classList.toggle('rail-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (remember && isWide()) { try { localStorage.setItem(KEY, open ? '1' : '0'); } catch (e) {} }
  }

  // 초기 상태
  setOpen(isWide() && stored() !== '0', false);

  toggle.addEventListener('click', function () {
    setOpen(!body.classList.contains('rail-open'), true);
  });

  backdrop.addEventListener('click', function () { setOpen(false, false); });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !isWide() && body.classList.contains('rail-open')) setOpen(false, false);
  });

  // 좁은 화면에서 메뉴를 고르면 서랍을 닫는다
  document.querySelectorAll('.rail .nav a').forEach(function (link) {
    link.addEventListener('click', function () { if (!isWide()) setOpen(false, false); });
  });

  // 화면 폭이 경계를 넘으면 그 모드의 기본값으로 되돌린다
  var mq = window.matchMedia(WIDE);
  var onChange = function () { setOpen(mq.matches && stored() !== '0', false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else mq.addListener(onChange);
})();
