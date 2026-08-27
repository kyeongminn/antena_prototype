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
    research:  '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/><path d="M8 10.5h5M10.5 8v5"/>',
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
        { key: 'research',  icon: 'research',  text: '리서치',      href: 'sim-research.html' },
        { key: 'ranking',   icon: 'trophy',    text: '랭킹',        href: 'sim-ranking.html' }
      ]
    }
  };

  // 상단바 검색용 종목 데이터 — 종목 보기 목록과 동일하게 유지한다.
  var STOCKS = [
    { code: "005930", name: "삼성전자",         market: "KOSPI",  sector: "반도체",   price: 71800,  change: 1.42,  per: 14.3, pbr: 1.31, logo: "logo-samsung",   mark: "삼" },
    { code: "000660", name: "SK하이닉스",       market: "KOSPI",  sector: "반도체",   price: 198500, change: 2.85,  per: 9.8,  pbr: 1.72, logo: "logo-skhy",      mark: "S" },
    { code: "247540", name: "에코프로비엠",     market: "KOSDAQ", sector: "2차전지",  price: 167200, change: -1.36, per: 48.5, pbr: 5.24, logo: "logo-ecopro",    mark: "에" },
    { code: "373220", name: "LG에너지솔루션",   market: "KOSPI",  sector: "2차전지",  price: 342000, change: -1.87, per: 72.4, pbr: 3.61, logo: "logo-lgenergy",  mark: "L" },
    { code: "035420", name: "NAVER",            market: "KOSPI",  sector: "인터넷",   price: 176300, change: -0.62, per: 18.7, pbr: 1.12, logo: "logo-naver2",    mark: "N" },
    { code: "005380", name: "현대차",           market: "KOSPI",  sector: "자동차",   price: 242000, change: 0.83,  per: 5.4,  pbr: 0.68, logo: "logo-hyundai",   mark: "현" },
    { code: "035720", name: "카카오",           market: "KOSPI",  sector: "인터넷",   price: 42150,  change: -1.04, per: 25.2, pbr: 1.08, logo: "logo-kakao2",    mark: "카" },
    { code: "068270", name: "셀트리온",         market: "KOSPI",  sector: "바이오",   price: 194600, change: -0.28, per: 41.9, pbr: 2.54, logo: "logo-celltrion", mark: "셀" },
    { code: "207940", name: "삼성바이오로직스", market: "KOSPI",  sector: "바이오",   price: 968000, change: 0.37,  per: 62.1, pbr: 6.48, logo: "logo-sambio",    mark: "삼" },
    { code: "105560", name: "KB금융",           market: "KOSPI",  sector: "금융",     price: 87900,  change: 0.11,  per: 6.2,  pbr: 0.59, logo: "logo-kb",        mark: "K" }
  ];

  // 로그인 상태 — 프로토타입이라 localStorage 로만 흉내낸다.
  var AUTH_KEY = "antena.auth";
  function loggedIn() {
    try { return localStorage.getItem(AUTH_KEY) === "1"; } catch (e) { return false; }
  }

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
          '<input type="search" id="topbar-search" autocomplete="off" role="combobox" ' +
            'aria-expanded="false" aria-controls="search-suggest" ' +
            'placeholder="종목명 또는 종목코드를 검색하세요 (예: 삼성전자, 005930)">' +
          '<div class="search-suggest" id="search-suggest" role="listbox" hidden></div>' +
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
          '<a class="avatar" href="' + url("mypage.html") + '" aria-label="내 계정"></a>' +
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
        '<div class="rail-foot">' +
          (loggedIn()
            ? '<a class="rail-me" href="' + url("mypage.html") + '">' +
                '<i class="rail-me-avatar">안</i>' +
                '<span><b>안테나님</b><small>마이페이지</small></span>' +
                '<em aria-hidden="true">›</em>' +
              '</a>' +
              '<button class="rail-logout" id="rail-logout" type="button">로그아웃</button>'
            : '<a class="btn-login" href="' + url("login.html") + '">로그인 / 회원가입</a>') +
        '</div>' +
      '</aside>' +
      '<div class="rail-backdrop" id="rail-backdrop"></div>';
  }

  var body = document.body;
  var mode = MODES[body.dataset.mode] ? body.dataset.mode : 'insight';
  var nav = body.dataset.nav || 'home';

  body.insertAdjacentHTML('afterbegin', topbar(mode) + rail(mode, nav));

  // ── 상단바 종목 검색 → 종목 상세로 이동 ──────────────
  var searchInput = document.getElementById("topbar-search");
  var suggest = document.getElementById("search-suggest");
  var hits = [];
  var cursor = -1;

  function detailUrl(s) {
    var params = new URLSearchParams({
      code: s.code, name: s.name, market: s.market, sector: s.sector,
      price: String(s.price), change: String(s.change),
      per: String(s.per), pbr: String(s.pbr), logo: s.logo, mark: s.mark
    });
    return url("stock-detail.html") + "?" + params.toString();
  }

  function match(q) {
    q = q.trim().toLowerCase().replace(/s+/g, "");
    if (!q) return [];
    return STOCKS.filter(function (s) {
      return s.name.toLowerCase().replace(/s+/g, "").indexOf(q) !== -1 ||
             s.code.indexOf(q) === 0 ||
             s.sector.replace(/s+/g, "").indexOf(q) !== -1;
    }).slice(0, 7);
  }

  function close() {
    suggest.hidden = true;
    suggest.innerHTML = "";
    searchInput.setAttribute("aria-expanded", "false");
    hits = []; cursor = -1;
  }

  function render(q) {
    hits = match(q);
    cursor = -1;
    if (!q.trim()) return close();

    if (!hits.length) {
      suggest.innerHTML = '<p class="sg-empty">일치하는 종목이 없습니다</p>';
    } else {
      suggest.innerHTML = hits.map(function (s, i) {
        var sign = s.change >= 0 ? "+" : "";
        return '<button class="sg-item" type="button" role="option" data-i="' + i + '">' +
            '<i class="sg-logo ' + s.logo + '">' + s.mark + '</i>' +
            '<span class="sg-main"><b>' + s.name + '</b>' +
              '<small>' + s.code + " · " + s.market + " · " + s.sector + '</small></span>' +
            '<span class="sg-price"><b>' + s.price.toLocaleString("ko-KR") + '원</b>' +
              '<small class="' + (s.change >= 0 ? "rise" : "fall") + '">' + sign + s.change.toFixed(2) + '%</small></span>' +
          '</button>';
      }).join("");
      suggest.querySelectorAll(".sg-item").forEach(function (btn) {
        btn.addEventListener("mousedown", function (event) {
          event.preventDefault();
          location.href = detailUrl(hits[Number(btn.dataset.i)]);
        });
      });
    }
    suggest.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function highlight(next) {
    var items = suggest.querySelectorAll(".sg-item");
    if (!items.length) return;
    cursor = (next + items.length) % items.length;
    items.forEach(function (el, i) { el.classList.toggle("on", i === cursor); });
    items[cursor].scrollIntoView({ block: "nearest" });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () { render(searchInput.value); });
    searchInput.addEventListener("focus", function () { if (searchInput.value.trim()) render(searchInput.value); });
    searchInput.addEventListener("blur", function () { setTimeout(close, 120); });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") { event.preventDefault(); highlight(cursor + 1); return; }
      if (event.key === "ArrowUp") { event.preventDefault(); highlight(cursor - 1); return; }
      if (event.key === "Escape") { close(); return; }
      if (event.key === "Enter") {
        event.preventDefault();
        if (!hits.length) hits = match(searchInput.value);
        var pick = hits[cursor >= 0 ? cursor : 0];
        if (pick) location.href = detailUrl(pick);
      }
    });
  }

  var logout = document.getElementById("rail-logout");
  if (logout) {
    logout.addEventListener("click", function () {
      try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
      location.href = url("index.html");
    });
  }

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
