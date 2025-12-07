import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, setCookie, deleteCookie, getCookie, readFormData, getHeader, setHeader, getResponseStatusText } from 'file://G:/lcjNotes/lcjNotes/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://G:/lcjNotes/lcjNotes/node_modules/@vue/shared/dist/shared.cjs.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://G:/lcjNotes/lcjNotes/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file://G:/lcjNotes/lcjNotes/node_modules/ufo/dist/index.mjs';
import process$1 from 'node:process';
import { renderToString } from 'file://G:/lcjNotes/lcjNotes/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://G:/lcjNotes/lcjNotes/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://G:/lcjNotes/lcjNotes/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://G:/lcjNotes/lcjNotes/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://G:/lcjNotes/lcjNotes/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://G:/lcjNotes/lcjNotes/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://G:/lcjNotes/lcjNotes/node_modules/devalue/index.js';
import { isVNode, toValue, isRef } from 'file://G:/lcjNotes/lcjNotes/node_modules/vue/index.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://G:/lcjNotes/lcjNotes/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://G:/lcjNotes/lcjNotes/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://G:/lcjNotes/lcjNotes/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://G:/lcjNotes/lcjNotes/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://G:/lcjNotes/lcjNotes/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://G:/lcjNotes/lcjNotes/node_modules/unstorage/drivers/fs.mjs';
import unstorage_47drivers_47memory from 'file://G:/lcjNotes/lcjNotes/node_modules/unstorage/drivers/memory.mjs';
import { digest } from 'file://G:/lcjNotes/lcjNotes/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://G:/lcjNotes/lcjNotes/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://G:/lcjNotes/lcjNotes/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://G:/lcjNotes/lcjNotes/node_modules/youch-core/build/index.js';
import { Youch } from 'file://G:/lcjNotes/lcjNotes/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://G:/lcjNotes/lcjNotes/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://G:/lcjNotes/lcjNotes/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://G:/lcjNotes/lcjNotes/node_modules/errx/dist/index.js';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://G:/lcjNotes/lcjNotes/node_modules/pathe/dist/index.mjs';
import { walkResolver } from 'file://G:/lcjNotes/lcjNotes/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"G:/lcjNotes/lcjNotes/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('kv', unstorage_47drivers_47memory({"driver":"memory"}));
storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"G:/lcjNotes/lcjNotes","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"G:/lcjNotes/lcjNotes/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"G:/lcjNotes/lcjNotes/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"G:/lcjNotes/lcjNotes/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"G:/lcjNotes/lcjNotes/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "turnstileSiteKey": ""
  },
  "adminPassword": "admin123",
  "sessionSecret": "",
  "r2PublicUrl": "https://photo.lcjlq.com",
  "turnstileSecretKey": ""
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const iframeStorageBridge = (nonce) => (
  /* js */
  `
(function() {
  const memoryStore = {};

  const NONCE = ${JSON.stringify(nonce)}
  
  const mockStorage = {
    getItem: function(key) {
      return memoryStore[key] !== undefined ? memoryStore[key] : null;
    },
    setItem: function(key, value) {
      memoryStore[key] = String(value);
      window.parent.postMessage({
        type: 'storage-set',
        key: key,
        value: String(value),
        nonce: NONCE
      }, '*');
    },
    removeItem: function(key) {
      delete memoryStore[key];
      window.parent.postMessage({
        type: 'storage-remove',
        key: key,
        nonce: NONCE
      }, '*');
    },
    clear: function() {
      for (const key in memoryStore) {
        delete memoryStore[key];
      }
      window.parent.postMessage({
        type: 'storage-clear',
        nonce: NONCE
      }, '*');
    },
    key: function(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] !== undefined ? keys[index] : null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };
  
  try {
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: false,
      configurable: true
    });
  } catch (e) {
    window.localStorage = mockStorage;
  }
  
  window.addEventListener('message', function(event) {
    if (event.data.type === 'storage-sync-data' && event.data.nonce === NONCE) {
      const data = event.data.data;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          memoryStore[key] = data[key];
        }
      }
      if (typeof window.initTheme === 'function') {
        window.initTheme();
      }
      window.dispatchEvent(new Event('storage-ready'));
    }
  });
  
  window.parent.postMessage({ 
    type: 'storage-sync-request',
    nonce: NONCE
  }, '*');
})();
`
);
const parentStorageBridge = (nonce) => (
  /* js */
  `
(function() {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;
  
  // Wait for shadow root to be attached
  const checkShadow = setInterval(function() {
    if (host.shadowRoot) {
      clearInterval(checkShadow);
      const iframe = host.shadowRoot.getElementById('frame');
      if (!iframe) return;

      const NONCE = ${JSON.stringify(nonce)}
      
      window.addEventListener('message', function(event) {
        if (!event.data || event.data.nonce !== NONCE) return;
        
        const data = event.data;
        
        if (data.type === 'storage-set') {
          localStorage.setItem(data.key, data.value);
        } else if (data.type === 'storage-remove') {
          localStorage.removeItem(data.key);
        } else if (data.type === 'storage-clear') {
          localStorage.clear();
        } else if (data.type === 'storage-sync-request') {
          const allData = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            allData[key] = localStorage.getItem(key);
          }
          iframe.contentWindow.postMessage({
            type: 'storage-sync-data',
            data: allData,
            nonce: NONCE
          }, '*');
        }
      });
    }
  }, 10);
})();
`
);
const errorCSS = (
  /* css */
  `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  right: 5px;
  bottom: 5px;
  left: auto;
  top: auto;
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: bottom right;
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  right: 5px;
  bottom: 5px;
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 8px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  right: 5px;
  bottom: 5px;
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 3px;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`
);
function webComponentScript(base64HTML, startMinimized) {
  return (
    /* js */
    `
  (function() {
    try {
      const host = document.querySelector('nuxt-error-overlay');
      if (!host) return;
      
      const shadow = host.attachShadow({ mode: 'open' });
      
      // Create elements
      const style = document.createElement('style');
      style.textContent = ${JSON.stringify(errorCSS)};
      
      const iframe = document.createElement('iframe');
      iframe.id = 'frame';
      iframe.src = 'data:text/html;base64,${base64HTML}';
      iframe.title = 'Detailed error stack trace';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      
      const preview = document.createElement('div');
      preview.id = 'preview';
      
      const button = document.createElement('button');
      button.id = 'toggle';
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('type', 'button');
      button.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';
      
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      
      // Update preview snapshot
      function updatePreview() {
        try {
          let previewIframe = preview.querySelector('iframe');
          if (!previewIframe) {
            previewIframe = document.createElement('iframe');
            previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
            previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
            preview.appendChild(previewIframe);
          }
          
          const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
          const cleanedHTML = document.documentElement.outerHTML
            .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
            .replace(/<script[^>]*>.*?<\\/script>/gs, '');
          
          const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(doctype + cleanedHTML);
          iframeDoc.close();
        } catch (error) {
          console.error('Failed to update preview:', error);
        }
      }
      
      function toggleView() {
        const isMinimized = iframe.hasAttribute('inert');
        
        if (isMinimized) {
          updatePreview();
          iframe.removeAttribute('inert');
          button.setAttribute('aria-expanded', 'true');
          liveRegion.textContent = 'Showing detailed error view';
          setTimeout(function() {
            try { iframe.contentWindow.focus(); } catch {}
          }, 100);
        } else {
          iframe.setAttribute('inert', '');
          button.setAttribute('aria-expanded', 'false');
          liveRegion.textContent = 'Showing error page';
          button.focus();
        }
      }
      
      button.onclick = toggleView;
      
      document.addEventListener('keydown', function(e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && !iframe.hasAttribute('inert')) {
          toggleView();
        }
      });
      
      // Append to shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(liveRegion);
      shadow.appendChild(iframe);
      shadow.appendChild(preview);
      shadow.appendChild(button);
      
      if (${startMinimized}) {
        iframe.setAttribute('inert', '');
        button.setAttribute('aria-expanded', 'false');
      }
      
      // Initialize preview
      setTimeout(updatePreview, 100);
      
    } catch (error) {
      console.error('Failed to initialize Nuxt error overlay:', error);
    }
  })();
  `
  );
}
function generateErrorOverlayHTML(html, options) {
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
  const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
  return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return error500; });
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  {
    const prettyResponse = await defaultHandler(error, event, { json: false });
    return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= statusCode && statusCode < 500 })}</body>`));
  }
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _a8G5zQjNbMZqOJDuY5Q3bQXMLlbys_A8j40O7J2SHbI = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "G:/lcjNotes/lcjNotes";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1.0"}],"link":[{"rel":"icon","type":"image/svg+xml","href":"/images/lcj.svg"},{"rel":"icon","type":"image/x-icon","href":"/favicon.ico"},{"rel":"shortcut icon","type":"image/x-icon","href":"/favicon.ico"},{"rel":"apple-touch-icon","href":"/images/lcj.svg"},{"rel":"stylesheet","href":"/styles/styles.css"}],"style":[],"script":[],"noscript":[],"title":"Leyili 花园"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _KALrG6HWC5DsF1iB5xLtcxqD_gXRBB5_KIe3mv6Ln4 = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

const plugins = [
  _a8G5zQjNbMZqOJDuY5Q3bQXMLlbys_A8j40O7J2SHbI,
_KALrG6HWC5DsF1iB5xLtcxqD_gXRBB5_KIe3mv6Ln4
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _FLioW9 = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file://G:/lcjNotes/lcjNotes/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file://G:/lcjNotes/lcjNotes/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const precomputed = void 0 ;
  const renderer = createRenderer(createSSRApp, {
    precomputed,
    manifest: await getClientManifest() ,
    renderToString: renderToString$1,
    buildAssetsURL
  });
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process$1.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const precomputed = void 0 ;
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const renderer = createRenderer(() => () => {
  }, {
    precomputed,
    manifest: await getClientManifest() ,
    renderToString: () => spaTemplate,
    buildAssetsURL
  });
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", err);
    throw err;
  });
  if (ssrContext.payload?.error) {
    throw ssrContext.payload.error;
  }
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  {
    const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      ssrContext.head.push({ link }, { mode: "server" });
    }
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  islandHead.link ||= [];
  islandHead.style ||= [];
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr$1(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

const _lazy_aEiV1C = () => Promise.resolve().then(function () { return delete_delete$1; });
const _lazy_smjiin = () => Promise.resolve().then(function () { return list_get$1; });
const _lazy_e1Y4kR = () => Promise.resolve().then(function () { return upload_post$1; });
const _lazy_uOvIXJ = () => Promise.resolve().then(function () { return check_get$1; });
const _lazy_8rD6vD = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_ixVewG = () => Promise.resolve().then(function () { return logout_post$1; });
const _lazy_gB5Uww = () => Promise.resolve().then(function () { return _id__delete$b; });
const _lazy_hs2uJU = () => Promise.resolve().then(function () { return _id__put$7; });
const _lazy_M_b7Ju = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_OKdLjG = () => Promise.resolve().then(function () { return index_post$9; });
const _lazy_FiCS1Z = () => Promise.resolve().then(function () { return _id__delete$9; });
const _lazy_OrlA9B = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_pOMziW = () => Promise.resolve().then(function () { return index_post$7; });
const _lazy_BEKpHc = () => Promise.resolve().then(function () { return requests_get$1; });
const _lazy_IfwBLS = () => Promise.resolve().then(function () { return requests_post$1; });
const _lazy_8cq4Ls = () => Promise.resolve().then(function () { return _id__delete$7; });
const _lazy_xLpzv7 = () => Promise.resolve().then(function () { return _id__put$5; });
const _lazy_hj5OPM = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_FJmxsN = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_6JO4iF = () => Promise.resolve().then(function () { return index_post$5; });
const _lazy_q2UsGM = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_wor7G3 = () => Promise.resolve().then(function () { return _id__get$3; });
const _lazy_XAjtWz = () => Promise.resolve().then(function () { return _id__put$3; });
const _lazy_tl6Nen = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_5cTgls = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_Sj_N1V = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_6e4dXp = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_089ywm = () => Promise.resolve().then(function () { return _id__put$1; });
const _lazy_JEeuNG = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_9MANWN = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_deYfGK = () => Promise.resolve().then(function () { return ____path__get$1; });
const _lazy_JkGPIo = () => Promise.resolve().then(function () { return image_post$1; });
const _lazy_DuBKWK = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _FLioW9, lazy: false, middleware: true, method: undefined },
  { route: '/api/assets/delete', handler: _lazy_aEiV1C, lazy: true, middleware: false, method: "delete" },
  { route: '/api/assets/list', handler: _lazy_smjiin, lazy: true, middleware: false, method: "get" },
  { route: '/api/assets/upload', handler: _lazy_e1Y4kR, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/check', handler: _lazy_uOvIXJ, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/login', handler: _lazy_8rD6vD, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_ixVewG, lazy: true, middleware: false, method: "post" },
  { route: '/api/bookmarks/:id', handler: _lazy_gB5Uww, lazy: true, middleware: false, method: "delete" },
  { route: '/api/bookmarks/:id', handler: _lazy_hs2uJU, lazy: true, middleware: false, method: "put" },
  { route: '/api/bookmarks', handler: _lazy_M_b7Ju, lazy: true, middleware: false, method: "get" },
  { route: '/api/bookmarks', handler: _lazy_OKdLjG, lazy: true, middleware: false, method: "post" },
  { route: '/api/friends/:id', handler: _lazy_FiCS1Z, lazy: true, middleware: false, method: "delete" },
  { route: '/api/friends', handler: _lazy_OrlA9B, lazy: true, middleware: false, method: "get" },
  { route: '/api/friends', handler: _lazy_pOMziW, lazy: true, middleware: false, method: "post" },
  { route: '/api/friends/requests', handler: _lazy_BEKpHc, lazy: true, middleware: false, method: "get" },
  { route: '/api/friends/requests', handler: _lazy_IfwBLS, lazy: true, middleware: false, method: "post" },
  { route: '/api/friends/requests/:id', handler: _lazy_8cq4Ls, lazy: true, middleware: false, method: "delete" },
  { route: '/api/friends/requests/:id', handler: _lazy_xLpzv7, lazy: true, middleware: false, method: "put" },
  { route: '/api/messages/:id', handler: _lazy_hj5OPM, lazy: true, middleware: false, method: "delete" },
  { route: '/api/messages', handler: _lazy_FJmxsN, lazy: true, middleware: false, method: "get" },
  { route: '/api/messages', handler: _lazy_6JO4iF, lazy: true, middleware: false, method: "post" },
  { route: '/api/moments/:id', handler: _lazy_q2UsGM, lazy: true, middleware: false, method: "delete" },
  { route: '/api/moments/:id', handler: _lazy_wor7G3, lazy: true, middleware: false, method: "get" },
  { route: '/api/moments/:id', handler: _lazy_XAjtWz, lazy: true, middleware: false, method: "put" },
  { route: '/api/moments', handler: _lazy_tl6Nen, lazy: true, middleware: false, method: "get" },
  { route: '/api/moments', handler: _lazy_5cTgls, lazy: true, middleware: false, method: "post" },
  { route: '/api/posts/:id', handler: _lazy_Sj_N1V, lazy: true, middleware: false, method: "delete" },
  { route: '/api/posts/:id', handler: _lazy_6e4dXp, lazy: true, middleware: false, method: "get" },
  { route: '/api/posts/:id', handler: _lazy_089ywm, lazy: true, middleware: false, method: "put" },
  { route: '/api/posts', handler: _lazy_JEeuNG, lazy: true, middleware: false, method: "get" },
  { route: '/api/posts', handler: _lazy_9MANWN, lazy: true, middleware: false, method: "post" },
  { route: '/api/r2/**:path', handler: _lazy_deYfGK, lazy: true, middleware: false, method: "get" },
  { route: '/api/upload/image', handler: _lazy_JkGPIo, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_DuBKWK, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_DuBKWK, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "This page is temporarily unavailable." };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml(messages.statusCode) + " - " + escapeHtml(messages.statusMessage) + " | " + escapeHtml(messages.appName) + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black"><div class="-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight"></div><div class="max-w-520px text-center"><h1 class="font-medium mb-8 sm:text-10xl text-8xl">` + escapeHtml(messages.statusCode) + '</h1><p class="font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl">' + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

