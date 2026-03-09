/**
 * Roller Stone - Notion API Proxy (Cloudflare Workers)
 * =====================================================
 * 現場管理ダッシュボード用 Notion APIプロキシ
 *
 * Cloudflare Workers環境変数（Secrets）に設定が必要：
 *   NOTION_API_KEY   : Notion Integration Token (secret_xxx...)
 *   NOTION_DATABASE_ID : 【一覧】現場管理 データベースのID
 *
 * エンドポイント一覧：
 *   GET  /schema        → Notionデータベースのプロパティ定義を取得
 *   GET  /pages         → データベースの全案件を取得
 *   POST /pages         → 新規案件をNotionに作成
 *   PATCH /pages/:id    → 既存案件を更新
 *
 * デプロイ方法：
 *   1. wrangler.toml を設定（または Cloudflare Dashboard から直接デプロイ）
 *   2. `wrangler secret put NOTION_API_KEY` でAPIキーを設定
 *   3. `wrangler secret put NOTION_DATABASE_ID` でDB IDを設定
 *   4. `wrangler deploy` でデプロイ
 */

const NOTION_VERSION = '2022-06-28';
const NOTION_BASE    = 'https://api.notion.com/v1';

// =============================================
// CORS ヘッダー（genba-dashboard.html からのリクエストを許可）
// =============================================
const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',  // 本番では特定のドメインに制限推奨
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age':       '86400',
};

// =============================================
// ENTRY POINT
// =============================================
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // CORS プリフライト
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url  = new URL(request.url);
  const path = url.pathname.replace(/\/$/, ''); // 末尾スラッシュ除去

  try {
    // ルーティング
    if (path === '/schema' && request.method === 'GET') {
      return await getSchema(request);
    }
    if (path === '/pages' && request.method === 'GET') {
      return await listPages(request, url);
    }
    if (path === '/pages' && request.method === 'POST') {
      return await createPage(request);
    }
    if (path.startsWith('/pages/') && request.method === 'PATCH') {
      const pageId = path.replace('/pages/', '');
      return await updatePage(request, pageId);
    }

    // 404
    return jsonResponse({ error: 'Not Found', path }, 404);

  } catch (err) {
    console.error('Worker error:', err);
    return jsonResponse({ error: 'Internal Server Error', message: err.message }, 500);
  }
}

// =============================================
// GET /schema
// Notionデータベースのプロパティ定義を返す
// フロントエンドが動的にフィールドを把握するために使用
// =============================================
async function getSchema(request) {
  const res = await notionFetch(`/databases/${NOTION_DATABASE_ID}`);
  if (!res.ok) {
    const err = await res.json();
    return jsonResponse({ error: 'Notion API error', details: err }, res.status);
  }
  const data = await res.json();
  return jsonResponse({
    id:         data.id,
    title:      data.title?.[0]?.plain_text || '',
    properties: data.properties,
  });
}

// =============================================
// GET /pages
// データベースの全案件を取得（最大100件、ページネーション対応）
// =============================================
async function listPages(request, url) {
  const statusFilter = url.searchParams.get('status'); // オプション: ステータスで絞り込み
  const startCursor  = url.searchParams.get('cursor');

  const body = {
    page_size: 100,
    sorts: [{ property: '見積日', direction: 'descending' }],
  };

  if (statusFilter) {
    body.filter = {
      property: 'ステータス',
      select:   { equals: statusFilter },
    };
  }

  if (startCursor) {
    body.start_cursor = startCursor;
  }

  const res = await notionFetch(`/databases/${NOTION_DATABASE_ID}/query`, 'POST', body);
  if (!res.ok) {
    const err = await res.json();
    return jsonResponse({ error: 'Notion API error', details: err }, res.status);
  }

  const data = await res.json();
  return jsonResponse({
    results:     data.results,
    has_more:    data.has_more,
    next_cursor: data.next_cursor,
    total:       data.results?.length,
  });
}

// =============================================
// POST /pages
// 新規案件をNotionデータベースに作成
// =============================================
async function createPage(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  // バリデーション
  if (!body.properties) {
    return jsonResponse({ error: 'Missing required field: properties' }, 400);
  }

  const notionBody = {
    parent:     { database_id: NOTION_DATABASE_ID },
    properties: body.properties,
  };

  const res = await notionFetch('/pages', 'POST', notionBody);
  if (!res.ok) {
    const err = await res.json();
    return jsonResponse({ error: 'Notion API error', details: err }, res.status);
  }

  const data = await res.json();
  return jsonResponse({ id: data.id, url: data.url, created_time: data.created_time }, 201);
}

// =============================================
// PATCH /pages/:id
// 既存案件のプロパティを更新
// =============================================
async function updatePage(request, pageId) {
  if (!pageId || pageId.length < 10) {
    return jsonResponse({ error: 'Invalid page ID' }, 400);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.properties) {
    return jsonResponse({ error: 'Missing required field: properties' }, 400);
  }

  // アーカイブ（削除）フラグのサポート
  const notionBody = {
    properties: body.properties,
  };
  if (body.archived !== undefined) {
    notionBody.archived = body.archived;
  }

  const res = await notionFetch(`/pages/${pageId}`, 'PATCH', notionBody);
  if (!res.ok) {
    const err = await res.json();
    return jsonResponse({ error: 'Notion API error', details: err }, res.status);
  }

  const data = await res.json();
  return jsonResponse({ id: data.id, last_edited_time: data.last_edited_time });
}

// =============================================
// UTILITY: Notion API Fetch
// =============================================
async function notionFetch(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization':  `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type':   'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(`${NOTION_BASE}${endpoint}`, options);
}

// =============================================
// UTILITY: JSON Response with CORS headers
// =============================================
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}
