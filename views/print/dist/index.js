!function(n){function t(e){if(r[e])return r[e].exports;var u=r[e]={exports:{},id:e,loaded:!1};return n[e].call(u.exports,u,u.exports,t),u.loaded=!0,u.exports}var r={};return t.m=n,t.c=r,t.p="",t(0)}([function(n,t,r){n.exports=r(2)},function(n,t,r){(function(n,e){"use strict";function u(n,t){this._id=n,this._clearFn=t}var i=r(5).nextTick,o=Function.prototype.apply,a=Array.prototype.slice,c={},l=0;t.setTimeout=function(){return new u(o.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new u(o.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(n){n.close()},u.prototype.unref=u.prototype.ref=function(){},u.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(n,t){clearTimeout(n._idleTimeoutId),n._idleTimeout=t},t.unenroll=function(n){clearTimeout(n._idleTimeoutId),n._idleTimeout=-1},t._unrefActive=t.active=function(n){clearTimeout(n._idleTimeoutId);var t=n._idleTimeout;t>=0&&(n._idleTimeoutId=setTimeout(function(){n._onTimeout&&n._onTimeout()},t))},t.setImmediate="function"==typeof n?n:function(n){var r=l++,e=arguments.length<2?!1:a.call(arguments,1);return c[r]=!0,i(function(){c[r]&&(e?n.apply(null,e):n.call(null),t.clearImmediate(r))}),r},t.clearImmediate="function"==typeof e?e:function(n){delete c[n]}}).call(t,r(1).setImmediate,r(1).clearImmediate)},function(n,t,r){"use strict";var e=r(4),u=r(3),i=r(6);i(function(){alert("i'm jquery!111!")});var o=[1,2,3,4];console.log(e.map(o,function(n){return 21*n})),u(function(n){e.delay(function(){console.log("ok"),n(null,"\u5b8c\u621011")},3e3)}).then(function(n,t){e.delay(function(){console.log(t)},3e3)}),console.log("aaa123")},function(n,t,r){var e,u,i;(function(r){"use strict";!function(r,o){"object"==typeof n&&"object"==typeof n.exports?n.exports=o():(u=[],e=o,i="function"==typeof e?e.apply(t,u):e,!(void 0!==i&&(n.exports=i)))}("object"==typeof window?window:void 0,function(){function n(n,t){if(t=t||0,t>=n.length)return[];for(var r=n.length,e=Array(r-t);r-->t;)e[r-t]=n[r];return e}function t(n,t){for(var r=[],e=0,u=n.length;u>e;e++)r.push(t(n[e],e,n));return r}function e(t,r){try{r.apply(null,n(arguments,2))}catch(e){t(e)}}function u(n,t){var r=arguments;x(function(){e.apply(null,r)})}function i(n){return null==n?n:"function"==typeof n.toThunk?n.toThunk():"function"==typeof n.then?function(t){n.then(function(n){t(null,n)},t)}:n}function o(n,r){return t(n,function(n,t,e){return function(u){r(u,n,t,e)}})}function a(n,t){var r,e=this;return n instanceof a?n:e instanceof a?(e._chain=0,e._success=e._parallel=e._series=null,e._finally=e._error=e._result=e._nextThen=null,arguments.length?(r=s(e,t),n=i(n),void(void 0===n?r():"function"==typeof n?u(r,n,r):r(null,n))):e):new a(n,t)}function c(){var t=this,r=n(arguments);t._result!==!1&&(!t._result&&t._chain&&t.debug.apply(t,["\nChain "+t._chain+": "].concat(n(r))),t._result=!1,e(function(n){n===r[0]?f(t,n):c.call(t._nextThen,n)},l,t,r))}function l(t,r){if(null==r[0])r[0]=null;else if(r=[r[0]],!t._finally)throw r[0];if(t._finally)return t._finally.apply(null,r);var e=t._success||t._parallel||t._series;return e?e.apply(null,n(r,1)):void(t._result=r)}function f(n,t){for(var r=n,u=n._error||n._finally;!u&&r._nextThen;)r=r._nextThen,u=r._error||r._finally;if(u)return e(function(n){c.call(r._nextThen,n)},u,t);if(a.onerror)return a.onerror(t);for(;r._nextThen;)r=r._nextThen;r._result=[t]}function s(n,t){function r(){return c.apply(n,arguments)}return r._isCont=!0,t&&(T.debug="function"==typeof t?t:m,n._chain=1),r}function p(n,t,r){var e=new a,u=s(e,r);return n(u,t),t?(t._nextThen=e,t._chain&&(e._chain=t._chain+1),t._result&&x(function(){c.apply(t,t._result)}),e):e}function h(t,r){return r._isCont?r:function(){var e=n(arguments);e.unshift(t),r.apply(null,e)}}function v(n,t){function r(t){function r(r,i){return 0>=e?void 0:null!=r?(e=0,n(r)):(u[t]=i,!--e&&n(null,u))}return r._isCont=!0,r}if(!j(t))return n(d(t,"parallel"));var e=t.length,u=[];if(0>=e)return n(null,u);for(var i=0,o=e;o>i;i++)t[i](r(i))}function y(n,t){function r(f,s){return null!=f?n(f):(c[o]=s,++o>a?n(null,c):(i=--l>0?e:(l=_,u),void i(n,t[o],r)))}if(!j(t))return n(d(t,"series"));var i,o=0,a=t.length-1,c=[],l=_;return 0>a?n(null,c):(r._isCont=!0,void t[0](r))}function g(n,t,r){function e(){return f?void 0:i>=c?(f=!0,v(n,l)):void(o>=r||(o++,l.push(u())))}function u(){return new a(t[i++]).fin(function(t,r,u){return null!=r?(f=!0,n(r)):(o--,e(),void t(null,u))}).toThunk()}var i=0,o=0,c=t.length,l=[],f=!1;r=r>=1?Math.floor(r):Number.MAX_VALUE;do e();while(c>i&&r>o)}function m(){console.log.apply(console,arguments)}function d(n,t){return new Error("The argument "+(n&&n.toString())+' in "'+t+'" is not Array!')}var _=100,w=Object.prototype.toString,b=Object.prototype.hasOwnProperty,x="function"==typeof r?r:function(n){setTimeout(n,0)},j=Array.isArray||function(n){return"[object Array]"===w.call(n)};a.defer=u,a.parallel=function(n,t){return new a(function(t){e(t,v,t,n)},t)},a.series=function(n,t){return new a(function(t){e(t,y,t,n)},t)},a.each=function(n,t,r){return new a(function(r){e(r,v,r,o(n,t))},r)},a.eachSeries=function(n,t,r){return new a(function(r){e(r,y,r,o(n,t))},r)},a.parallelLimit=function(n,t,r){return new a(function(r){g(r,n,t)},r)},a.eachLimit=function(n,t,r,e){return new a(function(e){g(e,o(n,t),r)},e)},a.nextTick=function(t){var r=n(arguments,1);x(function(){t.apply(null,r)})},a.onerror=function(n){throw console.error("Thenjs caught error: ",n),n};var T=a.prototype;return T.fin=T["finally"]=function(n){return p(function(t,r){r._finally=h(t,n)},this)},T.then=function(n,t){return p(function(r,e){n&&(e._success=h(r,n)),t&&(e._error=h(r,t))},this)},T.fail=T["catch"]=function(t){return p(function(r,e){e._error=h(r,t),e._success=function(){var t=n(arguments);t.unshift(null),r.apply(null,t)}},this)},T.parallel=function(n){return p(function(t,r){r._parallel=function(r){v(t,n||r)}},this)},T.series=function(n){return p(function(t,r){r._series=function(r){y(t,n||r)}},this)},T.each=function(n,t){return p(function(r,e){e._parallel=function(e,u){v(r,o(n||e,t||u))}},this)},T.eachSeries=function(n,t){return p(function(r,e){e._series=function(e,u){y(r,o(n||e,t||u))}},this)},T.parallelLimit=function(n,t){return p(function(r,e){e._parallel=function(e){g(r,n||e,t)}},this)},T.eachLimit=function(n,t,r){return p(function(e,u){u._series=function(u,i){g(e,o(n||u,t||i),r)}},this)},T.toThunk=function(){var n=this;return function(t){n._result?(t.apply(null,n._result),n._result=!1):n._result!==!1&&(n._finally=n._error=t)}},T.inspect=function(){var n={};for(var t in this)b.call(this,t)&&(n[t]="_nextThen"===t?this[t]&&this[t]._chain:this[t]);return n},a.NAME="Thenjs",a.VERSION="2.0.2",a})}).call(t,r(1).setImmediate)},function(n,t,r){var e,u;(function(){function r(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=j(e,i,4);var o=!E(r)&&x.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function i(n){return function(t,r,e){r=T(r,e);for(var u=S(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function o(n,t,r){return function(e,u,i){var o=0,a=S(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(v.call(e,o,a),x.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function a(n,t){var r=B.length,e=n.constructor,u=x.isFunction(e)&&e.prototype||s,i="constructor";for(x.has(n,i)&&!x.contains(t,i)&&t.push(i);r--;)i=B[r],i in n&&n[i]!==u[i]&&!x.contains(t,i)&&t.push(i)}var c=this,l=c._,f=Array.prototype,s=Object.prototype,p=Function.prototype,h=f.push,v=f.slice,y=s.toString,g=s.hasOwnProperty,m=Array.isArray,d=Object.keys,_=p.bind,w=Object.create,b=function(){},x=function W(n){return n instanceof W?n:this instanceof W?void(this._wrapped=n):new W(n)};"undefined"!=typeof n&&n.exports&&(t=n.exports=x),t._=x,x.VERSION="1.8.3";var j=function(n,t,r){if(void 0===t)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},T=function(n,t,r){return null==n?x.identity:x.isFunction(n)?j(n,t,r):x.isObject(n)?x.matcher(n):x.property(n)};x.iteratee=function(n,t){return T(n,t,1/0)};var A=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var l=o[c];t&&void 0!==r[l]||(r[l]=i[l])}return r}},k=function(n){if(!x.isObject(n))return{};if(w)return w(n);b.prototype=n;var t=new b;return b.prototype=null,t},O=function(n){return function(t){return null==t?void 0:t[n]}},I=Math.pow(2,53)-1,S=O("length"),E=function(n){var t=S(n);return"number"==typeof t&&t>=0&&I>=t};x.each=x.forEach=function(n,t,r){t=j(t,r);var e,u;if(E(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=x.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},x.map=x.collect=function(n,t,r){t=T(t,r);for(var e=!E(n)&&x.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},x.reduce=x.foldl=x.inject=r(1),x.reduceRight=x.foldr=r(-1),x.find=x.detect=function(n,t,r){var e;return e=E(n)?x.findIndex(n,t,r):x.findKey(n,t,r),void 0!==e&&-1!==e?n[e]:void 0},x.filter=x.select=function(n,t,r){var e=[];return t=T(t,r),x.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},x.reject=function(n,t,r){return x.filter(n,x.negate(T(t)),r)},x.every=x.all=function(n,t,r){t=T(t,r);for(var e=!E(n)&&x.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},x.some=x.any=function(n,t,r){t=T(t,r);for(var e=!E(n)&&x.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},x.contains=x.includes=x.include=function(n,t,r,e){return E(n)||(n=x.values(n)),("number"!=typeof r||e)&&(r=0),x.indexOf(n,t,r)>=0},x.invoke=function(n,t){var r=v.call(arguments,2),e=x.isFunction(t);return x.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},x.pluck=function(n,t){return x.map(n,x.property(t))},x.where=function(n,t){return x.filter(n,x.matcher(t))},x.findWhere=function(n,t){return x.find(n,x.matcher(t))},x.max=function(n,t,r){var e,u,i=-(1/0),o=-(1/0);if(null==t&&null!=n){n=E(n)?n:x.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=T(t,r),x.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-(1/0)&&i===-(1/0))&&(i=n,o=u)});return i},x.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=E(n)?n:x.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=T(t,r),x.each(n,function(n,r,e){u=t(n,r,e),(o>u||u===1/0&&i===1/0)&&(i=n,o=u)});return i},x.shuffle=function(n){for(var t,r=E(n)?n:x.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=x.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},x.sample=function(n,t,r){return null==t||r?(E(n)||(n=x.values(n)),n[x.random(n.length-1)]):x.shuffle(n).slice(0,Math.max(0,t))},x.sortBy=function(n,t,r){return t=T(t,r),x.pluck(x.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||void 0===r)return 1;if(e>r||void 0===e)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=T(r,e),x.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};x.groupBy=F(function(n,t,r){x.has(n,r)?n[r].push(t):n[r]=[t]}),x.indexBy=F(function(n,t,r){n[r]=t}),x.countBy=F(function(n,t,r){x.has(n,r)?n[r]++:n[r]=1}),x.toArray=function(n){return n?x.isArray(n)?v.call(n):E(n)?x.map(n,x.identity):x.values(n):[]},x.size=function(n){return null==n?0:E(n)?n.length:x.keys(n).length},x.partition=function(n,t,r){t=T(t,r);var e=[],u=[];return x.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},x.first=x.head=x.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:x.initial(n,n.length-t)},x.initial=function(n,t,r){return v.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},x.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:x.rest(n,Math.max(0,n.length-t))},x.rest=x.tail=x.drop=function(n,t,r){return v.call(n,null==t||r?1:t)},x.compact=function(n){return x.filter(n,x.identity)};var M=function X(n,t,r,e){for(var u=[],i=0,o=e||0,a=S(n);a>o;o++){var c=n[o];if(E(c)&&(x.isArray(c)||x.isArguments(c))){t||(c=X(c,t,r));var l=0,f=c.length;for(u.length+=f;f>l;)u[i++]=c[l++]}else r||(u[i++]=c)}return u};x.flatten=function(n,t){return M(n,t,!1)},x.without=function(n){return x.difference(n,v.call(arguments,1))},x.uniq=x.unique=function(n,t,r,e){x.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=T(r,e));for(var u=[],i=[],o=0,a=S(n);a>o;o++){var c=n[o],l=r?r(c,o,n):c;t?(o&&i===l||u.push(c),i=l):r?x.contains(i,l)||(i.push(l),u.push(c)):x.contains(u,c)||u.push(c)}return u},x.union=function(){return x.uniq(M(arguments,!0,!0))},x.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=S(n);u>e;e++){var i=n[e];if(!x.contains(t,i)){for(var o=1;r>o&&x.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},x.difference=function(n){var t=M(arguments,!0,!0,1);return x.filter(n,function(n){return!x.contains(t,n)})},x.zip=function(){return x.unzip(arguments)},x.unzip=function(n){for(var t=n&&x.max(n,S).length||0,r=Array(t),e=0;t>e;e++)r[e]=x.pluck(n,e);return r},x.object=function(n,t){for(var r={},e=0,u=S(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},x.findIndex=i(1),x.findLastIndex=i(-1),x.sortedIndex=function(n,t,r,e){r=T(r,e,1);for(var u=r(t),i=0,o=S(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},x.indexOf=o(1,x.findIndex,x.sortedIndex),x.lastIndexOf=o(-1,x.findLastIndex),x.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var N=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=k(n.prototype),o=n.apply(i,u);return x.isObject(o)?o:i};x.bind=function(n,t){if(_&&n.bind===_)return _.apply(n,v.call(arguments,1));if(!x.isFunction(n))throw new TypeError("Bind must be called on a function");var r=v.call(arguments,2),e=function u(){return N(n,u,t,this,r.concat(v.call(arguments)))};return e},x.partial=function(n){var t=v.call(arguments,1),r=function e(){for(var r=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===x?arguments[r++]:t[o];for(;r<arguments.length;)i.push(arguments[r++]);return N(n,e,this,this,i)};return r},x.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=x.bind(n[r],n);return n},x.memoize=function(n,t){var r=function e(r){var u=e.cache,i=""+(t?t.apply(this,arguments):r);return x.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},x.delay=function(n,t){var r=v.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},x.defer=x.partial(x.delay,x,1),x.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:x.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var l=x.now();a||r.leading!==!1||(a=l);var f=t-(l-a);return e=this,u=arguments,0>=f||f>t?(o&&(clearTimeout(o),o=null),a=l,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,f)),i}},x.debounce=function(n,t,r){var e,u,i,o,a,c=function l(){var c=x.now()-o;t>c&&c>=0?e=setTimeout(l,t-c):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=x.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(a=n.apply(i,u),i=u=null),a}},x.wrap=function(n,t){return x.partial(t,n)},x.negate=function(n){return function(){return!n.apply(this,arguments)}},x.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},x.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},x.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},x.once=x.partial(x.before,2);var L=!{toString:null}.propertyIsEnumerable("toString"),B=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];x.keys=function(n){if(!x.isObject(n))return[];if(d)return d(n);var t=[];for(var r in n)x.has(n,r)&&t.push(r);return L&&a(n,t),t},x.allKeys=function(n){if(!x.isObject(n))return[];var t=[];for(var r in n)t.push(r);return L&&a(n,t),t},x.values=function(n){for(var t=x.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},x.mapObject=function(n,t,r){t=T(t,r);for(var e,u=x.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},x.pairs=function(n){for(var t=x.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},x.invert=function(n){for(var t={},r=x.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},x.functions=x.methods=function(n){var t=[];for(var r in n)x.isFunction(n[r])&&t.push(r);return t.sort()},x.extend=A(x.allKeys),x.extendOwn=x.assign=A(x.keys),x.findKey=function(n,t,r){t=T(t,r);for(var e,u=x.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},x.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;x.isFunction(t)?(u=x.allKeys(o),e=j(t,r)):(u=M(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var l=u[a],f=o[l];e(f,l,o)&&(i[l]=f)}return i},x.omit=function(n,t,r){if(x.isFunction(t))t=x.negate(t);else{var e=x.map(M(arguments,!1,!1,1),String);t=function(n,t){return!x.contains(e,t)}}return x.pick(n,t,r)},x.defaults=A(x.allKeys,!0),x.create=function(n,t){var r=k(n);return t&&x.extendOwn(r,t),r},x.clone=function(n){return x.isObject(n)?x.isArray(n)?n.slice():x.extend({},n):n},x.tap=function(n,t){return t(n),n},x.isMatch=function(n,t){var r=x.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var q=function $(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof x&&(n=n._wrapped),t instanceof x&&(t=t._wrapped);var u=y.call(n);if(u!==y.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(x.isFunction(o)&&o instanceof o&&x.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!$(n[c],t[c],r,e))return!1}else{var l,f=x.keys(n);if(c=f.length,x.keys(t).length!==c)return!1;for(;c--;)if(l=f[c],!x.has(t,l)||!$(n[l],t[l],r,e))return!1}return r.pop(),e.pop(),!0};x.isEqual=function(n,t){return q(n,t)},x.isEmpty=function(n){return null==n?!0:E(n)&&(x.isArray(n)||x.isString(n)||x.isArguments(n))?0===n.length:0===x.keys(n).length},x.isElement=function(n){return!(!n||1!==n.nodeType)},x.isArray=m||function(n){return"[object Array]"===y.call(n)},x.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},x.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){x["is"+n]=function(t){return y.call(t)==="[object "+n+"]"}}),x.isArguments(arguments)||(x.isArguments=function(n){return x.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(x.isFunction=function(n){return"function"==typeof n||!1}),x.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},x.isNaN=function(n){return x.isNumber(n)&&n!==+n},x.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===y.call(n)},x.isNull=function(n){return null===n},x.isUndefined=function(n){return void 0===n},x.has=function(n,t){return null!=n&&g.call(n,t)},x.noConflict=function(){return c._=l,this},x.identity=function(n){return n},x.constant=function(n){return function(){return n}},x.noop=function(){},x.property=O,x.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},x.matcher=x.matches=function(n){return n=x.extendOwn({},n),function(t){return x.isMatch(t,n)}},x.times=function(n,t,r){var e=Array(Math.max(0,n));t=j(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},x.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},x.now=Date.now||function(){return(new Date).getTime()};var R={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},C=x.invert(R),K=function(n){var t=function(t){return n[t]},r="(?:"+x.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};x.escape=K(R),x.unescape=K(C),x.result=function(n,t,r){var e=null==n?void 0:n[t];return void 0===e&&(e=r),x.isFunction(e)?e.call(n):e};var z=0;x.uniqueId=function(n){var t=++z+"";return n?n+t:t},x.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var D=/(.)^/,P={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},V=/\\|'|\r|\n|\u2028|\u2029/g,U=function(n){return"\\"+P[n]};x.template=function(n,t,r){!t&&r&&(t=r),t=x.defaults({},t,x.templateSettings);var e=RegExp([(t.escape||D).source,(t.interpolate||D).source,(t.evaluate||D).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(V,U),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,x)},l=t.variable||"obj";return c.source="function("+l+"){\n"+i+"}",c},x.chain=function(n){var t=x(n);return t._chain=!0,t};var J=function(n,t){return n._chain?x(t).chain():t};x.mixin=function(n){x.each(x.functions(n),function(t){var r=x[t]=n[t];x.prototype[t]=function(){var n=[this._wrapped];return h.apply(n,arguments),J(this,r.apply(x,n))}})},x.mixin(x),x.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=f[n];x.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],J(this,r)}}),x.each(["concat","join","slice"],function(n){var t=f[n];x.prototype[n]=function(){return J(this,t.apply(this._wrapped,arguments))}}),x.prototype.value=function(){return this._wrapped},x.prototype.valueOf=x.prototype.toJSON=x.prototype.value,x.prototype.toString=function(){return""+this._wrapped},e=[],u=function(){return x}.apply(t,e),!(void 0!==u&&(n.exports=u))}).call(void 0)},function(n,t){"use strict";function r(){l=!1,o.length?c=o.concat(c):f=-1,c.length&&e()}function e(){if(!l){var n=setTimeout(r);l=!0;for(var t=c.length;t;){for(o=c,c=[];++f<t;)o&&o[f].run();f=-1,t=c.length}o=null,l=!1,clearTimeout(n)}}function u(n,t){this.fun=n,this.array=t}function i(){}var o,a=n.exports={},c=[],l=!1,f=-1;a.nextTick=function(n){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];c.push(new u(n,t)),1!==c.length||l||setTimeout(e,0)},u.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=i,a.addListener=i,a.once=i,a.off=i,a.removeListener=i,a.removeAllListeners=i,a.emit=i,a.binding=function(n){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(n){throw new Error("process.chdir is not supported")},a.umask=function(){return 0}},function(n,t){n.exports=jquery}]);