function getR2Storage(event) {
  var _a, _b;
  const env = (_b = (_a = event.context) == null ? void 0 : _a.cloudflare) == null ? void 0 : _b.env;
  if (env == null ? void 0 : env.BLOG_R2) {
    return env.BLOG_R2;
  }
  throw new Error("R2 storage not available. Please configure BLOG_R2 binding in Cloudflare Pages.");
}
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
function generateFileName(originalName) {
  var _a;
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const uuid = generateUUID();
  const ext = ((_a = originalName.split(".").pop()) == null ? void 0 : _a.toLowerCase()) || "jpg";
  const validExts = ["jpg", "jpeg", "png", "webp", "gif"];
  const finalExt = validExts.includes(ext) ? ext : "jpg";
  return `assets/${year}-${month}/${uuid}.${finalExt}`;
}
function generateAssetFileName(originalName) {
  return generateFileName(originalName);
}
function isValidImageType(mimeType) {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  return allowedTypes.includes(mimeType);
}

function isProduction() {
  return process.env.NITRO_PRESET === "cloudflare-pages";
}
function createSafeError(statusCode, defaultMessage, error) {
  if (isProduction()) {
    return createError({
      statusCode,
      message: defaultMessage
    });
  }
  const message = (error == null ? void 0 : error.message) ? `${defaultMessage}: ${error.message}` : defaultMessage;
  return createError({
    statusCode,
    message
  });
}
function handleApiError(error, defaultMessage, statusCode = 500) {
  if (error.statusCode) {
    throw error;
  }
  throw createSafeError(statusCode, defaultMessage, error);
}

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const SESSION_SECRET_MIN_LENGTH = 32;
function getSessionSecret() {
  const config = useRuntimeConfig();
  const secret = config.sessionSecret || process.env.SESSION_SECRET;
  if (secret && secret.length >= SESSION_SECRET_MIN_LENGTH) {
    return secret;
  }
  if (process.env.NITRO_PRESET === "cloudflare-pages") {
    throw new Error("SESSION_SECRET must be configured in production environment");
  }
  console.warn("\u26A0\uFE0F  Warning: Using default session secret in development. Set SESSION_SECRET in production!");
  return "dev-session-secret-key-change-in-production-" + Date.now();
}
async function encryptSession(data, secret) {
  try {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const secretBytes = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, dataBytes);
    const signatureArray = new Uint8Array(signature);
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
    const dataBase64 = btoa(String.fromCharCode(...dataBytes));
    const timestamp = Date.now();
    return `${dataBase64}.${signatureBase64}.${timestamp}`;
  } catch (error) {
    console.error("Session encryption error:", error);
    throw error;
  }
}
async function decryptSession(encrypted, secret) {
  try {
    const parts = encrypted.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const [dataBase64, signatureBase64, timestamp] = parts;
    const sessionTime = parseInt(timestamp, 10);
    if (Date.now() - sessionTime > SESSION_MAX_AGE * 1e3) {
      return null;
    }
    const encoder = new TextEncoder();
    const dataBytes = Uint8Array.from(atob(dataBase64), (c) => c.charCodeAt(0));
    const secretBytes = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signature = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify("HMAC", key, signature, dataBytes);
    if (!isValid) {
      return null;
    }
    return atob(dataBase64);
  } catch (error) {
    console.error("Session decryption error:", error);
    return null;
  }
}
async function createSession(event, sessionData) {
  const secret = getSessionSecret();
  const sessionJson = JSON.stringify(sessionData);
  const encrypted = await encryptSession(sessionJson, secret);
  setCookie(event, SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NITRO_PRESET === "cloudflare-pages",
    // 生产环境使用 HTTPS
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/"
  });
}
async function getUserSession(event) {
  const encrypted = getCookie(event, SESSION_COOKIE_NAME);
  if (!encrypted) {
    return null;
  }
  const secret = getSessionSecret();
  const decrypted = await decryptSession(encrypted, secret);
  if (!decrypted) {
    return null;
  }
  try {
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Session parse error:", error);
    return null;
  }
}
function destroySession(event) {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NITRO_PRESET === "cloudflare-pages",
    sameSite: "strict",
    path: "/"
  });
}
async function isAuthenticated(event) {
  const session = await getUserSession(event);
  return session !== null;
}
async function requireAuth(event) {
  const session = await getUserSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      message: "\u672A\u6388\u6743\u8BBF\u95EE\uFF0C\u8BF7\u5148\u767B\u5F55"
    });
  }
}

