/**
 * case_template.js v2.0
 * RollerStone 制作事例・施工事例 共通テンプレート
 *
 * ============================================================
 * CASE オブジェクトの仕様：
 *
 * const CASE = {
 *   id: '001',
 *   galleryType: 'paas',        // 'paas'（制作事例）or 'construction'（施工事例）
 *   theme: 'DARK',              // DARK / LIGHT / ELEGANT / NATURAL / BOLD
 *   category: '乱形石調',       // 乱形石調 / タイル調 / 特殊・ロゴ
 *   subtitle: '駐車場 — 一戸建て',
 *   mainColor: '#c8b89a',       // 仕上げメインカラー（CSSカラー or 色名）任意
 *   accentColor: '#888',        // 仕上げイメージカラー 任意
 *   mainColorLabel: 'ベージュ', // 表示名 任意
 *   accentColorLabel: 'グレー', // 表示名 任意
 *   comments: ['コメント1', 'コメント2'],
 *   photos: [
 *     { type: 'before', url: 'https://...' },                          // 必須・1枚目がスライダー
 *     { type: 'after',  url: 'https://...' },                          // 必須・1枚目がスライダー
 *     { type: 'before', url: 'https://...', label: '玄関アプローチ' }, // 2枚目以降
 *     { type: 'after',  url: 'https://...', label: '玄関アプローチ' }, // 2枚目以降
 *     { type: 'sub',    url: 'https://...', label: '夜のライトアップ' },// 任意・複数可
 *     { type: 'material', url: 'https://...' },                        // 任意
 *     { type: 'video',  url: 'https://...', poster: 'https://...' },   // 任意
 *   ],
 * };
 * ============================================================
 */

