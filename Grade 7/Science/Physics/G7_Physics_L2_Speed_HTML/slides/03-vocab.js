/* New vocabulary — slide 4-8 PPTX gộp thành 1 bộ thẻ lật (giữ nguyên văn từ, phiên âm, định nghĩa) */
Engine.register({
  id: 'vocab',
  section: 'New vocabulary',
  title: 'New words: flashcards',
  mech: 'flashcard',

  render(root, ctx) {
    const W = [
      { w: 'graph', t: '(n)', ipa: '/ɡræf/', img: 'assets/img/image9.png',
        d: 'a picture that shows how two sets of information or variables (= amounts that can change) are related, usually by lines or curves' },
      { w: 'table', t: '(n)', ipa: '/ˈteɪbl/', img: 'assets/img/image11.gif',
        d: 'an arrangement of facts and numbers, usually in rows on a page, that makes information easy to understand.' },
      { w: 'limited speed', t: '(n phr)', ipa: '/ˈlɪmɪtɪd spiːd/', img: 'assets/img/image12.jpg',
        d: 'the maximum or minimum speed permitted by law in a given area under specified circumstances.' },
      { w: 'traffic safety', t: '(n phr)', ipa: '/ˈtræfɪk ˈseɪfti/', img: 'assets/img/image13.jpeg',
        d: 'teaching people how to behave safely when driving or crossing the road.' },
      { w: 'safe distance', t: '(n phr)', ipa: '/seɪf ˈdɪstəns/', img: 'assets/img/image14.png',
        d: 'the minimum amount of space needed between people, vehicles, or objects to prevent accidents, ensure safety, or avoid harm' }
    ];
    let i = 0;
    const seen = new Set();

    root.appendChild(h('div', { class: 'pill fixed', text: 'New vocabulary' }));

    const stage = h('div', { class: 'grow center-col vstage stagger' });
    const wrap = h('div', { class: 'fc-wrap' });
    const holder = h('div', { style: 'position:relative;width:min(100%,150vh);height:100%;display:flex;justify-content:center' });
    const under2 = h('div', { class: 'fc-stack-under two' });
    const under1 = h('div', { class: 'fc-stack-under' });
    const card = h('div', { class: 'fc vcard', role: 'button', 'aria-label': 'Flip card' });
    holder.append(under2, under1, card);
    wrap.appendChild(holder);
    stage.appendChild(wrap);

    const dots = h('div', { class: 'dots fixed' });

    const draw = () => {
      const v = W[i];
      card.classList.remove('flipped');
      card.innerHTML = '';
      const front = h('div', { class: 'face front' }, [
        h('div', { class: 'pic' }, [ctx.img(v.img, { alt: v.w, zoom: false, class: 'float-anim' })]),
        h('div', { class: 'info' }, [
          h('div', { class: 'vword', text: v.w }),
          h('div', { class: 'taphint', text: '👆 Tap the card to see the meaning' })
        ])
      ]);
      const back = h('div', { class: 'face back' }, [
        h('div', { class: 'pic' }, [ctx.img(v.img, { alt: v.w, zoom: false })]),
        h('div', { class: 'info' }, [
          h('div', { class: 'vword', style: 'font-size:var(--f-h2)', text: v.w }),
          h('div', { class: 'vipa', text: v.t + '  ' + v.ipa }),
          h('div', { class: 'vdef', text: v.d })
        ])
      ]);
      card.append(front, back);
      card.classList.remove('flipin'); void card.offsetWidth; card.classList.add('flipin');
      dots.innerHTML = '';
      W.forEach((_, k) => dots.appendChild(h('i', { class: k === i ? 'now' : (seen.has(k) ? 'done' : '') })));
    };

    ctx.on(card, 'click', () => {
      card.classList.toggle('flipped');
      Sound.playEffect('click');
      if (card.classList.contains('flipped')) {
        Sound.speak(W[i].w);
        if (!seen.has(i)) {
          seen.add(i);
          dots.children[i] && dots.children[i].classList.add('done');
          if (seen.size === W.length) { Engine.confetti('star'); Engine.toast('🎉 You have met all 5 new words!'); }
        }
      }
    });

    const bPrev = h('button', { class: 'btn', text: '‹ Prev' });
    const bNext = h('button', { class: 'btn btn-primary', text: 'Next ›' });
    const bSay = h('button', { class: 'btn', text: '🔊 Listen' });
    const bRep = h('button', { class: 'btn', text: '🔁 x3' });
    ctx.on(bPrev, 'click', () => { i = (i - 1 + W.length) % W.length; draw(); });
    ctx.on(bNext, 'click', () => { i = (i + 1) % W.length; draw(); });
    ctx.on(bSay, 'click', () => Sound.speak(W[i].w));
    ctx.on(bRep, 'click', () => Sound.repeat(W[i].w, 3));

    root.appendChild(stage);
    root.appendChild(h('div', { class: 'btnrow fixed' }, [bPrev, bSay, dots, bRep, bNext]));
    draw();
  }
});