async function verifyAuth(event) {
  await requireAuth(event);
}
async function isAdmin(event) {
  try {
    await requireAuth(event);
    return true;
  } catch {
    return false;
  }
}

const auth = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  isAdmin: isAdmin,
  verifyAuth: verifyAuth
}, Symbol.toStringTag, { value: 'Module' }));

const delete_delete = defineEventHandler(async (event) => {
  await verifyAuth(event);
  try {
    const query = getQuery$1(event);
    const key = query.key;
    if (!key) {
      throw createError({
        statusCode: 400,
        message: "\u7F3A\u5C11\u6587\u4EF6 key \u53C2\u6570"
      });
    }
    if (!key.startsWith("assets/")) {
      throw createError({
        statusCode: 400,
        message: "\u53EA\u80FD\u5220\u9664 assets \u76EE\u5F55\u4E0B\u7684\u6587\u4EF6"
      });
    }
    const r2 = getR2Storage(event);
    await r2.delete(key);
    return {
      success: true,
      message: "\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u5220\u9664\u5931\u8D25", 500);
  }
});

const delete_delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: delete_delete
}, Symbol.toStringTag, { value: 'Module' }));

const list_get = defineEventHandler(async (event) => {
  await verifyAuth(event);
  try {
    const r2 = getR2Storage(event);
    const query = getQuery$1(event);
    const cursor = query.cursor;
    const limit = Math.min(parseInt(query.limit) || 50, 100);
    const listOptions = {
      limit,
      prefix: "assets/"
      // 只列出 assets 目录下的文件
    };
    if (cursor) {
      listOptions.cursor = cursor;
    }
    const result = await r2.list(listOptions);
    const imageFiles = (result.objects || []).filter((obj) => {
      const name = obj.key.toLowerCase();
      return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp") || name.endsWith(".gif");
    });
    const r2PublicUrl = useRuntimeConfig().r2PublicUrl;
    const assets = imageFiles.map((obj) => {
      const fileName = obj.key;
      const publicUrl = r2PublicUrl ? `${r2PublicUrl}/${fileName}` : `/api/r2/${fileName}`;
      return {
        key: fileName,
        name: fileName.split("/").pop() || fileName,
        url: publicUrl,
        size: obj.size || 0,
        uploaded: obj.uploaded ? new Date(obj.uploaded).toISOString() : null,
        etag: obj.etag || ""
      };
    });
    assets.sort((a, b) => {
      const timeA = a.uploaded ? new Date(a.uploaded).getTime() : 0;
      const timeB = b.uploaded ? new Date(b.uploaded).getTime() : 0;
      return timeB - timeA;
    });
    return {
      success: true,
      data: {
        assets,
        cursor: result.cursor || null,
        truncated: result.truncated || false,
        hasMore: result.truncated || false
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u83B7\u53D6\u56FE\u7247\u5217\u8868\u5931\u8D25", 500);
  }
});

const list_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: list_get
}, Symbol.toStringTag, { value: 'Module' }));

const upload_post = defineEventHandler(async (event) => {
  await verifyAuth(event);
  try {
    const formData = await readFormData(event);
    const file = formData.get("file");
    if (!file) {
      throw createError({
        statusCode: 400,
        message: "\u6CA1\u6709\u4E0A\u4F20\u6587\u4EF6"
      });
    }
    if (!isValidImageType(file.type)) {
      throw createError({
        statusCode: 400,
        message: "\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B\uFF0C\u4EC5\u652F\u6301\uFF1AJPEG, PNG, WebP, GIF"
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw createError({
        statusCode: 400,
        message: "\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 10MB"
      });
    }
    const r2 = getR2Storage(event);
    const fileName = generateAssetFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await r2.put(fileName, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000"
        // 缓存 1 年
      }
    });
    const r2PublicUrl = useRuntimeConfig().r2PublicUrl;
    const publicUrl = r2PublicUrl ? `${r2PublicUrl}/${fileName}` : `/api/r2/${fileName}`;
    return {
      success: true,
      data: {
        key: fileName,
        name: fileName.split("/").pop() || fileName,
        url: publicUrl,
        size: file.size,
        type: file.type
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u4E0A\u4F20\u5931\u8D25", 500);
  }
});

const upload_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: upload_post
}, Symbol.toStringTag, { value: 'Module' }));

