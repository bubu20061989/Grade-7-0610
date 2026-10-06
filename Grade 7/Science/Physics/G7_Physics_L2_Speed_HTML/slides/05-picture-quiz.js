/* Practice — slide 10-14 PPTX: 5 vòng "nhìn tranh, chọn đúng từ", nền đường cao tốc gốc.
   Mỗi vòng 1 tranh full chiều cao; chọn 1 lần là chấm ngay (đúng như trigger âm thanh của PPTX). */
Engine.register({
  id: 'picture-quiz',
  section: 'Practice',
  bg: 'road',
  title: 'Look and choose the word',
  mech: 'quiz',

  render(root, ctx) {
    const R = [
      { img: 'assets/img/image13.jpeg', alt: 'Traffic safety awareness signs', ans: 'traffic safety', opts: ['limited speed', 'safe distance', 'traffic safety'] },
      { img: 'assets/img/image8.gif', alt: 'An animated bar graph', ans: 'graph', opts: ['limited speed', 'graph', 'safe distance'] },
      { img: 'assets/img/image14.png', alt: 'Keep a safe distance sign', ans: 'safe distance', opts: ['safe distance', 'traffic safety', 'limited speed'] },
      { img: 'assets/img/image11.gif', alt: 'Two data tables', ans: 'table', opts: ['graph', 'safe distance', 'table'] },
      { img: 'assets/img/image12.jpg', alt: 'Speed limit signs above a highway', ans: 'limited speed', opts: ['limited speed', 'traffic safety', 'safe distance'] }
    ];
    let k = 0, tried = false, solved = false;

    root.appendChild(h('div', { class: 'pill fixed', text: 'Look and choose the word' }));

    const split = h('div', { class: 'split stagger' });
    const media = h('div', { class: 'media' });
    const side = h('div', {});
    const bar = h('div', { class: 'roundbar' });
    const opts = h('div', { style: 'display:flex;flex-direction:column;gap:clamp(10px,2.2vh,26px);width:100%' });
    const bNext = h('button', { class: 'btn btn-primary', text: 'Next picture ›' });
    side.append(bar, opts, h('div', { class: 'btnrow' }, [bNext]));
    split.append(media, side);
    root.appendChild(split);

    const draw = () => {
      const r = R[k];
      tried = false; solved = false;
      media.innerHTML = '';
      const im = ctx.img(r.img, { alt: r.alt, zoom: false, class: 'hero-img pop-in' });
      media.appendChild(im);
      bar.innerHTML = '';
      R.forEach((_, j) => bar.appendChild(h('span', { text: j < k ? '★' : (j === k ? '●' : '○') })));
      bar.appendChild(h('span', { text: 'Picture ' + (k + 1) + ' / ' + R.length }));
      opts.innerHTML = '';
      ctx.shuffle(r.opts).forEach(o => {
        const b = h('button', { class: 'wordopt', text: o });
        ctx.on(b, 'click', () => {
          if (solved) return;
          const ok = o === r.ans;
          if (!tried) { tried = true; Engine.score(ok ? 1 : 0, 1); ctx.markResult(b, ok); }
          else ctx.markResult(b, ok, { sound: true });
          if (ok) {
            solved = true;
            Sound.speak(r.ans);
            opts.querySelectorAll('.wordopt').forEach(x => { x.disabled = true; });
            bNext.disabled = false;
            if (k === R.length - 1) { bNext.textContent = '🎉 All done!'; bNext.disabled = true; Engine.confetti('star'); }
          }
        });
        opts.appendChild(b);
      });
      bNext.textContent = 'Next picture ›';
      bNext.disabled = true;
    };
    ctx.on(bNext, 'click', () => { if (k < R.length - 1) { k++; draw(); } });

    const bAgain = h('button', { class: 'btn btn-reset', text: '↺ Play again' });
    ctx.on(bAgain, 'click', () => { Sound.stopAll(); k = 0; draw(); });
    root.appendChild(h('div', { class: 'btnrow fixed' }, [bAgain]));
    draw();
  }
});
