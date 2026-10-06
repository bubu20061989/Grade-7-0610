(function (global) {
  'use strict';
  if (global.Lab) return;
  var NS = 'http://www.w3.org/2000/svg';
  var Lab = {};
  global.Lab = Lab;

  function sv(tag, attrs, kids) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  Lab.sv = sv;
  function dv(cls, txt) { var d = document.createElement('div'); if (cls) d.className = cls; if (txt != null) d.textContent = txt; return d; }
  Lab.dv = dv;

  /* ===== 1. TẦNG NỀN THEO PHẦN HỌC (nằm ngoài .slide) ===== */
  /* Mỗi SECTION tự nhận 1 bảng màu theo thứ tự xuất hiện -> đổi bài không phải sửa gì.
     Chỉ định tay: Lab.PAL = { 'Tên section': ['#..','#..','#..'] }. */
  var POOL = [
    ['#5EEAD4', '#93C5FD', '#A7F3D0'],
    ['#7DD3FC', '#BAE6FD', '#5EEAD4'],
    ['#34D399', '#A3E635', '#A7F3D0'],
    ['#2DD4BF', '#34D399', '#93C5FD'],
    ['#A5B4FC', '#93C5FD', '#C7D2FE'],
    ['#FCD34D', '#A3E635', '#FDE68A']
  ];
  var palMap = null;
  function palFor(key) {
    if (!palMap) {
      palMap = {};
      var seen = [];
      Engine.slides.forEach(function (s) { var k = s.section || '-'; if (seen.indexOf(k) < 0) seen.push(k); });
      seen.forEach(function (k, i) { palMap[k] = POOL[i % POOL.length]; });
    }
    return (Lab.PAL && Lab.PAL[key]) || palMap[key] || POOL[0];
  }
  function rgba(hex, a) {
    var h = hex.replace('#', '');
    return 'rgba(' + parseInt(h.slice(0,2),16) + ',' + parseInt(h.slice(2,4),16) + ',' + parseInt(h.slice(4,6),16) + ',' + a + ')';
  }

  /* Khung gần trung tính, màu CHỈ ở 2 góc, giữa màn hình sạch tuyệt đối:
     không có gì nằm sau vùng chữ -> mắt không bị nhiễu. */
  function sceneD(c) {
    var sc = dv('scene');
    sc.style.background = 'linear-gradient(180deg,#FFFFFF 0%,#F7FBF9 56%,#EEF6F2 100%)';
    var tr = dv('deco');
    tr.style.right = '-16vw'; tr.style.top = '-34vh'; tr.style.width = '62vw'; tr.style.height = '62vw';
    tr.style.borderRadius = '50%'; tr.style.opacity = '1';
    tr.style.background = 'radial-gradient(circle at 50% 50%,' + rgba(c[0], .26) + ' 0%,' + rgba(c[0], 0) + ' 66%)';
    sc.appendChild(tr);
    var bl = dv('deco');
    bl.style.left = '-20vw'; bl.style.bottom = '-32vh'; bl.style.width = '56vw'; bl.style.height = '56vw';
    bl.style.borderRadius = '50%'; bl.style.opacity = '1';
    bl.style.background = 'radial-gradient(circle at 50% 50%,' + rgba(c[2], .22) + ' 0%,' + rgba(c[2], 0) + ' 66%)';
    sc.appendChild(bl);
    return sc;
  }

  /* NỀN MINH HOẠ GỐC CỦA PPTX — hoạ tiết vật lý (bóng đèn, nam châm, tia sét, máy bay giấy, mũi tên)
     tách nguyên từ slide layout của file .pptx (đã bỏ chữ/ảnh nội dung), giữ đúng tinh thần bài gốc.
     Hoạ tiết nằm sát 4 mép, giữa màn hình sạch (luật 14). Khoá cảnh: def.bg || def.section. */
  Lab.BGIMG = {
    'Start': 'assets/img/bg-title.jpg',
    'Lead-in': 'assets/img/bg-leadin.jpg',
    'New vocabulary': 'assets/img/bg-vocab.jpg',
    'road': 'assets/img/bg-road.jpg',
    'Practice': 'assets/img/bg-practice.jpg',
    'Produce': 'assets/img/bg-produce.jpg',
    'Consolidation': 'assets/img/bg-consol.jpg',
    'thanks': 'assets/img/bg-thanks.jpg'
  };
  function scenePlate(c, key) {
    var src = Lab.BGIMG[key];
    if (!src) return sceneD(c);
    var sc = dv('scene');
    sc.style.background = '#E3F6FB url("' + src + '") center / cover no-repeat';
    /* ảnh đường cao tốc phủ cả màn -> phủ 1 lớp sương trắng ở giữa để chữ không bị nhiễu */
    if (key === 'road') {
      var veil = dv('deco');
      veil.style.inset = '0';
      veil.style.background = 'radial-gradient(ellipse 62% 58% at 50% 52%, rgba(255,255,255,.62) 0%, rgba(255,255,255,.28) 70%, rgba(255,255,255,0) 100%)';
      sc.appendChild(veil);
    }
    /* 1 máy bay giấy trôi chậm ở mép trên (chu kỳ 28s, chỉ transform) — nền "sống" mà không hút mắt */
    var plane = document.createElement('img');
    plane.src = 'assets/img/image30.png'; plane.alt = '';
    plane.className = 'deco drift';
    plane.style.left = '40vw'; plane.style.top = '1.5vh'; plane.style.width = '7vw'; plane.style.opacity = '.55';
    sc.appendChild(plane);
    return sc;
  }

  var STYLES = { D: sceneD, P: scenePlate };
  Lab.bgStyle = 'P';
  function buildScene(key) { return (STYLES[Lab.bgStyle] || sceneD)(palFor(key), key); }

  var bgHost = null, curScene = null, curKey = null;
  function applyScene() {
    if (!bgHost) {
      bgHost = document.getElementById('bgLayer');
      if (!bgHost) { bgHost = dv(''); bgHost.id = 'bgLayer'; document.body.insertBefore(bgHost, document.body.firstChild); }
    }
    var def = Engine.slides[Engine.idx];
    var key = (def && (def.bg || def.section)) || '-';
    if (key === curKey && !Lab.__force) return;
    Lab.__force = false;
    curKey = key;
    var next = buildScene(key);
    bgHost.appendChild(next);
    void next.offsetWidth;
    next.classList.add('on');
    var old = curScene;
    curScene = next;
    if (old) setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 700);
  }

  /* ===== 2. fitStage() — lưới an toàn chống vỡ =====
     Dùng biến CSS, KHÔNG transform:scale() lên .slide: tổ tiên có transform
     sẽ phá position:fixed của #dragLayer. */
  var fitRaf = 0, fitTries = 0;
  function curSlide() { return document.querySelector('.stage > .slide'); }
  function minFit() {
    var fs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs-scale')) || 1;
    return Math.min(1, 0.72 / fs);
  }
  /* Sàn CHÍNH XÁC cho từng slide: đo cỡ chữ NHỎ NHẤT đang hiện ở --fit = 1, rồi cho co
     đúng tới lúc cỡ đó chạm ngưỡng đọc được từ cuối lớp (1/40 chiều cao màn hình, tối
     thiểu 22px). Bỏ qua chữ trong <svg> vì nó co theo khung hình, không theo --fit. */
  function textFloor(slide) {
    var th = Math.max(22, global.innerHeight / 40);
    var min = Infinity;
    var nodes = slide.querySelectorAll('*');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.ownerSVGElement || n.tagName.toLowerCase() === 'svg') continue;
      var hasText = false;
      for (var c = n.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3 && c.nodeValue.trim()) { hasText = true; break; }
      }
      if (!hasText) continue;
      var r = n.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      var fsz = parseFloat(getComputedStyle(n).fontSize);
      if (fsz && fsz < min) min = fsz;
    }
    if (!isFinite(min) || !th) return 0.45;
    /* co hệ số f => chữ nhỏ nhất thành min*f; cần min*f >= th => f >= th/min */
    return Math.max(0.45, Math.min(1, (th * 1.06) / min));   // +6% biên an toàn
  }
  function fitNow() {
    fitRaf = 0;
    var slide = curSlide();
    if (!slide) return;
    var lo = slide.__floor != null ? slide.__floor : minFit();
    var cur = parseFloat(slide.style.getPropertyValue('--fit'));
    if (!(cur > 0)) cur = 1;
    var guard = 0;
    /* Vòng lặp ĐỒNG BỘ: đọc scrollHeight ép trình duyệt tính lại layout ngay, nên slide
       vừa vào là đã vừa khung — không nhấp nháy 1-2 khung hình. */
    while (slide.scrollHeight > slide.clientHeight + 1 && cur > lo + 0.001 && guard++ < 16) {
      cur = Math.max(lo, cur - 0.05);
      slide.style.setProperty('--fit', cur.toFixed(3));
    }
    fitTries = guard;
  }
  function scheduleFit() {
    if (fitRaf) return;
    fitRaf = global.requestAnimationFrame ? requestAnimationFrame(fitNow) : setTimeout(fitNow, 16);
  }
  function resetFit() {
    var slide = curSlide();
    if (slide) {
      slide.style.setProperty('--fit', '1');
      slide.__floor = textFloor(slide);
    }
    fitTries = 0;
    fitNow();
    scheduleFit();
  }
  Lab.setBgStyle = function (k) { Lab.bgStyle = k; Lab.__force = true; applyScene(); };
  Lab.fit = scheduleFit;
  Lab.refit = resetFit;

  Lab.goTo = function (id) {
    var i = Engine.slides.findIndex(function (s) { return s.id === id; });
    if (i >= 0) Engine.go(i, 'jump');
  };

  /* ===== 3. NÚT LỚP HỌC: Tập trung / Giảm chuyển động ===== */
  function addNavButtons() {
    var nav = document.querySelector('.navbar');
    if (!nav || nav.querySelector('#focusBtn')) return;
    var anchor = nav.querySelector('#fullscreenBtn') || nav.querySelector('#tlockBtn');
    var mk = function (id, icon, title, cls) {
      var b = document.createElement('button');
      b.className = 'iconbtn'; b.id = id; b.textContent = icon; b.title = title;
      b.addEventListener('click', function () {
        var on = document.body.classList.toggle(cls);
        b.classList.toggle('on', on);
        try { sessionStorage.setItem('pref:' + cls, on ? '1' : '0'); } catch (e) { }
        Engine.toast(title + (on ? ' — ON' : ' — OFF'));
        resetFit();
      });
      try { if (sessionStorage.getItem('pref:' + cls) === '1') { document.body.classList.add(cls); b.classList.add('on'); } } catch (e) { }
      if (anchor) nav.insertBefore(b, anchor); else nav.appendChild(b);
      return b;
    };
    mk('focusBtn', '🎯', 'Focus mode', 'focus');
    mk('motionBtn', '🌀', 'Reduce motion', 'nomotion');
  }

  /* ===== 4. NỐI VÀO ENGINE ===== */
  var origGo = Engine.go;
  Engine.go = function (i, dir) {
    origGo.call(Engine, i, dir);
    applyScene();
    resetFit();
    setTimeout(scheduleFit, 140);
    setTimeout(scheduleFit, 620);
  };
  var origFs = Engine._applyFontScale;
  Engine._applyFontScale = function (v) { origFs.call(Engine, v); resetFit(); };

  var origStart = Engine.start;
  Engine.start = function (cfg) {
    origStart.call(Engine, cfg);
    applyScene();
    addNavButtons();
    resetFit();
    var stage = document.querySelector('.stage');
    if (stage) {
      if (global.ResizeObserver) new ResizeObserver(resetFit).observe(stage);
      else global.addEventListener('resize', resetFit);
      new MutationObserver(scheduleFit).observe(stage, { childList: true, subtree: true, characterData: true });
      stage.addEventListener('load', scheduleFit, true);   // ảnh tải xong -> đo lại
    }
    global.addEventListener('resize', resetFit);
    document.addEventListener('fullscreenchange', resetFit);
  };

  /* ===== 5. LỚP THẨM MỸ: icon SVG, thanh công cụ gọn, nhãn phần =====
     Chạy SAU engine dựng navbar, không sửa engine.js. Tắt từng phần nếu cần:
     Lab.tidyNav = false · Lab.svgIcons = false · Lab.autoEyebrow = false (đặt trong slide đầu). */
  var IC = {
    prev: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    shrink: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2"/><circle cx="12" cy="12" r="7"/>',
    check: '<path d="M4.5 12.5l4.8 4.8L19.5 7"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
    sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M9.5 2.5h5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    star: '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/>',
    undo: '<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>'
  };
  /* Icon vẽ bằng CSS mask (thẻ <i>), KHÔNG chèn <svg> vào DOM: qa.py mục 5 coi mọi <svg> là
     widget và báo "QUÁ NHỎ" oan cho icon trong nút. Màu icon = currentColor của nút. */
  Lab.icon = function (name) {
    var i = document.createElement('i');
    i.className = 'ic'; i.setAttribute('aria-hidden', 'true');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + (IC[name] || '') + '</svg>';
    var url = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
    i.style.webkitMaskImage = url; i.style.maskImage = url;
    return i;
  };
  function setIcon(btn, name) { if (!btn) return; btn.textContent = ''; btn.appendChild(Lab.icon(name)); }

  /* Emoji đầu nhãn nút -> icon SVG cùng nghĩa. Emoji không có trong bảng thì để nguyên. */
  var LEAD = [
    [/^\s*(✅|✔️?)\s*/, 'check'], [/^\s*👁️?\s*/, 'eye'], [/^\s*(↺|🔄)\s*/, 'reset'],
    [/^\s*(🔊|🔈)\s*/, 'sound'], [/^\s*(⏱️?)\s*/, 'timer'], [/^\s*(▶️?)\s*/, 'play'], [/^\s*(↩️?)\s*/, 'undo']
  ];
  function iconizeButtons(scope) {
    if (Lab.svgIcons === false || !scope) return;
    scope.querySelectorAll('.btn').forEach(function (b) {
      if (b.querySelector('.ic') || b.children.length) return;
      var t = b.textContent;
      for (var i = 0; i < LEAD.length; i++) {
        if (LEAD[i][0].test(t)) { b.textContent = t.replace(LEAD[i][0], ''); b.insertBefore(Lab.icon(LEAD[i][1]), b.firstChild); return; }
      }
    });
  }
  Lab.iconize = iconizeButtons;

  function tidyNav() {
    if (Lab.tidyNav === false) return;
    var nav = document.querySelector('.navbar');
    if (!nav || nav.querySelector('#tdrawerBtn')) return;
    var byTitle = function (p) { var r = null; nav.querySelectorAll('.iconbtn').forEach(function (b) { if (!r && (b.title || '').indexOf(p) === 0) r = b; }); return r; };
    var prev = byTitle('Previous'), next = byTitle('Next'), full = nav.querySelector('#fullscreenBtn');
    var drawer = dv(''); drawer.id = 'tdrawer';
    var row = function (label, els) {
      els = els.filter(Boolean); if (!els.length) return;
      var r = dv('row'); r.appendChild(dv('lbl', label)); els.forEach(function (e) { r.appendChild(e); }); drawer.appendChild(r);
    };
    row('Text size', [nav.querySelector('.fs-group')]);
    row('Sound', [byTitle('Mute'), nav.querySelector('#voiceBtn')]);
    row('Teams', [nav.querySelector('.teams')]);
    row('Class tools', [byTitle('Timer'), byTitle('Spotlight'), byTitle('Slides')]);
    row('Display', [nav.querySelector('#focusBtn'), nav.querySelector('#motionBtn')]);
    row('Lock', [nav.querySelector('#tlockBtn')]);
    document.body.appendChild(drawer);

    var tb = document.createElement('button');
    tb.id = 'tdrawerBtn'; tb.className = 'iconbtn tbtn'; tb.title = 'Teacher tools';
    tb.appendChild(Lab.icon('gear')); tb.appendChild(document.createTextNode('Teacher'));
    tb.addEventListener('click', function (e) { e.stopPropagation(); drawer.classList.toggle('on'); });
    document.addEventListener('pointerdown', function (e) {
      if (drawer.classList.contains('on') && !drawer.contains(e.target) && !tb.contains(e.target)) drawer.classList.remove('on');
    });
    var anchor = full || prev;
    if (anchor) nav.insertBefore(tb, anchor); else nav.appendChild(tb);

    if (Lab.svgIcons !== false) {
      if (prev) { setIcon(prev, 'prev'); prev.classList.add('nav-arrow'); }
      if (next) { setIcon(next, 'next'); next.classList.add('nav-arrow'); }
      if (full) {
        var sync = function () { setIcon(full, document.fullscreenElement ? 'shrink' : 'expand'); };
        sync(); document.addEventListener('fullscreenchange', function () { setTimeout(sync, 0); });
      }
    }
  }

  /* Nhãn phần (section) nhỏ phía trên tiêu đề — người xem luôn biết đang ở phần nào của bài */
  function addEyebrow() {
    if (Lab.autoEyebrow === false) return;
    var slide = curSlide(); var def = Engine.slides[Engine.idx];
    if (!slide || !def || !def.section || slide.querySelector('.eyebrow, .cover')) return;
    var pill = slide.querySelector(':scope > .pill');
    if (!pill || pill.textContent.toLowerCase().indexOf(def.section.toLowerCase()) >= 0) return;
    var eb = dv('eyebrow fixed', def.section);
    slide.insertBefore(eb, pill);
    /* Nhãn phần là trang trí: slide chật (font 150%, màn dọc) thì bỏ nhãn TRƯỚC khi fitStage phải co chữ */
    var f0 = slide.style.getPropertyValue('--fit');
    slide.style.setProperty('--fit', '1');
    var tight = slide.scrollHeight > slide.clientHeight + 1;
    if (f0) slide.style.setProperty('--fit', f0);
    if (tight || global.innerHeight < 560) eb.remove();
    resetFit();
  }

  var goAes = Engine.go;
  Engine.go = function (i, dir) {
    goAes.call(Engine, i, dir);
    addEyebrow();
    iconizeButtons(document.querySelector('.stage'));
  };
  var startAes = Engine.start;
  Engine.start = function (cfg) {
    startAes.call(Engine, cfg);
    tidyNav();
    addEyebrow();
    iconizeButtons(document.querySelector('.stage'));
    var st = document.querySelector('.stage');
    if (st) new MutationObserver(function () { iconizeButtons(st); }).observe(st, { childList: true, subtree: true });
  };
})(window);