const check_get = defineEventHandler(async (event) => {
  const authenticated = await isAuthenticated(event);
  return {
    success: true,
    authenticated
  };
});

const check_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: check_get
}, Symbol.toStringTag, { value: 'Module' }));

async function verifyTurnstile(token, secretKey, remoteip) {
  if (!token || !secretKey) {
    return false;
  }
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip
      })
    });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

const login_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
  const adminUsername = "lcj";
  if (!adminPassword) {
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u672A\u914D\u7F6E\u7BA1\u7406\u5458\u5BC6\u7801"
    });
  }
  const turnstileSecretKey = useRuntimeConfig().turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u5B8C\u6210\u4EBA\u673A\u9A8C\u8BC1"
      });
    }
    const clientIP = getHeader(event, "cf-connecting-ip") || ((_b = (_a = getHeader(event, "x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) || "unknown";
    const isValid = await verifyTurnstile(turnstileToken, turnstileSecretKey, clientIP);
    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: "\u4EBA\u673A\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
      });
    }
  }
  if (body.username !== adminUsername) {
    throw createError({
      statusCode: 401,
      message: "\u7528\u6237\u540D\u9519\u8BEF"
    });
  }
  if (body.password !== adminPassword) {
    throw createError({
      statusCode: 401,
      message: "\u5BC6\u7801\u9519\u8BEF"
    });
  }
  await createSession(event, {
    username: adminUsername,
    loginTime: Date.now()
  });
  return {
    success: true,
    message: "\u767B\u5F55\u6210\u529F"
  };
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const logout_post = defineEventHandler(async (event) => {
  destroySession(event);
  return {
    success: true,
    message: "\u5DF2\u6210\u529F\u767B\u51FA"
  };
});

const logout_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: logout_post
}, Symbol.toStringTag, { value: 'Module' }));

function getKVStorage(event) {
  var _a, _b;
  const env = (_b = (_a = event.context) == null ? void 0 : _a.cloudflare) == null ? void 0 : _b.env;
  if (env == null ? void 0 : env.BLOG_D2) {
    const db = env.BLOG_D2;
    const initTable = async () => {
      var _a2;
      try {
        await db.exec(`
          CREATE TABLE IF NOT EXISTS kv_store (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )
        `);
      } catch (e) {
        if (!((_a2 = e.message) == null ? void 0 : _a2.includes("already exists"))) {
          console.log("D2 table initialization note:", e.message || e);
        }
      }
    };
    initTable().catch(() => {
    });
    return {
      async getItem(key) {
        var _a2;
        try {
          await initTable();
          const result = await db.prepare("SELECT value FROM kv_store WHERE key = ?").bind(key).first();
          if (result && result.value) {
            return JSON.parse(result.value);
          }
          return null;
        } catch (e) {
          console.error("D2 getItem error:", e.message || e, "key:", key);
          if ((_a2 = e.message) == null ? void 0 : _a2.includes("no such table")) {
            await initTable();
            return null;
          }
          return null;
        }
      },
      async setItem(key, value) {
        var _a2;
        try {
          await initTable();
          const jsonValue = JSON.stringify(value);
          await db.prepare("INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key, jsonValue).run();
          return true;
        } catch (e) {
          console.error("D2 setItem error:", e.message || e, "key:", key);
          if ((_a2 = e.message) == null ? void 0 : _a2.includes("no such table")) {
            await initTable();
            await db.prepare("INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(key, JSON.stringify(value)).run();
            return true;
          }
          throw e;
        }
      },
      async removeItem(key) {
        var _a2;
        try {
          await initTable();
          await db.prepare("DELETE FROM kv_store WHERE key = ?").bind(key).run();
          return true;
        } catch (e) {
          console.error("D2 removeItem error:", e.message || e, "key:", key);
          if ((_a2 = e.message) == null ? void 0 : _a2.includes("no such table")) {
            return true;
          }
          throw e;
        }
      }
    };
  }
  if (env == null ? void 0 : env.BLOG_KV) {
    return {
      async getItem(key) {
        const value = await env.BLOG_KV.get(key);
        return value ? JSON.parse(value) : null;
      },
      async setItem(key, value) {
        return await env.BLOG_KV.put(key, JSON.stringify(value));
      },
      async removeItem(key) {
        return await env.BLOG_KV.delete(key);
      }
    };
  }
  try {
    return useStorage("kv");
  } catch (e) {
    throw new Error("Storage not available. Please configure BLOG_D2 or BLOG_KV binding in Cloudflare Pages.");
  }
}

const _id__delete$a = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u4E66\u7B7E ID \u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  try {
    const kv = getKVStorage(event);
    const bookmarkKey = `bookmark:${id}`;
    const existingBookmark = await kv.getItem(bookmarkKey);
    if (!existingBookmark) {
      throw createError({
        statusCode: 404,
        message: "\u4E66\u7B7E\u4E0D\u5B58\u5728"
      });
    }
    await kv.removeItem(bookmarkKey);
    const bookmarksListKey = "bookmarks:list";
    const bookmarksList = await kv.getItem(bookmarksListKey) || [];
    const updatedList = bookmarksList.filter((bookmarkId) => bookmarkId !== id);
    await kv.setItem(bookmarksListKey, updatedList);
    return {
      success: true,
      message: "\u4E66\u7B7E\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u5220\u9664\u4E66\u7B7E\u5931\u8D25", 500);
  }
});

const _id__delete$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$a
}, Symbol.toStringTag, { value: 'Module' }));

const FIELD_LIMITS = {
  // 留言相关
  MESSAGE_NAME: 50,
  // 留言姓名
  MESSAGE_EMAIL: 100,
  // 邮箱
  MESSAGE_CONTENT: 2e3,
  // 留言内容
  MESSAGE_WEBSITE: 500,
  // 网站链接
  // 文章相关
  POST_TITLE: 200,
  // 文章标题
  POST_BODY: 5e4,
  // 文章内容（Markdown）
  POST_USER: 50,
  // 作者名
  POST_COVER: 500,
  // 封面链接
  // 友链相关
  FRIEND_NAME: 100,
  // 友链名称
  FRIEND_URL: 500,
  // 友链链接
  FRIEND_DESCRIPTION: 500,
  // 友链描述
  FRIEND_AVATAR: 500,
  // 友链头像
  // 朋友圈动态相关
  MOMENT_CONTENT: 2e3,
  // 动态内容
  MOMENT_NICKNAME: 50,
  // 昵称
  MOMENT_AVATAR: 500,
  // 头像链接
  // 书签相关
  BOOKMARK_NAME: 200,
  // 书签名称
  BOOKMARK_URL: 500,
  // 书签链接
  BOOKMARK_DESCRIPTION: 1e3
  // 书签描述
};
function validateLength(value, maxLength, fieldName) {
  if (value === void 0 || value === null) {
    return;
  }
  if (typeof value !== "string") {
    throw createError({
      statusCode: 400,
      message: `${fieldName}\u5FC5\u987B\u662F\u5B57\u7B26\u4E32\u7C7B\u578B`
    });
  }
  const length = Array.from(value).length;
  if (length > maxLength) {
    throw createError({
      statusCode: 400,
      message: `${fieldName}\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7 ${maxLength} \u4E2A\u5B57\u7B26\uFF08\u5F53\u524D\uFF1A${length} \u4E2A\u5B57\u7B26\uFF09`
    });
  }
}
function validateAndTrim(value, maxLength, fieldName) {
  if (value === void 0 || value === null) {
    return "";
  }
  const trimmed = String(value).trim();
  validateLength(trimmed, maxLength, fieldName);
  return trimmed;
}

