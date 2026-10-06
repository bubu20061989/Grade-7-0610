/* Practice — slide 19 PPTX: (P. 25) nghe hội thoại (media1.mp3, 1:04) + phiếu image17.
   Đáp án = 3 vòng tròn đỏ trong PPTX: a-B, b-A, c-C. */
Engine.register({
  id: 'listening',
  section: 'Practice',
  title: 'Listening: the experiment',
  mech: 'listen',

  render(root, ctx) {
    const KEY = { a: 'B', b: 'A', c: 'C' };
    const pick = { a: null, b: null, c: null };

    root.appendChild(h('div', { class: 'pill fixed', text: 'Listen and choose' }));
    root.appendChild(h('div', { class: 'note fixed', text: '(P. 25) Listen to the conversation and choose the correct answer' }));

    /* trình phát audio tuỳ chỉnh — thẻ <audio> của chính bài, Sound.stopAll() tự dừng khi chuyển slide */
    const au = h('audio', { src: 'assets/audio/media1.mp3', preload: 'auto' });
    this._au = au;   // không gắn vào DOM (qa coi là phần tử ẩn) -> tự dừng ở destroy()
    const bPlay = h('button', { class: 'btn btn-primary', text: '▶ Play' });
    const bBack = h('button', { class: 'btn', text: '⏪ 5s' });
    const fill = h('i', {});
    const bar = h('div', { class: 'bar', title: 'Tap to jump' }, [fill]);
    const time = h('span', { class: 'time', text: '0:00 / 1:04' });
    const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    const paint = () => {
      const d = au.duration || 64.4;
      fill.style.transform = 'scaleX(' + Math.min(1, (au.currentTime || 0) / d) + ')';
      time.textContent = fmt(au.currentTime) + ' / ' + fmt(d);
    };
    const setLabel = () => {
      bPlay.textContent = '';
      if (au.paused) bPlay.append(Lab.icon('play'), document.createTextNode('Play'));
      else bPlay.textContent = '⏸ Pause';
    };
    ctx.on(bPlay, 'click', () => {
      if (au.paused) { const p = au.play(); if (p && p.catch) p.catch(e => { console.warn('[audio]', e); Engine.toast('Audio could not play on this device'); }); }
      else au.pause();
    });
    ctx.on(bBack, 'click', () => { au.currentTime = Math.max(0, au.currentTime - 5); paint(); });
    ctx.on(bar, 'pointerup', e => {
      const r = bar.getBoundingClientRect();
      if (au.duration) { au.currentTime = au.duration * Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); paint(); }
    });
    ['play', 'pause', 'ended'].forEach(ev => ctx.on(au, ev, setLabel));
    ['timeupdate', 'loadedmetadata'].forEach(ev => ctx.on(au, ev, paint));
    const player = h('div', { class: 'player fixed' }, [bPlay, bBack, bar, time]);
    root.appendChild(player);

    const grow = h('div', { class: 'grow center-col stagger' });
    const sheet = h('div', { class: 'card fill-w grow', style: 'display:flex;align-items:center;justify-content:center;padding:clamp(6px,1vh,12px)' }, [
      ctx.img('assets/img/image17.png', { alt: 'Listening worksheet: distance–time table, graph and questions a, b, c', class: 'hero-img' })
    ]);
    grow.appendChild(sheet);
    root.appendChild(grow);

    const row = h('div', { class: 'lqrow fixed' });
    const btns = {};
    ['a', 'b', 'c'].forEach(q => {
      const g = h('div', { class: 'lqgroup' }, [h('span', { class: 'lbl', text: q + '.' })]);
      btns[q] = {};
      ['A', 'B', 'C'].forEach(L => {
        const b = h('button', { class: 'letter', text: L, 'aria-label': 'Question ' + q + ' option ' + L });
        ctx.on(b, 'click', () => {
          pick[q] = L;
          Object.values(btns[q]).forEach(x => { x.classList.remove('picked'); ctx.clearResult(x); });
          b.classList.add('picked');
          Sound.playEffect('click');
        });
        btns[q][L] = b; g.appendChild(b);
      });
      row.appendChild(g);
    });
    root.appendChild(row);

    root.appendChild(ctx.buttons({
      check: () => {
        let c = 0;
        Object.keys(KEY).forEach(q => {
          const ok = pick[q] === KEY[q];
          if (ok) c++;
          if (pick[q]) ctx.markResult(btns[q][pick[q]], ok);
          else ctx.markResult(btns[q].A.parentNode, false);
        });
        return { correct: c, total: 3 };
      },
      show: () => {
        Object.keys(KEY).forEach(q => {
          ctx.clearResult(btns[q].A.parentNode);
          Object.values(btns[q]).forEach(x => { x.classList.remove('picked'); ctx.clearResult(x); });
          btns[q][KEY[q]].classList.add('picked');
          ctx.markResult(btns[q][KEY[q]], true);
          pick[q] = KEY[q];
        });
      },
      reset: () => {
        Object.keys(KEY).forEach(q => {
          pick[q] = null;
          ctx.clearResult(btns[q].A.parentNode);
          Object.values(btns[q]).forEach(x => { x.classList.remove('picked'); ctx.clearResult(x); });
        });
        au.pause(); au.currentTime = 0; paint();
      }
    }));
    setLabel();
  },

  destroy() {
    if (this._au) { try { this._au.pause(); this._au.removeAttribute('src'); this._au.load(); } catch (e) {} this._au = null; }
  }
});
