/* Bìa — gộp slide 1 (ảnh "Let's explore English in Sciences") + slide 2 (PHYSICS · Lesson 2) của PPTX */
Engine.register({
  id: 'cover',
  section: 'Start',
  title: 'Lesson 2: Measurement of Speed',
  mech: 'cover',

  render(root, ctx) {
    const cov = h('div', { class: 'cover stagger' });

    const media = h('div', { class: 'cover-media' });
    const pic = ctx.img('assets/img/image2.png', { alt: "Let's explore English in Sciences — Grade 7", zoom: false, class: 'hero-img float-anim' });
    ctx.on(pic, 'click', () => {
      pic.classList.remove('nudge'); void pic.offsetWidth; pic.classList.add('nudge');
      Sound.speak("Let's explore English in Sciences!");
    });
    media.appendChild(pic);

    const txt = h('div', { class: 'cover-text' });
    txt.appendChild(h('div', { class: 'tagrow' }, [
      h('span', { class: 'tag', text: 'Grade 7' }),
      h('span', { class: 'tag', text: 'Physics' }),
      h('span', { class: 'tag', text: 'Lesson 2' })
    ]));
    txt.appendChild(ctx.img('assets/img/image4.png', { alt: 'Physics', zoom: false, class: 'wordart' }));
    const t = h('div', { class: 'hero-title' });
    t.innerHTML = 'Measurement<br>of <em>Speed</em>';
    txt.appendChild(t);
    txt.appendChild(h('div', { class: 'hero-sub', text: '👆 Tap the picture to say hello' }));

    const start = h('button', { class: 'btn btn-primary pulse', text: "▶ Let's start" });
    ctx.on(start, 'click', () => { Engine.confetti('star'); ctx.timeout(() => Engine.next(), 380); });
    txt.appendChild(h('div', { class: 'btnrow', style: 'justify-content:flex-start' }, [
      start,
      ctx.speakBtn('Lesson 2. Measurement of speed.', ' Listen')
    ]));

    cov.append(media, txt);
    root.appendChild(cov);
  }
});