const _id__put$6 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u4E66\u7B7E ID \u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  const name = validateAndTrim(body.name, FIELD_LIMITS.BOOKMARK_NAME, "\u4E66\u7B7E\u540D\u79F0");
  const url = validateAndTrim(body.url, FIELD_LIMITS.BOOKMARK_URL, "\u4E66\u7B7E\u94FE\u63A5");
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.BOOKMARK_DESCRIPTION, "\u4E66\u7B7E\u63CF\u8FF0") : "";
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: "\u7F51\u7AD9\u540D\u79F0\u548C\u94FE\u63A5\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  try {
    new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7F51\u7AD9\u94FE\u63A5"
    });
  }
  try {
    const kv = getKVStorage(event);
    const bookmarkKey = `bookmark:${id}`;
    const existingBookmark = await kv.getItem(bookmarkKey);
    if (!existingBookmark) {
      throw createError({
        statusCode: 404,
        message: "\u4E66\u7B7E\u4E0D\u5B58\u5728"
      });
    }
    const bookmarkData = {
      ...existingBookmark,
      name,
      url,
      description,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await kv.setItem(bookmarkKey, bookmarkData);
    return {
      success: true,
      data: bookmarkData,
      message: "\u4E66\u7B7E\u66F4\u65B0\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u66F4\u65B0\u4E66\u7B7E\u5931\u8D25", 500);
  }
});

const _id__put$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$8 = defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const bookmarksListKey = "bookmarks:list";
    const bookmarksList = await kv.getItem(bookmarksListKey) || [];
    const bookmarks = [];
    for (const id of bookmarksList) {
      const bookmarkKey = `bookmark:${id}`;
      const bookmarkData = await kv.getItem(bookmarkKey);
      if (bookmarkData) {
        bookmarks.push(bookmarkData);
      }
    }
    bookmarks.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    return {
      success: true,
      data: bookmarks
    };
  } catch (error) {
    handleApiError(error, "\u83B7\u53D6\u4E66\u7B7E\u5217\u8868\u5931\u8D25", 500);
  }
});

const index_get$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$8
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$8 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const body = await readBody(event);
  const name = validateAndTrim(body.name, FIELD_LIMITS.BOOKMARK_NAME, "\u4E66\u7B7E\u540D\u79F0");
  const url = validateAndTrim(body.url, FIELD_LIMITS.BOOKMARK_URL, "\u4E66\u7B7E\u94FE\u63A5");
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.BOOKMARK_DESCRIPTION, "\u4E66\u7B7E\u63CF\u8FF0") : "";
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: "\u7F51\u7AD9\u540D\u79F0\u548C\u94FE\u63A5\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  try {
    new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7F51\u7AD9\u94FE\u63A5"
    });
  }
  try {
    const kv = getKVStorage(event);
    const bookmarksListKey = "bookmarks:list";
    const bookmarksList = await kv.getItem(bookmarksListKey) || [];
    const newId = bookmarksList.length > 0 ? String(Math.max(...bookmarksList.map((id) => parseInt(id))) + 1) : "1";
    const bookmarkData = {
      id: newId,
      name,
      url,
      description,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const bookmarkKey = `bookmark:${newId}`;
    await kv.setItem(bookmarkKey, bookmarkData);
    bookmarksList.push(newId);
    await kv.setItem(bookmarksListKey, bookmarksList);
    return {
      success: true,
      data: bookmarkData,
      message: "\u4E66\u7B7E\u6DFB\u52A0\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u6DFB\u52A0\u4E66\u7B7E\u5931\u8D25", 500);
  }
});

const index_post$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$8
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$8 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u53CB\u94FE ID"
    });
  }
  try {
    const kv = getKVStorage(event);
    const friendKey = `friend:${id}`;
    await kv.removeItem(friendKey);
    const friendsListKey = "friends:list";
    const friendsList = await kv.getItem(friendsListKey) || [];
    const updatedList = friendsList.filter((friendId) => friendId !== id);
    await kv.setItem(friendsListKey, updatedList);
    return {
      success: true,
      message: "\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u5220\u9664\u53CB\u94FE\u5931\u8D25", 500);
  }
});

const _id__delete$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$8
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$6 = defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const friendsListKey = "friends:list";
    const friendsList = await kv.getItem(friendsListKey) || [];
    const friends = [];
    for (const id of friendsList) {
      const friendKey = `friend:${id}`;
      const friendData = await kv.getItem(friendKey);
      if (friendData) {
        friends.push(friendData);
      }
    }
    friends.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return {
      success: true,
      data: friends
    };
  } catch (error) {
    handleApiError(error, "\u83B7\u53D6\u53CB\u94FE\u5217\u8868\u5931\u8D25", 500);
  }
});

const index_get$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$6
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$6 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const body = await readBody(event);
  const name = validateAndTrim(body.name, FIELD_LIMITS.FRIEND_NAME, "\u7F51\u7AD9\u540D\u79F0");
  const url = validateAndTrim(body.url, FIELD_LIMITS.FRIEND_URL, "\u7F51\u7AD9\u94FE\u63A5");
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.FRIEND_DESCRIPTION, "\u7F51\u7AD9\u63CF\u8FF0") : "";
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, "\u5934\u50CF") : "/images/home/avatar.webp";
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: "\u7F51\u7AD9\u540D\u79F0\u548C\u94FE\u63A5\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  try {
    new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7F51\u7AD9\u94FE\u63A5"
    });
  }
  try {
    const kv = getKVStorage(event);
    const friendsListKey = "friends:list";
    const friendsList = await kv.getItem(friendsListKey) || [];
    const newId = friendsList.length > 0 ? String(Math.max(...friendsList.map((id) => parseInt(id))) + 1) : "1";
    const friendData = {
      id: newId,
      name,
      url,
      description,
      avatar,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    const friendKey = `friend:${newId}`;
    await kv.setItem(friendKey, friendData);
    friendsList.push(newId);
    await kv.setItem(friendsListKey, friendsList);
    return {
      success: true,
      data: friendData,
      message: "\u53CB\u94FE\u6DFB\u52A0\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u6DFB\u52A0\u53CB\u94FE\u5931\u8D25", 500);
  }
});

const index_post$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$6
}, Symbol.toStringTag, { value: 'Module' }));

const requests_get = defineEventHandler(async (event) => {
  await verifyAuth(event);
  try {
    const kv = getKVStorage(event);
    const requestsListKey = "friend-requests:list";
    const requestsList = await kv.getItem(requestsListKey) || [];
    const requests = [];
    for (const id of requestsList) {
      const requestKey = `friend-request:${id}`;
      const requestData = await kv.getItem(requestKey);
      if (requestData) {
        requests.push(requestData);
      }
    }
    requests.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return {
      success: true,
      data: requests
    };
  } catch (error) {
    handleApiError(error, "\u83B7\u53D6\u7533\u8BF7\u5217\u8868\u5931\u8D25", 500);
  }
});

const requests_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: requests_get
}, Symbol.toStringTag, { value: 'Module' }));

