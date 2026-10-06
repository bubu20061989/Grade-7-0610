/* Practice — slide 20 PPTX: (P. 24) Speaking. Hội thoại mẫu chép nguyên văn từ ảnh image18.
   Đóng vai: chọn vai, máy đọc lời vai kia, đến lượt mình thì dừng cho học sinh nói. */
Engine.register({
  id: 'speaking',
  section: 'Practice',
  title: 'Speaking: role-play',
  mech: 'roleplay',

  render(root, ctx) {
    const L = [
      ['P', 'Excuse me, you were riding over the limited speed. Do you realize how dangerous that is?'],
      ['D', 'Sorry, I didn’t notice the speed limit sign.'],
      ['P', 'You should be more careful about traffic safety.'],
      ['D', 'I got it, sir. I’ll drive more carefully next time.'],
      ['P', 'High speed can lead to accidents. It’s important to keep a safe distance from other vehicles, too.'],
      ['D', 'I’ll remember that. I’m sorry for my mistake.'],
      ['P', 'Well, there is a penalty for you for that mistake. Let’s make sure this doesn’t happen again.']
    ];
    const NAME = { P: 'The policeman', D: 'The driver' };
    let i = 0, role = null;

    root.appendChild(h('div', { class: 'pill fixed', text: 'Speaking: role-play' }));
    root.appendChild(h('div', { class: 'note fixed', text: '(P. 24) Imagine a traffic policeman caught a driver for driving too fast. Make a conversation between the policeman and the driver as in the following example:' }));

    const split = h('div', { class: 'split stagger' });
    const media = h('div', { class: 'media' }, [
      ctx.img('assets/img/image18.jpg', { alt: 'A conversation about speeding between a policeman and a driver', class: 'hero-img' }),
      ctx.zoomHint()
    ]);

    const side = h('div', {});
    const roles = h('div', { class: 'rolerow' });
    const rb = {
      P: h('button', { class: 'btn role', text: '👮 I am the policeman' }),
      D: h('button', { class: 'btn role', text: '🏍 I am the driver' })
    };
    roles.append(rb.P, rb.D);
    const card = h('div', { class: 'line-card' });
    const dots = h('div', { class: 'dots' });
    const bPrev = h('button', { class: 'btn', text: '‹' });
    const bSay = h('button', { class: 'btn', text: '🔊 Listen' });
    const bNext = h('button', { class: 'btn btn-primary', text: '›' });
    side.append(roles, card, h('div', { class: 'btnrow' }, [bPrev, bSay, dots, bNext]));
    split.append(media, side);
    root.appendChild(split);

    const draw = () => {
      const [who, text] = L[i];
      card.className = 'line-card pop-in' + (who === 'D' ? ' driver' : '');
      card.innerHTML = '';
      card.append(h('div', { class: 'who', text: (who === 'P' ? '👮 ' : '🏍 ') + NAME[who] + ':' }), h('div', { class: 'say', text: text }));
      if (role === who) card.appendChild(h('div', { class: 'yourturn', text: '🎤 Your turn — say it!' }));
      dots.innerHTML = '';
      L.forEach((_, k) => dots.appendChild(h('i', { class: k === i ? 'now' : (k < i ? 'done' : '') })));
    };
    /* đọc dòng hiện tại nếu không phải vai của học sinh */
    const play = () => {
      draw();
      if (role !== L[i][0]) Sound.speak(L[i][1]);
    };
    ctx.on(bPrev, 'click', () => { if (i > 0) { i--; play(); } });
    ctx.on(bNext, 'click', () => {
      if (i < L.length - 1) { i++; play(); }
      else { Engine.confetti(); Engine.toast('👏 Great conversation! Now swap roles.'); }
    });
    ctx.on(bSay, 'click', () => Sound.speak(L[i][1]));
    Object.keys(rb).forEach(k => ctx.on(rb[k], 'click', () => {
      role = role === k ? null : k;
      rb.P.classList.toggle('on', role === 'P'); rb.D.classList.toggle('on', role === 'D');
      i = 0; play();
    }));

    const bTimer = h('button', { class: 'btn', text: '⏱ 60s' });
    ctx.on(bTimer, 'click', () => Engine.timer(60));
    const bRestart = h('button', { class: 'btn btn-reset', text: '↺ Start again' });
    ctx.on(bRestart, 'click', () => { Sound.stopAll(); i = 0; draw(); });
    root.appendChild(h('div', { class: 'btnrow fixed' }, [bTimer, bRestart]));
    draw();
  }
});