(function () {

    // ============================================================
    // テーマ定義
    // ============================================================
    const THEMES = {
        DARK: {
            bg: '#0a0a0a', surface: '#111', border: 'rgba(255,255,255,0.08)',
            text: '#fff', textSub: 'rgba(255,255,255,0.3)', textBody: 'rgba(255,255,255,0.65)',
            gold: '#D4AF37', goldBg: 'rgba(212,175,55,0.9)',
            headerBg: 'rgba(0,0,0,0.92)', badgeBg: 'rgba(255,255,255,0.92)', badgeText: '#111',
        },
        LIGHT: {
            bg: '#f5f5f0', surface: '#fff', border: 'rgba(0,0,0,0.08)',
            text: '#111', textSub: 'rgba(0,0,0,0.35)', textBody: 'rgba(0,0,0,0.65)',
            gold: '#B8860B', goldBg: 'rgba(184,134,11,0.9)',
            headerBg: 'rgba(245,245,240,0.95)', badgeBg: '#111', badgeText: '#fff',
        },
        ELEGANT: {
            bg: '#0d1b2a', surface: '#162032', border: 'rgba(192,192,192,0.12)',
            text: '#fff', textSub: 'rgba(255,255,255,0.3)', textBody: 'rgba(255,255,255,0.6)',
            gold: '#C0C0C0', goldBg: 'rgba(192,192,192,0.9)',
            headerBg: 'rgba(13,27,42,0.95)', badgeBg: 'rgba(255,255,255,0.9)', badgeText: '#0d1b2a',
        },
        NATURAL: {
            bg: '#f0ebe3', surface: '#fff', border: 'rgba(101,67,33,0.12)',
            text: '#3d2b1f', textSub: 'rgba(61,43,31,0.4)', textBody: 'rgba(61,43,31,0.65)',
            gold: '#8B6335', goldBg: 'rgba(139,99,53,0.9)',
            headerBg: 'rgba(240,235,227,0.95)', badgeBg: '#3d2b1f', badgeText: '#f0ebe3',
        },
        BOLD: {
            bg: '#000', surface: '#0d0d0d', border: 'rgba(255,255,255,0.15)',
            text: '#fff', textSub: 'rgba(255,255,255,0.3)', textBody: 'rgba(255,255,255,0.7)',
            gold: '#fff', goldBg: 'rgba(255,255,255,0.95)',
            headerBg: 'rgba(0,0,0,0.95)', badgeBg: '#fff', badgeText: '#000',
        },
    };

    const T = THEMES[CASE.theme] || THEMES.DARK;
    const galleryType = CASE.galleryType || 'paas';
    const isPaas = galleryType === 'paas';

    // ============================================================
    // CTA・免責バッジ設定
    // ============================================================
    const ctaConfig = {
        paas: {
            title: 'このデザインが気になりましたか？',
            sub: 'あなたのお家の写真を送るだけで<br>無料で完成イメージを作成します',
            btn: 'LINEで無料イメージ作成を依頼',
        },
        construction: {
            title: 'この施工が気になりましたか？',
            sub: '無料でイメージを作成することができます<br>お気軽にご相談ください',
            btn: 'LINEで無料見積もりを依頼',
        },
    };
    const cta = ctaConfig[galleryType];

    const disclaimerConfig = {
        paas:         { text: '⚠ AIパース・施工前イメージです', color: '#D4AF37', border: '#D4AF3755' },
        construction: { text: '✓ 実際の施工写真です',           color: '#06C755', border: '#06C75555' },
    };
    const disc = disclaimerConfig[galleryType];

    // ============================================================
    // カテゴリ
    // ============================================================
    const catCls = { '乱形石調': 'random', 'タイル調': 'tile', '特殊・ロゴ': 'original' }[CASE.category] || 'random';

    // ============================================================
    // ページタイトル・フォント
    // ============================================================
    document.title = `${isPaas ? '制作' : '施工'}事例 No.${CASE.id} | RollerStone`;
    if (!document.querySelector('link[href*="Noto+Sans+JP"]')) {
        const fl = document.createElement('link');
        fl.rel = 'stylesheet';
        fl.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap';
        document.head.appendChild(fl);
    }

    // ============================================================
    // CSS
    // ============================================================
    const css = document.createElement('style');
    css.textContent = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${T.bg};color:${T.text};font-family:'Noto Sans JP',sans-serif;-webkit-tap-highlight-color:transparent}

    /* ヘッダー */
    #rs-hd{position:sticky;top:0;z-index:50;background:${T.headerBg};backdrop-filter:blur(12px);border-bottom:1px solid ${T.border}}
    #rs-hd .in{max-width:512px;margin:0 auto;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}
    #rs-hd a{font-size:11px;font-weight:900;color:${T.gold};text-decoration:none}
    #rs-hd .no{font-size:10px;font-weight:900;letter-spacing:.2em;color:${T.textSub}}

    /* 免責バッジ固定 */
    #rs-disc{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:40;
      white-space:nowrap;background:rgba(0,0,0,0.88);color:${disc.color};
      font-size:10px;font-weight:900;letter-spacing:.05em;padding:6px 18px;border-radius:999px;
      border:1px solid ${disc.border};backdrop-filter:blur(8px);pointer-events:none}

    /* ページ */
    .rs-pg{max-width:512px;margin:0 auto;padding-bottom:80px}

    /* タイトル */
    .rs-ta{padding:20px 16px 16px}
    .rs-cat{display:inline-block;font-size:9px;font-weight:900;padding:3px 12px;border-radius:999px;letter-spacing:.05em}
    .rs-cat.random{background:${T.badgeBg};color:${T.badgeText}}
    .rs-cat.tile{background:${T.goldBg};color:#000}
    .rs-cat.original{background:transparent;color:${T.text};border:1px solid ${T.border}}
    .rs-ttl{font-size:22px;font-weight:900;margin-top:8px}
    .rs-ttl-g{background:linear-gradient(135deg,${T.gold},${T.gold}99);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .rs-sub{font-size:12px;color:${T.textSub};margin-top:4px}

    /* カラーチップ */
    .rs-chips{display:flex;gap:12px;margin-top:12px;flex-wrap:wrap}
    .rs-chip{display:flex;align-items:center;gap:6px;font-size:11px;color:${T.textSub}}
    .rs-dot{width:12px;height:12px;border-radius:50%;border:1px solid ${T.border};flex-shrink:0}

    /* セクション */
    .rs-sec{padding:0 16px;margin-top:28px}
    .rs-lbl{font-size:9px;font-weight:900;letter-spacing:.2em;color:${T.gold}bb;text-transform:uppercase;padding-bottom:8px}
    .rs-lbl-sub{font-size:11px;color:${T.textSub};margin-bottom:8px}

    /* ===== メインスライダー ===== */
    .rs-sl{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:${T.surface};cursor:ew-resize;user-select:none;touch-action:pan-y}
    .rs-sl-af,.rs-sl-bf{position:absolute;inset:0}
    .rs-sl-af img,.rs-sl-bf img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
    .rs-sl-bf{clip-path:inset(0 50% 0 0)}
    .rs-sl-line{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#fff;transform:translateX(-50%);pointer-events:none;z-index:3}
    .rs-sl-hdl{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:44px;height:44px;border-radius:50%;background:#fff;z-index:4;pointer-events:none;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 14px rgba(0,0,0,.5);font-size:13px;color:#333;font-weight:900;letter-spacing:-2px}
    .rs-sl-bdg{position:absolute;top:12px;font-size:10px;font-weight:900;letter-spacing:.1em;padding:4px 12px;border-radius:999px;z-index:2;pointer-events:none}
    .rs-sl-bdg.bf{left:12px;background:rgba(0,0,0,.7);color:rgba(255,255,255,.9)}
    .rs-sl-bdg.af{right:12px;background:${T.goldBg};color:#000}

    /* ===== 2枚目以降 BA ===== */
    .rs-ba{margin-top:3px}
    @media(min-width:512px){.rs-ba{display:grid;grid-template-columns:1fr 1fr;gap:3px}}
    .rs-ba-ph{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:${T.surface};cursor:pointer}
    @media(max-width:511px){.rs-ba-ph+.rs-ba-ph{margin-top:3px}}
    .rs-ba-ph img{width:100%;height:100%;object-fit:cover;display:block}
    .rs-ba-bdg{position:absolute;top:10px;left:10px;font-size:9px;font-weight:900;letter-spacing:.1em;padding:3px 10px;border-radius:999px;pointer-events:none}
    .rs-ba-bdg.bf{background:rgba(0,0,0,.7);color:rgba(255,255,255,.9)}
    .rs-ba-bdg.af{background:${T.goldBg};color:#000}
    .rs-ba-lbl{position:absolute;bottom:0;left:0;right:0;padding:20px 10px 8px;font-size:11px;font-weight:700;color:#fff;background:linear-gradient(to top,rgba(0,0,0,.8),transparent);pointer-events:none}

    /* 矢印 */
    .rs-arr{display:flex;align-items:center;justify-content:center;padding:10px 0}
    .rs-arr-in{display:flex;flex-direction:column;align-items:center;gap:2px}
    .rs-arr-ln{width:1px;height:16px;background:${T.gold}44}
    .rs-arr-ic{color:${T.gold};font-size:16px;line-height:1}

    /* More Photos */
    .rs-sg{display:grid;grid-template-columns:1fr 1fr;gap:3px}
    .rs-sp{position:relative;aspect-ratio:1;overflow:hidden;background:${T.surface};cursor:pointer}
    .rs-sp img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}
    .rs-sp img:active{transform:scale(1.04)}
    .rs-sp-lbl{position:absolute;bottom:0;left:0;right:0;padding:20px 10px 8px;font-size:11px;font-weight:700;color:#fff;background:linear-gradient(to top,rgba(0,0,0,.85),transparent)}

    /* 素材 */
    .rs-mat{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;background:${T.surface};cursor:pointer}
    .rs-mat img{width:100%;height:100%;object-fit:cover;display:block}
    .rs-mat-bdg{position:absolute;top:10px;left:10px;font-size:9px;font-weight:900;color:${T.textSub};background:rgba(0,0,0,.6);padding:3px 10px;border-radius:999px;backdrop-filter:blur(4px);border:1px solid ${T.border}}

    /* 動画 */
    .rs-vid{position:relative;width:100%;aspect-ratio:16/9;background:#000;overflow:hidden}
    .rs-vid video{width:100%;height:100%;object-fit:cover;display:block}

    /* コメント */
    .rs-cm{padding:0 16px;margin-top:24px}
    .rs-cm-tx{font-size:13px;color:${T.textBody};line-height:1.9;margin-bottom:12px}

    /* CTA */
    .rs-cta{margin:32px 16px 0}
    .rs-cta-bx{background:${T.surface};border:1px solid ${T.border};border-radius:20px;padding:24px;text-align:center}
    .rs-cta-t{font-size:14px;font-weight:900;margin-bottom:8px;color:${T.text}}
    .rs-cta-s{font-size:11px;color:${T.textSub};margin-bottom:16px;line-height:1.7}
    .rs-cta-ln{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#06C755;color:#fff;font-weight:900;font-size:15px;padding:16px;border-radius:12px;text-decoration:none;transition:opacity .2s}
    .rs-cta-ln:active{opacity:.85}
    .rs-bk{display:flex;align-items:center;justify-content:center;width:100%;margin-top:10px;padding:12px;border:1px solid ${T.border};border-radius:12px;font-size:13px;font-weight:700;color:${T.textSub};text-decoration:none}
    .rs-bk:active{background:${T.border}}

    /* モーダル */
    .rs-mdl{position:fixed;inset:0;background:rgba(0,0,0,.97);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;pointer-events:none;transition:opacity .25s}
    .rs-mdl.open{opacity:1;pointer-events:all}
    .rs-mdl img{max-width:100%;max-height:88vh;object-fit:contain;border-radius:8px}
    .rs-mdl-cl{position:absolute;top:16px;right:16px;font-size:24px;font-weight:900;color:rgba(255,255,255,.5);cursor:pointer;background:none;border:none}
    `;
    document.head.appendChild(css);

    // ============================================================
    // ヘッダー
    // ============================================================
    const hd = document.createElement('div');
    hd.id = 'rs-hd';
    hd.innerHTML = `<div class="in"><a href="../gallery_works.html">← 戻る</a><span class="no">${isPaas ? '制作' : '施工'}事例 No.${CASE.id}</span><div style="width:48px"></div></div>`;
    document.body.prepend(hd);

    // 免責バッジ
    const db = document.createElement('div');
    db.id = 'rs-disc';
    db.textContent = disc.text;
    document.body.appendChild(db);

    // ============================================================
    // コンテンツ生成
    // ============================================================
    const pg = document.createElement('div');
    pg.className = 'rs-pg';
    let h = '';

    // カラーチップ
    let chips = '';
    if (CASE.mainColor || CASE.accentColor) {
        chips = `<div class="rs-chips">`;
        if (CASE.mainColor) chips += `<div class="rs-chip"><div class="rs-dot" style="background:${CASE.mainColor}"></div>メイン：${CASE.mainColorLabel || CASE.mainColor}</div>`;
        if (CASE.accentColor) chips += `<div class="rs-chip"><div class="rs-dot" style="background:${CASE.accentColor}"></div>イメージ：${CASE.accentColorLabel || CASE.accentColor}</div>`;
        chips += `</div>`;
    }

    h += `<div class="rs-ta">
        <span class="rs-cat ${catCls}">${CASE.category}</span>
        <div class="rs-ttl">${isPaas ? '制作' : '施工'}事例 <span class="rs-ttl-g">No.${CASE.id}</span></div>
        <div class="rs-sub">${CASE.subtitle || ''}</div>
        ${chips}
    </div>`;

    // 写真分類
    let bfCnt = 0, afCnt = 0;
    let mainBf = null, mainAf = null;
    const subBAs = [], subs = [];
    let mat = null, vid = null;

    CASE.photos.forEach(p => {
        if (p.type === 'before') { if (bfCnt++ === 0) mainBf = p; else subBAs.push({ ...p, _t: 'before' }); }
        else if (p.type === 'after') { if (afCnt++ === 0) mainAf = p; else subBAs.push({ ...p, _t: 'after' }); }
        else if (p.type === 'sub') subs.push(p);
        else if (p.type === 'material') mat = p;
        else if (p.type === 'video') vid = p;
    });

    // メインスライダー
    if (mainBf && mainAf) {
        h += `<div class="rs-sec"><p class="rs-lbl">Before / After</p></div>
        <div class="rs-sl" id="rs-sl">
            <div class="rs-sl-af"><img src="${mainAf.url}" alt="After"></div>
            <div class="rs-sl-bf" id="rs-sl-bf"><img src="${mainBf.url}" alt="Before"></div>
            <div class="rs-sl-line" id="rs-sl-ln"></div>
            <div class="rs-sl-hdl" id="rs-sl-hdl">◀▶</div>
            <div class="rs-sl-bdg bf">BEFORE</div>
            <div class="rs-sl-bdg af">AFTER</div>
        </div>`;
    }

    // 2枚目以降 BA（ペアにまとめる）
    const bfs = subBAs.filter(p => p._t === 'before');
    const afs = subBAs.filter(p => p._t === 'after');
    const pairLen = Math.max(bfs.length, afs.length);
    for (let i = 0; i < pairLen; i++) {
        const bf = bfs[i], af = afs[i];
        const lbl = bf?.label || af?.label || '';
        h += `<div class="rs-sec" style="margin-top:20px"><p class="rs-lbl">Before / After</p>${lbl ? `<p class="rs-lbl-sub">${lbl}</p>` : ''}</div>
        <div class="rs-ba">`;
        if (bf) h += `<div class="rs-ba-ph" onclick="rsMdl('${bf.url}')"><img src="${bf.url}" alt="Before"><div class="rs-ba-bdg bf">BEFORE</div>${lbl ? `<div class="rs-ba-lbl">${lbl}</div>` : ''}</div>`;
        if (af) h += `<div class="rs-ba-ph" onclick="rsMdl('${af.url}')"><img src="${af.url}" alt="After"><div class="rs-ba-bdg af">AFTER</div></div>`;
        h += `</div>`;
    }

    // 動画
    if (vid) {
        h += `<div class="rs-sec"><p class="rs-lbl">Movie</p></div>
        <div class="rs-vid"><video src="${vid.url}" ${vid.poster ? `poster="${vid.poster}"` : ''} autoplay muted loop playsinline></video></div>`;
    }

    // More Photos
    if (subs.length > 0) {
        h += `<div class="rs-sec"><p class="rs-lbl">More Photos</p><p class="rs-lbl-sub">別アングル・時間帯別イメージ</p></div><div class="rs-sg">`;
        subs.forEach(s => { h += `<div class="rs-sp" onclick="rsMdl('${s.url}')"><img src="${s.url}" alt="${s.label || ''}"><div class="rs-sp-lbl">${s.label || ''}</div></div>`; });
        h += `</div>`;
    }

    // 素材
    if (mat) {
        const matLbl = isPaas ? '使用パターン素材' : '施工クローズアップ';
        h += `<div class="rs-sec"><p class="rs-lbl">Material</p><p class="rs-lbl-sub">${isPaas ? '使用パターン素材' : '仕上がりの質感'}</p></div>
        <div class="rs-mat" onclick="rsMdl('${mat.url}')"><img src="${mat.url}" alt="${matLbl}"><div class="rs-mat-bdg">${matLbl}</div></div>`;
    }

    // コメント
    if (CASE.comments && CASE.comments.length > 0) {
        h += `<div class="rs-cm"><p class="rs-lbl" style="margin-bottom:12px">Comment</p>`;
        CASE.comments.forEach(c => { h += `<p class="rs-cm-tx">${c}</p>`; });
        h += `</div>`;
    }

    // CTA
    h += `<div class="rs-cta">
        <div class="rs-cta-bx">
            <p class="rs-cta-t">${cta.title}</p>
            <p class="rs-cta-s">${cta.sub}</p>
            <a href="https://lin.ee/EAASJvg" target="_blank" class="rs-cta-ln">${cta.btn}</a>
        </div>
        <a href="../gallery_works.html" class="rs-bk">← 事例一覧に戻る</a>
    </div>`;

    pg.innerHTML = h;
    document.body.appendChild(pg);

    // モーダル
    const mdl = document.createElement('div');
    mdl.className = 'rs-mdl';
    mdl.id = 'rs-mdl';
    mdl.innerHTML = `<img id="rs-mdl-img" src="" alt=""><button class="rs-mdl-cl" onclick="rsMdlCl()">✕</button>`;
    mdl.addEventListener('click', e => { if (e.target === mdl) rsMdlCl(); });
    document.body.appendChild(mdl);

    window.rsMdl = src => { document.getElementById('rs-mdl-img').src = src; document.getElementById('rs-mdl').classList.add('open'); };
    window.rsMdlCl = () => { document.getElementById('rs-mdl').classList.remove('open'); };

    // ============================================================
    // スライダーロジック
    // ============================================================
    const sl = document.getElementById('rs-sl');
    if (sl) {
        const slBf = document.getElementById('rs-sl-bf');
        const slLn = document.getElementById('rs-sl-ln');
        const slHd = document.getElementById('rs-sl-hdl');
        let pos = 50, drag = false;

        function setPos(p) {
            pos = Math.max(2, Math.min(98, p));
            slBf.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
            slLn.style.left = slHd.style.left = pos + '%';
        }
        function pct(x) { const r = sl.getBoundingClientRect(); return ((x - r.left) / r.width) * 100; }

        sl.addEventListener('mousedown', e => { drag = true; setPos(pct(e.clientX)); });
        window.addEventListener('mousemove', e => { if (drag) setPos(pct(e.clientX)); });
        window.addEventListener('mouseup', () => { drag = false; });
        sl.addEventListener('touchstart', e => { drag = true; setPos(pct(e.touches[0].clientX)); }, { passive: true });
        window.addEventListener('touchmove', e => { if (drag) setPos(pct(e.touches[0].clientX)); }, { passive: true });
        window.addEventListener('touchend', () => { drag = false; });

        setPos(50);
    }

})();