const requests_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const kv = getKVStorage(event);
  const body = await readBody(event);
  const name = validateAndTrim(body.name, FIELD_LIMITS.FRIEND_NAME, "\u7F51\u7AD9\u540D\u79F0");
  const url = validateAndTrim(body.url, FIELD_LIMITS.FRIEND_URL, "\u7F51\u7AD9\u94FE\u63A5");
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.FRIEND_DESCRIPTION, "\u7F51\u7AD9\u63CF\u8FF0") : "";
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, "\u5934\u50CF") : "";
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: "\u7F51\u7AD9\u540D\u79F0\u548C\u94FE\u63A5\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  try {
    new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7F51\u7AD9\u94FE\u63A5"
    });
  }
  const turnstileSecretKey = useRuntimeConfig().turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY;
  const turnstileToken = body.turnstileToken;
  if (turnstileSecretKey) {
    if (!turnstileToken) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u5B8C\u6210\u4EBA\u673A\u9A8C\u8BC1"
      });
    }
    const clientIP = getHeader(event, "cf-connecting-ip") || ((_b = (_a = getHeader(event, "x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) || "unknown";
    const isValid = await verifyTurnstile(turnstileToken, turnstileSecretKey, clientIP);
    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: "\u4EBA\u673A\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
      });
    }
  }
  try {
    const requestsListKey = "friend-requests:list";
    const requestsList = await kv.getItem(requestsListKey) || [];
    const newId = requestsList.length > 0 ? String(Math.max(...requestsList.map((id) => parseInt(id))) + 1) : "1";
    const requestData = {
      id: newId,
      name,
      url,
      description,
      avatar,
      status: "pending",
      // pending, approved, rejected
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      ip: getHeader(event, "cf-connecting-ip") || ((_d = (_c = getHeader(event, "x-forwarded-for")) == null ? void 0 : _c.split(",")[0]) == null ? void 0 : _d.trim()) || "unknown"
    };
    const requestKey = `friend-request:${newId}`;
    await kv.setItem(requestKey, requestData);
    requestsList.push(newId);
    await kv.setItem(requestsListKey, requestsList);
    return {
      success: true,
      data: {
        id: newId,
        message: "\u7533\u8BF7\u5DF2\u63D0\u4EA4\uFF0C\u7B49\u5F85\u5BA1\u6838"
      }
    };
  } catch (error) {
    handleApiError(error, "\u63D0\u4EA4\u7533\u8BF7\u5931\u8D25", 500);
  }
});

const requests_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: requests_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$6 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u7533\u8BF7 ID"
    });
  }
  try {
    const kv = getKVStorage(event);
    const requestKey = `friend-request:${id}`;
    await kv.removeItem(requestKey);
    const requestsListKey = "friend-requests:list";
    const requestsList = await kv.getItem(requestsListKey) || [];
    const updatedList = requestsList.filter((reqId) => reqId !== id);
    await kv.setItem(requestsListKey, updatedList);
    return {
      success: true,
      message: "\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u5220\u9664\u7533\u8BF7\u5931\u8D25", 500);
  }
});

const _id__delete$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$6
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$4 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u7533\u8BF7 ID"
    });
  }
  if (!body.status || !["approved", "rejected"].includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "\u65E0\u6548\u7684\u72B6\u6001\uFF0C\u5FC5\u987B\u662F approved \u6216 rejected"
    });
  }
  try {
    const kv = getKVStorage(event);
    const requestKey = `friend-request:${id}`;
    const requestData = await kv.getItem(requestKey);
    if (!requestData) {
      throw createError({
        statusCode: 404,
        message: "\u7533\u8BF7\u4E0D\u5B58\u5728"
      });
    }
    requestData.status = body.status;
    requestData.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
    await kv.setItem(requestKey, requestData);
    if (body.status === "approved") {
      const friendsListKey = "friends:list";
      const friendsList = await kv.getItem(friendsListKey) || [];
      if (!friendsList.includes(id)) {
        friendsList.push(id);
        await kv.setItem(friendsListKey, friendsList);
        const friendKey = `friend:${id}`;
        const friendData = {
          id,
          name: requestData.name,
          url: requestData.url,
          description: requestData.description,
          avatar: requestData.avatar || "/images/home/avatar.webp",
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        };
        await kv.setItem(friendKey, friendData);
      }
    }
    return {
      success: true,
      data: requestData
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u66F4\u65B0\u7533\u8BF7\u72B6\u6001\u5931\u8D25", 500);
  }
});

const _id__put$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$4 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const kv = getKVStorage(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u7559\u8A00 ID"
    });
  }
  try {
    const messageKey = `message:${id}`;
    const existingMessage = await kv.getItem(messageKey);
    if (!existingMessage) {
      throw createError({
        statusCode: 404,
        message: "\u7559\u8A00\u4E0D\u5B58\u5728"
      });
    }
    await kv.removeItem(messageKey);
    const messagesListKey = "messages:list";
    const messagesList = await kv.getItem(messagesListKey) || [];
    const updatedList = messagesList.filter((messageId) => messageId !== id);
    await kv.setItem(messagesListKey, updatedList);
    return {
      success: true,
      message: "\u7559\u8A00\u5DF2\u5220\u9664"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u5220\u9664\u7559\u8A00\u5931\u8D25", 500);
  }
});

const _id__delete$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$4
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$4 = defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const messagesListKey = "messages:list";
    const messagesList = await kv.getItem(messagesListKey) || [];
    const messages = [];
    for (const messageId of messagesList) {
      const messageKey = `message:${messageId}`;
      const messageData = await kv.getItem(messageKey);
      if (messageData) {
        messages.push({
          id: messageId,
          name: messageData.name || "\u533F\u540D",
          email: messageData.email || "",
          content: messageData.content || "",
          date: messageData.date || "",
          avatar: messageData.avatar || "",
          website: messageData.website || ""
          // 不返回敏感信息给前端
        });
      }
    }
    messages.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    return {
      success: true,
      data: messages
    };
  } catch (error) {
    const isProd = process.env.NITRO_PRESET === "cloudflare-pages";
    return {
      success: false,
      error: isProd ? "\u83B7\u53D6\u7559\u8A00\u5217\u8868\u5931\u8D25" : error.message || "\u83B7\u53D6\u7559\u8A00\u5217\u8868\u5931\u8D25"
    };
  }
});

const index_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$4 = defineEventHandler(async (event) => {
  var _a, _b;
  const kv = getKVStorage(event);
  const body = await readBody(event);
  const name = validateAndTrim(body.name, FIELD_LIMITS.MESSAGE_NAME, "\u59D3\u540D");
  const content = validateAndTrim(body.content, FIELD_LIMITS.MESSAGE_CONTENT, "\u7559\u8A00\u5185\u5BB9");
  const email = body.email ? validateAndTrim(body.email, FIELD_LIMITS.MESSAGE_EMAIL, "\u90AE\u7BB1") : "";
  const website = body.website ? validateAndTrim(body.website, FIELD_LIMITS.MESSAGE_WEBSITE, "\u7F51\u7AD9") : "";
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, "\u5934\u50CF") : "";
  if (!name || !content) {
    throw createError({
      statusCode: 400,
      message: "\u59D3\u540D\u548C\u7559\u8A00\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      message: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E"
    });
  }
  const { isAdmin: checkIsAdmin } = await Promise.resolve().then(function () { return auth; });
  let isAdmin = await checkIsAdmin(event);
  if (!isAdmin) {
    const authHeader = getHeader(event, "authorization");
    const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
    isAdmin = adminPassword && authHeader === `Bearer ${adminPassword}`;
  }
  if (!isAdmin) {
    const turnstileSecretKey = useRuntimeConfig().turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY;
    const turnstileToken = body.turnstileToken;
    if (turnstileSecretKey) {
      if (!turnstileToken) {
        throw createError({
          statusCode: 400,
          message: "\u8BF7\u5B8C\u6210\u4EBA\u673A\u9A8C\u8BC1"
        });
      }
      const clientIP = getHeader(event, "cf-connecting-ip") || ((_b = (_a = getHeader(event, "x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) || "unknown";
      const isValid = await verifyTurnstile(turnstileToken, turnstileSecretKey, clientIP);
      if (!isValid) {
        throw createError({
          statusCode: 400,
          message: "\u4EBA\u673A\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"
        });
      }
    }
  }
  try {
    const messagesListKey = "messages:list";
    const messagesList = await kv.getItem(messagesListKey) || [];
    const newId = messagesList.length > 0 ? String(Math.max(...messagesList.map((id) => parseInt(id))) + 1) : "1";
    let messageDate = (/* @__PURE__ */ new Date()).toISOString();
    if (isAdmin && body.date) {
      const customDate = new Date(body.date);
      if (!isNaN(customDate.getTime())) {
        messageDate = customDate.toISOString();
      }
    }
    const messageData = {
      id: newId,
      name,
      email,
      content,
      date: messageDate,
      avatar,
      website,
      ip: isAdmin ? "admin" : event.headers.get("cf-connecting-ip") || event.headers.get("x-forwarded-for") || "unknown"
    };
    const messageKey = `message:${newId}`;
    await kv.setItem(messageKey, messageData);
    messagesList.push(newId);
    await kv.setItem(messagesListKey, messagesList);
    return {
      success: true,
      data: {
        id: newId,
        name: messageData.name,
        content: messageData.content,
        date: messageData.date,
        avatar: messageData.avatar,
        website: messageData.website
      }
    };
  } catch (error) {
    handleApiError(error, "\u521B\u5EFA\u7559\u8A00\u5931\u8D25", 500);
  }
});

const index_post$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$2 = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u52A8\u6001 ID"
    });
  }
  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    await kv.removeItem(momentKey);
    const momentsListKey = "moments:list";
    const momentsList = await kv.getItem(momentsListKey) || [];
    const updatedList = momentsList.filter((momentId) => momentId !== id);
    await kv.setItem(momentsListKey, updatedList);
    return {
      success: true,
      message: "\u5220\u9664\u6210\u529F"
    };
  } catch (error) {
    handleApiError(error, "\u5220\u9664\u670B\u53CB\u5708\u52A8\u6001\u5931\u8D25", 500);
  }
});

