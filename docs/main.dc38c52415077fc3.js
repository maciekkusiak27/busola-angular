"use strict";
(self.webpackChunkbusola_web = self.webpackChunkbusola_web || []).push([
  [179],
  {
    797: () => {
      function ee(e) {
        return "function" == typeof e;
      }
      function Jo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Ko = Jo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function jr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class mt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ee(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Ko ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  pd(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Ko ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Ko(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) pd(t);
            else {
              if (t instanceof mt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && jr(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && jr(n, t), t instanceof mt && t._removeParent(this);
        }
      }
      mt.EMPTY = (() => {
        const e = new mt();
        return (e.closed = !0), e;
      })();
      const fd = mt.EMPTY;
      function hd(e) {
        return (
          e instanceof mt ||
          (e && "closed" in e && ee(e.remove) && ee(e.add) && ee(e.unsubscribe))
        );
      }
      function pd(e) {
        ee(e) ? e() : e.unsubscribe();
      }
      const Cn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        ei = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = ei;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = ei;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function gd(e) {
        ei.setTimeout(() => {
          const { onUnhandledError: t } = Cn;
          if (!t) throw e;
          t(e);
        });
      }
      function md() {}
      const V_ = la("C", void 0, void 0);
      function la(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let wn = null;
      function ti(e) {
        if (Cn.useDeprecatedSynchronousErrorHandling) {
          const t = !wn;
          if ((t && (wn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = wn;
            if (((wn = null), n)) throw r;
          }
        } else e();
      }
      class ca extends mt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), hd(t) && t.add(this))
              : (this.destination = z_);
        }
        static create(t, n, r) {
          return new Br(t, n, r);
        }
        next(t) {
          this.isStopped
            ? fa(
                (function B_(e) {
                  return la("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? fa(
                (function j_(e) {
                  return la("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? fa(V_, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const $_ = Function.prototype.bind;
      function da(e, t) {
        return $_.call(e, t);
      }
      class U_ {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              ni(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              ni(r);
            }
          else ni(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              ni(n);
            }
        }
      }
      class Br extends ca {
        constructor(t, n, r) {
          let o;
          if ((super(), ee(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && Cn.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && da(t.next, i),
                  error: t.error && da(t.error, i),
                  complete: t.complete && da(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new U_(o);
        }
      }
      function ni(e) {
        Cn.useDeprecatedSynchronousErrorHandling
          ? (function H_(e) {
              Cn.useDeprecatedSynchronousErrorHandling &&
                wn &&
                ((wn.errorThrown = !0), (wn.error = e));
            })(e)
          : gd(e);
      }
      function fa(e, t) {
        const { onStoppedNotification: n } = Cn;
        n && ei.setTimeout(() => n(e, t));
      }
      const z_ = {
          closed: !0,
          next: md,
          error: function G_(e) {
            throw e;
          },
          complete: md,
        },
        ha =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function pa(e) {
        return e;
      }
      let we = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function W_(e) {
              return (
                (e && e instanceof ca) ||
                ((function q_(e) {
                  return e && ee(e.next) && ee(e.error) && ee(e.complete);
                })(e) &&
                  hd(e))
              );
            })(n)
              ? n
              : new Br(n, r, o);
            return (
              ti(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = vd(r))((o, i) => {
              const s = new Br({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ha]() {
            return this;
          }
          pipe(...n) {
            return (function yd(e) {
              return 0 === e.length
                ? pa
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = vd(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function vd(e) {
        var t;
        return null !== (t = e ?? Cn.Promise) && void 0 !== t ? t : Promise;
      }
      const Z_ = Jo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let ri = (() => {
        class e extends we {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Dd(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new Z_();
          }
          next(n) {
            ti(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            ti(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            ti(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? fd
              : ((this.currentObservers = null),
                i.push(n),
                new mt(() => {
                  (this.currentObservers = null), jr(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new we();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Dd(t, n)), e;
      })();
      class Dd extends ri {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : fd;
        }
      }
      function Rt(e) {
        return (t) => {
          if (
            (function Y_(e) {
              return ee(e?.lift);
            })(t)
          )
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function kt(e, t, n, r, o) {
        return new Q_(e, t, n, r, o);
      }
      class Q_ extends ca {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function En(e, t) {
        return Rt((n, r) => {
          let o = 0;
          n.subscribe(
            kt(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function en(e) {
        return this instanceof en ? ((this.v = e), this) : new en(e);
      }
      function Ed(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function va(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    i({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const bd = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Id(e) {
        return ee(e?.then);
      }
      function Md(e) {
        return ee(e[ha]);
      }
      function Sd(e) {
        return Symbol.asyncIterator && ee(e?.[Symbol.asyncIterator]);
      }
      function Ad(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Td = (function vC() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Nd(e) {
        return ee(e?.[Td]);
      }
      function xd(e) {
        return (function wd(e, t, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = n.apply(e, t || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function u(f) {
                f.value instanceof en
                  ? Promise.resolve(f.value.v).then(l, c)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function l(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield en(n.read());
              if (o) return yield en(void 0);
              yield yield en(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Od(e) {
        return ee(e?.getReader);
      }
      function yt(e) {
        if (e instanceof we) return e;
        if (null != e) {
          if (Md(e))
            return (function DC(e) {
              return new we((t) => {
                const n = e[ha]();
                if (ee(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (bd(e))
            return (function _C(e) {
              return new we((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Id(e))
            return (function CC(e) {
              return new we((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, gd);
              });
            })(e);
          if (Sd(e)) return Fd(e);
          if (Nd(e))
            return (function wC(e) {
              return new we((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Od(e))
            return (function EC(e) {
              return Fd(xd(e));
            })(e);
        }
        throw Ad(e);
      }
      function Fd(e) {
        return new we((t) => {
          (function bC(e, t) {
            var n, r, o, i;
            return (function _d(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Ed(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function tn(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function oi(e, t, n = 1 / 0) {
        return ee(t)
          ? oi((r, o) => En((i, s) => t(r, i, o, s))(yt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Rt((r, o) =>
              (function IC(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), l++;
                    let y = !1;
                    yt(n(g, c++)).subscribe(
                      kt(
                        t,
                        (D) => {
                          o?.(D), i ? h(D) : t.next(D);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (l--; u.length && l < r; ) {
                                const D = u.shift();
                                s ? tn(t, s, () => p(D)) : p(D);
                              }
                              f();
                            } catch (D) {
                              t.error(D);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    kt(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      const Pd = new we((e) => e.complete());
      function Da(e) {
        return e[e.length - 1];
      }
      function Rd(e) {
        return (function AC(e) {
          return e && ee(e.schedule);
        })(Da(e))
          ? e.pop()
          : void 0;
      }
      function kd(e, t = 0) {
        return Rt((n, r) => {
          n.subscribe(
            kt(
              r,
              (o) => tn(r, e, () => r.next(o), t),
              () => tn(r, e, () => r.complete(), t),
              (o) => tn(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Ld(e, t = 0) {
        return Rt((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Vd(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new we((n) => {
          tn(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            tn(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function ii(e, t) {
        return t
          ? (function kC(e, t) {
              if (null != e) {
                if (Md(e))
                  return (function xC(e, t) {
                    return yt(e).pipe(Ld(t), kd(t));
                  })(e, t);
                if (bd(e))
                  return (function FC(e, t) {
                    return new we((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Id(e))
                  return (function OC(e, t) {
                    return yt(e).pipe(Ld(t), kd(t));
                  })(e, t);
                if (Sd(e)) return Vd(e, t);
                if (Nd(e))
                  return (function PC(e, t) {
                    return new we((n) => {
                      let r;
                      return (
                        tn(n, t, () => {
                          (r = e[Td]()),
                            tn(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ee(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Od(e))
                  return (function RC(e, t) {
                    return Vd(xd(e), t);
                  })(e, t);
              }
              throw Ad(e);
            })(e, t)
          : yt(e);
      }
      class VC extends ri {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function _a(...e) {
        return ii(e, Rd(e));
      }
      function jd(e = {}) {
        const {
          connector: t = () => new ri(),
          resetOnError: n = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: o = !0,
        } = e;
        return (i) => {
          let s,
            a,
            u,
            l = 0,
            c = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = u = void 0), (c = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return Rt((g, y) => {
            l++, !d && !c && f();
            const D = (u = u ?? t());
            y.add(() => {
              l--, 0 === l && !d && !c && (a = Ca(p, o));
            }),
              D.subscribe(y),
              !s &&
                l > 0 &&
                ((s = new Br({
                  next: (m) => D.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = Ca(h, n, m)), D.error(m);
                  },
                  complete: () => {
                    (c = !0), f(), (a = Ca(h, r)), D.complete();
                  },
                })),
                yt(g).subscribe(s));
          })(i);
        };
      }
      function Ca(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new Br({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return yt(t(...n)).subscribe(r);
      }
      function Bd(e, t) {
        return Rt((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            kt(
              r,
              (u) => {
                o?.unsubscribe();
                let l = 0;
                const c = i++;
                yt(e(u, c)).subscribe(
                  (o = kt(
                    r,
                    (d) => r.next(t ? t(u, d, c, l++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function BC(e, t) {
        return e === t;
      }
      function q(e) {
        for (let t in e) if (e[t] === q) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function si(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function de(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(de).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function wa(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const HC = q({ __forward_ref__: q });
      function Y(e) {
        return (
          (e.__forward_ref__ = Y),
          (e.toString = function () {
            return de(this());
          }),
          e
        );
      }
      function A(e) {
        return Ea(e) ? e() : e;
      }
      function Ea(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(HC) &&
          e.__forward_ref__ === Y
        );
      }
      function ba(e) {
        return e && !!e.ɵproviders;
      }
      class C extends Error {
        constructor(t, n) {
          super(
            (function ai(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function T(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Ia(e, t) {
        throw new C(-201, !1);
      }
      function Ke(e, t) {
        null == e &&
          (function M(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function B(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function vt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function ui(e) {
        return $d(e, ci) || $d(e, Ud);
      }
      function $d(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function li(e) {
        return e && (e.hasOwnProperty(Ma) || e.hasOwnProperty(ZC))
          ? e[Ma]
          : null;
      }
      const ci = q({ ɵprov: q }),
        Ma = q({ ɵinj: q }),
        Ud = q({ ngInjectableDef: q }),
        ZC = q({ ngInjectorDef: q });
      var L = (function (e) {
        return (
          (e[(e.Default = 0)] = "Default"),
          (e[(e.Host = 1)] = "Host"),
          (e[(e.Self = 2)] = "Self"),
          (e[(e.SkipSelf = 4)] = "SkipSelf"),
          (e[(e.Optional = 8)] = "Optional"),
          e
        );
      })(L || {});
      let Sa;
      function Ve(e) {
        const t = Sa;
        return (Sa = e), t;
      }
      function zd(e, t, n) {
        const r = ui(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & L.Optional
          ? null
          : void 0 !== t
          ? t
          : void Ia(de(e));
      }
      const Q = globalThis;
      class b {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = B({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const Hr = {},
        Oa = "__NG_DI_FLAG__",
        di = "ngTempTokenPath",
        XC = /\n/gm,
        Wd = "__source";
      let $n;
      function nn(e) {
        const t = $n;
        return ($n = e), t;
      }
      function ew(e, t = L.Default) {
        if (void 0 === $n) throw new C(-203, !1);
        return null === $n
          ? zd(e, void 0, t)
          : $n.get(e, t & L.Optional ? null : void 0, t);
      }
      function P(e, t = L.Default) {
        return (
          (function Gd() {
            return Sa;
          })() || ew
        )(A(e), t);
      }
      function H(e, t = L.Default) {
        return P(e, fi(t));
      }
      function fi(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function Fa(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = A(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = L.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = tw(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(P(o, i));
          } else t.push(P(r));
        }
        return t;
      }
      function $r(e, t) {
        return (e[Oa] = t), (e.prototype[Oa] = t), e;
      }
      function tw(e) {
        return e[Oa];
      }
      function Lt(e) {
        return { toString: e }.toString();
      }
      var hi = (function (e) {
          return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
          );
        })(hi || {}),
        it = (function (e) {
          return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
          );
        })(it || {});
      const Dt = {},
        $ = [],
        pi = q({ ɵcmp: q }),
        Pa = q({ ɵdir: q }),
        Ra = q({ ɵpipe: q }),
        Yd = q({ ɵmod: q }),
        Vt = q({ ɵfac: q }),
        Ur = q({ __NG_ELEMENT_ID__: q }),
        Qd = q({ __NG_ENV_ID__: q });
      function Xd(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      function ka(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Kd(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function Jd(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Kd(e) {
        return 64 === e.charCodeAt(0);
      }
      function Gr(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  ef(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function ef(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      const tf = "ng-template";
      function ow(e, t, n) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (n && "class" === i && -1 !== Xd(s.toLowerCase(), t, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < e.length && "string" == typeof (i = e[r++]); )
                if (i.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function nf(e) {
        return 4 === e.type && e.value !== tf;
      }
      function iw(e, t, n) {
        return t === (4 !== e.type || n ? e.value : tf);
      }
      function sw(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function lw(e) {
            for (let t = 0; t < e.length; t++) if (Jd(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !iw(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (st(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!ow(e.attrs, l, n)) {
                    if (st(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = aw(8 & r ? "class" : u, o, nf(e), n);
                if (-1 === d) {
                  if (st(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Xd(h, l, 0)) || (2 & r && l !== f)) {
                    if (st(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !st(r) && !st(u)) return !1;
            if (s && st(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return st(r) || s;
      }
      function st(e) {
        return 0 == (1 & e);
      }
      function aw(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function cw(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function rf(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (sw(e, t[r], n)) return !0;
        return !1;
      }
      function sf(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function fw(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !st(s) && ((t += sf(i, o)), (o = "")),
              (r = s),
              (i = i || !st(r));
          n++;
        }
        return "" !== o && (t += sf(i, o)), t;
      }
      function La(e) {
        return Lt(() => {
          const t = uf(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === hi.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || it.Emulated,
              styles: e.styles || $,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          lf(n);
          const r = e.dependencies;
          return (
            (n.directiveDefs = gi(r, !1)),
            (n.pipeDefs = gi(r, !0)),
            (n.id = (function _w(e) {
              let t = 0;
              const n = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
              return (t += 2147483648), "c" + t;
            })(n)),
            n
          );
        });
      }
      function mw(e) {
        return V(e) || ye(e);
      }
      function yw(e) {
        return null !== e;
      }
      function jt(e) {
        return Lt(() => ({
          type: e.type,
          bootstrap: e.bootstrap || $,
          declarations: e.declarations || $,
          imports: e.imports || $,
          exports: e.exports || $,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function af(e, t) {
        if (null == e) return Dt;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      function x(e) {
        return Lt(() => {
          const t = uf(e);
          return lf(t), t;
        });
      }
      function V(e) {
        return e[pi] || null;
      }
      function ye(e) {
        return e[Pa] || null;
      }
      function Te(e) {
        return e[Ra] || null;
      }
      function uf(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          inputTransforms: null,
          inputConfig: e.inputs || Dt,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || $,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: af(e.inputs, t),
          outputs: af(e.outputs),
        };
      }
      function lf(e) {
        e.features?.forEach((t) => t(e));
      }
      function gi(e, t) {
        if (!e) return null;
        const n = t ? Te : mw;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => n(r)).filter(yw);
      }
      const oe = 0,
        w = 1,
        F = 2,
        te = 3,
        at = 4,
        qr = 5,
        Ee = 6,
        Un = 7,
        ae = 8,
        rn = 9,
        Gn = 10,
        N = 11,
        Wr = 12,
        cf = 13,
        zn = 14,
        ue = 15,
        Zr = 16,
        qn = 17,
        _t = 18,
        Yr = 19,
        df = 20,
        on = 21,
        Bt = 22,
        Qr = 23,
        Xr = 24,
        k = 25,
        Va = 1,
        ff = 2,
        Ct = 7,
        Wn = 9,
        ve = 11;
      function Be(e) {
        return Array.isArray(e) && "object" == typeof e[Va];
      }
      function Ne(e) {
        return Array.isArray(e) && !0 === e[Va];
      }
      function ja(e) {
        return 0 != (4 & e.flags);
      }
      function In(e) {
        return e.componentOffset > -1;
      }
      function yi(e) {
        return 1 == (1 & e.flags);
      }
      function ut(e) {
        return !!e.template;
      }
      function Ba(e) {
        return 0 != (512 & e[F]);
      }
      function Mn(e, t) {
        return e.hasOwnProperty(Vt) ? e[Vt] : null;
      }
      let De = null,
        vi = !1;
      function et(e) {
        const t = De;
        return (De = e), t;
      }
      const gf = {
        version: 0,
        dirty: !1,
        producerNode: void 0,
        producerLastReadVersion: void 0,
        producerIndexOfThis: void 0,
        nextProducerIndex: 0,
        liveConsumerNode: void 0,
        liveConsumerIndexOfThis: void 0,
        consumerAllowSignalWrites: !1,
        consumerIsAlwaysLive: !1,
        producerMustRecompute: () => !1,
        producerRecomputeValue: () => {},
        consumerMarkedDirty: () => {},
      };
      function yf(e) {
        if (!Kr(e) || e.dirty) {
          if (!e.producerMustRecompute(e) && !_f(e)) return void (e.dirty = !1);
          e.producerRecomputeValue(e), (e.dirty = !1);
        }
      }
      function Df(e) {
        (e.dirty = !0),
          (function vf(e) {
            if (void 0 === e.liveConsumerNode) return;
            const t = vi;
            vi = !0;
            try {
              for (const n of e.liveConsumerNode) n.dirty || Df(n);
            } finally {
              vi = t;
            }
          })(e),
          e.consumerMarkedDirty?.(e);
      }
      function $a(e) {
        return e && (e.nextProducerIndex = 0), et(e);
      }
      function Ua(e, t) {
        if (
          (et(t),
          e &&
            void 0 !== e.producerNode &&
            void 0 !== e.producerIndexOfThis &&
            void 0 !== e.producerLastReadVersion)
        ) {
          if (Kr(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
              Di(e.producerNode[n], e.producerIndexOfThis[n]);
          for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
              e.producerLastReadVersion.pop(),
              e.producerIndexOfThis.pop();
        }
      }
      function _f(e) {
        Zn(e);
        for (let t = 0; t < e.producerNode.length; t++) {
          const n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
          if (r !== n.version || (yf(n), r !== n.version)) return !0;
        }
        return !1;
      }
      function Cf(e) {
        if ((Zn(e), Kr(e)))
          for (let t = 0; t < e.producerNode.length; t++)
            Di(e.producerNode[t], e.producerIndexOfThis[t]);
        (e.producerNode.length =
          e.producerLastReadVersion.length =
          e.producerIndexOfThis.length =
            0),
          e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
      }
      function Di(e, t) {
        if (
          ((function Ef(e) {
            (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
          })(e),
          Zn(e),
          1 === e.liveConsumerNode.length)
        )
          for (let r = 0; r < e.producerNode.length; r++)
            Di(e.producerNode[r], e.producerIndexOfThis[r]);
        const n = e.liveConsumerNode.length - 1;
        if (
          ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
          (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
          e.liveConsumerNode.length--,
          e.liveConsumerIndexOfThis.length--,
          t < e.liveConsumerNode.length)
        ) {
          const r = e.liveConsumerIndexOfThis[t],
            o = e.liveConsumerNode[t];
          Zn(o), (o.producerIndexOfThis[r] = t);
        }
      }
      function Kr(e) {
        return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
      }
      function Zn(e) {
        (e.producerNode ??= []),
          (e.producerIndexOfThis ??= []),
          (e.producerLastReadVersion ??= []);
      }
      let bf = null;
      const Af = () => {},
        Fw = (() => ({
          ...gf,
          consumerIsAlwaysLive: !0,
          consumerAllowSignalWrites: !1,
          consumerMarkedDirty: (e) => {
            e.schedule(e.ref);
          },
          hasRun: !1,
          cleanupFn: Af,
        }))();
      class Pw {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Ht() {
        return Tf;
      }
      function Tf(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = kw), Rw;
      }
      function Rw() {
        const e = xf(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === Dt) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function kw(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            xf(e) ||
            (function Lw(e, t) {
              return (e[Nf] = t);
            })(e, { previous: Dt, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new Pw(u && u.currentValue, t, a === Dt)), (e[r] = t);
      }
      Ht.ngInherit = !0;
      const Nf = "__ngSimpleChanges__";
      function xf(e) {
        return e[Nf] || null;
      }
      const wt = function (e, t, n) {};
      function X(e) {
        for (; Array.isArray(e); ) e = e[oe];
        return e;
      }
      function _i(e, t) {
        return X(t[e]);
      }
      function He(e, t) {
        return X(t[e.index]);
      }
      function Pf(e, t) {
        return e.data[t];
      }
      function Ze(e, t) {
        const n = t[e];
        return Be(n) ? n : n[oe];
      }
      function an(e, t) {
        return null == t ? null : e[t];
      }
      function Rf(e) {
        e[qn] = 0;
      }
      function Uw(e) {
        1024 & e[F] || ((e[F] |= 1024), Lf(e, 1));
      }
      function kf(e) {
        1024 & e[F] && ((e[F] &= -1025), Lf(e, -1));
      }
      function Lf(e, t) {
        let n = e[te];
        if (null === n) return;
        n[qr] += t;
        let r = n;
        for (
          n = n[te];
          null !== n && ((1 === t && 1 === r[qr]) || (-1 === t && 0 === r[qr]));

        )
          (n[qr] += t), (r = n), (n = n[te]);
      }
      const S = {
        lFrame: Zf(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Bf() {
        return S.bindingsEnabled;
      }
      function v() {
        return S.lFrame.lView;
      }
      function j() {
        return S.lFrame.tView;
      }
      function eo(e) {
        return (S.lFrame.contextLView = e), e[ae];
      }
      function to(e) {
        return (S.lFrame.contextLView = null), e;
      }
      function _e() {
        let e = Hf();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Hf() {
        return S.lFrame.currentTNode;
      }
      function Et(e, t) {
        const n = S.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Za() {
        return S.lFrame.isParent;
      }
      function Xn() {
        return S.lFrame.bindingIndex++;
      }
      function tE(e, t) {
        const n = S.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Qa(t);
      }
      function Qa(e) {
        S.lFrame.currentDirectiveIndex = e;
      }
      function Ja(e) {
        S.lFrame.currentQueryIndex = e;
      }
      function rE(e) {
        const t = e[w];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[Ee] : null;
      }
      function qf(e, t, n) {
        if (n & L.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & L.Host ||
              ((o = rE(i)), null === o || ((i = i[zn]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (S.lFrame = Wf());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Ka(e) {
        const t = Wf(),
          n = e[w];
        (S.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Wf() {
        const e = S.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Zf(e) : t;
      }
      function Zf(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function Yf() {
        const e = S.lFrame;
        return (
          (S.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Qf = Yf;
      function eu() {
        const e = Yf();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Oe() {
        return S.lFrame.selectedIndex;
      }
      function Sn(e) {
        S.lFrame.selectedIndex = e;
      }
      let Jf = !0;
      function Ci() {
        return Jf;
      }
      function un(e) {
        Jf = e;
      }
      function wi(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks ??= []).push(-n, s),
            a &&
              ((e.contentHooks ??= []).push(n, a),
              (e.contentCheckHooks ??= []).push(n, a)),
            u && (e.viewHooks ??= []).push(-n, u),
            l &&
              ((e.viewHooks ??= []).push(n, l),
              (e.viewCheckHooks ??= []).push(n, l)),
            null != c && (e.destroyHooks ??= []).push(n, c);
        }
      }
      function Ei(e, t, n) {
        Kf(e, t, 3, n);
      }
      function bi(e, t, n, r) {
        (3 & e[F]) === n && Kf(e, t, n, r);
      }
      function tu(e, t) {
        let n = e[F];
        (3 & n) === t && ((n &= 8191), (n += 1), (e[F] = n));
      }
      function Kf(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[qn] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[qn] += 65536),
              (a < i || -1 == i) &&
                (dE(e, n, t, u), (e[qn] = (4294901760 & e[qn]) + u + 2)),
              u++;
      }
      function eh(e, t) {
        wt(4, e, t);
        const n = et(null);
        try {
          t.call(e);
        } finally {
          et(n), wt(5, e, t);
        }
      }
      function dE(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        o
          ? e[F] >> 13 < e[qn] >> 16 &&
            (3 & e[F]) === t &&
            ((e[F] += 8192), eh(a, i))
          : eh(a, i);
      }
      const Jn = -1;
      class ro {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function ru(e) {
        return e !== Jn;
      }
      function oo(e) {
        return 32767 & e;
      }
      function io(e, t) {
        let n = (function gE(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[zn]), n--;
        return r;
      }
      let ou = !0;
      function Ii(e) {
        const t = ou;
        return (ou = e), t;
      }
      const th = 255,
        nh = 5;
      let mE = 0;
      const bt = {};
      function Mi(e, t) {
        const n = rh(e, t);
        if (-1 !== n) return n;
        const r = t[w];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          iu(r.data, e),
          iu(t, null),
          iu(r.blueprint, null));
        const o = Si(e, t),
          i = e.injectorIndex;
        if (ru(o)) {
          const s = oo(o),
            a = io(o, t),
            u = a[w].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function iu(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function rh(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Si(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = ch(o)), null === r)) return Jn;
          if ((n++, (o = o[zn]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return Jn;
      }
      function su(e, t, n) {
        !(function yE(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Ur) && (r = n[Ur]),
            null == r && (r = n[Ur] = mE++);
          const o = r & th;
          t.data[e + (o >> nh)] |= 1 << o;
        })(e, t, n);
      }
      function oh(e, t, n) {
        if (n & L.Optional || void 0 !== e) return e;
        Ia();
      }
      function ih(e, t, n, r) {
        if (
          (n & L.Optional && void 0 === r && (r = null),
          !(n & (L.Self | L.Host)))
        ) {
          const o = e[rn],
            i = Ve(void 0);
          try {
            return o ? o.get(t, r, n & L.Optional) : zd(t, r, n & L.Optional);
          } finally {
            Ve(i);
          }
        }
        return oh(r, 0, n);
      }
      function sh(e, t, n, r = L.Default, o) {
        if (null !== e) {
          if (2048 & t[F] && !(r & L.Self)) {
            const s = (function EE(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 2048 & s[F] && !(512 & s[F]);

              ) {
                const a = ah(i, s, n, r | L.Self, bt);
                if (a !== bt) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[df];
                  if (l) {
                    const c = l.get(n, bt, r);
                    if (c !== bt) return c;
                  }
                  (u = ch(s)), (s = s[zn]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, bt);
            if (s !== bt) return s;
          }
          const i = ah(e, t, n, r, bt);
          if (i !== bt) return i;
        }
        return ih(t, n, r, o);
      }
      function ah(e, t, n, r, o) {
        const i = (function _E(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Ur) ? e[Ur] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & th : wE) : t;
        })(n);
        if ("function" == typeof i) {
          if (!qf(t, e, r)) return r & L.Host ? oh(o, 0, r) : ih(t, n, r, o);
          try {
            let s;
            if (((s = i(r)), null != s || r & L.Optional)) return s;
            Ia();
          } finally {
            Qf();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = rh(e, t),
            u = Jn,
            l = r & L.Host ? t[ue][Ee] : null;
          for (
            (-1 === a || r & L.SkipSelf) &&
            ((u = -1 === a ? Si(e, t) : t[a + 8]),
            u !== Jn && lh(r, !1)
              ? ((s = t[w]), (a = oo(u)), (t = io(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[w];
            if (uh(i, a, c.data)) {
              const d = DE(a, t, n, s, r, l);
              if (d !== bt) return d;
            }
            (u = t[a + 8]),
              u !== Jn && lh(r, t[w].data[a + 8] === l) && uh(i, a, t)
                ? ((s = c), (a = oo(u)), (t = io(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function DE(e, t, n, r, o, i) {
        const s = t[w],
          a = s.data[e + 8],
          c = (function Ai(e, t, n, r, o) {
            const i = e.providerIndexes,
              s = t.data,
              a = 1048575 & i,
              u = e.directiveStart,
              c = i >> 20,
              f = o ? a + c : e.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < u && n === p) || (h >= u && p.type === n)) return h;
            }
            if (o) {
              const h = s[u];
              if (h && ut(h) && h.type === n) return u;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? In(a) && ou : r != s && 0 != (3 & a.type),
            o & L.Host && i === a
          );
        return null !== c ? An(t, s, c, a) : bt;
      }
      function An(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function fE(e) {
            return e instanceof ro;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function $C(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function z(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : T(e);
              })(i[n])
            );
          const a = Ii(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Ve(s.injectImpl) : null;
          qf(e, r, L.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function cE(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = Tf(t);
                    (n.preOrderHooks ??= []).push(e, s),
                      (n.preOrderCheckHooks ??= []).push(e, s);
                  }
                  o && (n.preOrderHooks ??= []).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks ??= []).push(e, i),
                      (n.preOrderCheckHooks ??= []).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== l && Ve(l), Ii(a), (s.resolving = !1), Qf();
          }
        }
        return o;
      }
      function uh(e, t, n) {
        return !!(n[t + (e >> nh)] & (1 << e));
      }
      function lh(e, t) {
        return !(e & L.Self || (e & L.Host && t));
      }
      class Fe {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return sh(this._tNode, this._lView, t, fi(r), n);
        }
      }
      function wE() {
        return new Fe(_e(), v());
      }
      function be(e) {
        return Lt(() => {
          const t = e.prototype.constructor,
            n = t[Vt] || au(t),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[Vt] || au(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function au(e) {
        return Ea(e)
          ? () => {
              const t = au(A(e));
              return t && t();
            }
          : Mn(e);
      }
      function ch(e) {
        const t = e[w],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[Ee] : null;
      }
      const er = "__parameters__";
      function nr(e, t, n) {
        return Lt(() => {
          const r = (function lu(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(er)
                ? u[er]
                : Object.defineProperty(u, er, { value: [] })[er];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      function or(e, t) {
        e.forEach((n) => (Array.isArray(n) ? or(n, t) : t(n)));
      }
      function fh(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Ti(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function Ye(e, t, n) {
        let r = ir(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function NE(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function cu(e, t) {
        const n = ir(e, t);
        if (n >= 0) return e[1 | n];
      }
      function ir(e, t) {
        return (function hh(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const fu = $r(nr("Optional"), 8),
        hu = $r(nr("SkipSelf"), 4);
      function Ri(e) {
        return 128 == (128 & e.flags);
      }
      var ln = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(ln || {});
      const yu = new Map();
      let eb = 0;
      const Du = "__ngContext__";
      function Ie(e, t) {
        Be(t)
          ? ((e[Du] = t[Yr]),
            (function nb(e) {
              yu.set(e[Yr], e);
            })(t))
          : (e[Du] = t);
      }
      let _u;
      function Cu(e, t) {
        return _u(e, t);
      }
      function fo(e) {
        const t = e[te];
        return Ne(t) ? t[te] : t;
      }
      function Fh(e) {
        return Rh(e[Wr]);
      }
      function Ph(e) {
        return Rh(e[at]);
      }
      function Rh(e) {
        for (; null !== e && !Ne(e); ) e = e[at];
        return e;
      }
      function ur(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          Ne(r) ? (i = r) : Be(r) && ((s = !0), (r = r[oe]));
          const a = X(r);
          0 === e && null !== n
            ? null == o
              ? jh(t, n, a)
              : Tn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? Tn(t, n, a, o || null, !0)
            : 2 === e
            ? (function $i(e, t, n) {
                const r = Bi(e, t);
                r &&
                  (function Cb(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function bb(e, t, n, r, o) {
                const i = n[Ct];
                i !== X(n) && ur(t, e, r, i, o);
                for (let a = ve; a < n.length; a++) {
                  const u = n[a];
                  po(u[w], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function Vi(e, t, n) {
        return e.createElement(t, n);
      }
      function Lh(e, t) {
        const n = e[Wn],
          r = n.indexOf(t);
        kf(t), n.splice(r, 1);
      }
      function ji(e, t) {
        if (e.length <= ve) return;
        const n = ve + t,
          r = e[n];
        if (r) {
          const o = r[Zr];
          null !== o && o !== e && Lh(o, r), t > 0 && (e[n - 1][at] = r[at]);
          const i = Ti(e, ve + t);
          !(function hb(e, t) {
            po(e, t, t[N], 2, null, null), (t[oe] = null), (t[Ee] = null);
          })(r[w], r);
          const s = i[_t];
          null !== s && s.detachView(i[w]),
            (r[te] = null),
            (r[at] = null),
            (r[F] &= -129);
        }
        return r;
      }
      function Eu(e, t) {
        if (!(256 & t[F])) {
          const n = t[N];
          t[Qr] && Cf(t[Qr]),
            t[Xr] && Cf(t[Xr]),
            n.destroyNode && po(e, t, n, 3, null, null),
            (function mb(e) {
              let t = e[Wr];
              if (!t) return bu(e[w], e);
              for (; t; ) {
                let n = null;
                if (Be(t)) n = t[Wr];
                else {
                  const r = t[ve];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[at] && t !== e; )
                    Be(t) && bu(t[w], t), (t = t[te]);
                  null === t && (t = e), Be(t) && bu(t[w], t), (n = t && t[at]);
                }
                t = n;
              }
            })(t);
        }
      }
      function bu(e, t) {
        if (!(256 & t[F])) {
          (t[F] &= -129),
            (t[F] |= 256),
            (function _b(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof ro)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        wt(4, a, u);
                        try {
                          u.call(a);
                        } finally {
                          wt(5, a, u);
                        }
                      }
                    else {
                      wt(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        wt(5, o, i);
                      }
                    }
                  }
                }
            })(e, t),
            (function Db(e, t) {
              const n = e.cleanup,
                r = t[Un];
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else n[i].call(r[n[i + 1]]);
              null !== r && (t[Un] = null);
              const o = t[on];
              if (null !== o) {
                t[on] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(e, t),
            1 === t[w].type && t[N].destroy();
          const n = t[Zr];
          if (null !== n && Ne(t[te])) {
            n !== t[te] && Lh(n, t);
            const r = t[_t];
            null !== r && r.detachView(e);
          }
          !(function rb(e) {
            yu.delete(e[Yr]);
          })(t);
        }
      }
      function Iu(e, t, n) {
        return (function Vh(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[oe];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === it.None || i === it.Emulated) return null;
            }
            return He(r, n);
          }
        })(e, t.parent, n);
      }
      function Tn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function jh(e, t, n) {
        e.appendChild(t, n);
      }
      function Bh(e, t, n, r, o) {
        null !== r ? Tn(e, t, n, r, o) : jh(e, t, n);
      }
      function Bi(e, t) {
        return e.parentNode(t);
      }
      let Mu,
        Nu,
        Uh = function $h(e, t, n) {
          return 40 & e.type ? He(e, n) : null;
        };
      function Hi(e, t, n, r) {
        const o = Iu(e, r, t),
          i = t[N],
          a = (function Hh(e, t, n) {
            return Uh(e, t, n);
          })(r.parent || t[Ee], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) Bh(i, o, n[u], a, !1);
          else Bh(i, o, n, a, !1);
        void 0 !== Mu && Mu(i, r, t, n, o);
      }
      function ho(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return He(t, e);
          if (4 & n) return Su(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return ho(e, r);
            {
              const o = e[t.index];
              return Ne(o) ? Su(-1, o) : X(o);
            }
          }
          if (32 & n) return Cu(t, e)() || X(e[t.index]);
          {
            const r = zh(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ho(fo(e[ue]), r)
              : ho(e, t.next);
          }
        }
        return null;
      }
      function zh(e, t) {
        return null !== t ? e[ue][Ee].projection[t.projection] : null;
      }
      function Su(e, t) {
        const n = ve + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[w].firstChild;
          if (null !== o) return ho(r, o);
        }
        return t[Ct];
      }
      function Au(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Ie(X(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & u) Au(e, t, n.child, r, o, i, !1), ur(t, e, o, a, i);
            else if (32 & u) {
              const l = Cu(n, r);
              let c;
              for (; (c = l()); ) ur(t, e, o, c, i);
              ur(t, e, o, a, i);
            } else 16 & u ? Wh(e, t, r, n, o, i) : ur(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function po(e, t, n, r, o, i) {
        Au(n, r, e.firstChild, t, o, i, !1);
      }
      function Wh(e, t, n, r, o, i) {
        const s = n[ue],
          u = s[Ee].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) ur(t, e, o, u[l], i);
        else {
          let l = u;
          const c = s[te];
          Ri(r) && (l.flags |= 128), Au(e, t, l, c, o, i, !0);
        }
      }
      function Zh(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Yh(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && ka(e, t, r),
          null !== o && Zh(e, t, o),
          null !== i &&
            (function Mb(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class Kh {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      const qi = new b("ENVIRONMENT_INITIALIZER"),
        up = new b("INJECTOR", -1),
        lp = new b("INJECTOR_DEF_TYPES");
      class ku {
        get(t, n = Hr) {
          if (n === Hr) {
            const r = new Error(`NullInjectorError: No provider for ${de(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function eI(...e) {
        return { ɵproviders: cp(0, e), ɵfromNgModule: !0 };
      }
      function cp(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        const i = (s) => {
          n.push(s);
        };
        return (
          or(t, (s) => {
            const a = s;
            Wi(a, i, [], r) && ((o ||= []), o.push(a));
          }),
          void 0 !== o && dp(o, i),
          n
        );
      }
      function dp(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { ngModule: r, providers: o } = e[n];
          Vu(o, (i) => {
            t(i, r);
          });
        }
      }
      function Wi(e, t, n, r) {
        if (!(e = A(e))) return !1;
        let o = null,
          i = li(e);
        const s = !i && V(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = li(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) Wi(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                or(i.imports, (c) => {
                  Wi(c, t, n, r) && ((l ||= []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && dp(l, t);
            }
            if (!a) {
              const l = Mn(o) || (() => new o());
              t({ provide: o, useFactory: l, deps: $ }, o),
                t({ provide: lp, useValue: o, multi: !0 }, o),
                t({ provide: qi, useValue: () => P(o), multi: !0 }, o);
            }
            const u = i.providers;
            if (null != u && !a) {
              const l = e;
              Vu(u, (c) => {
                t(c, l);
              });
            }
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function Vu(e, t) {
        for (let n of e)
          ba(n) && (n = n.ɵproviders), Array.isArray(n) ? Vu(n, t) : t(n);
      }
      const tI = q({ provide: String, useValue: q });
      function ju(e) {
        return null !== e && "object" == typeof e && tI in e;
      }
      function Nn(e) {
        return "function" == typeof e;
      }
      const Bu = new b("Set Injector scope."),
        Zi = {},
        rI = {};
      let Hu;
      function Yi() {
        return void 0 === Hu && (Hu = new ku()), Hu;
      }
      class It {}
      class fr extends It {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Uu(t, (s) => this.processProvider(s)),
            this.records.set(up, hr(void 0, this)),
            o.has("environment") && this.records.set(It, hr(void 0, this));
          const i = this.records.get(Bu);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(lp.multi, $, L.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of t) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(t) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(t),
            () => this.removeOnDestroy(t)
          );
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = nn(this),
            r = Ve(void 0);
          try {
            return t();
          } finally {
            nn(n), Ve(r);
          }
        }
        get(t, n = Hr, r = L.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(Qd)))
            return t[Qd](this);
          r = fi(r);
          const i = nn(this),
            s = Ve(void 0);
          try {
            if (!(r & L.SkipSelf)) {
              let u = this.records.get(t);
              if (void 0 === u) {
                const l =
                  (function uI(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof b)
                    );
                  })(t) && ui(t);
                (u = l && this.injectableDefInScope(l) ? hr($u(t), Zi) : null),
                  this.records.set(t, u);
              }
              if (null != u) return this.hydrate(t, u);
            }
            return (r & L.Self ? Yi() : this.parent).get(
              t,
              (n = r & L.Optional && n === Hr ? null : n)
            );
          } catch (a) {
            if ("NullInjectorError" === a.name) {
              if (((a[di] = a[di] || []).unshift(de(t)), i)) throw a;
              return (function nw(e, t, n, r) {
                const o = e[di];
                throw (
                  (t[Wd] && o.unshift(t[Wd]),
                  (e.message = (function rw(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = de(t);
                    if (Array.isArray(t)) o = t.map(de).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : de(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      XC,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[di] = null),
                  e)
                );
              })(a, t, "R3InjectorError", this.source);
            }
            throw a;
          } finally {
            Ve(s), nn(i);
          }
        }
        resolveInjectorInitializers() {
          const t = nn(this),
            n = Ve(void 0);
          try {
            const o = this.get(qi.multi, $, L.Self);
            for (const i of o) i();
          } finally {
            nn(t), Ve(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(de(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let n = Nn((t = A(t))) ? t : A(t && t.provide);
          const r = (function iI(e) {
            return ju(e) ? hr(void 0, e.useValue) : hr(pp(e), Zi);
          })(t);
          if (Nn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = hr(void 0, Zi, !0)),
              (o.factory = () => Fa(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === Zi && ((n.value = rI), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function aI(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = A(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
          const n = this._onDestroyHooks.indexOf(t);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function $u(e) {
        const t = ui(e),
          n = null !== t ? t.factory : Mn(e);
        if (null !== n) return n;
        if (e instanceof b) throw new C(204, !1);
        if (e instanceof Function)
          return (function oI(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function uo(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function WC(e) {
              return (e && (e[ci] || e[Ud])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function pp(e, t, n) {
        let r;
        if (Nn(e)) {
          const o = A(e);
          return Mn(o) || $u(o);
        }
        if (ju(e)) r = () => A(e.useValue);
        else if (
          (function hp(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...Fa(e.deps || []));
        else if (
          (function fp(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => P(A(e.useExisting));
        else {
          const o = A(e && (e.useClass || e.provide));
          if (
            !(function sI(e) {
              return !!e.deps;
            })(e)
          )
            return Mn(o) || $u(o);
          r = () => new o(...Fa(e.deps));
        }
        return r;
      }
      function hr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Uu(e, t) {
        for (const n of e)
          Array.isArray(n) ? Uu(n, t) : n && ba(n) ? Uu(n.ɵproviders, t) : t(n);
      }
      const Qi = new b("AppId", { providedIn: "root", factory: () => lI }),
        lI = "ng",
        gp = new b("Platform Initializer"),
        xn = new b("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        mp = new b("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function cr() {
              if (void 0 !== Nu) return Nu;
              if (typeof document < "u") return document;
              throw new C(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let yp = (e, t, n) => null;
      function Xu(e, t, n = !1) {
        return yp(e, t, n);
      }
      class DI {}
      class _p {}
      class CI {
        resolveComponentFactory(t) {
          throw (function _I(e) {
            const t = Error(`No component factory found for ${de(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let ns = (() => {
        class e {
          static #e = (this.NULL = new CI());
        }
        return e;
      })();
      function wI() {
        return mr(_e(), v());
      }
      function mr(e, t) {
        return new lt(He(e, t));
      }
      let lt = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
          static #e = (this.__NG_ELEMENT_ID__ = wI);
        }
        return e;
      })();
      class wp {}
      let On = (() => {
          class e {
            constructor() {
              this.destroyNode = null;
            }
            static #e = (this.__NG_ELEMENT_ID__ = () =>
              (function bI() {
                const e = v(),
                  n = Ze(_e().index, e);
                return (Be(n) ? n : e)[N];
              })());
          }
          return e;
        })(),
        II = (() => {
          class e {
            static #e = (this.ɵprov = B({
              token: e,
              providedIn: "root",
              factory: () => null,
            }));
          }
          return e;
        })();
      class rs {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const MI = new rs("16.2.11"),
        el = {};
      function Mp(e, t = null, n = null, r) {
        const o = Sp(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Sp(e, t = null, n = null, r, o = new Set()) {
        const i = [n || $, eI(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : de(e))),
          new fr(i, t || Yi(), r || null, o)
        );
      }
      let ct = (() => {
        class e {
          static #e = (this.THROW_IF_NOT_FOUND = Hr);
          static #t = (this.NULL = new ku());
          static create(n, r) {
            if (Array.isArray(n)) return Mp({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Mp({ name: o }, n.parent, n.providers, o);
            }
          }
          static #n = (this.ɵprov = B({
            token: e,
            providedIn: "any",
            factory: () => P(up),
          }));
          static #r = (this.__NG_ELEMENT_ID__ = -1);
        }
        return e;
      })();
      function nl(e) {
        return e.ngOriginalError;
      }
      class zt {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && nl(t);
          for (; n && nl(n); ) n = nl(n);
          return n || null;
        }
      }
      function ol(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const Me = class FI extends ri {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = ol(i)), o && (o = ol(o)), s && (s = ol(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof mt && t.add(a), a;
        }
      };
      function Tp(...e) {}
      class ie {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Me(!1)),
            (this.onMicrotaskEmpty = new Me(!1)),
            (this.onStable = new Me(!1)),
            (this.onError = new Me(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function PI() {
              const e = "function" == typeof Q.requestAnimationFrame;
              let t = Q[e ? "requestAnimationFrame" : "setTimeout"],
                n = Q[e ? "cancelAnimationFrame" : "clearTimeout"];
              if (typeof Zone < "u" && t && n) {
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
                const o = n[Zone.__symbol__("OriginalDelegate")];
                o && (n = o);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: n,
              };
            })().nativeRequestAnimationFrame),
            (function LI(e) {
              const t = () => {
                !(function kI(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(Q, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                sl(e),
                                (e.isCheckStableRunning = !0),
                                il(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    sl(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  if (
                    (function jI(e) {
                      return (
                        !(!Array.isArray(e) || 1 !== e.length) &&
                        !0 === e[0].data?.__ignore_ng_zone__
                      );
                    })(a)
                  )
                    return n.invokeTask(o, i, s, a);
                  try {
                    return Np(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      xp(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return Np(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), xp(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          sl(e),
                          il(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ie.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (ie.isInAngularZone()) throw new C(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, RI, Tp, Tp);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const RI = {};
      function il(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function sl(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Np(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function xp(e) {
        e._nesting--, il(e);
      }
      class VI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Me()),
            (this.onMicrotaskEmpty = new Me()),
            (this.onStable = new Me()),
            (this.onError = new Me());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const Op = new b("", { providedIn: "root", factory: Fp });
      function Fp() {
        const e = H(ie);
        let t = !0;
        return (function LC(...e) {
          const t = Rd(e),
            n = (function NC(e, t) {
              return "number" == typeof Da(e) ? e.pop() : t;
            })(e, 1 / 0),
            r = e;
          return r.length
            ? 1 === r.length
              ? yt(r[0])
              : (function MC(e = 1 / 0) {
                  return oi(pa, e);
                })(n)(ii(r, t))
            : Pd;
        })(
          new we((o) => {
            (t =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                o.next(t), o.complete();
              });
          }),
          new we((o) => {
            let i;
            e.runOutsideAngular(() => {
              i = e.onStable.subscribe(() => {
                ie.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    !t &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((t = !0), o.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              ie.assertInAngularZone(),
                t &&
                  ((t = !1),
                  e.runOutsideAngular(() => {
                    o.next(!1);
                  }));
            });
            return () => {
              i.unsubscribe(), s.unsubscribe();
            };
          }).pipe(jd())
        );
      }
      let al = (() => {
        class e {
          constructor() {
            (this.renderDepth = 0), (this.handler = null);
          }
          begin() {
            this.handler?.validateBegin(), this.renderDepth++;
          }
          end() {
            this.renderDepth--,
              0 === this.renderDepth && this.handler?.execute();
          }
          ngOnDestroy() {
            this.handler?.destroy(), (this.handler = null);
          }
          static #e = (this.ɵprov = B({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function _o(e) {
        for (; e; ) {
          e[F] |= 64;
          const t = fo(e);
          if (Ba(e) && !t) return e;
          e = t;
        }
        return null;
      }
      const Vp = new b("", { providedIn: "root", factory: () => !1 });
      let is = null;
      function $p(e, t) {
        return e[t] ?? zp();
      }
      function Up(e, t) {
        const n = zp();
        n.producerNode?.length && ((e[t] = is), (n.lView = e), (is = Gp()));
      }
      const YI = {
        ...gf,
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
          _o(e.lView);
        },
        lView: null,
      };
      function Gp() {
        return Object.create(YI);
      }
      function zp() {
        return (is ??= Gp()), is;
      }
      const O = {};
      function Ce(e) {
        qp(j(), v(), Oe() + e, !1);
      }
      function qp(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[F])) {
            const i = e.preOrderCheckHooks;
            null !== i && Ei(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && bi(t, i, 0, n);
          }
        Sn(n);
      }
      function _(e, t = L.Default) {
        const n = v();
        return null === n ? P(e, t) : sh(_e(), n, A(e), t);
      }
      function ss(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[oe] = o),
          (d[F] = 140 | r),
          (null !== l || (e && 2048 & e[F])) && (d[F] |= 2048),
          Rf(d),
          (d[te] = d[zn] = e),
          (d[ae] = n),
          (d[Gn] = s || (e && e[Gn])),
          (d[N] = a || (e && e[N])),
          (d[rn] = u || (e && e[rn]) || null),
          (d[Ee] = i),
          (d[Yr] = (function tb() {
            return eb++;
          })()),
          (d[Bt] = c),
          (d[df] = l),
          (d[ue] = 2 == t.type ? e[ue] : d),
          d
        );
      }
      function Dr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function ul(e, t, n, r, o) {
            const i = Hf(),
              s = Za(),
              u = (e.data[t] = (function oM(e, t, n, r, o, i) {
                let s = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  (function Qn() {
                    return null !== S.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: o,
                    attrs: i,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: t,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && ((i.next = u), (u.prev = i))),
              u
            );
          })(e, t, n, r, o)),
            (function eE() {
              return S.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function no() {
            const e = S.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Et(i, !0), i;
      }
      function Co(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Wp(e, t, n, r, o) {
        const i = $p(t, Qr),
          s = Oe(),
          a = 2 & r;
        try {
          Sn(-1), a && t.length > k && qp(e, t, k, !1), wt(a ? 2 : 0, o);
          const l = a ? i : null,
            c = $a(l);
          try {
            null !== l && (l.dirty = !1), n(r, o);
          } finally {
            Ua(l, c);
          }
        } finally {
          a && null === t[Qr] && Up(t, Qr), Sn(s), wt(a ? 3 : 1, o);
        }
      }
      function ll(e, t, n) {
        if (ja(t)) {
          const r = et(null);
          try {
            const i = t.directiveEnd;
            for (let s = t.directiveStart; s < i; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            et(r);
          }
        }
      }
      function cl(e, t, n) {
        Bf() &&
          ((function dM(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            In(n) &&
              (function vM(e, t, n) {
                const r = He(t, e),
                  o = Zp(n);
                let s = 16;
                n.signals ? (s = 4096) : n.onPush && (s = 64);
                const a = as(
                  e,
                  ss(
                    e,
                    o,
                    null,
                    s,
                    r,
                    t,
                    null,
                    e[Gn].rendererFactory.createRenderer(r, n),
                    null,
                    null,
                    null
                  )
                );
                e[t.index] = a;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || Mi(n, t),
              Ie(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                l = An(t, e, a, n);
              Ie(l, t),
                null !== s && DM(0, a - o, l, u, 0, s),
                ut(u) && (Ze(n.index, t)[ae] = An(t, e, a, n));
            }
          })(e, t, n, He(n, t)),
          64 == (64 & n.flags) && Kp(e, t, n));
      }
      function dl(e, t, n = He) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Zp(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = fl(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : t;
      }
      function fl(e, t, n, r, o, i, s, a, u, l, c) {
        const d = k + r,
          f = d + o,
          h = (function JI(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : O);
            return n;
          })(d, f),
          p = "function" == typeof l ? l() : l;
        return (h[w] = {
          type: e,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: c,
        });
      }
      let Yp = (e) => null;
      function Qp(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? Xp(n, t, o, i)
              : r.hasOwnProperty(o) && Xp(n, t, r[o], i);
          }
        return n;
      }
      function Xp(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function hl(e, t, n, r) {
        if (Bf()) {
          const o = null === r ? null : { "": -1 },
            i = (function hM(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if (rf(t, s.selectors, !1))
                    if ((r || (r = []), ut(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          pl(e, t, a.length);
                      } else r.unshift(s), pl(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Jp(e, t, n, s, o, a),
            o &&
              (function pM(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < t.length; o += 2) {
                    const i = n[t[o + 1]];
                    if (null == i) throw new C(-301, !1);
                    r.push(t[o], i);
                  }
                }
              })(n, r, o);
        }
        n.mergedAttrs = Gr(n.mergedAttrs, n.attrs);
      }
      function Jp(e, t, n, r, o, i) {
        for (let l = 0; l < r.length; l++) su(Mi(n, t), e, r[l].type);
        !(function mM(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          u = Co(e, t, r.length, null);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          (n.mergedAttrs = Gr(n.mergedAttrs, c.hostAttrs)),
            yM(e, n, t, u, c),
            gM(u, c, o),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            u++;
        }
        !(function iM(e, t, n) {
          const o = t.directiveEnd,
            i = e.data,
            s = t.attrs,
            a = [];
          let u = null,
            l = null;
          for (let c = t.directiveStart; c < o; c++) {
            const d = i[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (u = Qp(d.inputs, c, u, f ? f.inputs : null)),
              (l = Qp(d.outputs, c, l, p));
            const g = null === u || null === s || nf(t) ? null : _M(u, c, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (t.flags |= 8),
            u.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = u),
            (t.outputs = l);
        })(e, n, i);
      }
      function Kp(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function nE() {
            return S.lFrame.currentDirectiveIndex;
          })();
        try {
          Sn(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              l = t[a];
            Qa(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                fM(u, l);
          }
        } finally {
          Sn(-1), Qa(s);
        }
      }
      function fM(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function pl(e, t, n) {
        (t.componentOffset = n), (e.components ??= []).push(t.index);
      }
      function gM(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          ut(t) && (n[""] = e);
        }
      }
      function yM(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Mn(o.type)),
          s = new ro(i, ut(o), _);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function lM(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function cM(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, Co(e, n, o.hostVars, O), o);
      }
      function DM(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s)
          for (let a = 0; a < s.length; ) eg(r, n, s[a++], s[a++], s[a++]);
      }
      function eg(e, t, n, r, o) {
        const i = et(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(t, o)),
            null !== e.setInput ? e.setInput(t, o, n, r) : (t[r] = o);
        } finally {
          et(i);
        }
      }
      function _M(e, t, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function tg(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null, null];
      }
      function ng(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Ja(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function as(e, t) {
        return e[Wr] ? (e[cf][at] = t) : (e[Wr] = t), (e[cf] = t), t;
      }
      function ml(e, t, n) {
        Ja(0);
        const r = et(null);
        try {
          t(e, n);
        } finally {
          et(r);
        }
      }
      function sg(e, t) {
        const n = e[rn],
          r = n ? n.get(zt, null) : null;
        r && r.handleError(t);
      }
      function yl(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++];
          eg(e.data[s], t[s], r, a, o);
        }
      }
      function CM(e, t) {
        const n = Ze(t, e),
          r = n[w];
        !(function wM(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n);
        const o = n[oe];
        null !== o && null === n[Bt] && (n[Bt] = Xu(o, n[rn])), vl(r, n, n[ae]);
      }
      function vl(e, t, n) {
        Ka(t);
        try {
          const r = e.viewQuery;
          null !== r && ml(1, r, n);
          const o = e.template;
          null !== o && Wp(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && ng(e, t),
            e.staticViewQueries && ml(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function EM(e, t) {
              for (let n = 0; n < t.length; n++) CM(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[F] &= -5), eu();
        }
      }
      let ag = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = (function Ow(e, t, n) {
                const r = Object.create(Fw);
                n && (r.consumerAllowSignalWrites = !0),
                  (r.fn = e),
                  (r.schedule = t);
                const o = (s) => {
                  r.cleanupFn = s;
                };
                return (
                  (r.ref = {
                    notify: () => Df(r),
                    run: () => {
                      if (((r.dirty = !1), r.hasRun && !_f(r))) return;
                      r.hasRun = !0;
                      const s = $a(r);
                      try {
                        r.cleanupFn(), (r.cleanupFn = Af), r.fn(o);
                      } finally {
                        Ua(r, s);
                      }
                    },
                    cleanup: () => r.cleanupFn(),
                  }),
                  r.ref
                );
              })(
                n,
                (l) => {
                  this.all.has(l) && this.queue.set(l, i);
                },
                o
              );
            let a;
            this.all.add(s), s.notify();
            const u = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(u)), { destroy: u };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue)
                this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
          static #e = (this.ɵprov = B({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function us(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = wa(o, a))
              : 2 == i && (r = wa(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function wo(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          null !== i && r.push(X(i)), Ne(i) && ug(i, r);
          const s = n.type;
          if (8 & s) wo(e, t, n.child, r);
          else if (32 & s) {
            const a = Cu(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = zh(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = fo(t[ue]);
              wo(u[w], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      function ug(e, t) {
        for (let n = ve; n < e.length; n++) {
          const r = e[n],
            o = r[w].firstChild;
          null !== o && wo(r[w], r, o, t);
        }
        e[Ct] !== e[oe] && t.push(e[Ct]);
      }
      function ls(e, t, n, r = !0) {
        const o = t[Gn],
          i = o.rendererFactory,
          s = o.afterRenderEventManager;
        i.begin?.(), s?.begin();
        try {
          lg(e, t, e.template, n);
        } catch (u) {
          throw (r && sg(t, u), u);
        } finally {
          i.end?.(), o.effectManager?.flush(), s?.end();
        }
      }
      function lg(e, t, n, r) {
        const o = t[F];
        if (256 != (256 & o)) {
          t[Gn].effectManager?.flush(), Ka(t);
          try {
            Rf(t),
              (function Uf(e) {
                return (S.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && Wp(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && Ei(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && bi(t, l, 0, null), tu(t, 0);
            }
            if (
              ((function MM(e) {
                for (let t = Fh(e); null !== t; t = Ph(t)) {
                  if (!t[ff]) continue;
                  const n = t[Wn];
                  for (let r = 0; r < n.length; r++) {
                    Uw(n[r]);
                  }
                }
              })(t),
              cg(t, 2),
              null !== e.contentQueries && ng(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && Ei(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && bi(t, l, 1), tu(t, 1);
            }
            !(function XI(e, t) {
              const n = e.hostBindingOpCodes;
              if (null === n) return;
              const r = $p(t, Xr);
              try {
                for (let o = 0; o < n.length; o++) {
                  const i = n[o];
                  if (i < 0) Sn(~i);
                  else {
                    const s = i,
                      a = n[++o],
                      u = n[++o];
                    tE(a, s), (r.dirty = !1);
                    const l = $a(r);
                    try {
                      u(2, t[s]);
                    } finally {
                      Ua(r, l);
                    }
                  }
                }
              } finally {
                null === t[Xr] && Up(t, Xr), Sn(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a && fg(t, a, 0);
            const u = e.viewQuery;
            if ((null !== u && ml(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && Ei(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && bi(t, l, 2), tu(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[F] &= -73),
              kf(t);
          } finally {
            eu();
          }
        }
      }
      function cg(e, t) {
        for (let n = Fh(e); null !== n; n = Ph(n))
          for (let r = ve; r < n.length; r++) dg(n[r], t);
      }
      function SM(e, t, n) {
        dg(Ze(t, e), n);
      }
      function dg(e, t) {
        if (
          !(function Hw(e) {
            return 128 == (128 & e[F]);
          })(e)
        )
          return;
        const n = e[w],
          r = e[F];
        if ((80 & r && 0 === t) || 1024 & r || 2 === t)
          lg(n, e, n.template, e[ae]);
        else if (e[qr] > 0) {
          cg(e, 1);
          const o = n.components;
          null !== o && fg(e, o, 1);
        }
      }
      function fg(e, t, n) {
        for (let r = 0; r < t.length; r++) SM(e, t[r], n);
      }
      class Eo {
        get rootNodes() {
          const t = this._lView,
            n = t[w];
          return wo(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ae];
        }
        set context(t) {
          this._lView[ae] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[F]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[te];
            if (Ne(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (ji(t, r), Ti(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          Eu(this._lView[w], this._lView);
        }
        onDestroy(t) {
          !(function Vf(e, t) {
            if (256 == (256 & e[F])) throw new C(911, !1);
            null === e[on] && (e[on] = []), e[on].push(t);
          })(this._lView, t);
        }
        markForCheck() {
          _o(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[F] &= -129;
        }
        reattach() {
          this._lView[F] |= 128;
        }
        detectChanges() {
          ls(this._lView[w], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function gb(e, t) {
              po(e, t, t[N], 2, null, null);
            })(this._lView[w], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class AM extends Eo {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          ls(t[w], t, t[ae], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class hg extends ns {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = V(t);
          return new bo(n, this.ngModule);
        }
      }
      function pg(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class NM {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = fi(r);
          const o = this.injector.get(t, el, r);
          return o !== el || n === el ? o : this.parentInjector.get(t, n, r);
        }
      }
      class bo extends _p {
        get inputs() {
          const t = this.componentDef,
            n = t.inputTransforms,
            r = pg(t.inputs);
          if (null !== n)
            for (const o of r)
              n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
          return r;
        }
        get outputs() {
          return pg(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function hw(e) {
              return e.map(fw).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof It ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new NM(t, i) : t,
            a = s.get(wp, null);
          if (null === a) throw new C(407, !1);
          const d = {
              rendererFactory: a,
              sanitizer: s.get(II, null),
              effectManager: s.get(ag, null),
              afterRenderEventManager: s.get(al, null),
            },
            f = a.createRenderer(null, this.componentDef),
            h = this.componentDef.selectors[0][0] || "div",
            p = r
              ? (function KI(e, t, n, r) {
                  const i = r.get(Vp, !1) || n === it.ShadowDom,
                    s = e.selectRootElement(t, i);
                  return (
                    (function eM(e) {
                      Yp(e);
                    })(s),
                    s
                  );
                })(f, r, this.componentDef.encapsulation, s)
              : Vi(
                  f,
                  h,
                  (function TM(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(h)
                ),
            D = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528;
          let m = null;
          null !== p && (m = Xu(p, s, !0));
          const E = fl(0, null, null, 1, 0, null, null, null, null, null, null),
            I = ss(null, E, null, D, null, null, d, f, s, null, m);
          let R, me;
          Ka(I);
          try {
            const Pt = this.componentDef;
            let Hn,
              dd = null;
            Pt.findHostDirectiveDefs
              ? ((Hn = []),
                (dd = new Map()),
                Pt.findHostDirectiveDefs(Pt, Hn, dd),
                Hn.push(Pt))
              : (Hn = [Pt]);
            const fR = (function OM(e, t) {
                const n = e[w],
                  r = k;
                return (e[r] = t), Dr(n, r, 2, "#host", null);
              })(I, p),
              hR = (function FM(e, t, n, r, o, i, s) {
                const a = o[w];
                !(function PM(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = Gr(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (us(t, t.mergedAttrs, !0), null !== n && Yh(r, n, t));
                })(r, e, t, s);
                let u = null;
                null !== t && (u = Xu(t, o[rn]));
                const l = i.rendererFactory.createRenderer(t, n);
                let c = 16;
                n.signals ? (c = 4096) : n.onPush && (c = 64);
                const d = ss(
                  o,
                  Zp(n),
                  null,
                  c,
                  o[e.index],
                  e,
                  i,
                  l,
                  null,
                  null,
                  u
                );
                return (
                  a.firstCreatePass && pl(a, e, r.length - 1),
                  as(o, d),
                  (o[e.index] = d)
                );
              })(fR, p, Pt, Hn, I, d, f);
            (me = Pf(E, k)),
              p &&
                (function kM(e, t, n, r) {
                  if (r) ka(e, n, ["ng-version", MI.full]);
                  else {
                    const { attrs: o, classes: i } = (function pw(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && t.push(i, e[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!st(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    o && ka(e, n, o),
                      i && i.length > 0 && Zh(e, n, i.join(" "));
                  }
                })(f, Pt, p, r),
              void 0 !== n &&
                (function LM(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(me, this.ngContentSelectors, n),
              (R = (function RM(e, t, n, r, o, i) {
                const s = _e(),
                  a = o[w],
                  u = He(s, o);
                Jp(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  Ie(An(o, a, s.directiveStart + c, s), o);
                Kp(a, o, s), u && Ie(u, o);
                const l = An(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ae] = o[ae] = l), null !== i))
                  for (const c of i) c(l, t);
                return ll(a, s, e), l;
              })(hR, Pt, Hn, dd, I, [VM])),
              vl(E, I, null);
          } finally {
            eu();
          }
          return new xM(this.componentType, R, mr(me, I), I, me);
        }
      }
      class xM extends DI {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new AM(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) &&
                Object.is(this.previousInputValues.get(t), n))
            )
              return;
            const i = this._rootLView;
            yl(i[w], i, o, t, n),
              this.previousInputValues.set(t, n),
              _o(Ze(this._tNode.index, i));
          }
        }
        get injector() {
          return new Fe(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function VM() {
        const e = _e();
        wi(v()[w], e);
      }
      function W(e) {
        let t = (function gg(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let o;
          if (ut(e)) o = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            o = t.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = e;
              (s.inputs = cs(e.inputs)),
                (s.inputTransforms = cs(e.inputTransforms)),
                (s.declaredInputs = cs(e.declaredInputs)),
                (s.outputs = cs(e.outputs));
              const a = o.hostBindings;
              a && $M(e, a);
              const u = o.viewQuery,
                l = o.contentQueries;
              if (
                (u && BM(e, u),
                l && HM(e, l),
                si(e.inputs, o.inputs),
                si(e.declaredInputs, o.declaredInputs),
                si(e.outputs, o.outputs),
                null !== o.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  si(s.inputTransforms, o.inputTransforms)),
                ut(o) && o.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === W && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function jM(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Gr(o.hostAttrs, (n = Gr(n, o.hostAttrs))));
          }
        })(r);
      }
      function cs(e) {
        return e === Dt ? {} : e === $ ? [] : e;
      }
      function BM(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function HM(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function $M(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function ds(e) {
        return (
          !!(function Dl(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Se(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Yt(e, t, n, r, o, i, s, a) {
        const u = v(),
          l = j(),
          c = e + k,
          d = l.firstCreatePass
            ? (function pS(e, t, n, r, o, i, s, a, u) {
                const l = t.consts,
                  c = Dr(t, e, 4, s || null, an(l, a));
                hl(t, n, c, an(l, u)), wi(t, c);
                const d = (c.tView = fl(
                  2,
                  c,
                  r,
                  o,
                  i,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  l,
                  null
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, l, u, t, n, r, o, i, s)
            : l.data[c];
        Et(d, !1);
        const f = xg(l, u, d, e);
        Ci() && Hi(l, u, f, d),
          Ie(f, u),
          as(u, (u[c] = tg(f, u, f, d))),
          yi(d) && cl(l, u, d),
          null != s && dl(u, d, a);
      }
      let xg = function Og(e, t, n, r) {
        return un(!0), t[N].createComment("");
      };
      function Ue(e, t, n) {
        const r = v();
        return (
          Se(r, Xn(), t) &&
            (function Qe(e, t, n, r, o, i, s, a) {
              const u = He(t, n);
              let c,
                l = t.inputs;
              !a && null != l && (c = l[r])
                ? (yl(e, n, c, r, o),
                  In(t) &&
                    (function aM(e, t) {
                      const n = Ze(t, e);
                      16 & n[F] || (n[F] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function sM(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  i.setProperty(u, r, o));
            })(
              j(),
              (function re() {
                const e = S.lFrame;
                return Pf(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              t,
              r[N],
              n,
              !1
            ),
          Ue
        );
      }
      function Il(e, t, n, r, o) {
        const s = o ? "class" : "style";
        yl(e, n, t.inputs[s], s, r);
      }
      function pe(e, t, n, r) {
        const o = v(),
          i = j(),
          s = k + e,
          a = o[N],
          u = i.firstCreatePass
            ? (function DS(e, t, n, r, o, i) {
                const s = t.consts,
                  u = Dr(t, e, 2, r, an(s, o));
                return (
                  hl(t, n, u, an(s, i)),
                  null !== u.attrs && us(u, u.attrs, !1),
                  null !== u.mergedAttrs && us(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, i, o, t, n, r)
            : i.data[s],
          l = Fg(i, o, u, a, t, e);
        o[s] = l;
        const c = yi(u);
        return (
          Et(u, !0),
          Yh(a, l, u),
          32 != (32 & u.flags) && Ci() && Hi(i, o, l, u),
          0 ===
            (function zw() {
              return S.lFrame.elementDepthCount;
            })() && Ie(l, o),
          (function qw() {
            S.lFrame.elementDepthCount++;
          })(),
          c && (cl(i, o, u), ll(i, u, o)),
          null !== r && dl(o, u),
          pe
        );
      }
      function ge() {
        let e = _e();
        Za()
          ? (function Ya() {
              S.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Et(e, !1));
        const t = e;
        (function Zw(e) {
          return S.skipHydrationRootTNode === e;
        })(t) &&
          (function Jw() {
            S.skipHydrationRootTNode = null;
          })(),
          (function Ww() {
            S.lFrame.elementDepthCount--;
          })();
        const n = j();
        return (
          n.firstCreatePass && (wi(n, e), ja(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function hE(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            Il(n, t, v(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function pE(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Il(n, t, v(), t.stylesWithoutHost, !1),
          ge
        );
      }
      function ms(e, t, n, r) {
        return pe(e, t, n, r), ge(), ms;
      }
      let Fg = (e, t, n, r, o, i) => (
        un(!0),
        Vi(
          r,
          o,
          (function Xf() {
            return S.lFrame.currentNamespace;
          })()
        )
      );
      function Al() {
        return v();
      }
      function ys(e) {
        return !!e && "function" == typeof e.then;
      }
      function kg(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function Xe(e, t, n, r) {
        const o = v(),
          i = j(),
          s = _e();
        return (
          (function Vg(e, t, n, r, o, i, s) {
            const a = yi(r),
              l =
                e.firstCreatePass &&
                (function og(e) {
                  return e.cleanup || (e.cleanup = []);
                })(e),
              c = t[ae],
              d = (function rg(e) {
                return e[Un] || (e[Un] = []);
              })(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = He(r, t),
                y = s ? s(g) : g,
                D = d.length,
                m = s ? (I) => s(X(I[r.index])) : r.index;
              let E = null;
              if (
                (!s &&
                  a &&
                  (E = (function IS(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[Un],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== E)
              )
                ((E.__ngLastListenerFn__ || E).__ngNextListenerFn__ = i),
                  (E.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = Bg(r, t, c, i, !1);
                const I = n.listen(y, o, i);
                d.push(i, I), l && l.push(o, m, D, D + 1);
              }
            } else i = Bg(r, t, c, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let y = 0; y < g; y += 2) {
                  const R = t[p[y]][p[y + 1]].subscribe(i),
                    me = d.length;
                  d.push(i, R), l && l.push(o, r.index, me, -(me + 1));
                }
            }
          })(i, o, o[N], s, e, t, r),
          Xe
        );
      }
      function jg(e, t, n, r) {
        try {
          return wt(6, t, n), !1 !== n(r);
        } catch (o) {
          return sg(e, o), !1;
        } finally {
          wt(7, t, n);
        }
      }
      function Bg(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          _o(e.componentOffset > -1 ? Ze(e.index, t) : t);
          let u = jg(t, n, r, s),
            l = i.__ngNextListenerFn__;
          for (; l; ) (u = jg(t, n, l, s) && u), (l = l.__ngNextListenerFn__);
          return o && !1 === u && s.preventDefault(), u;
        };
      }
      function At(e = 1) {
        return (function oE(e) {
          return (S.lFrame.contextLView = (function iE(e, t) {
            for (; e > 0; ) (t = t[zn]), e--;
            return t;
          })(e, S.lFrame.contextLView))[ae];
        })(e);
      }
      function vs(e, t) {
        return (e << 17) | (t << 2);
      }
      function dn(e) {
        return (e >> 17) & 32767;
      }
      function Nl(e) {
        return 2 | e;
      }
      function Pn(e) {
        return (131068 & e) >> 2;
      }
      function xl(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Ol(e) {
        return 1 | e;
      }
      function Qg(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? dn(i) : Pn(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const c = e[a + 1];
          PS(e[a], t) && ((u = !0), (e[a + 1] = r ? Ol(c) : Nl(c))),
            (a = r ? dn(c) : Pn(c));
        }
        u && (e[n + 1] = r ? Nl(i) : Ol(i));
      }
      function PS(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && ir(e, t) >= 0)
        );
      }
      function Ds(e, t) {
        return (
          (function dt(e, t, n, r) {
            const o = v(),
              i = j(),
              s = (function Ut(e) {
                const t = S.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            i.firstUpdatePass &&
              (function im(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[Oe()],
                    s = (function om(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function lm(e, t) {
                    return 0 != (e.flags & (t ? 8 : 16));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function US(e, t, n, r) {
                      const o = (function Xa(e) {
                        const t = S.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = To((n = Fl(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = Fl(o, e, t, n, r)), null === i)) {
                            let u = (function GS(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== Pn(r)) return e[dn(r)];
                            })(e, t, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = Fl(null, e, t, u[1], r)),
                              (u = To(u, t.attrs, r)),
                              (function zS(e, t, n, r) {
                                e[dn(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, u));
                          } else
                            i = (function qS(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = To(r, e[i].hostAttrs, n);
                              return To(r, t.attrs, n);
                            })(e, t, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (t.residualClasses = i)
                            : (t.residualStyles = i)),
                        n
                      );
                    })(o, i, t, r)),
                    (function OS(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = dn(s),
                        u = Pn(s);
                      e[r] = n;
                      let c,
                        l = !1;
                      if (
                        (Array.isArray(n)
                          ? ((c = n[1]),
                            (null === c || ir(n, c) > 0) && (l = !0))
                          : (c = n),
                        o)
                      )
                        if (0 !== u) {
                          const f = dn(e[a + 1]);
                          (e[r + 1] = vs(f, a)),
                            0 !== f && (e[f + 1] = xl(e[f + 1], r)),
                            (e[a + 1] = (function NS(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = vs(a, 0)),
                            0 !== a && (e[a + 1] = xl(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = vs(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = xl(e[u + 1], r)),
                          (u = r);
                      l && (e[r + 1] = Nl(e[r + 1])),
                        Qg(e, c, r, !0),
                        Qg(e, c, r, !1),
                        (function FS(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            ir(i, t) >= 0 &&
                            (n[r + 1] = Ol(n[r + 1]));
                        })(t, c, e, r, i),
                        (s = vs(a, u)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== O &&
                Se(o, s, t) &&
                (function am(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const u = e.data,
                    l = u[a + 1],
                    c = (function xS(e) {
                      return 1 == (1 & e);
                    })(l)
                      ? um(u, t, n, o, Pn(l), s)
                      : void 0;
                  _s(c) ||
                    (_s(i) ||
                      ((function TS(e) {
                        return 2 == (2 & e);
                      })(l) &&
                        (i = um(u, null, n, o, a, s))),
                    (function Ib(e, t, n, r, o) {
                      if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : ln.DashCase;
                        null == o
                          ? e.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= ln.Important)),
                            e.setStyle(n, r, o, i));
                      }
                    })(r, s, _i(Oe(), n), o, i));
                })(
                  i,
                  i.data[Oe()],
                  o,
                  o[N],
                  e,
                  (o[s + 1] = (function QS(e, t) {
                    return (
                      null == e ||
                        "" === e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e &&
                            (e = de(
                              (function cn(e) {
                                return e instanceof Kh
                                  ? e.changingThisBreaksApplicationSecurity
                                  : e;
                              })(e)
                            ))),
                      e
                    );
                  })(t, n)),
                  r,
                  s
                );
          })(e, t, null, !0),
          Ds
        );
      }
      function Fl(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = To(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function To(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                Ye(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function um(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            l = Array.isArray(u),
            c = l ? u[1] : u,
            d = null === c;
          let f = n[o + 1];
          f === O && (f = d ? $ : void 0);
          let h = d ? cu(f, r) : c === r ? f : void 0;
          if ((l && !_s(h) && (h = cu(u, r)), _s(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? dn(p) : Pn(p);
        }
        if (null !== t) {
          let u = i ? t.residualClasses : t.residualStyles;
          null != u && (a = cu(u, r));
        }
        return a;
      }
      function _s(e) {
        return void 0 !== e;
      }
      function ht(e, t = "") {
        const n = v(),
          r = j(),
          o = e + k,
          i = r.firstCreatePass ? Dr(r, o, 1, t, null) : r.data[o],
          s = cm(r, n, i, t, e);
        (n[o] = s), Ci() && Hi(r, n, s, i), Et(i, !1);
      }
      let cm = (e, t, n, r, o) => (
        un(!0),
        (function Li(e, t) {
          return e.createText(t);
        })(t[N], r)
      );
      function Pl(e) {
        return fn("", e, ""), Pl;
      }
      function fn(e, t, n) {
        const r = v(),
          o = (function Cr(e, t, n, r) {
            return Se(e, Xn(), n) ? t + T(n) + r : O;
          })(r, e, t, n);
        return (
          o !== O &&
            (function Wt(e, t, n) {
              const r = _i(t, e);
              !(function kh(e, t, n) {
                e.setValue(t, n);
              })(e[N], r, n);
            })(r, Oe(), o),
          fn
        );
      }
      const xr = "en-US";
      let Om = xr;
      function Ll(e, t, n, r, o) {
        if (((e = A(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) Ll(e[i], t, n, r, o);
        else {
          const i = j(),
            s = v(),
            a = _e();
          let u = Nn(e) ? e : A(e.provide);
          const l = pp(e),
            c = 1048575 & a.providerIndexes,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
          if (Nn(e) || !e.multi) {
            const h = new ro(l, o, _),
              p = jl(u, t, o ? c : c + f, d);
            -1 === p
              ? (su(Mi(a, s), i, u),
                Vl(i, e, t.length),
                t.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = jl(u, t, c + f, d),
              p = jl(u, t, c, c + f),
              y = p >= 0 && n[p];
            if ((o && !y) || (!o && !(h >= 0 && n[h]))) {
              su(Mi(a, s), i, u);
              const D = (function vA(e, t, n, r, o) {
                const i = new ro(e, n, _);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  ry(i, o, r && !n),
                  i
                );
              })(o ? yA : mA, n.length, o, r, l);
              !o && y && (n[p].providerFactory = D),
                Vl(i, e, t.length, 0),
                t.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                n.push(D),
                s.push(D);
            } else Vl(i, e, h > -1 ? h : p, ry(n[o ? p : h], l, !o && r));
            !o && r && y && n[p].componentProviders++;
          }
        }
      }
      function Vl(e, t, n, r) {
        const o = Nn(t),
          i = (function nI(e) {
            return !!e.useClass;
          })(t);
        if (o || i) {
          const u = (i ? A(t.useClass) : t).prototype.ngOnDestroy;
          if (u) {
            const l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
              const c = l.indexOf(n);
              -1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u);
            } else l.push(n, u);
          }
        }
      }
      function ry(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function jl(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function mA(e, t, n, r) {
        return Bl(this.multi, []);
      }
      function yA(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = An(n, n[w], this.providerFactory.index, r);
          (i = a.slice(0, s)), Bl(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), Bl(o, i);
        return i;
      }
      function Bl(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function ne(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function gA(e, t, n) {
              const r = j();
              if (r.firstCreatePass) {
                const o = ut(e);
                Ll(n, r.data, r.blueprint, o, !0),
                  Ll(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class kn {}
      class DA {}
      class Hl extends kn {
        constructor(t, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new hg(this));
          const o = (function We(e, t) {
            const n = e[Yd] || null;
            if (!n && !0 === t)
              throw new Error(
                `Type ${de(e)} does not have '\u0275mod' property.`
              );
            return n;
          })(t);
          (this._bootstrapComponents = (function qt(e) {
            return e instanceof Function ? e() : e;
          })(o.bootstrap)),
            (this._r3Injector = Sp(
              t,
              n,
              [
                { provide: kn, useValue: this },
                { provide: ns, useValue: this.componentFactoryResolver },
                ...r,
              ],
              de(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class $l extends DA {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Hl(this.moduleType, t, []);
        }
      }
      function JA(e, t, n, r = !0) {
        const o = t[w];
        if (
          ((function yb(e, t, n, r) {
            const o = ve + r,
              i = n.length;
            r > 0 && (n[o - 1][at] = t),
              r < i - ve
                ? ((t[at] = n[o]), fh(n, ve + r, t))
                : (n.push(t), (t[at] = null)),
              (t[te] = n);
            const s = t[Zr];
            null !== s &&
              n !== s &&
              (function vb(e, t) {
                const n = e[Wn];
                t[ue] !== t[te][te][ue] && (e[ff] = !0),
                  null === n ? (e[Wn] = [t]) : n.push(t);
              })(s, t);
            const a = t[_t];
            null !== a && a.insertView(e), (t[F] |= 128);
          })(o, t, e, n),
          r)
        ) {
          const i = Su(n, e),
            s = t[N],
            a = Bi(s, e[Ct]);
          null !== a &&
            (function pb(e, t, n, r, o, i) {
              (r[oe] = o), (r[Ee] = t), po(e, r, n, 1, o, i);
            })(o, e[Ee], s, t, a, i);
        }
      }
      Symbol;
      let Qt = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = tT);
        }
        return e;
      })();
      const KA = Qt,
        eT = class extends KA {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(t, n) {
            return this.createEmbeddedViewImpl(t, n);
          }
          createEmbeddedViewImpl(t, n, r) {
            const o = (function XA(e, t, n, r) {
              const o = t.tView,
                a = ss(
                  e,
                  o,
                  n,
                  4096 & e[F] ? 4096 : 16,
                  null,
                  t,
                  null,
                  null,
                  null,
                  r?.injector ?? null,
                  r?.hydrationInfo ?? null
                );
              a[Zr] = e[t.index];
              const l = e[_t];
              return (
                null !== l && (a[_t] = l.createEmbeddedView(o)), vl(o, a, n), a
              );
            })(this._declarationLView, this._declarationTContainer, t, {
              injector: n,
              hydrationInfo: r,
            });
            return new Eo(o);
          }
        };
      function tT() {
        return (function Is(e, t) {
          return 4 & e.type ? new eT(t, e, mr(e, t)) : null;
        })(_e(), v());
      }
      let xt = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = aT);
        }
        return e;
      })();
      function aT() {
        return (function wy(e, t) {
          let n;
          const r = t[e.index];
          return (
            Ne(r)
              ? (n = r)
              : ((n = tg(r, t, null, e)), (t[e.index] = n), as(t, n)),
            Ey(n, t, e, r),
            new _y(n, e, t)
          );
        })(_e(), v());
      }
      const uT = xt,
        _y = class extends uT {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return mr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Fe(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Si(this._hostTNode, this._hostLView);
            if (ru(t)) {
              const n = io(t, this._hostLView),
                r = oo(t);
              return new Fe(n[w].data[r + 8], n);
            }
            return new Fe(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = Cy(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - ve;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const a = t.createEmbeddedViewImpl(n || {}, i, null);
            return this.insertImpl(a, o, false), a;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function ao(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index),
                (r = g.injector),
                (o = g.projectableNodes),
                (i = g.environmentInjector || g.ngModuleRef);
            }
            const u = s ? t : new bo(V(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const y = (s ? l : this.parentInjector).get(It, null);
              y && (i = y);
            }
            V(u.componentType ?? {});
            const h = u.create(l, o, null, i);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(t, n) {
            return this.insertImpl(t, n, !1);
          }
          insertImpl(t, n, r) {
            const o = t._lView;
            if (
              (function $w(e) {
                return Ne(e[te]);
              })(o)
            ) {
              const u = this.indexOf(t);
              if (-1 !== u) this.detach(u);
              else {
                const l = o[te],
                  c = new _y(l, l[Ee], l[te]);
                c.detach(c.indexOf(t));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            return (
              JA(a, o, s, !r), t.attachToViewContainerRef(), fh(zl(a), s, t), t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = Cy(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = ji(this._lContainer, n);
            r && (Ti(zl(this._lContainer), n), Eu(r[w], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = ji(this._lContainer, n);
            return r && null != Ti(zl(this._lContainer), n) ? new Eo(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function Cy(e) {
        return e[8];
      }
      function zl(e) {
        return e[8] || (e[8] = []);
      }
      let Ey = function by(e, t, n, r) {
        if (e[Ct]) return;
        let o;
        (o =
          8 & n.type
            ? X(r)
            : (function lT(e, t) {
                const n = e[N],
                  r = n.createComment(""),
                  o = He(t, e);
                return (
                  Tn(
                    n,
                    Bi(n, o),
                    r,
                    (function wb(e, t) {
                      return e.nextSibling(t);
                    })(n, o),
                    !1
                  ),
                  r
                );
              })(t, n)),
          (e[Ct] = o);
      };
      const UT = new b("Application Initializer");
      let tc = (() => {
        class e {
          constructor() {
            (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((n, r) => {
                (this.resolve = n), (this.reject = r);
              })),
              (this.appInits = H(UT, { optional: !0 }) ?? []);
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [];
            for (const o of this.appInits) {
              const i = o();
              if (ys(i)) n.push(i);
              else if (kg(i)) {
                const s = new Promise((a, u) => {
                  i.subscribe({ complete: a, error: u });
                });
                n.push(s);
              }
            }
            const r = () => {
              (this.done = !0), this.resolve();
            };
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = B({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const Xt = new b("LocaleId", {
        providedIn: "root",
        factory: () =>
          H(Xt, L.Optional | L.SkipSelf) ||
          (function zT() {
            return (typeof $localize < "u" && $localize.locale) || xr;
          })(),
      });
      let nc = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new VC(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = B({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const Qy = new b(""),
        Ts = new b("");
      let ac,
        ic = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                ac ||
                  ((function mN(e) {
                    ac = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ie.assertNotInAngularZone(),
                        queueMicrotask(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                queueMicrotask(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(P(ie), P(sc), P(Ts));
            });
            static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        sc = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return ac?.findTestabilityInTree(this, n, r) ?? null;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = B({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })(),
        hn = null;
      const Xy = new b("AllowMultipleToken"),
        uc = new b("PlatformDestroyListeners"),
        Jy = new b("appBootstrapListener");
      function tv(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new b(r);
        return (i = []) => {
          let s = lc();
          if (!s || s.injector.get(Xy, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function DN(e) {
                  if (hn && !hn.get(Xy, !1)) throw new C(400, !1);
                  (function Ky() {
                    !(function Sw(e) {
                      bf = e;
                    })(() => {
                      throw new C(600, !1);
                    });
                  })(),
                    (hn = e);
                  const t = e.get(rv);
                  (function ev(e) {
                    e.get(gp, null)?.forEach((n) => n());
                  })(e);
                })(
                  (function nv(e = [], t) {
                    return ct.create({
                      name: t,
                      providers: [
                        { provide: Bu, useValue: "platform" },
                        { provide: uc, useValue: new Set([() => (hn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function CN(e) {
            const t = lc();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function lc() {
        return hn?.get(rv) ?? null;
      }
      let rv = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function wN(e = "zone.js", t) {
              return "noop" === e ? new VI() : "zone.js" === e ? new ie(t) : e;
            })(
              r?.ngZone,
              (function ov(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return o.run(() => {
              const i = (function CA(e, t, n) {
                  return new Hl(e, t, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function lv(e) {
                    return [
                      { provide: ie, useFactory: e },
                      {
                        provide: qi,
                        multi: !0,
                        useFactory: () => {
                          const t = H(bN, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: uv, useFactory: EN },
                      { provide: Op, useFactory: Fp },
                    ];
                  })(() => o)
                ),
                s = i.injector.get(zt, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (u) => {
                      s.handleError(u);
                    },
                  });
                  i.onDestroy(() => {
                    Ns(this._modules, i), a.unsubscribe();
                  });
                }),
                (function iv(e, t, n) {
                  try {
                    const r = n();
                    return ys(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, o, () => {
                  const a = i.injector.get(tc);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function Fm(e) {
                          Ke(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Om = e.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(Xt, xr) || xr),
                        this._moduleDoBootstrap(i),
                        i
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = sv({}, r);
            return (function yN(e, t, n) {
              const r = new $l(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(jo);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(uc, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(ct));
          });
          static #t = (this.ɵprov = B({
            token: e,
            factory: e.ɵfac,
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function sv(e, t) {
        return Array.isArray(t) ? t.reduce(sv, e) : { ...e, ...t };
      }
      let jo = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = H(uv)),
              (this.zoneIsStable = H(Op)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = H(nc).hasPendingTasks.pipe(
                Bd((n) => (n ? _a(!1) : this.zoneIsStable)),
                (function jC(e, t = pa) {
                  return (
                    (e = e ?? BC),
                    Rt((n, r) => {
                      let o,
                        i = !0;
                      n.subscribe(
                        kt(r, (s) => {
                          const a = t(s);
                          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                        })
                      );
                    })
                  );
                })(),
                jd()
              )),
              (this._injector = H(It));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof _p;
            if (!this._injector.get(tc).done)
              throw (
                (!o &&
                  (function zr(e) {
                    const t = V(e) || ye(e) || Te(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, !1))
              );
            let s;
            (s = o ? n : this._injector.get(ns).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function vN(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(kn),
              l = s.create(ct.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(Qy, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  Ns(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Ns(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(Jy, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Ns(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = B({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function Ns(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const uv = new b("", {
        providedIn: "root",
        factory: () => H(zt).handleError.bind(void 0),
      });
      function EN() {
        const e = H(ie),
          t = H(zt);
        return (n) => e.runOutsideAngular(() => t.handleError(n));
      }
      let bN = (() => {
        class e {
          constructor() {
            (this.zone = H(ie)), (this.applicationRef = H(jo));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = B({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      let dv = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = MN);
        }
        return e;
      })();
      function MN(e) {
        return (function SN(e, t, n) {
          if (In(e) && !n) {
            const r = Ze(e.index, t);
            return new Eo(r, r);
          }
          return 47 & e.type ? new Eo(t[ue], t) : null;
        })(_e(), v(), 16 == (16 & e));
      }
      class pv {
        constructor() {}
        supports(t) {
          return ds(t);
        }
        create(t) {
          return new FN(t);
        }
      }
      const ON = (e, t) => t;
      class FN {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || ON);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < mv(r, o, i)) ? n : r,
              a = mv(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const l = a - o,
                c = u - o;
              if (l != c) {
                for (let f = 0; f < l; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < l && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - l;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !ds(t))) throw new C(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function QM(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new PN(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new gv()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new gv()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class PN {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class RN {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class gv {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new RN()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function mv(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      function vv() {
        return new Fs([new pv()]);
      }
      let Fs = (() => {
        class e {
          static #e = (this.ɵprov = B({
            token: e,
            providedIn: "root",
            factory: vv,
          }));
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || vv()),
              deps: [[e, new hu(), new fu()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new C(901, !1);
          }
        }
        return e;
      })();
      const BN = tv(null, "core", []);
      let HN = (() => {
        class e {
          constructor(n) {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(jo));
          });
          static #t = (this.ɵmod = jt({ type: e }));
          static #n = (this.ɵinj = vt({}));
        }
        return e;
      })();
      let mc = null;
      function Ho() {
        return mc;
      }
      class ex {}
      const pn = new b("DocumentToken");
      function kv(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === t) return decodeURIComponent(i);
        }
        return null;
      }
      class $x {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let jv = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new $x(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), Bv(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              Bv(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(xt), _(Qt), _(Fs));
          });
          static #t = (this.ɵdir = x({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      function Bv(e, t) {
        e.context.$implicit = t.item;
      }
      let Hv = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new Ux()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            $v("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            $v("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(xt), _(Qt));
          });
          static #t = (this.ɵdir = x({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      class Ux {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function $v(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${de(t)}'.`
          );
      }
      let pO = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵmod = jt({ type: e }));
          static #n = (this.ɵinj = vt({}));
        }
        return e;
      })();
      function qv(e) {
        return "server" === e;
      }
      class Wv {}
      class HO extends ex {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class Fc extends HO {
        static makeCurrent() {
          !(function KN(e) {
            mc || (mc = e);
          })(new Fc());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r),
            () => {
              t.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function $O() {
            return (
              (zo = zo || document.querySelector("base")),
              zo ? zo.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function UO(e) {
                (Ws = Ws || document.createElement("a")),
                  Ws.setAttribute("href", e);
                const t = Ws.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          zo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return kv(document.cookie, t);
        }
      }
      let Ws,
        zo = null,
        zO = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
          }
          return e;
        })();
      const Pc = new b("EventManagerPlugins");
      let Jv = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(n))), !r))
              throw new C(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(Pc), P(ie));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class Kv {
        constructor(t) {
          this._doc = t;
        }
      }
      const Rc = "ng-app-id";
      let eD = (() => {
        class e {
          constructor(n, r, o, i = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = qv(i)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${Rc}="${this.appId}"]`
            );
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach((o) => {
                  null != o.textContent && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const o = this.styleRef;
            if (o.has(n)) {
              const i = o.get(n);
              return (i.usage += r), i.usage;
            }
            return o.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === n)
              return o.delete(r), i.removeAttribute(Rc), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(Rc, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const o = this.getStyleElement(n, r);
            n.appendChild(o);
            const i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(pn), P(Qi), P(mp, 8), P(xn));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const kc = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Lc = /%COMP%/g,
        YO = new b("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function nD(e, t) {
        return t.map((n) => n.replace(Lc, e));
      }
      let rD = (() => {
        class e {
          constructor(n, r, o, i, s, a, u, l = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestroy = i),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = u),
              (this.nonce = l),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = qv(a)),
              (this.defaultRenderer = new Vc(n, s, u, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === it.ShadowDom &&
              (r = { ...r, encapsulation: it.Emulated });
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof iD
                ? o.applyToHost(n)
                : o instanceof jc && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(n, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.doc,
                a = this.ngZone,
                u = this.eventManager,
                l = this.sharedStylesHost,
                c = this.removeStylesOnCompDestroy,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case it.Emulated:
                  i = new iD(u, l, r, this.appId, c, s, a, d);
                  break;
                case it.ShadowDom:
                  return new KO(u, l, n, r, s, a, this.nonce, d);
                default:
                  i = new jc(u, l, r, c, s, a, d);
              }
              o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(
              P(Jv),
              P(eD),
              P(Qi),
              P(YO),
              P(pn),
              P(xn),
              P(ie),
              P(mp)
            );
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class Vc {
        constructor(t, n, r, o) {
          (this.eventManager = t),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? this.doc.createElementNS(kc[n] || n, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (oD(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (oD(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? this.doc.querySelector(t) : t;
          if (!r) throw new C(-5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = kc[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = kc[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (ln.DashCase | ln.Important)
            ? t.style.setProperty(n, r, o & ln.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & ln.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          if (
            "string" == typeof t &&
            !(t = Ho().getGlobalEventTarget(this.doc, t))
          )
            throw new Error(`Unsupported event target ${t} for event ${n}`);
          return this.eventManager.addEventListener(
            t,
            n,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(t) {
          return (n) => {
            if ("__ngUnwrap__" === n) return t;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => t(n))
                : t(n)) && n.preventDefault();
          };
        }
      }
      function oD(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class KO extends Vc {
        constructor(t, n, r, o, i, s, a, u) {
          super(t, i, s, u),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const l = nD(o.id, o.styles);
          for (const c of l) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = c),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class jc extends Vc {
        constructor(t, n, r, o, i, s, a, u) {
          super(t, i, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = u ? nD(u, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class iD extends jc {
        constructor(t, n, r, o, i, s, a, u) {
          const l = o + "-" + r.id;
          super(t, n, r, i, s, a, u, l),
            (this.contentAttr = (function QO(e) {
              return "_ngcontent-%COMP%".replace(Lc, e);
            })(l)),
            (this.hostAttr = (function XO(e) {
              return "_nghost-%COMP%".replace(Lc, e);
            })(l));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let eF = (() => {
        class e extends Kv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(pn));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const sD = ["alt", "control", "meta", "shift"],
        tF = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        nF = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let rF = (() => {
        class e extends Kv {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Ho().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              sD.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = tF[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                sD.forEach((s) => {
                  s !== o && (0, nF[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(pn));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const aF = tv(BN, "browser", [
          { provide: xn, useValue: "browser" },
          {
            provide: gp,
            useValue: function oF() {
              Fc.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: pn,
            useFactory: function sF() {
              return (
                (function Nb(e) {
                  Nu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        uF = new b(""),
        lD = [
          {
            provide: Ts,
            useClass: class GO {
              addToWindow(t) {
                (Q.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i) throw new C(5103, !1);
                  return i;
                }),
                  (Q.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (Q.getAllAngularRootElements = () => t.getAllRootElements()),
                  Q.frameworkStabilizers || (Q.frameworkStabilizers = []),
                  Q.frameworkStabilizers.push((r) => {
                    const o = Q.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach((u) => {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Ho().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: Qy, useClass: ic, deps: [ie, sc, Ts] },
          { provide: ic, useClass: ic, deps: [ie, sc, Ts] },
        ],
        cD = [
          { provide: Bu, useValue: "root" },
          {
            provide: zt,
            useFactory: function iF() {
              return new zt();
            },
            deps: [],
          },
          { provide: Pc, useClass: eF, multi: !0, deps: [pn, ie, xn] },
          { provide: Pc, useClass: rF, multi: !0, deps: [pn] },
          rD,
          eD,
          Jv,
          { provide: wp, useExisting: rD },
          { provide: Wv, useClass: zO, deps: [] },
          [],
        ];
      let lF = (() => {
        class e {
          constructor(n) {}
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [{ provide: Qi, useValue: n.appId }],
            };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(uF, 12));
          });
          static #t = (this.ɵmod = jt({ type: e }));
          static #n = (this.ɵinj = vt({
            providers: [...cD, ...lD],
            imports: [pO, HN],
          }));
        }
        return e;
      })();
      function pD(e) {
        return Rt((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      typeof window < "u" && window;
      class Zs {}
      class Ys {}
      class Ot {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? "string" == typeof t
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      t.split("\n").forEach((n) => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                          const o = n.slice(0, r),
                            i = o.toLowerCase(),
                            s = n.slice(r + 1).trim();
                          this.maybeSetNormalizedName(o, i),
                            this.headers.has(i)
                              ? this.headers.get(i).push(s)
                              : this.headers.set(i, [s]);
                        }
                      });
                  })
                : typeof Headers < "u" && t instanceof Headers
                ? ((this.headers = new Map()),
                  t.forEach((n, r) => {
                    this.setHeaderEntries(r, n);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(t).forEach(([n, r]) => {
                        this.setHeaderEntries(n, r);
                      });
                  })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Ot
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new Ot();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof Ot
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = t.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        setHeaderEntries(t, n) {
          const r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
            o = t.toLowerCase();
          this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class vF {
        encodeKey(t) {
          return gD(t);
        }
        encodeValue(t) {
          return gD(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const _F = /%(\d[a-f0-9])/gi,
        CF = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function gD(e) {
        return encodeURIComponent(e).replace(_F, (t, n) => CF[n] ?? t);
      }
      function Qs(e) {
        return `${e}`;
      }
      class mn {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new vF()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function DF(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [t.decodeKey(o), ""]
                            : [
                                t.decodeKey(o.slice(0, i)),
                                t.decodeValue(o.slice(i + 1)),
                              ],
                        u = n.get(s) || [];
                      u.push(a), n.set(s, u);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n],
                    o = Array.isArray(r) ? r.map(Qs) : [Qs(r)];
                  this.map.set(n, o);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const o = t[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new mn({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(Qs(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const o = r.indexOf(Qs(t.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class wF {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function mD(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function yD(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function vD(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class qo {
        constructor(t, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function EF(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new Ot()),
            this.context || (this.context = new wF()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new mn()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : mD(this.body) ||
              yD(this.body) ||
              vD(this.body) ||
              (function bF(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof mn
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || vD(this.body)
            ? null
            : yD(this.body)
            ? this.body.type || null
            : mD(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof mn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          const n = t.method || this.method,
            r = t.url || this.url,
            o = t.responseType || this.responseType,
            i = void 0 !== t.body ? t.body : this.body,
            s =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            a =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let u = t.headers || this.headers,
            l = t.params || this.params;
          const c = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders &&
              (u = Object.keys(t.setHeaders).reduce(
                (d, f) => d.set(f, t.setHeaders[f]),
                u
              )),
            t.setParams &&
              (l = Object.keys(t.setParams).reduce(
                (d, f) => d.set(f, t.setParams[f]),
                l
              )),
            new qo(n, r, i, {
              params: l,
              headers: u,
              context: c,
              reportProgress: a,
              responseType: o,
              withCredentials: s,
            })
          );
        }
      }
      var Rr = (function (e) {
        return (
          (e[(e.Sent = 0)] = "Sent"),
          (e[(e.UploadProgress = 1)] = "UploadProgress"),
          (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
          (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
          (e[(e.Response = 4)] = "Response"),
          (e[(e.User = 5)] = "User"),
          e
        );
      })(Rr || {});
      class Hc {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new Ot()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class $c extends Hc {
        constructor(t = {}) {
          super(t), (this.type = Rr.ResponseHeader);
        }
        clone(t = {}) {
          return new $c({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class kr extends Hc {
        constructor(t = {}) {
          super(t),
            (this.type = Rr.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new kr({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class DD extends Hc {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Uc(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let _D = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof qo) i = n;
            else {
              let u, l;
              (u = o.headers instanceof Ot ? o.headers : new Ot(o.headers)),
                o.params &&
                  (l =
                    o.params instanceof mn
                      ? o.params
                      : new mn({ fromObject: o.params })),
                (i = new qo(n, r, void 0 !== o.body ? o.body : null, {
                  headers: u,
                  context: o.context,
                  params: l,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = _a(i).pipe(
              (function mF(e, t) {
                return ee(t) ? oi(e, t, 1) : oi(e, 1);
              })((u) => this.handler.handle(u))
            );
            if (n instanceof qo || "events" === o.observe) return s;
            const a = s.pipe(
              (function yF(e, t) {
                return Rt((n, r) => {
                  let o = 0;
                  n.subscribe(kt(r, (i) => e.call(t, i, o++) && r.next(i)));
                });
              })((u) => u instanceof kr)
            );
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      En((u) => {
                        if (null !== u.body && !(u.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return u.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      En((u) => {
                        if (null !== u.body && !(u.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return u.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      En((u) => {
                        if (null !== u.body && "string" != typeof u.body)
                          throw new Error("Response is not a string.");
                        return u.body;
                      })
                    );
                  default:
                    return a.pipe(En((u) => u.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new mn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, Uc(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, Uc(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, Uc(o, r));
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(Zs));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function ED(e, t) {
        return t(e);
      }
      function MF(e, t) {
        return (n, r) => t.intercept(n, { handle: (o) => e(o, r) });
      }
      const AF = new b(""),
        Wo = new b(""),
        bD = new b("");
      function TF() {
        let e = null;
        return (t, n) => {
          null === e &&
            (e = (H(AF, { optional: !0 }) ?? []).reduceRight(MF, ED));
          const r = H(nc),
            o = r.add();
          return e(t, n).pipe(pD(() => r.remove(o)));
        };
      }
      let ID = (() => {
        class e extends Zs {
          constructor(n, r) {
            super(),
              (this.backend = n),
              (this.injector = r),
              (this.chain = null),
              (this.pendingTasks = H(nc));
          }
          handle(n) {
            if (null === this.chain) {
              const o = Array.from(
                new Set([
                  ...this.injector.get(Wo),
                  ...this.injector.get(bD, []),
                ])
              );
              this.chain = o.reduceRight(
                (i, s) =>
                  (function SF(e, t, n) {
                    return (r, o) => n.runInContext(() => t(r, (i) => e(i, o)));
                  })(i, s, this.injector),
                ED
              );
            }
            const r = this.pendingTasks.add();
            return this.chain(n, (o) => this.backend.handle(o)).pipe(
              pD(() => this.pendingTasks.remove(r))
            );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(Ys), P(It));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const FF = /^\)\]\}',?\n/;
      let SD = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method) throw new C(-2800, !1);
            const r = this.xhrFactory;
            return (r.ɵloadImpl ? ii(r.ɵloadImpl()) : _a(null)).pipe(
              Bd(
                () =>
                  new we((i) => {
                    const s = r.build();
                    if (
                      (s.open(n.method, n.urlWithParams),
                      n.withCredentials && (s.withCredentials = !0),
                      n.headers.forEach((g, y) =>
                        s.setRequestHeader(g, y.join(","))
                      ),
                      n.headers.has("Accept") ||
                        s.setRequestHeader(
                          "Accept",
                          "application/json, text/plain, */*"
                        ),
                      !n.headers.has("Content-Type"))
                    ) {
                      const g = n.detectContentTypeHeader();
                      null !== g && s.setRequestHeader("Content-Type", g);
                    }
                    if (n.responseType) {
                      const g = n.responseType.toLowerCase();
                      s.responseType = "json" !== g ? g : "text";
                    }
                    const a = n.serializeBody();
                    let u = null;
                    const l = () => {
                        if (null !== u) return u;
                        const g = s.statusText || "OK",
                          y = new Ot(s.getAllResponseHeaders()),
                          D =
                            (function PF(e) {
                              return "responseURL" in e && e.responseURL
                                ? e.responseURL
                                : /^X-Request-URL:/m.test(
                                    e.getAllResponseHeaders()
                                  )
                                ? e.getResponseHeader("X-Request-URL")
                                : null;
                            })(s) || n.url;
                        return (
                          (u = new $c({
                            headers: y,
                            status: s.status,
                            statusText: g,
                            url: D,
                          })),
                          u
                        );
                      },
                      c = () => {
                        let {
                            headers: g,
                            status: y,
                            statusText: D,
                            url: m,
                          } = l(),
                          E = null;
                        204 !== y &&
                          (E =
                            typeof s.response > "u"
                              ? s.responseText
                              : s.response),
                          0 === y && (y = E ? 200 : 0);
                        let I = y >= 200 && y < 300;
                        if ("json" === n.responseType && "string" == typeof E) {
                          const R = E;
                          E = E.replace(FF, "");
                          try {
                            E = "" !== E ? JSON.parse(E) : null;
                          } catch (me) {
                            (E = R),
                              I && ((I = !1), (E = { error: me, text: E }));
                          }
                        }
                        I
                          ? (i.next(
                              new kr({
                                body: E,
                                headers: g,
                                status: y,
                                statusText: D,
                                url: m || void 0,
                              })
                            ),
                            i.complete())
                          : i.error(
                              new DD({
                                error: E,
                                headers: g,
                                status: y,
                                statusText: D,
                                url: m || void 0,
                              })
                            );
                      },
                      d = (g) => {
                        const { url: y } = l(),
                          D = new DD({
                            error: g,
                            status: s.status || 0,
                            statusText: s.statusText || "Unknown Error",
                            url: y || void 0,
                          });
                        i.error(D);
                      };
                    let f = !1;
                    const h = (g) => {
                        f || (i.next(l()), (f = !0));
                        let y = { type: Rr.DownloadProgress, loaded: g.loaded };
                        g.lengthComputable && (y.total = g.total),
                          "text" === n.responseType &&
                            s.responseText &&
                            (y.partialText = s.responseText),
                          i.next(y);
                      },
                      p = (g) => {
                        let y = { type: Rr.UploadProgress, loaded: g.loaded };
                        g.lengthComputable && (y.total = g.total), i.next(y);
                      };
                    return (
                      s.addEventListener("load", c),
                      s.addEventListener("error", d),
                      s.addEventListener("timeout", d),
                      s.addEventListener("abort", d),
                      n.reportProgress &&
                        (s.addEventListener("progress", h),
                        null !== a &&
                          s.upload &&
                          s.upload.addEventListener("progress", p)),
                      s.send(a),
                      i.next({ type: Rr.Sent }),
                      () => {
                        s.removeEventListener("error", d),
                          s.removeEventListener("abort", d),
                          s.removeEventListener("load", c),
                          s.removeEventListener("timeout", d),
                          n.reportProgress &&
                            (s.removeEventListener("progress", h),
                            null !== a &&
                              s.upload &&
                              s.upload.removeEventListener("progress", p)),
                          s.readyState !== s.DONE && s.abort();
                      }
                    );
                  })
              )
            );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(Wv));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const Gc = new b("XSRF_ENABLED"),
        AD = new b("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        TD = new b("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class ND {}
      let LF = (() => {
        class e {
          constructor(n, r, o) {
            (this.doc = n),
              (this.platform = r),
              (this.cookieName = o),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = kv(n, this.cookieName)),
                (this.lastCookieString = n)),
              this.lastToken
            );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(P(pn), P(xn), P(AD));
          });
          static #t = (this.ɵprov = B({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function VF(e, t) {
        const n = e.url.toLowerCase();
        if (
          !H(Gc) ||
          "GET" === e.method ||
          "HEAD" === e.method ||
          n.startsWith("http://") ||
          n.startsWith("https://")
        )
          return t(e);
        const r = H(ND).getToken(),
          o = H(TD);
        return (
          null != r &&
            !e.headers.has(o) &&
            (e = e.clone({ headers: e.headers.set(o, r) })),
          t(e)
        );
      }
      var yn = (function (e) {
        return (
          (e[(e.Interceptors = 0)] = "Interceptors"),
          (e[(e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
          (e[(e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
          (e[(e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
          (e[(e.JsonpSupport = 4)] = "JsonpSupport"),
          (e[(e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
          (e[(e.Fetch = 6)] = "Fetch"),
          e
        );
      })(yn || {});
      function jF(...e) {
        const t = [
          _D,
          SD,
          ID,
          { provide: Zs, useExisting: ID },
          { provide: Ys, useExisting: SD },
          { provide: Wo, useValue: VF, multi: !0 },
          { provide: Gc, useValue: !0 },
          { provide: ND, useClass: LF },
        ];
        for (const n of e) t.push(...n.ɵproviders);
        return (function Lu(e) {
          return { ɵproviders: e };
        })(t);
      }
      const xD = new b("LEGACY_INTERCEPTOR_FN");
      function BF() {
        return (function Vn(e, t) {
          return { ɵkind: e, ɵproviders: t };
        })(yn.LegacyInterceptors, [
          { provide: xD, useFactory: TF },
          { provide: Wo, useExisting: xD, multi: !0 },
        ]);
      }
      let HF = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = jt({ type: e }));
            static #n = (this.ɵinj = vt({ providers: [jF(BF())] }));
          }
          return e;
        })(),
        WF = (() => {
          class e {
            constructor(n) {
              (this.http = n),
                (this.apiUrl =
                  "https://raw.githubusercontent.com/maciekkusiak27/busola-json/main/departures.json");
            }
            getDeparturesData() {
              return this.http.get(this.apiUrl);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(P(_D));
            });
            static #t = (this.ɵprov = B({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })();
      const { isArray: ZF } = Array,
        { getPrototypeOf: YF, prototype: QF, keys: XF } = Object;
      const { isArray: eP } = Array;
      function rP(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      function oP(...e) {
        const t = (function TC(e) {
            return ee(Da(e)) ? e.pop() : void 0;
          })(e),
          { args: n, keys: r } = (function JF(e) {
            if (1 === e.length) {
              const t = e[0];
              if (ZF(t)) return { args: t, keys: null };
              if (
                (function KF(e) {
                  return e && "object" == typeof e && YF(e) === QF;
                })(t)
              ) {
                const n = XF(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e),
          o = new we((i) => {
            const { length: s } = n;
            if (!s) return void i.complete();
            const a = new Array(s);
            let u = s,
              l = s;
            for (let c = 0; c < s; c++) {
              let d = !1;
              yt(n[c]).subscribe(
                kt(
                  i,
                  (f) => {
                    d || ((d = !0), l--), (a[c] = f);
                  },
                  () => u--,
                  void 0,
                  () => {
                    (!u || !d) && (l || i.next(r ? rP(r, a) : a), i.complete());
                  }
                )
              );
            }
          });
        return t
          ? o.pipe(
              (function nP(e) {
                return En((t) =>
                  (function tP(e, t) {
                    return eP(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(t)
            )
          : o;
      }
      let OD = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(On), _(lt));
            });
            static #t = (this.ɵdir = x({ type: e }));
          }
          return e;
        })(),
        jn = (() => {
          class e extends OD {
            static #e = (this.ɵfac = (function () {
              let n;
              return function (o) {
                return (n || (n = be(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = x({ type: e, features: [W] }));
          }
          return e;
        })();
      const Ft = new b("NgValueAccessor"),
        sP = { provide: Ft, useExisting: Y(() => zc), multi: !0 },
        uP = new b("CompositionEventMode");
      let zc = (() => {
        class e extends OD {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function aP() {
                  const e = Ho() ? Ho().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(On), _(lt), _(uP, 8));
          });
          static #t = (this.ɵdir = x({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (r, o) {
              1 & r &&
                Xe("input", function (s) {
                  return o._handleInput(s.target.value);
                })("blur", function () {
                  return o.onTouched();
                })("compositionstart", function () {
                  return o._compositionStart();
                })("compositionend", function (s) {
                  return o._compositionEnd(s.target.value);
                });
            },
            features: [ne([sP]), W],
          }));
        }
        return e;
      })();
      const Ae = new b("NgValidators"),
        Dn = new b("NgAsyncValidators");
      function UD(e) {
        return null != e;
      }
      function GD(e) {
        return ys(e) ? ii(e) : e;
      }
      function zD(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function qD(e, t) {
        return t.map((n) => n(e));
      }
      function WD(e) {
        return e.map((t) =>
          (function cP(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function qc(e) {
        return null != e
          ? (function ZD(e) {
              if (!e) return null;
              const t = e.filter(UD);
              return 0 == t.length
                ? null
                : function (n) {
                    return zD(qD(n, t));
                  };
            })(WD(e))
          : null;
      }
      function Wc(e) {
        return null != e
          ? (function YD(e) {
              if (!e) return null;
              const t = e.filter(UD);
              return 0 == t.length
                ? null
                : function (n) {
                    return oP(qD(n, t).map(GD)).pipe(En(zD));
                  };
            })(WD(e))
          : null;
      }
      function QD(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function Zc(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function Ks(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function KD(e, t) {
        const n = Zc(t);
        return (
          Zc(e).forEach((o) => {
            Ks(n, o) || n.push(o);
          }),
          n
        );
      }
      function e_(e, t) {
        return Zc(t).filter((n) => !Ks(e, n));
      }
      class t_ {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = qc(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = Wc(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t = void 0) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class Le extends t_ {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class _n extends t_ {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class n_ {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let r_ = (() => {
        class e extends n_ {
          constructor(n) {
            super(n);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(_(_n, 2));
          });
          static #t = (this.ɵdir = x({
            type: e,
            selectors: [
              ["", "formControlName", ""],
              ["", "ngModel", ""],
              ["", "formControl", ""],
            ],
            hostVars: 14,
            hostBindings: function (r, o) {
              2 & r &&
                Ds("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                  "ng-pristine",
                  o.isPristine
                )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                  "ng-invalid",
                  o.isInvalid
                )("ng-pending", o.isPending);
            },
            features: [W],
          }));
        }
        return e;
      })();
      const Zo = "VALID",
        ta = "INVALID",
        Lr = "PENDING",
        Yo = "DISABLED";
      function na(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      class a_ {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(t),
            this._assignAsyncValidators(n);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Zo;
        }
        get invalid() {
          return this.status === ta;
        }
        get pending() {
          return this.status == Lr;
        }
        get disabled() {
          return this.status === Yo;
        }
        get enabled() {
          return this.status !== Yo;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          this._assignValidators(t);
        }
        setAsyncValidators(t) {
          this._assignAsyncValidators(t);
        }
        addValidators(t) {
          this.setValidators(KD(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(KD(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(e_(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(e_(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return Ks(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return Ks(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = Lr),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = Yo),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = Zo),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Zo || this.status === Lr) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Yo : Zo;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = Lr), (this._hasOwnPendingAsyncValidator = !0);
            const n = GD(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          let n = t;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, o) => r && r._find(o), this);
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new Me()), (this.statusChanges = new Me());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Yo
            : this.errors
            ? ta
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Lr)
            ? Lr
            : this._anyControlsHaveStatus(ta)
            ? ta
            : Zo;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          na(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
        _assignValidators(t) {
          (this._rawValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedValidatorFn = (function gP(e) {
              return Array.isArray(e) ? qc(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function mP(e) {
              return Array.isArray(e) ? Wc(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      const Vr = new b("CallSetDisabledState", {
          providedIn: "root",
          factory: () => ra,
        }),
        ra = "always";
      function Qo(e, t, n = ra) {
        (function ed(e, t) {
          const n = (function XD(e) {
            return e._rawValidators;
          })(e);
          null !== t.validator
            ? e.setValidators(QD(n, t.validator))
            : "function" == typeof n && e.setValidators([n]);
          const r = (function JD(e) {
            return e._rawAsyncValidators;
          })(e);
          null !== t.asyncValidator
            ? e.setAsyncValidators(QD(r, t.asyncValidator))
            : "function" == typeof r && e.setAsyncValidators([r]);
          const o = () => e.updateValueAndValidity();
          sa(t._rawValidators, o), sa(t._rawAsyncValidators, o);
        })(e, t),
          t.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === n) &&
            t.valueAccessor.setDisabledState?.(e.disabled),
          (function DP(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && u_(e, t);
            });
          })(e, t),
          (function CP(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function _P(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && u_(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function vP(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function sa(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function u_(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function d_(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function f_(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const h_ = class extends a_ {
          constructor(t = null, n, r) {
            super(
              (function Xc(e) {
                return (na(e) ? e.validators : e) || null;
              })(n),
              (function Jc(e, t) {
                return (na(t) ? t.asyncValidators : e) || null;
              })(r, n)
            ),
              (this.defaultValue = null),
              (this._onChange = []),
              (this._pendingChange = !1),
              this._applyFormState(t),
              this._setUpdateStrategy(n),
              this._initObservables(),
              this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator,
              }),
              na(n) &&
                (n.nonNullable || n.initialValueIsDefault) &&
                (this.defaultValue = f_(t) ? t.value : t);
          }
          setValue(t, n = {}) {
            (this.value = this._pendingValue = t),
              this._onChange.length &&
                !1 !== n.emitModelToViewChange &&
                this._onChange.forEach((r) =>
                  r(this.value, !1 !== n.emitViewToModelChange)
                ),
              this.updateValueAndValidity(n);
          }
          patchValue(t, n = {}) {
            this.setValue(t, n);
          }
          reset(t = this.defaultValue, n = {}) {
            this._applyFormState(t),
              this.markAsPristine(n),
              this.markAsUntouched(n),
              this.setValue(this.value, n),
              (this._pendingChange = !1);
          }
          _updateValue() {}
          _anyControls(t) {
            return !1;
          }
          _allControlsDisabled() {
            return this.disabled;
          }
          registerOnChange(t) {
            this._onChange.push(t);
          }
          _unregisterOnChange(t) {
            d_(this._onChange, t);
          }
          registerOnDisabledChange(t) {
            this._onDisabledChange.push(t);
          }
          _unregisterOnDisabledChange(t) {
            d_(this._onDisabledChange, t);
          }
          _forEachChild(t) {}
          _syncPendingControls() {
            return !(
              "submit" !== this.updateOn ||
              (this._pendingDirty && this.markAsDirty(),
              this._pendingTouched && this.markAsTouched(),
              !this._pendingChange) ||
              (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1,
              }),
              0)
            );
          }
          _applyFormState(t) {
            f_(t)
              ? ((this.value = this._pendingValue = t.value),
                t.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = t);
          }
        },
        TP = { provide: _n, useExisting: Y(() => id) },
        m_ = (() => Promise.resolve())();
      let id = (() => {
          class e extends _n {
            constructor(n, r, o, i, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new h_()),
                (this._registered = !1),
                (this.name = ""),
                (this.update = new Me()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function rd(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === zc
                        ? (n = i)
                        : (function bP(e) {
                            return Object.getPrototypeOf(e.constructor) === jn;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                (function nd(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const n = e.model;
                  return !!n.isFirstChange() || !Object.is(t, n.currentValue);
                })(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              Qo(this.control, this, this.callSetDisabledState),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              m_.then(() => {
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o =
                  0 !== r &&
                  (function gc(e) {
                    return "boolean" == typeof e
                      ? e
                      : null != e && "false" !== e;
                  })(r);
              m_.then(() => {
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent
                ? (function oa(e, t) {
                    return [...t.path, e];
                  })(n, this._parent)
                : [n];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(
                _(Le, 9),
                _(Ae, 10),
                _(Dn, 10),
                _(Ft, 10),
                _(dv, 8),
                _(Vr, 8)
              );
            });
            static #t = (this.ɵdir = x({
              type: e,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [ne([TP]), W, Ht],
            }));
          }
          return e;
        })(),
        v_ = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = jt({ type: e }));
            static #n = (this.ɵinj = vt({}));
          }
          return e;
        })();
      const BP = { provide: Ft, useExisting: Y(() => ua), multi: !0 };
      function I_(e, t) {
        return null == e
          ? `${t}`
          : (t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let ua = (() => {
          class e extends jn {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(n) {
              this._compareWith = n;
            }
            writeValue(n) {
              this.value = n;
              const o = I_(this._getOptionId(n), n);
              this.setProperty("value", o);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                (this.value = this._getOptionValue(r)), n(this.value);
              };
            }
            _registerOption() {
              return (this._idCounter++).toString();
            }
            _getOptionId(n) {
              for (const r of this._optionMap.keys())
                if (this._compareWith(this._optionMap.get(r), n)) return r;
              return null;
            }
            _getOptionValue(n) {
              const r = (function HP(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r) : n;
            }
            static #e = (this.ɵfac = (function () {
              let n;
              return function (o) {
                return (n || (n = be(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = x({
              type: e,
              selectors: [
                ["select", "formControlName", "", 3, "multiple", ""],
                ["select", "formControl", "", 3, "multiple", ""],
                ["select", "ngModel", "", 3, "multiple", ""],
              ],
              hostBindings: function (r, o) {
                1 & r &&
                  Xe("change", function (s) {
                    return o.onChange(s.target.value);
                  })("blur", function () {
                    return o.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [ne([BP]), W],
            }));
          }
          return e;
        })(),
        M_ = (() => {
          class e {
            constructor(n, r, o) {
              (this._element = n),
                (this._renderer = r),
                (this._select = o),
                this._select && (this.id = this._select._registerOption());
            }
            set ngValue(n) {
              null != this._select &&
                (this._select._optionMap.set(this.id, n),
                this._setElementValue(I_(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._setElementValue(n),
                this._select && this._select.writeValue(this._select.value);
            }
            _setElementValue(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                n
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(lt), _(On), _(ua, 9));
            });
            static #t = (this.ɵdir = x({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            }));
          }
          return e;
        })();
      const $P = { provide: Ft, useExisting: Y(() => ld), multi: !0 };
      function S_(e, t) {
        return null == e
          ? `${t}`
          : ("string" == typeof t && (t = `'${t}'`),
            t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let ld = (() => {
          class e extends jn {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(n) {
              this._compareWith = n;
            }
            writeValue(n) {
              let r;
              if (((this.value = n), Array.isArray(n))) {
                const o = n.map((i) => this._getOptionId(i));
                r = (i, s) => {
                  i._setSelected(o.indexOf(s.toString()) > -1);
                };
              } else
                r = (o, i) => {
                  o._setSelected(!1);
                };
              this._optionMap.forEach(r);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                const o = [],
                  i = r.selectedOptions;
                if (void 0 !== i) {
                  const s = i;
                  for (let a = 0; a < s.length; a++) {
                    const l = this._getOptionValue(s[a].value);
                    o.push(l);
                  }
                } else {
                  const s = r.options;
                  for (let a = 0; a < s.length; a++) {
                    const u = s[a];
                    if (u.selected) {
                      const l = this._getOptionValue(u.value);
                      o.push(l);
                    }
                  }
                }
                (this.value = o), n(o);
              };
            }
            _registerOption(n) {
              const r = (this._idCounter++).toString();
              return this._optionMap.set(r, n), r;
            }
            _getOptionId(n) {
              for (const r of this._optionMap.keys())
                if (this._compareWith(this._optionMap.get(r)._value, n))
                  return r;
              return null;
            }
            _getOptionValue(n) {
              const r = (function UP(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r)._value : n;
            }
            static #e = (this.ɵfac = (function () {
              let n;
              return function (o) {
                return (n || (n = be(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = x({
              type: e,
              selectors: [
                ["select", "multiple", "", "formControlName", ""],
                ["select", "multiple", "", "formControl", ""],
                ["select", "multiple", "", "ngModel", ""],
              ],
              hostBindings: function (r, o) {
                1 & r &&
                  Xe("change", function (s) {
                    return o.onChange(s.target);
                  })("blur", function () {
                    return o.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [ne([$P]), W],
            }));
          }
          return e;
        })(),
        A_ = (() => {
          class e {
            constructor(n, r, o) {
              (this._element = n),
                (this._renderer = r),
                (this._select = o),
                this._select && (this.id = this._select._registerOption(this));
            }
            set ngValue(n) {
              null != this._select &&
                ((this._value = n),
                this._setElementValue(S_(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._select
                ? ((this._value = n),
                  this._setElementValue(S_(this.id, n)),
                  this._select.writeValue(this._select.value))
                : this._setElementValue(n);
            }
            _setElementValue(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                n
              );
            }
            _setSelected(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "selected",
                n
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(lt), _(On), _(ld, 9));
            });
            static #t = (this.ɵdir = x({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            }));
          }
          return e;
        })(),
        JP = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = jt({ type: e }));
            static #n = (this.ɵinj = vt({ imports: [v_] }));
          }
          return e;
        })(),
        eR = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: Vr, useValue: n.callSetDisabledState ?? ra },
                ],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = jt({ type: e }));
            static #n = (this.ɵinj = vt({ imports: [JP] }));
          }
          return e;
        })();
      function tR(e, t) {
        if ((1 & e && (pe(0, "option", 5), ht(1), ge()), 2 & e)) {
          const n = t.$implicit;
          Ue("value", n), Ce(1), fn(" ", n, " ");
        }
      }
      function nR(e, t) {
        if (1 & e) {
          const n = Al();
          pe(0, "div")(1, "label", 2),
            ht(2, "Wybierz kierunek:"),
            ge(),
            pe(3, "select", 3),
            Xe("ngModelChange", function (o) {
              return eo(n), to((At().selectedDirection = o));
            })("change", function () {
              return eo(n), to(At().onDirectionChange());
            }),
            Yt(4, tR, 2, 2, "option", 4),
            ge()();
        }
        if (2 & e) {
          const n = At();
          Ce(3),
            Ue("ngModel", n.selectedDirection),
            Ce(1),
            Ue("ngForOf", n.directions);
        }
      }
      function rR(e, t) {
        if ((1 & e && (pe(0, "option", 9), ht(1), ge()), 2 & e)) {
          const n = t.$implicit;
          Ue("ngValue", n), Ce(1), fn(" ", n, " ");
        }
      }
      function oR(e, t) {
        if (1 & e) {
          const n = Al();
          pe(0, "div")(1, "label", 6),
            ht(2, "Wybierz przystanek:"),
            ge(),
            pe(3, "select", 7),
            Xe("ngModelChange", function (o) {
              return eo(n), to((At().selectedStop = o));
            })("change", function () {
              return eo(n), to(At().onStopChange());
            }),
            Yt(4, rR, 2, 2, "option", 8),
            ge()();
        }
        if (2 & e) {
          const n = At();
          Ce(3),
            Ue("ngModel", n.selectedStop),
            Ce(1),
            Ue("ngForOf", n.filteredStops);
        }
      }
      function iR(e, t) {
        if ((1 & e && (pe(0, "h4"), ht(1), ge()), 2 & e)) {
          const n = At(2);
          Ce(1), Pl(n.nextDepartureTime);
        }
      }
      function sR(e, t) {
        if (
          (1 & e &&
            (pe(0, "div")(1, "h3"),
            ht(2),
            ge(),
            Yt(3, iR, 2, 1, "h4", 1),
            ge()),
          2 & e)
        ) {
          const n = At();
          Ce(2),
            fn("Nast\u0119pny odjazd z ", n.selectedStop, ":"),
            Ce(1),
            Ue("ngIf", n.nextDepartureTime);
        }
      }
      function aR(e, t) {
        if ((1 & e && (pe(0, "p"), ht(1), ge()), 2 & e)) {
          const n = t.$implicit;
          Ce(1), fn(" ", n, " ");
        }
      }
      function uR(e, t) {
        if (
          (1 & e &&
            (pe(0, "div")(1, "h3"),
            ht(2),
            ge(),
            pe(3, "div", 10),
            Yt(4, aR, 2, 1, "p", 11),
            ge()()),
          2 & e)
        ) {
          const n = At();
          Ce(2),
            fn("Odjazdy z ", n.selectedStop, ""),
            Ce(2),
            Ue("ngForOf", n.getDeparturesForStop(n.selectedStop));
        }
      }
      let lR = (() => {
          class e {
            constructor(n) {
              (this.departuresService = n),
                (this.directions = []),
                (this.selectedDirection = ""),
                (this.stops = []),
                (this.selectedStop = ""),
                (this.uniqueStops = []),
                (this.today = ""),
                (this.departuresData = { stops: [] });
            }
            ngOnInit() {
              this.departuresService.getDeparturesData().subscribe(
                (n) => {
                  if (
                    ((this.departuresData = n.departuresData),
                    this.departuresData && this.departuresData.stops)
                  ) {
                    this.stops = this.departuresData.stops;
                    const r = Array.from(
                      new Set(this.departuresData.stops.map((o) => o.direction))
                    );
                    (this.directions = r),
                      (this.selectedDirection =
                        "Krak\xf3w" === this.selectedDirection
                          ? this.selectedDirection
                          : "My\u015blenice"),
                      (this.today = this.getDayOfWeek(new Date())),
                      this.defaultStops();
                  } else
                    console.error("Nieprawid\u0142owa struktura danych z API.");
                },
                (n) => {
                  console.error(
                    "B\u0142\u0105d podczas pobierania danych z API:",
                    n
                  );
                }
              );
            }
            getDayOfWeek(n) {
              return [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ][n.getDay()];
            }
            get filteredStops() {
              if (!this.selectedDirection || !this.stops) return [];
              let n;
              return (
                (n =
                  "Saturday" === this.today || "Sunday" === this.today
                    ? this.today.toLowerCase()
                    : "mon-fri"),
                this.stops
                  .filter(
                    (o) =>
                      o.direction === this.selectedDirection && o.type === n
                  )
                  .map((o) => o.name)
              );
            }
            onStopChange() {
              this.nextDepartureTime = this.getNextDepartureTime(
                this.selectedStop
              );
            }
            onDirectionChange() {
              this.defaultStops(), this.updateNextDepartureTime();
            }
            defaultStops() {
              "My\u015blenice" === this.selectedDirection
                ? (this.selectedStop = "Krak\xf3w MDA")
                : "Krak\xf3w" === this.selectedDirection &&
                  (this.selectedStop = "My\u015blenice DA");
            }
            updateNextDepartureTime() {
              this.nextDepartureTime = this.getNextDepartureTime(
                this.selectedStop
              );
            }
            getDeparturesForStop(n) {
              const r = this.stops.find((o) => o.name === n);
              return r ? r.departures : [];
            }
            getNextDepartureTime(n) {
              const r = new Date(),
                o = r.getHours(),
                i = r.getMinutes(),
                s = this.stops.find((a) => a.name === n);
              if (s) {
                const a = s.departures.map((c) => {
                    const [d, f] = c.split(":").map(Number);
                    return 60 * d + f;
                  }),
                  u = 60 * o + i,
                  l = a.find((c) => c > u);
                if (void 0 !== l) {
                  const d = l % 60;
                  return `${Math.floor(l / 60)
                    .toString()
                    .padStart(2, "0")}:${d.toString().padStart(2, "0")}`;
                }
              }
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(_(WF));
            });
            static #t = (this.ɵcmp = La({
              type: e,
              selectors: [["app-bus-departures"]],
              decls: 7,
              vars: 4,
              consts: [
                [1, "departures"],
                [4, "ngIf"],
                ["for", "direction"],
                ["id", "direction", 3, "ngModel", "ngModelChange", "change"],
                [3, "value", 4, "ngFor", "ngForOf"],
                [3, "value"],
                ["for", "stop"],
                ["id", "stop", 3, "ngModel", "ngModelChange", "change"],
                [3, "ngValue", 4, "ngFor", "ngForOf"],
                [3, "ngValue"],
                [1, "departure-times"],
                [4, "ngFor", "ngForOf"],
              ],
              template: function (r, o) {
                1 & r &&
                  (pe(0, "div", 0),
                  Yt(1, nR, 5, 2, "div", 1),
                  Yt(2, oR, 5, 2, "div", 1),
                  Yt(3, sR, 4, 2, "div", 1),
                  Yt(4, uR, 5, 2, "div", 1),
                  pe(5, "h4"),
                  ht(6, "Wkr\xf3tce do pobrania aplikacja mobilna"),
                  ge()()),
                  2 & r &&
                    (Ce(1),
                    Ue("ngIf", o.directions),
                    Ce(1),
                    Ue("ngIf", o.filteredStops),
                    Ce(1),
                    Ue("ngIf", o.selectedStop),
                    Ce(1),
                    Ue("ngIf", o.selectedStop));
              },
              dependencies: [jv, Hv, M_, A_, ua, r_, id],
              styles: [
                ".departures[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;text-align:center}.departures[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:16px}.departures[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:8px}.departures[_ngcontent-%COMP%]   .departure-times[_ngcontent-%COMP%]{align-items:center;display:flex;flex-wrap:wrap;margin:0 32px}.departures[_ngcontent-%COMP%]   .departure-times[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{width:25%}",
              ],
            }));
          }
          return e;
        })(),
        cR = (() => {
          class e {
            constructor() {
              this.title = "busola-web";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = La({
              type: e,
              selectors: [["app-root"]],
              decls: 6,
              vars: 0,
              consts: [
                ["src", "./assets/busola.png", "alt", "logo", 1, "logo--img"],
                ["href", "https://github.com/maciekkusiak27"],
              ],
              template: function (r, o) {
                1 & r &&
                  (pe(0, "header"),
                  ms(1, "img", 0),
                  ge(),
                  ms(2, "app-bus-departures"),
                  pe(3, "footer")(4, "a", 1),
                  ht(5, "\xa9Projekt i realizacja Maciej Kusiak"),
                  ge()());
              },
              dependencies: [lR],
              styles: [
                "header[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:center;margin:16px 0}.logo--img[_ngcontent-%COMP%]{width:150px}footer[_ngcontent-%COMP%]{position:fixed;bottom:0;width:100%;text-align:center;background-color:#fff;display:flex;padding:16px;justify-content:center}footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#000;text-decoration:none}",
              ],
            }));
          }
          return e;
        })(),
        dR = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = jt({ type: e, bootstrap: [cR] }));
            static #n = (this.ɵinj = vt({ imports: [lF, eR, HF] }));
          }
          return e;
        })();
      aF()
        .bootstrapModule(dR)
        .catch((e) => console.error(e));
    },
  },
  (ee) => {
    ee((ee.s = 797));
  },
]);
