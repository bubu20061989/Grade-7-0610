/* Lead-in — slide 3 PPTX: đồng hồ tốc độ + CSGT bắn tốc độ, 2 câu hỏi trong bong bóng hội thoại.
   PPTX không có đáp án in sẵn -> hoạt động thảo luận mở, không chấm. */
Engine.register({
  id: 'leadin',
  section: 'Lead-in',
  title: 'Lead-in: How fast?',
  mech: 'discuss',

  render(root, ctx) {
    root.appendChild(h('div', { class: 'pill fixed', text: 'Lead-in' }));

    const split = h('div', { class: 'split stagger' });

    const media = h('div', { class: 'media', style: 'gap:clamp(8px,1.2vh,16px)' });
    const f1 = h('div', { class: 'picframe' }, [ctx.img('assets/img/image6.jpeg', { alt: 'A motorbike speedometer' })]);
    const f2 = h('div', { class: 'picframe' }, [ctx.img('assets/img/image7.png', { alt: 'A traffic policeman checking speed on the road' })]);
    media.append(f1, f2);

    const side = h('div', {});
    const qs = [
      { n: 1, text: 'How can we know the speed of our motorbikes?', frame: f1 },
      { n: 2, text: 'What do the policeman use to know the speed of our motorbikes?', frame: f2 }
    ];
    const bubbles = qs.map(q => {
      const b = h('button', { class: 'bubble' }, [h('span', { class: 'qn', text: String(q.n) }), h('span', { text: q.text })]);
      ctx.on(b, 'click', () => {
        bubbles.forEach(x => x.classList.remove('on'));
        [f1, f2].forEach(f => f.classList.remove('on'));
        b.classList.add('on'); q.frame.classList.add('on');
        Sound.speak(q.text);
      });
      return b;
    });
    side.append(...bubbles);
    side.appendChild(h('div', { class: 'note', text: 'Tap a question · think · share with your partner' }));

    const tbtn = h('button', { class: 'btn btn-primary', text: '⏱ 30s' });
    ctx.on(tbtn, 'click', () => Engine.timer(30));
    side.appendChild(h('div', { class: 'btnrow' }, [tbtn]));

    split.append(media, side);
    root.appendChild(split);
    root.appendChild(h('div', { class: 'zoomhint fixed', style: 'text-align:center', text: '🔍 Click a picture to zoom in' }));
  }
});