const _id__delete$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get$2 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u52A8\u6001 ID"
    });
  }
  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    const momentData = await kv.getItem(momentKey);
    if (!momentData) {
      throw createError({
        statusCode: 404,
        message: "\u52A8\u6001\u4E0D\u5B58\u5728"
      });
    }
    return {
      success: true,
      data: momentData
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u83B7\u53D6\u670B\u53CB\u5708\u52A8\u6001\u5931\u8D25", 500);
  }
});

const _id__get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$2 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u52A8\u6001 ID"
    });
  }
  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    const momentData = await kv.getItem(momentKey);
    if (!momentData) {
      throw createError({
        statusCode: 404,
        message: "\u52A8\u6001\u4E0D\u5B58\u5728"
      });
    }
    let nickname = ((_a = momentData.author) == null ? void 0 : _a.nickname) || "Leyili";
    let avatar = ((_b = momentData.author) == null ? void 0 : _b.avatar) || "/images/lcj.svg";
    let content = momentData.content;
    let images = momentData.images || [];
    if (((_c = body.author) == null ? void 0 : _c.nickname) !== void 0) {
      nickname = validateAndTrim(body.author.nickname, FIELD_LIMITS.MOMENT_NICKNAME, "\u6635\u79F0");
    }
    if (((_d = body.author) == null ? void 0 : _d.avatar) !== void 0) {
      avatar = validateAndTrim(body.author.avatar, FIELD_LIMITS.MOMENT_AVATAR, "\u5934\u50CF");
    }
    if (body.content !== void 0) {
      content = validateAndTrim(body.content, FIELD_LIMITS.MOMENT_CONTENT, "\u52A8\u6001\u5185\u5BB9");
    }
    if (body.images !== void 0) {
      if (Array.isArray(body.images) && body.images.length > 9) {
        throw createError({
          statusCode: 400,
          message: "\u6700\u591A\u53EA\u80FD\u4E0A\u4F20 9 \u5F20\u56FE\u7247"
        });
      }
      images = body.images;
    }
    const updatedData = {
      ...momentData,
      author: {
        nickname,
        avatar
      },
      content,
      timestamp: body.timestamp !== void 0 ? body.timestamp : momentData.timestamp,
      images
    };
    await kv.setItem(momentKey, updatedData);
    return {
      success: true,
      data: updatedData,
      message: "\u670B\u53CB\u5708\u52A8\u6001\u66F4\u65B0\u6210\u529F"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u66F4\u65B0\u670B\u53CB\u5708\u52A8\u6001\u5931\u8D25", 500);
  }
});

const _id__put$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_get$2 = defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const momentsListKey = "moments:list";
    let momentsList = await kv.getItem(momentsListKey) || [];
    if (momentsList.length === 0) {
      const recoveredIds = [];
      for (let id = 1; id <= 1e3; id++) {
        const momentKey = `moment:${id}`;
        const momentData = await kv.getItem(momentKey);
        if (momentData) {
          recoveredIds.push(String(id));
        }
      }
      if (recoveredIds.length > 0) {
        momentsList = recoveredIds;
        await kv.setItem(momentsListKey, momentsList);
        console.log(`\u6062\u590D\u4E86 ${recoveredIds.length} \u6761\u65E7\u670B\u53CB\u5708\u6570\u636E`);
      }
    }
    const moments = [];
    for (const id of momentsList) {
      const momentKey = `moment:${id}`;
      const momentData = await kv.getItem(momentKey);
      if (momentData) {
        moments.push(momentData);
      }
    }
    moments.sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp.replace("\u521B\u5EFA\u65F6\u95F4: ", "")).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp.replace("\u521B\u5EFA\u65F6\u95F4: ", "")).getTime() : 0;
      return timeB - timeA;
    });
    return {
      success: true,
      data: moments
    };
  } catch (error) {
    handleApiError(error, "\u83B7\u53D6\u670B\u53CB\u5708\u52A8\u6001\u5931\u8D25", 500);
  }
});

const index_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const index_post$2 = defineEventHandler(async (event) => {
  var _a, _b;
  await verifyAuth(event);
  const body = await readBody(event);
  const content = validateAndTrim(body.content, FIELD_LIMITS.MOMENT_CONTENT, "\u52A8\u6001\u5185\u5BB9");
  const nickname = ((_a = body.author) == null ? void 0 : _a.nickname) ? validateAndTrim(body.author.nickname, FIELD_LIMITS.MOMENT_NICKNAME, "\u6635\u79F0") : "Leyili";
  const avatar = ((_b = body.author) == null ? void 0 : _b.avatar) ? validateAndTrim(body.author.avatar, FIELD_LIMITS.MOMENT_AVATAR, "\u5934\u50CF") : "/images/lcj.svg";
  if (!content) {
    throw createError({
      statusCode: 400,
      message: "\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  if (body.images && Array.isArray(body.images) && body.images.length > 9) {
    throw createError({
      statusCode: 400,
      message: "\u6700\u591A\u53EA\u80FD\u4E0A\u4F20 9 \u5F20\u56FE\u7247"
    });
  }
  try {
    const kv = getKVStorage(event);
    const momentsListKey = "moments:list";
    const momentsList = await kv.getItem(momentsListKey) || [];
    const newId = momentsList.length > 0 ? String(Math.max(...momentsList.map((id) => parseInt(id) || 0)) + 1) : "1";
    const now = /* @__PURE__ */ new Date();
    const timestamp = `\u521B\u5EFA\u65F6\u95F4: ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const momentData = {
      id: parseInt(newId),
      author: {
        nickname,
        avatar
      },
      content,
      timestamp: body.timestamp || timestamp,
      images: body.images || []
    };
    await kv.setItem(`moment:${newId}`, momentData);
    momentsList.push(newId);
    await kv.setItem(momentsListKey, momentsList);
    return {
      success: true,
      data: momentData,
      message: "\u670B\u53CB\u5708\u52A8\u6001\u521B\u5EFA\u6210\u529F"
    };
  } catch (error) {
    console.error("\u521B\u5EFA\u670B\u53CB\u5708\u52A8\u6001\u5931\u8D25:", error);
    handleApiError(error, "\u521B\u5EFA\u670B\u53CB\u5708\u52A8\u6001\u5931\u8D25", 500);
  }
});

const index_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  const kv = getKVStorage(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u6587\u7AE0 ID"
    });
  }
  try {
    const postKey = `post:${id}`;
    const existingPost = await kv.getItem(postKey);
    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u7AE0\u4E0D\u5B58\u5728"
      });
    }
    await kv.removeItem(postKey);
    const postsListKey = "posts:list";
    const postsList = await kv.getItem(postsListKey) || [];
    const updatedList = postsList.filter((postId) => postId !== id);
    await kv.setItem(postsListKey, updatedList);
    return {
      success: true,
      message: "\u6587\u7AE0\u5DF2\u5220\u9664"
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u5220\u9664\u6587\u7AE0\u5931\u8D25", 500);
  }
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

function setCacheHeaders(event, maxAge = 300, staleWhileRevalidate = 0, mustRevalidate = false) {
  let cacheControl = `public, max-age=${maxAge}`;
  if (staleWhileRevalidate > 0) {
    cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`;
  }
  if (mustRevalidate) {
    cacheControl += ", must-revalidate";
  }
  setHeader(event, "Cache-Control", cacheControl);
  const etag = `"${Date.now()}"`;
  setHeader(event, "ETag", etag);
}
function setPostsListCacheHeaders(event) {
  setCacheHeaders(event, 120, 300, false);
}
function setPostDetailCacheHeaders(event) {
  setCacheHeaders(event, 3600, 86400, false);
}
function checkETag(event, etag) {
  const ifNoneMatch = getHeader(event, "if-none-match");
  if (ifNoneMatch && ifNoneMatch === etag) {
    setResponseStatus(event, 304);
    return true;
  }
  return false;
}
function generateETag(content) {
  const contentStr = typeof content === "string" ? content : JSON.stringify(content);
  let hash = 0;
  for (let i = 0; i < contentStr.length; i++) {
    const char = contentStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `"${Math.abs(hash).toString(16)}"`;
}

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u6587\u7AE0 ID"
    });
  }
  try {
    const kv = getKVStorage(event);
    const postKey = `post:${id}`;
    const postData = await kv.getItem(postKey);
    if (!postData) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u7AE0\u4E0D\u5B58\u5728"
      });
    }
    const responseData = {
      success: true,
      data: postData
    };
    const etag = generateETag(responseData);
    if (checkETag(event, etag)) {
      return;
    }
    setPostDetailCacheHeaders(event);
    setHeader(event, "ETag", etag);
    return responseData;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u83B7\u53D6\u6587\u7AE0\u5931\u8D25", 500);
  }
});

