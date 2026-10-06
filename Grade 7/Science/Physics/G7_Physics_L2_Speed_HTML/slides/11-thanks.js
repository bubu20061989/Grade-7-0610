/* Thank you — slide 23 PPTX (ảnh THANK YOU + câu trích dẫn), thêm lời chúc theo số sao thực tế. */
Engine.register({
  id: 'thanks',
  section: 'Consolidation',
  bg: 'thanks',
  title: 'Thank you!',
  mech: 'end',

  render(root, ctx) {
    const QUOTE = '“Energy cannot be created or destroyed; transform yours into action.”';
    const cov = h('div', { class: 'cover stagger' });
    const media = h('div', { class: 'cover-media thanks' }, [
      ctx.img('assets/img/image38.png', { alt: 'Thank you', zoom: false, class: 'hero-img float-anim' })
    ]);
    const txt = h('div', { class: 'cover-text' });
    const done = Object.keys(Engine.done || {}).length;
    const msg = Engine.stars > 0
      ? 'You earned ' + Engine.stars + ' ⭐ today. Well done!'
      : (done > 0 ? 'Great effort today — keep practising!' : 'See you in the next lesson!');
    txt.append(
      h('div', { class: 'tagrow' }, [h('span', { class: 'tag', text: 'Lesson 2 · Measurement of Speed' })]),
      h('div', { class: 'quote', text: QUOTE }),
      h('div', { class: 'hero-sub', text: msg })
    );
    const bParty = h('button', { class: 'btn btn-primary', text: '🎉 Celebrate' });
    ctx.on(bParty, 'click', () => { Engine.confetti('star'); Sound.playEffect('ok'); });
    const bHome = h('button', { class: 'btn', text: '↩ Back to start' });
    ctx.on(bHome, 'click', () => Engine.go(0, 'jump'));
    txt.appendChild(h('div', { class: 'btnrow', style: 'justify-content:flex-start' }, [ctx.speakBtn(QUOTE, ' Listen'), bParty, bHome]));
    cov.append(media, txt);
    root.appendChild(cov);
  }
});
