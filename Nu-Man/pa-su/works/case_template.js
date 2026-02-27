/**
 * case_template.js
 * RollerStone PaaS制作事例 - 共通テンプレート
 *
 * 使い方：
 * 各 case_XXX.html で CASE オブジェクトを定義してから
 * このファイルを読み込むだけでページが描画されます。
 *
 * ============================================================
 * CASE オブジェクトの仕様：
 * 
 * const CASE = {
 *   id: '001',                    // ファイル番号（3桁）
 *   category: '乱形石調',         // 乱形石調 / タイル調 / 特殊・ロゴ
 *   subtitle: '駐車場 — 一戸建て', // サブタイトル
 *   comments: [                   // コメント文（複数可・0でもOK）
 *     'コメント1',
 *     'コメント2',
 *   ],
 *   photos: [
 *     { type: 'before',   url: 'https://...' },         // 必須
 *     { type: 'after',    url: 'https://...' },         // 必須
 *     { type: 'sub',      url: 'https://...', label: '夜のライトアップ' }, // 任意・複数可
 *     { type: 'material', url: 'https://...' },         // 任意
 *   ],
 * };
 * ============================================================
 */

(function () {

    // ============================================================
    // スタイル注入
    // ============================================================
    const style = document.createElement('style');
    style.textContent = `
        body { background-color: #0a0a0a; color: #fff; -webkit-tap-highlight-color: transparent; font-family: 'Noto Sans JP', sans-serif; }
        #rs-header { position: sticky; top: 0; z-index: 50; background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,0.1); }
        #rs-header .inner { max-width: 512px; margin: 0 auto; padding: 1rem; display: flex; align-items: center; justify-content: space-between; }
        #rs-header a { font-size: 11px; font-weight: 900; color: #D4AF37; text-decoration: none; }
        #rs-header .case-no { font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: rgba(255,255,255,0.25); text-transform: uppercase; }

        .rs-page { max-width: 512px; margin: 0 auto; padding-bottom: 6rem; }

        /* タイトルエリア */
        .rs-title-area { padding: 1.5rem 1rem; }
        .rs-cat-tag { display: inline-block; font-size: 9px; font-weight: 900; padding: 3px 12px; border-radius: 999px; letter-spacing: 0.05em; }
        .rs-cat-tag.random   { background: rgba(255,255,255,0.9); color: #111; }
        .rs-cat-tag.tile     { background: rgba(212,175,55,0.9); color: #000; }
        .rs-cat-tag.original { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
        .rs-title { font-size: 22px; font-weight: 900; margin-top: 8px; }
        .rs-title-gold { background: linear-gradient(135deg, #D4AF37, #B8860B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .rs-subtitle { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 4px; }

        /* セクションラベル */
        .rs-section { padding: 0 1rem; margin-top: 2rem; }
        .rs-section-label { font-size: 9px; font-weight: 900; letter-spacing: 0.2em; color: rgba(212,175,55,0.7); text-transform: uppercase; padding-bottom: 6px; }
        .rs-section-sub { font-size: 11px; color: rgba(255,255,255,0.25); margin-bottom: 6px; }

        /* メイン写真（Before/After） */
        .rs-main-photo { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #111; }
        .rs-main-photo img { width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer; transition: transform 0.3s; }
        .rs-main-photo img:active { transform: scale(1.02); }
        .rs-photo-badge { position: absolute; top: 12px; left: 12px; font-size: 10px; font-weight: 900; letter-spacing: 0.15em; padding: 4px 14px; border-radius: 999px; }
        .rs-photo-badge.before { background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.2); }
        .rs-photo-badge.after  { background: rgba(212,175,55,0.9); color: #000; }

        /* 矢印 */
        .rs-arrow { display: flex; align-items: center; justify-content: center; padding: 1rem 0; }
        .rs-arrow-inner { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .rs-arrow-line { width: 1px; height: 20px; background: rgba(212,175,55,0.3); }
        .rs-arrow-icon { color: #D4AF37; font-size: 18px; line-height: 1; }

        /* 追加カットグリッド */
        .rs-sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
        .rs-sub-photo { position: relative; aspect-ratio: 1/1; overflow: hidden; background: #111; cursor: pointer; }
        .rs-sub-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .rs-sub-photo img:active { transform: scale(1.04); }
        .rs-sub-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 10px 8px; font-size: 11px; font-weight: 700; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); }

        /* 素材画像 */
        .rs-material-photo { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #111; cursor: pointer; }
        .rs-material-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
        .rs-material-photo img:active { transform: scale(1.02); }
        .rs-material-badge { position: absolute; top: 10px; left: 10px; font-size: 9px; font-weight: 900; color: rgba(255,255,255,0.6); background: rgba(0,0,0,0.6); padding: 3px 10px; border-radius: 999px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); }

        /* コメント */
        .rs-comments { padding: 0 1rem; margin-top: 2rem; space-y: 8px; }
        .rs-comment-text { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 10px; }

        /* CTA */
        .rs-cta { margin: 2.5rem 1rem 0; }
        .rs-cta-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 1.25rem; padding: 1.5rem; text-align: center; }
        .rs-cta-title { font-size: 14px; font-weight: 900; margin-bottom: 6px; }
        .rs-cta-sub { font-size: 11px; color: rgba(255,255,255,0.35); margin-bottom: 1rem; line-height: 1.6; }
        .rs-cta-line { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #06C755; color: #fff; font-weight: 900; font-size: 15px; padding: 1rem; border-radius: 0.75rem; text-decoration: none; transition: opacity 0.2s; }
        .rs-cta-line:active { opacity: 0.85; }
        .rs-back-btn { display: flex; align-items: center; justify-content: center; width: 100%; margin-top: 0.75rem; padding: 0.75rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 0.75rem; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.3); text-decoration: none; transition: background 0.2s; }
        .rs-back-btn:active { background: rgba(255,255,255,0.05); }

        /* モーダル */
        .rs-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.97); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
        .rs-modal.open { opacity: 1; pointer-events: all; }
        .rs-modal img { max-width: 100%; max-height: 88vh; object-fit: contain; border-radius: 8px; }
        .rs-modal-close { position: absolute; top: 1rem; right: 1rem; font-size: 24px; font-weight: 900; color: rgba(255,255,255,0.4); cursor: pointer; background: none; border: none; }
    `;
    document.head.appendChild(style);

    // ============================================================
    // カテゴリ設定
    // ============================================================
    const catConfig = {
        '乱形石調': { cls: 'random', key: 'random' },
        'タイル調':  { cls: 'tile',   key: 'tile' },
        '特殊・ロゴ': { cls: 'original', key: 'original' },
    };
    const cat = catConfig[CASE.category] || catConfig['乱形石調'];

    // ============================================================
    // ページタイトル設定
    // ============================================================
    document.title = `制作事例 No.${CASE.id} | RollerStone`;

    // ============================================================
    // ヘッダー生成
    // ============================================================
    const header = document.createElement('div');
    header.id = 'rs-header';
    header.innerHTML = `
        <div class="inner">
            <a href="../gallery_works.html">← 戻る</a>
            <span class="case-no">Case No.${CASE.id}</span>
            <div style="width:48px"></div>
        </div>`;
    document.body.prepend(header);

    // ============================================================
    // メインコンテンツ生成
    // ============================================================
    const page = document.createElement('div');
    page.className = 'rs-page';

    let html = '';

    // タイトルエリア
    html += `
    <div class="rs-title-area">
        <span class="rs-cat-tag ${cat.cls}">${CASE.category}</span>
        <div class="rs-title">制作事例 <span class="rs-title-gold">No.${CASE.id}</span></div>
        <div class="rs-subtitle">${CASE.subtitle || ''}</div>
    </div>`;

    // 写真を順番に処理
    let subPhotos = [];
    let beforeDone = false;

    CASE.photos.forEach(photo => {
        if (photo.type === 'before') {
            html += `
            <div class="rs-section"><p class="rs-section-label">Before</p></div>
            <div class="rs-main-photo">
                <img src="${photo.url}" alt="Before" onclick="rsOpenModal('${photo.url}')">
                <div class="rs-photo-badge before">BEFORE</div>
            </div>
            <div class="rs-arrow">
                <div class="rs-arrow-inner">
                    <div class="rs-arrow-line"></div>
                    <div class="rs-arrow-icon">↓</div>
                    <div class="rs-arrow-line"></div>
                </div>
            </div>`;
            beforeDone = true;

        } else if (photo.type === 'after') {
            html += `
            <div class="rs-section"><p class="rs-section-label">After</p></div>
            <div class="rs-main-photo">
                <img src="${photo.url}" alt="After" onclick="rsOpenModal('${photo.url}')">
                <div class="rs-photo-badge after">AFTER</div>
            </div>`;

        } else if (photo.type === 'sub') {
            subPhotos.push(photo);

        } else if (photo.type === 'material') {
            // subPhotosをここで出力
            if (subPhotos.length > 0) {
                html += `
                <div class="rs-section">
                    <p class="rs-section-label">More Photos</p>
                    <p class="rs-section-sub">別アングル・時間帯別イメージ</p>
                </div>
                <div class="rs-sub-grid">`;
                subPhotos.forEach(s => {
                    html += `
                    <div class="rs-sub-photo" onclick="rsOpenModal('${s.url}')">
                        <img src="${s.url}" alt="${s.label || ''}">
                        <div class="rs-sub-label">${s.label || ''}</div>
                    </div>`;
                });
                html += `</div>`;
                subPhotos = [];
            }
            // 素材画像
            html += `
            <div class="rs-section">
                <p class="rs-section-label">Material</p>
                <p class="rs-section-sub">使用パターン素材</p>
            </div>
            <div class="rs-material-photo">
                <img src="${photo.url}" alt="使用素材" onclick="rsOpenModal('${photo.url}')">
                <div class="rs-material-badge">使用素材</div>
            </div>`;
        }
    });

    // subPhotosが残っていれば出力（materialがない場合）
    if (subPhotos.length > 0) {
        html += `
        <div class="rs-section">
            <p class="rs-section-label">More Photos</p>
            <p class="rs-section-sub">別アングル・時間帯別イメージ</p>
        </div>
        <div class="rs-sub-grid">`;
        subPhotos.forEach(s => {
            html += `
            <div class="rs-sub-photo" onclick="rsOpenModal('${s.url}')">
                <img src="${s.url}" alt="${s.label || ''}">
                <div class="rs-sub-label">${s.label || ''}</div>
            </div>`;
        });
        html += `</div>`;
    }

    // コメント
    if (CASE.comments && CASE.comments.length > 0) {
        html += `
        <div class="rs-comments">
            <p class="rs-section-label">Comment</p>`;
        CASE.comments.forEach(c => {
            html += `<p class="rs-comment-text">${c}</p>`;
        });
        html += `</div>`;
    }

    // CTA
    html += `
    <div class="rs-cta">
        <div class="rs-cta-box">
            <p class="rs-cta-title">このデザインが気になりましたか？</p>
            <p class="rs-cta-sub">あなたのお家の写真を送るだけで<br>無料で完成イメージを作成します</p>
            <a href="https://lin.ee/EAASJvg" target="_blank" class="rs-cta-line">
                LINEで無料イメージ作成を依頼
            </a>
        </div>
        <a href="../gallery_works.html" class="rs-back-btn">← 事例一覧に戻る</a>
    </div>`;

    page.innerHTML = html;
    document.body.appendChild(page);

    // モーダル
    const modal = document.createElement('div');
    modal.className = 'rs-modal';
    modal.id = 'rs-modal';
    modal.innerHTML = `
        <img id="rs-modal-img" src="" alt="拡大画像">
        <button class="rs-modal-close" onclick="rsCloseModal()">✕</button>`;
    modal.addEventListener('click', function(e) {
        if (e.target === modal) rsCloseModal();
    });
    document.body.appendChild(modal);

    // ============================================================
    // モーダル関数（グローバル）
    // ============================================================
    window.rsOpenModal = function(src) {
        document.getElementById('rs-modal-img').src = src;
        document.getElementById('rs-modal').classList.add('open');
    };
    window.rsCloseModal = function() {
        document.getElementById('rs-modal').classList.remove('open');
    };

})();
