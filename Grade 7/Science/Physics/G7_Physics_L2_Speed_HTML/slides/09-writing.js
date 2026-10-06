/* Produce · Homework — slide 21 PPTX: (P. 25) viết đoạn 50-60 từ. Phiếu image19 dựng lại thành
   3 câu gợi ý (bấm nghe / đánh dấu đã nghĩ ý) + giấy kẻ dòng xanh viết tay bằng bút trên bảng. */
Engine.register({
  id: 'writing',
  section: 'Produce',
  title: 'Writing: traffic safety tips',
  mech: 'write',

  render(root, ctx) {
    const QS = [
      'Why should you follow traffic safety?',
      'What should you ride and wear when participating in traffic?',
      'How can you keep safe on the road?'
    ];
    const pill = h('div', { class: 'pill fixed' });
    pill.innerHTML = 'Writing <span class="tag" style="margin-left:.4em">Homework</span>';
    root.appendChild(pill);
    root.appendChild(h('div', { class: 'note fixed', text: '(P. 25) Write a short paragraph (50-60 words) to guide 7th grade students on traffic safety.' }));

    const row = h('div', { class: 'rowwrap wrow stagger' });
    const left = h('div', { class: 'colhalf wl' });
    const list = h('div', { class: 'qlist' });
    QS.forEach(q => {
      const it = h('button', { class: 'qitem' }, [h('i', { class: 'ck', text: '✓' }), h('span', { text: q })]);
      ctx.on(it, 'click', () => { it.classList.toggle('done'); Sound.speak(q); });
      list.appendChild(it);
    });
    left.appendChild(list);
    left.appendChild(h('div', { class: 'note', text: 'Useful words — tap to hear' }));
    const bank = h('div', { class: 'wordbank' });
    ['limited speed', 'traffic safety', 'safe distance'].forEach(w => {
      const c = h('span', { class: 'chip', text: w });
      ctx.on(c, 'click', () => Sound.speak(w));
      bank.appendChild(c);
    });
    left.appendChild(bank);

    const right = h('div', { class: 'colhalf wr' });
    const area = h('div', { class: 'workarea lined' });
    const cv = ctx.canvas({ color: '#1E3A8A', width: 6 });
    area.appendChild(h('div', { class: 'drawwrap' }, [cv]));
    const fitLines = () => { const r = area.getBoundingClientRect(); area.style.setProperty('--lh', Math.max(48, Math.round((r.height - 24) / 6)) + 'px'); };
    ctx.observe(area, fitLines);

    const pens = h('div', { class: 'pens' });
    const P = [['Blue', '#1E3A8A'], ['Red', '#DC2626'], ['Black', '#111827']];
    const penEls = P.map(([n, c], k) => {
      const b = h('button', { class: 'pen' + (k === 0 ? ' on' : ''), style: '--pc:' + c, text: '✎ ' + n });
      ctx.on(b, 'click', () => { cv.__color = c; penEls.forEach(x => x.classList.toggle('on', x === b)); });
      return b;
    });
    pens.append(...penEls);
    const bUndo = h('button', { class: 'btn', text: '↩ Undo' });
    const bClear = h('button', { class: 'btn btn-reset', text: '↺ Clear' });
    ctx.on(bUndo, 'click', () => cv.__undo());
    ctx.on(bClear, 'click', () => cv.__clear());
    right.append(area, h('div', { class: 'btnrow' }, [pens, bUndo, bClear]));

    row.append(left, right);
    root.appendChild(row);
  }
});
