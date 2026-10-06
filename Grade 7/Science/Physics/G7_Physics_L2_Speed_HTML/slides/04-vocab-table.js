/* New vocabulary — slide 9 PPTX (bảng New words / Pronunciation / Meaning).
   Cột Meaning thành ô thả: học sinh kéo nghĩa tiếng Việt vào đúng từ. */
Engine.register({
  id: 'vocab-table',
  section: 'New vocabulary',
  title: 'Match the meanings',
  mech: 'match',

  render(root, ctx) {
    const ROWS = [
      { id: 'graph', w: '1. graph (n)', say: 'graph', ipa: '/ɡræf/', vn: 'Biểu đồ' },
      { id: 'table', w: '2. table (n)', say: 'table', ipa: '/ˈteɪbl/', vn: 'Bảng dữ liệu' },
      { id: 'limited', w: '3. limited speed (n phr)', say: 'limited speed', ipa: '/ˈlɪmɪtɪd spiːd/', vn: 'Tốc độ giới hạn' },
      { id: 'traffic', w: '4. traffic safety (n phr)', say: 'traffic safety', ipa: '/ˈtræfɪk ˈseɪfti/', vn: 'An toàn giao thông' },
      { id: 'safe', w: '5. safe distance (n phr)', say: 'safe distance', ipa: '/seɪf ˈdɪstəns/', vn: 'Khoảng cách an toàn' }
    ];

    root.appendChild(h('div', { class: 'pill fixed', text: 'Match the meanings' }));
    root.appendChild(h('div', { class: 'note fixed', text: 'Drag each meaning into the Meaning column · tap a word to hear it' }));

    const dd = ctx.dragDrop({
      items: ROWS.map(r => ({ id: r.id, label: r.vn })),
      zones: ROWS.map(r => ({ id: 'z-' + r.id, accept: [r.id], capacity: 1 })),
      renderZone: () => h('div', { class: 'dd-zone' })
    });
    dd.tray.classList.add('vtray');

    const grow = h('div', { class: 'grow stagger', style: 'justify-content:center' });
    const tbl = h('div', { class: 'vtable' });
    tbl.append(h('div', { class: 'th', text: 'New words' }), h('div', { class: 'th ipa', text: 'Pronunciation' }), h('div', { class: 'th', text: 'Meaning' }));
    ROWS.forEach(r => {
      const wcell = h('div', { class: 'td', style: 'cursor:pointer' }, [h('span', { class: 'say', text: '🔊' }), h('span', { text: r.w })]);
      const icell = h('div', { class: 'td ipa', text: r.ipa });
      [wcell, icell].forEach(c => ctx.on(c, 'click', () => Sound.speak(r.say)));
      tbl.append(wcell, icell, dd.zoneEls['z-' + r.id]);
    });
    grow.appendChild(tbl);
    root.appendChild(grow);
    root.appendChild(dd.tray);

    root.appendChild(ctx.buttons({
      check: () => dd.check(),
      show: () => dd.show(),
      reset: () => dd.reset()
    }));
  }
});
