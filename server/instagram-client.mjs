function getConfig(env = process.env) {
  const token = env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const apiVersion = env.INSTAGRAM_API_VERSION?.trim() || 'v24.0';
  const accountId = env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();

  if (!token) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN is not configured on the server.');
  }

  return {
    token,
    accountId,
    graphUrl: `https://graph.instagram.com/${apiVersion}`,
  };
}

async function graphRequest(path, config, options = {}) {
  const body = new URLSearchParams({ ...(options.body || {}), access_token: config.token });
  const response = await fetch(`${config.graphUrl}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: options.method === 'POST' ? body : undefined,
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || `Meta API request failed (${response.status}).`);
  }
  return result;
}

export async function checkInstagramConnection(env = process.env) {
  const config = getConfig(env);
  const account = await graphRequest('/me?fields=user_id,username', config);

  return {
    connected: Boolean(account.id || account.user_id),
    account: {
      id: account.id || account.user_id,
      username: account.username || null,
    },
    permissionsVerifiedSeparately: true,
  };
}

export async function publishReel({ mediaUrl, caption }, env = process.env) {
  const config = getConfig(env);
  const accountId = config.accountId || (await graphRequest('/me?fields=user_id', config)).user_id;
  if (!accountId) throw new Error('Instagram account ID could not be determined.');

  const container = await graphRequest(`/${encodeURIComponent(accountId)}/media`, config, {
    method: 'POST',
    body: { media_type: 'REELS', video_url: mediaUrl, caption },
  });
  if (!container.id) throw new Error('Instagram did not return a media container ID.');

  const published = await graphRequest(`/${encodeURIComponent(accountId)}/media_publish`, config, {
    method: 'POST',
    body: { creation_id: container.id },
  });

  return { containerId: container.id, mediaId: published.id || null };
}
