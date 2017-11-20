"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/chess-notebook/index.html","27eb0906f23bdcd895df3182314fbc12"],["/chess-notebook/static/css/main.178ff2c4.css","6a005f70791340d9496bff99e0904f29"],["/chess-notebook/static/js/main.8b1a5aa0.js","882497b07f53c4288872fe2287255113"],["/chess-notebook/static/media/back.ea34e870.svg","ea34e870de41e42aa4528d23cf06c3d4"],["/chess-notebook/static/media/background.c019f087.svg","c019f087244e31756989746598daa756"],["/chess-notebook/static/media/bishopBlack.82f6f142.svg","82f6f14226d158692dba9bdc75ebbacd"],["/chess-notebook/static/media/bishopWhite.38f54b2c.svg","38f54b2caa25c5c0c7fecb9d22ddba4e"],["/chess-notebook/static/media/box.2475e467.svg","2475e467d56f2853814e7ecd3daacb66"],["/chess-notebook/static/media/box_checked.92ed8a8d.svg","92ed8a8d75598cb2a22d42d5568201f7"],["/chess-notebook/static/media/delete.8bed1fe3.svg","8bed1fe31b8255335105b92af95bd513"],["/chess-notebook/static/media/exclamation.cc9e76a0.svg","cc9e76a0ce84c0009d6e2129938eb590"],["/chess-notebook/static/media/forward.c6d417f5.svg","c6d417f5751540effe35aba9c7c005ee"],["/chess-notebook/static/media/gear.69a55ad6.svg","69a55ad6128552f61c9ba11df1832d15"],["/chess-notebook/static/media/kingBlack.d99d5d5b.svg","d99d5d5b7597f44ec6f491a52032e90d"],["/chess-notebook/static/media/kingWhite.da37f628.svg","da37f628e8970139fc6faa38a1285c3f"],["/chess-notebook/static/media/knightBlack.54f8eb7d.svg","54f8eb7dc8f5bc570af080ab8b6367e5"],["/chess-notebook/static/media/knightWhite.d57cc29c.svg","d57cc29c19642a96d6d76d98c00dbdc0"],["/chess-notebook/static/media/menu.05301cf0.svg","05301cf0d69ba14069bc96618457f41b"],["/chess-notebook/static/media/pawnBlack.ae138ff8.svg","ae138ff8097545dce48dc21f18d04c86"],["/chess-notebook/static/media/pawnWhite.c3a5e2b0.svg","c3a5e2b0ce4e921825aa155c322b4464"],["/chess-notebook/static/media/pgn.f133626a.svg","f133626ae16022a6a218fa2ccc90a931"],["/chess-notebook/static/media/play.4883adfd.svg","4883adfdc4a1d838194fe5ae209700ba"],["/chess-notebook/static/media/plus.9980473e.svg","9980473e9906ddeabae8a9b6d33d05ab"],["/chess-notebook/static/media/queenBlack.216dcce3.svg","216dcce334571dee5b933dca0883cf83"],["/chess-notebook/static/media/queenWhite.069f1e6d.svg","069f1e6d78ab9184c74774e1bf14fba2"],["/chess-notebook/static/media/question.586d6a24.svg","586d6a2490dadb183bc529a946e86625"],["/chess-notebook/static/media/rew.250f4f24.svg","250f4f24a175e4d6f29491b0df20b5fd"],["/chess-notebook/static/media/rookBlack.9a554455.svg","9a554455a8a3a4c0dea99ad1752c9dc3"],["/chess-notebook/static/media/rookWhite.3480866c.svg","3480866c1b4862b4a7fdb44337c7ff24"],["/chess-notebook/static/media/swap.a49a9035.svg","a49a90350e2b0b1ba01b4141a9596b0f"],["/chess-notebook/static/media/top.27069f21.svg","27069f216c9927b03a83bf478fdc7302"],["/chess-notebook/static/media/trash.0f3fcb06.svg","0f3fcb06cd3f08a7bf9ce71d9b8de1a3"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,a,s){var c=new URL(e);return s&&c.pathname.match(s)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],s=new URL(t,self.location),c=createCacheKey(s,hashParamName,a,/\.\w{8}\./);return[s.toString(),c]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var s=new Request(a,{credentials:"same-origin"});return fetch(s).then(function(t){if(!t.ok)throw new Error("Request for "+a+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(a,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!t.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,"index.html"),t=urlsToCacheKeys.has(a));!t&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(a=new URL("/chess-notebook/index.html",self.location).toString(),t=urlsToCacheKeys.has(a)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});