const _id__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const kv = getKVStorage(event);
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "\u7F3A\u5C11\u6587\u7AE0 ID"
    });
  }
  try {
    const postKey = `post:${id}`;
    const existingPost = await kv.getItem(postKey);
    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u7AE0\u4E0D\u5B58\u5728"
      });
    }
    const updates = {};
    if (body.title !== void 0) {
      updates.title = validateAndTrim(body.title, FIELD_LIMITS.POST_TITLE, "\u6807\u9898");
    }
    if (body.body !== void 0) {
      updates.body = validateAndTrim(body.body, FIELD_LIMITS.POST_BODY, "\u6587\u7AE0\u5185\u5BB9");
    }
    if (body.user !== void 0) {
      updates.user = validateAndTrim(body.user, FIELD_LIMITS.POST_USER, "\u4F5C\u8005");
    }
    if (body.cover !== void 0) {
      updates.cover = validateAndTrim(body.cover, FIELD_LIMITS.POST_COVER, "\u5C01\u9762");
    }
    if (body.avatar !== void 0) {
      updates.avatar = validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, "\u5934\u50CF");
    }
    if (body.date !== void 0) {
      updates.date = body.date;
    }
    if (body.ratio !== void 0) {
      updates.ratio = body.ratio;
    }
    if (body.likes !== void 0) {
      updates.likes = body.likes;
    }
    const updatedPost = {
      ...existingPost,
      ...updates
    };
    await kv.setItem(postKey, updatedPost);
    return {
      success: true,
      data: updatedPost
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u66F4\u65B0\u6587\u7AE0\u5931\u8D25", 500);
  }
});

const _id__put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const postsListKey = "posts:list";
    const postsList = await kv.getItem(postsListKey) || [];
    const posts = [];
    for (const postId of postsList) {
      const postKey = `post:${postId}`;
      const postData = await kv.getItem(postKey);
      if (postData) {
        posts.push({
          id: postId,
          title: postData.title || "\u65E0\u6807\u9898",
          date: postData.date || "",
          cover: postData.cover || "",
          ratio: postData.ratio || 0.75,
          user: postData.user || "lcj",
          avatar: postData.avatar || "",
          likes: postData.likes || 0
          // 不返回 body 内容，减少传输量
        });
      }
    }
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    const responseData = {
      success: true,
      data: posts
    };
    const etag = generateETag(responseData);
    if (checkETag(event, etag)) {
      return;
    }
    setPostsListCacheHeaders(event);
    setHeader(event, "ETag", etag);
    return responseData;
  } catch (error) {
    const isProd = process.env.NITRO_PRESET === "cloudflare-pages";
    return {
      success: false,
      error: isProd ? "\u83B7\u53D6\u6587\u7AE0\u5217\u8868\u5931\u8D25" : error.message || "\u83B7\u53D6\u6587\u7AE0\u5217\u8868\u5931\u8D25"
    };
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_post = defineEventHandler(async (event) => {
  await verifyAuth(event);
  const body = await readBody(event);
  const kv = getKVStorage(event);
  const title = validateAndTrim(body.title, FIELD_LIMITS.POST_TITLE, "\u6807\u9898");
  const postBody = validateAndTrim(body.body, FIELD_LIMITS.POST_BODY, "\u6587\u7AE0\u5185\u5BB9");
  const user = body.user ? validateAndTrim(body.user, FIELD_LIMITS.POST_USER, "\u4F5C\u8005") : "lcj";
  const cover = body.cover ? validateAndTrim(body.cover, FIELD_LIMITS.POST_COVER, "\u5C01\u9762") : "";
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, "\u5934\u50CF") : "";
  if (!title || !postBody) {
    throw createError({
      statusCode: 400,
      message: "\u6807\u9898\u548C\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"
    });
  }
  try {
    const postsListKey = "posts:list";
    const postsList = await kv.getItem(postsListKey) || [];
    const newId = postsList.length > 0 ? String(Math.max(...postsList.map((id) => parseInt(id))) + 1) : "1";
    const postData = {
      id: newId,
      title,
      date: body.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      cover,
      ratio: body.ratio || 0.75,
      user,
      avatar,
      likes: body.likes || 0,
      body: postBody
    };
    const postKey = `post:${newId}`;
    await kv.setItem(postKey, postData);
    postsList.push(newId);
    await kv.setItem(postsListKey, postsList);
    return {
      success: true,
      data: postData
    };
  } catch (error) {
    handleApiError(error, "\u521B\u5EFA\u6587\u7AE0\u5931\u8D25", 500);
  }
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

const ____path__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const path = getRouterParam(event, "path");
    if (!path) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u4EF6\u4E0D\u5B58\u5728"
      });
    }
    const r2 = getR2Storage(event);
    const object = await r2.get(path);
    if (!object) {
      throw createError({
        statusCode: 404,
        message: "\u6587\u4EF6\u4E0D\u5B58\u5728"
      });
    }
    const body = await object.arrayBuffer();
    const buffer = Buffer.from(body);
    const contentType = ((_a = object.httpMetadata) == null ? void 0 : _a.contentType) || "image/jpeg";
    setHeader(event, "Content-Type", contentType);
    setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
    return buffer;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u83B7\u53D6\u6587\u4EF6\u5931\u8D25", 500);
  }
});

const ____path__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: ____path__get
}, Symbol.toStringTag, { value: 'Module' }));

const image_post = defineEventHandler(async (event) => {
  await verifyAuth(event);
  try {
    const formData = await readFormData(event);
    const file = formData.get("file");
    if (!file) {
      throw createError({
        statusCode: 400,
        message: "\u6CA1\u6709\u4E0A\u4F20\u6587\u4EF6"
      });
    }
    if (!isValidImageType(file.type)) {
      throw createError({
        statusCode: 400,
        message: "\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B\uFF0C\u4EC5\u652F\u6301\uFF1AJPEG, PNG, WebP, GIF"
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw createError({
        statusCode: 400,
        message: "\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7 10MB"
      });
    }
    const r2 = getR2Storage(event);
    const fileName = generateFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await r2.put(fileName, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000"
        // 缓存 1 年
      }
    });
    const r2PublicUrl = useRuntimeConfig().r2PublicUrl;
    const publicUrl = r2PublicUrl ? `${r2PublicUrl}/${fileName}` : `/api/r2/${fileName}`;
    return {
      success: true,
      data: {
        url: publicUrl,
        fileName,
        size: file.size,
        type: file.type
      }
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, "\u4E0A\u4F20\u5931\u8D25", 500);
  }
});

const image_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: image_post
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    setSSRError(ssrContext, ssrError);
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  const result = [];
  for (const _chunk of chunks) {
    const chunk = _chunk?.trim();
    if (chunk) {
      result.push(chunk);
    }
  }
  return result;
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
