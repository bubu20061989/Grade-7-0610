/* Consolidation — slide 22 PPTX: ôn 5 từ (bấm để nghe + lật nghĩa) + 2 mục tiêu còn lại của bài. */
Engine.register({
  id: 'consolidation',
  section: 'Consolidation',
  title: 'Consolidation',
  mech: 'recall',

  render(root, ctx) {
    const W = [
      { w: 'graph', vn: 'Biểu đồ', img: 'assets/img/image9.png' },
      { w: 'table', vn: 'Bảng dữ liệu', img: 'assets/img/image11.gif' },
      { w: 'limited speed', vn: 'Tốc độ giới hạn', img: 'assets/img/image12.jpg' },
      { w: 'traffic safety', vn: 'An toàn giao thông', img: 'assets/img/image13.jpeg' },
      { w: 'safe distance', vn: 'Khoảng cách an toàn', img: 'assets/img/image14.png' }
    ];
    root.appendChild(h('div', { class: 'pill fixed', text: 'Consolidation' }));
    root.appendChild(h('div', { class: 'note fixed', text: 'Vocabulary: say the meaning, then tap the card to check' }));

    const grow = h('div', { class: 'grow' });
    const grid = h('div', { class: 'imgrid recall stagger' });
    const opened = new Set();
    W.forEach((v, k) => {
      const lab = h('div', { class: 'chip', text: v.w });
      const cell = h('div', { class: 'cell' }, [ctx.img(v.img, { alt: v.w, zoom: false }), lab]);
      ctx.on(cell, 'click', () => {
        const open = cell.classList.toggle('open');
        lab.textContent = open ? v.vn : v.w;
        Sound.speak(v.w);
        if (open) { opened.add(k); if (opened.size === W.length) Engine.toast('🌟 You remember all 5 words!'); }
      });
      grid.appendChild(cell);
    });
    grow.appendChild(grid);
    root.appendChild(grow);

    root.appendChild(h('div', { class: 'goals fixed' }, [
      h('span', { class: 'goal', text: '✔ Understand and do exercises, related to measurement of speed.' }),
      h('span', { class: 'goal', text: '📚 Prepare the next lesson.' })
    ]));
    const bAll = h('button', { class: 'btn btn-primary', text: '🔊 Listen to all' });
    ctx.on(bAll, 'click', () => Sound.speak(W.map(v => v.w).join('. ') + '.'));
    root.appendChild(h('div', { class: 'btnrow fixed' }, [bAll]));
  }
});
