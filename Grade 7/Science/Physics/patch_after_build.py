#!/usr/bin/env python3
"""patch_after_build.py — chạy NGAY SAU build.py, TRƯỚC qa.py, ở MỌI bài.
A. Vá 7 lỗi ENGINE đã biết trong assets/engine.js + assets/base.css (2 file chỉ đọc).
B. Chèn <build>/visual-system.js vào index.html NGAY TRƯỚC Engine.start() — tức sau khi
   mọi slide đã đăng ký nhưng TRƯỚC khi slide đầu render. Chèn sau </body> thì quá muộn:
   slide đầu đã render xong, #bgLayer và fitStage chưa tồn tại lúc nó cần.
An toàn chạy lại nhiều lần.
    python3 patch_after_build.py <build>
"""
import sys, os

MARK = '/* __VISUAL_SYSTEM__ */'
ANCHOR = '  Engine.start('

PATCHES = [
    # 1) dragDrop() onDrop: ô đầy -> trả item về đúng chỗ cũ thay vì mồ côi trong #dragLayer
    (
        "if (zdef && zdef.capacity && already >= zdef.capacity) { bump(zoneEl); return; }   // ô đầy -> item tự nảy lại chỗ cũ\n"
        "            place[it.id] = zdef ? zdef.id : null;\n"
        "            zoneEl.appendChild(n);",
        "if (zdef && zdef.capacity && already >= zdef.capacity) {\n"
        "              bump(zoneEl);\n"
        "              const homeId = place[it.id];\n"
        "              (homeId && zoneEls[homeId] ? zoneEls[homeId] : tray).appendChild(n);\n"
        "              return;\n"
        "            }\n"
        "            place[it.id] = zdef ? zdef.id : null;\n"
        "            zoneEl.appendChild(n);",
    ),
    # 2) .center-col: cho phép co xuống dưới kích thước nội dung khi lồng trong .grow
    (
        ".center-col { display: flex; flex-direction: column; align-items: center; justify-content: center; }",
        ".center-col { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 0; min-width: 0; }",
    ),
    # 3) .fc: chặn trần ở 100% khung .fc-wrap thật, không chỉ theo vw/vh viewport
    (
        "width: min(70vw, 58vh); height: min(60vh, 70vw);",
        "width: min(70vw, 58vh, 100%); height: min(60vh, 70vw, 100%);",
    ),
    # 4) intro title mất khoảng trắng giữa các từ (whitespace collapsing ở biên inline-block)
    (
        "const s = el('span', { class: 'word', text: w + ' ' });",
        "const s = el('span', { class: 'word', text: w + '\\u00A0' });",
    ),
    # 5) "Skip intro" không huỷ setTimeout(fin,2600) gốc -> fin() chạy 2 lần -> tự nhảy về slide bìa
    (
        "const fin = () => { Store.sess('introSeen', 1); v.remove(); done(); };\n"
        "      skip.addEventListener('click', safe(fin));\n"
        "      v.appendChild(skip);\n"
        "      document.body.appendChild(v);\n"
        "      setTimeout(fin, 2600);",
        "const fin = () => { Store.sess('introSeen', 1); v.remove(); done(); };\n"
        "      const introTimer = setTimeout(fin, 2600);\n"
        "      skip.addEventListener('click', safe(() => { clearTimeout(introTimer); fin(); }));\n"
        "      v.appendChild(skip);\n"
        "      document.body.appendChild(v);",
    ),
    # 6) .fb-badge bị overflow:hidden của phần tử cha (vd .imgrid > .cell) cắt mất phần đè ra góc
    (
        ".fb-badge {\n"
        "  position: absolute; top: -12px; right: -12px; z-index: 3;",
        ".fb-badge {\n"
        "  position: absolute; top: 6px; right: 6px; z-index: 3;",
    ),
    # 7) kéo-thả đứng hình giữa chừng nếu setPointerCapture() hỏng/bị huỷ ngầm -> thêm lớp dự phòng
    (
        "      this.on(node, 'pointerdown', start);\n"
        "      this.on(node, 'pointermove', move);\n"
        "      this.on(node, 'pointerup', finish);\n"
        "      this.on(node, 'pointercancel', finish);\n"
        "      node.__ddLock",
        "      this.on(node, 'pointerdown', start);\n"
        "      this.on(node, 'pointermove', move);\n"
        "      this.on(node, 'pointerup', finish);\n"
        "      this.on(node, 'pointercancel', finish);\n"
        "      this.on(node, 'lostpointercapture', finish);\n"
        "      this.on(document, 'pointermove', move);\n"
        "      this.on(document, 'pointerup', finish);\n"
        "      this.on(document, 'pointercancel', finish);\n"
        "      node.__ddLock",
    ),
]


def patch_engine(build):
    targets = [
        os.path.join(build, 'index.html'),            # mặc định (inline 1 file)
        os.path.join(build, 'assets', 'engine.js'),   # chế độ --split
        os.path.join(build, 'assets', 'base.css'),
    ]
    existing = [t for t in targets if os.path.exists(t)]
    total = 0
    for i, (old, new) in enumerate(PATCHES, 1):
        if any(new in open(t, encoding='utf-8').read() for t in existing):
            continue
        applied = False
        for t in existing:
            txt = open(t, encoding='utf-8').read()
            if old in txt:
                open(t, 'w', encoding='utf-8').write(txt.replace(old, new))
                total += 1
                applied = True
        if not applied:
            print(f'  CANH BAO: khong tim thay doan can va #{i} -- engine.js/base.css cua skill '
                  f'co the da doi, doc lai 2 file do va viet lai cap chuoi va')
    print(f'OK: da va {total} loi engine' if total else 'OK: engine da va san tu truoc')


def inject_visual(build):
    idx = os.path.join(build, 'index.html')
    js = os.path.join(build, 'visual-system.js')
    if not os.path.exists(js):
        print('CANH BAO: thieu <build>/visual-system.js -- chua chep khoi chuan tu SKILL.md?')
        return
    html = open(idx, encoding='utf-8').read()
    if MARK in html:
        print('OK: visual-system da chen san tu truoc')
        return
    if ('<script>\n' + ANCHOR) not in html:
        print('CANH BAO: khong tim thay "  Engine.start(" -- template.html cua skill co the da doi')
        return
    payload = '<script>\n' + MARK + '\n' + open(js, encoding='utf-8').read() + '\n</script>\n<script>\n'
    open(idx, 'w', encoding='utf-8').write(html.replace('<script>\n' + ANCHOR, payload + ANCHOR, 1))
    print('OK: da chen visual-system.js truoc Engine.start()')


def main():
    build = sys.argv[1] if len(sys.argv) > 1 else 'build'
    if not os.path.exists(os.path.join(build, 'index.html')):
        print('LOI: chua co', os.path.join(build, 'index.html'), '-- chay build.py truoc')
        sys.exit(1)
    patch_engine(build)
    inject_visual(build)


if __name__ == '__main__':
    main()
