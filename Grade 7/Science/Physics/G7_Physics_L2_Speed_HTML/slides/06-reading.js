/* Practice — slide 15-18 PPTX: đoạn đọc (P. 24) + 3 câu hỏi a/b/c gộp 1 slide.
   Show answer tô sáng đúng câu bằng chứng mà PPTX khoanh khung đỏ.
   Câu c: PPTX phát âm "đúng" cho A (3s) và B (4s), nhưng đoạn văn nói "at least three to four seconds
   ... in normal conditions, and even more in bad weather" -> dựng theo nội dung đoạn văn (C/D),
   đã báo giáo viên trong bàn giao. */
Engine.register({
  id: 'reading',
  section: 'Practice',
  title: 'Reading: keep a safe distance',
  mech: 'reading',

  render(root, ctx) {
    const P = [
      ['', 'Traffic situations are very complicated these days, so we need to follow traffic safety regulations, especially safe distance and speed limit. To do this, we should notice signs on the roads and drive our vehicles at the speed lower than the speed limit in that region. '],
      ['a', 'For example, people should remember the “3-second rule” when driving on highways: safe distance (m) = speed (m/s) x 3 (s).'],
      ['', ' Keeping a safe distance from the vehicles ahead gives drivers time to react when those vehicles have any trouble. '],
      ['c', 'We should keep at least three to four seconds of distance in normal conditions, and even more in bad weather or heavy traffic.'],
      ['', ' '],
      ['b', 'Doing this keeps drivers safe because they can avoid hitting other vehicles. Also, it helps traffic flow better and lowers the risk of many accidents at the same time.']
    ];
    const Q = [
      { id: 'a', q: 'What simple rule helps us keep a safe distance?', multi: false,
        opts: ['A. 2-second rule', 'B. 3-second rule', 'C. 4-second rule'], ok: [1], cols: 1 },
      { id: 'b', q: 'Why is it important to keep a safe distance?', tag: 'Choose more than one', multi: true,
        opts: ['A. Not to hit the cars in front', 'B. Help traffic flow better', 'C. Increase the number of accidents.'], ok: [0, 1], cols: 1 },
      { id: 'c', q: 'In bad weather, the safe distance from other vehicles should be:', multi: false,
        opts: ['A. 3 seconds', 'B. 4 seconds', 'C. 5 seconds', 'D. 6 seconds'], ok: [2, 3], cols: 2 }
    ];
    const pick = { a: new Set(), b: new Set(), c: new Set() };
    let cur = 0;
    const evs = {};

    root.appendChild(h('div', { class: 'pill fixed', text: 'Read and answer' }));

    const split = h('div', { class: 'readwrap stagger' });

    /* cột trái: đoạn văn */
    const left = h('div', { class: 'card' });
    const para = h('p', { class: 'passage' });
    P.forEach(([key, s]) => {
      if (!key) para.appendChild(document.createTextNode(s));
      else { const sp = h('span', { class: 'ev', text: s }); evs[key] = sp; para.appendChild(sp); }
    });
    const full = P.map(x => x[1]).join('');
    const bTimer = h('button', { class: 'btn', text: '⏱ 60s' });
    ctx.on(bTimer, 'click', () => Engine.timer(60));
    const bListen = ctx.speakBtn(full, ' Listen');
    const pbtns = h('div', { class: 'btnrow' }, [bListen, bTimer]);
    const ptitle = h('div', { class: 'ptitle' }, [h('span', { class: 'src', text: '(P. 24) Read the paragraph and answer the questions below.' }), pbtns]);
    left.append(ptitle, para);

    /* cột phải: câu hỏi theo tab */
    const right = h('div', { class: 'qpanel' });
    const tabs = h('div', { class: 'qtabs' });
    const qbox = h('div', { class: 'qtext' });
    const grid = h('div', { class: 'optgrid', style: 'width:100%' });
    right.append(h('div', { class: 'qhead' }, [tabs, qbox]), grid);

    const tabEls = Q.map((q, i) => {
      const t = h('button', { class: 'qtab', text: q.id + '.' });
      ctx.on(t, 'click', () => { cur = i; draw(); });
      tabs.appendChild(t);
      return t;
    });

    const draw = () => {
      const q = Q[cur];
      tabEls.forEach((t, i) => {
        t.classList.toggle('cur', i === cur);
        t.classList.toggle('answered', pick[Q[i].id].size > 0);
      });
      qbox.innerHTML = '';
      qbox.append(document.createTextNode(q.id + '. ' + q.q));
      if (q.tag) qbox.append(h('span', { class: 'tag', text: q.tag }));
      grid.innerHTML = '';
      grid.style.gridTemplateColumns = 'repeat(' + q.opts.length + ',minmax(0,1fr))';
      q.opts.forEach((o, j) => {
        const b = h('button', { class: 'opt small' + (pick[q.id].has(j) ? ' picked' : ''), text: o });
        if (q._mark && q._mark[j] != null) ctx.markResult(b, q._mark[j], { shake: false });
        ctx.on(b, 'click', () => {
          q._mark = null;
          const s = pick[q.id];
          if (q.multi) { s.has(j) ? s.delete(j) : s.add(j); }
          else { s.clear(); s.add(j); }
          Sound.playEffect('click');
          draw();
        });
        grid.appendChild(b);
      });
    };

    root.appendChild(split);
    /* màn dọc: đoạn văn + câu hỏi không vừa 1 màn -> gắn 1 trong 2 khối + nút chuyển, KHÔNG cuộn.
       Gắn/gỡ khỏi DOM (không ẩn bằng CSS) để không còn phần tử kích thước 0. */
    const bText = h('button', { class: 'btn', text: '📖 Text' });
    const bQ = h('button', { class: 'btn', text: '❓ Questions' });
    const toggleRow = h('div', { class: 'btnrow fixed' }, [bText, bQ]);
    let showQ = false;
    const mq = window.matchMedia ? window.matchMedia('(max-aspect-ratio: 1/1)') : null;
    const layout = () => {
      const portrait = !!(mq && mq.matches);
      split.innerHTML = '';
      if (!portrait) {
        if (!ptitle.parentNode) left.prepend(ptitle);
        pbtns.append(bListen, bTimer);
        split.append(left, right); toggleRow.remove(); return;
      }
      ptitle.remove();                       // màn dọc: bỏ dòng tiêu đề phụ, dồn nút lên hàng chuyển
      toggleRow.append(bListen, bTimer);
      split.appendChild(showQ ? right : left);
      bText.classList.toggle('btn-primary', !showQ); bQ.classList.toggle('btn-primary', showQ);
      if (!toggleRow.parentNode) root.insertBefore(toggleRow, split.nextSibling);
    };
    ctx.on(bText, 'click', () => { showQ = false; layout(); });
    ctx.on(bQ, 'click', () => { showQ = true; layout(); });
    if (mq) ctx.on(mq, 'change', layout);

    const judge = (q) => {
      const s = pick[q.id];
      if (q.multi) return s.size === q.ok.length && q.ok.every(x => s.has(x));
      return s.size === 1 && q.ok.indexOf([...s][0]) >= 0;
    };

    root.appendChild(ctx.buttons({
      check: () => {
        let c = 0;
        Q.forEach((q, i) => {
          const ok = judge(q);
          if (ok) c++;
          q._mark = {};
          pick[q.id].forEach(j => { q._mark[j] = q.ok.indexOf(j) >= 0; });
          ctx.markResult(tabEls[i], ok, { shake: !ok });
        });
        draw();
        return { correct: c, total: Q.length };
      },
      show: () => {
        Q.forEach((q, i) => {
          pick[q.id] = new Set(q.ok);
          q._mark = {}; q.ok.forEach(j => { q._mark[j] = true; });
          ctx.clearResult(tabEls[i]);
          evs[q.id].classList.add('on');
        });
        draw();
      },
      reset: () => {
        Q.forEach((q, i) => { pick[q.id] = new Set(); q._mark = null; ctx.clearResult(tabEls[i]); evs[q.id].classList.remove('on'); });
        cur = 0; draw();
      }
    }));
    layout();
    draw();
  }
});
