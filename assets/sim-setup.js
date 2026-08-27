/* 모의 투자 준비 — 조건 선택과 파생 값 계산.
   종목 보기에서 ?code=&name=&price= 로 넘어오면 종목 카드를 그 종목으로 채운다. */
(function () {
  var q = new URLSearchParams(location.search);
  var won = function (n) { return Math.round(n).toLocaleString('ko-KR'); };
  var set = function (id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };

  var days = 20;
  var speed = 1;

  // ── 넘어온 종목으로 교체
  if (q.get('code')) {
    var name = q.get('name') || '';
    var price = Number(q.get('price') || 0);
    set('ss-mark', q.get('mark') || name.slice(0, 1));
    set('ss-name', name);
    set('ss-code', q.get('code'));
    if (q.get('market')) set('ss-market', q.get('market'));
    if (price) {
      set('ss-close', won(price));
      set('ss-target', won(price * 1.2));   // 참고 목표가 = 직전 종가 +20%
    }
    document.title = name + ' 모의 투자 준비 · ANTENA';
  }

  // ── 종료 예정 = 시작일 + (영업일 ÷ 5 × 7)일
  var startInput = document.getElementById('ss-start-date');
  function updateEnd() {
    if (!startInput.value) return;
    var parts = startInput.value.split('-').map(Number);
    var end = new Date(parts[0], parts[1] - 1, parts[2]);
    end.setDate(end.getDate() + days / 5 * 7);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    set('ss-end', end.getFullYear() + '.' + pad(end.getMonth() + 1) + '.' + pad(end.getDate()));
  }

  // ── 예상 소요 시간 = 영업일 × 0.6분 ÷ 배속
  function updateEta() {
    set('ss-eta', String(Math.max(1, Math.round(days * 0.6 / speed))));
  }

  startInput.addEventListener('change', updateEnd);

  document.querySelectorAll('[data-days]').forEach(function (button) {
    button.addEventListener('click', function () {
      days = Number(button.dataset.days);
      document.querySelectorAll('[data-days]').forEach(function (b) { b.classList.toggle('on', b === button); });
      updateEnd();
      updateEta();
    });
  });

  document.querySelectorAll('[data-speed]').forEach(function (button) {
    button.addEventListener('click', function () {
      speed = Number(button.dataset.speed);
      document.querySelectorAll('[data-speed]').forEach(function (b) { b.classList.toggle('on', b === button); });
      updateEta();
    });
  });

  // ── 게임 모드 (단일 선택)
  var hint = document.getElementById('ss-hint');
  document.querySelectorAll('[data-mode]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-mode]').forEach(function (b) {
        var on = b === button;
        b.setAttribute('aria-pressed', String(on));
        b.querySelector('.ss-pick').textContent = on ? '선택됨' : '선택';
      });
      // 대회 모드는 정의상 AI 힌트를 쓰지 않는다
      if (button.dataset.mode === 'contest') setHint(false);
    });
  });

  // ── AI 힌트
  function setHint(on) {
    hint.setAttribute('aria-pressed', String(on));
  }
  hint.addEventListener('click', function () {
    setHint(hint.getAttribute('aria-pressed') !== 'true');
  });

  // ── 초기 자본
  var capital = document.getElementById('ss-capital');
  var out = document.getElementById('ss-capital-out');
  function updateCapital() {
    var min = Number(capital.min), max = Number(capital.max), value = Number(capital.value);
    capital.style.setProperty('--fill', ((value - min) / (max - min) * 100) + '%');
    out.innerHTML = won(value) + '<span>원</span>';
  }
  capital.addEventListener('input', updateCapital);

  // ── 시작 시 선택한 조건을 진행 화면으로 넘긴다
  document.getElementById('ss-start').addEventListener('click', function (event) {
    var selected = document.querySelector('[data-mode][aria-pressed="true"]');
    var params = new URLSearchParams({
      code: q.get('code') || '005930',
      name: q.get('name') || document.getElementById('ss-name').textContent,
      days: String(days),
      start: startInput.value,
      mode: selected ? selected.dataset.mode : 'learn',
      capital: capital.value,
      hint: hint.getAttribute('aria-pressed'),
      speed: String(speed)
    });
    event.currentTarget.href = 'sim-play.html?' + params.toString();
  });

  updateEnd();
  updateEta();
  updateCapital();
})();
