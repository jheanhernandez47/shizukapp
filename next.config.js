/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: process.env.NEXT_OUTPUT_MODE ? path.join(__dirname, '../') : '/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  // Dev chunk URLs are not content-hashed, so a cached copy outlives an edit.
  async headers() {
    if (process.env.NODE_ENV !== 'development') return [];
    return [{ source: '/_next/static/:path*', headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }] }];
  },
  // Next 16 BLOCKS unlisted origins on /_next/* and /__nextjs* in dev — including the /_next/hmr
  // WEBSOCKET upgrade, and Turbopack gates client module wiring on that socket, so a blocked origin
  // means the page renders but never hydrates, with no console error (the block writes a raw
  // non-HTTP reply onto the upgrade socket). Every conversation sharing this project directory —
  // the root and each of its forks — previews from its OWN subdomain against this one config, so
  // each of their hosts is named here; listing only the current one leaves the others hydrating
  // never. Plus 127.0.0.1 because Next's built-in default covers `localhost` but not the IP, and
  // the platform's browser checks on the pod browse via 127.0.0.1. Enumerated hosts, never a
  // wildcard: every conversation previews under the same parent domain and serves content its own
  // author controls, so `**.<domain>` would let any UNRELATED app's preview reach this dev server.
  allowedDevOrigins: ['127.0.0.1', '5e1c43486.na124.preview.abacusai.app'],
};

const fs = require('fs');
const userConfigPath = path.join(__dirname, 'next.config.user.json');
const userConfigAllowedKeys = { skipTrailingSlashRedirect: 'boolean', trailingSlash: 'boolean', serverExternalPackages: 'string[]', transpilePackages: 'string[]', outputFileTracingIncludes: 'string[] map' };
const userConfigKeyPaths = {};
const isStringList = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
const isStringListMap = (value) => !!value && typeof value === 'object' && !Array.isArray(value) && Object.values(value).every(isStringList);
const unionList = (base, extra) => [...new Set([...(base || []), ...extra])];
const userConfigMerge = {
  'boolean': (base, value) => value,
  'string[]': unionList,
  'string[] map': (base, value) => Object.fromEntries([...Object.keys(base || {}), ...Object.keys(value)].map((route) => [route, unionList((base || {})[route], value[route] || [])])),
};
const userConfigCheck = { 'boolean': (value) => typeof value === 'boolean', 'string[]': isStringList, 'string[] map': isStringListMap };
if (fs.existsSync(userConfigPath)) {
  const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
  for (const key of Object.keys(userConfig)) {
    const expected = userConfigAllowedKeys[key];
    if (!expected || !userConfigCheck[expected](userConfig[key])) {
      throw new Error(`next.config.user.json: unsupported override "${key}". Supported keys: skipTrailingSlashRedirect (boolean), trailingSlash (boolean), serverExternalPackages (string[]), transpilePackages (string[]), outputFileTracingIncludes (string[] map).`);
    }
    const keyPath = userConfigKeyPaths[key] || [key];
    let target = nextConfig;
    for (const part of keyPath.slice(0, -1)) target = target[part] = target[part] || {};
    const leaf = keyPath[keyPath.length - 1];
    target[leaf] = userConfigMerge[expected](target[leaf], userConfig[key]);
  }
}

module.exports = nextConfig;

