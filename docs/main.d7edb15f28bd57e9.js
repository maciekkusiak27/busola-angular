"use strict";
(self.webpackChunkbusola_web = self.webpackChunkbusola_web || []).push([
  [179],
  {
    630: () => {
      function ne(e) {
        return "function" == typeof e;
      }
      function jo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Bo = jo(
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
      function Nr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class gt {
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
            if (ne(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Bo ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  qc(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Bo ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Bo(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) qc(t);
            else {
              if (t instanceof gt) {
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
          n === t ? (this._parentage = null) : Array.isArray(n) && Nr(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && Nr(n, t), t instanceof gt && t._removeParent(this);
        }
      }
      gt.EMPTY = (() => {
        const e = new gt();
        return (e.closed = !0), e;
      })();
      const zc = gt.EMPTY;
      function Gc(e) {
        return (
          e instanceof gt ||
          (e && "closed" in e && ne(e.remove) && ne(e.add) && ne(e.unsubscribe))
        );
      }
      function qc(e) {
        ne(e) ? e() : e.unsubscribe();
      }
      const pn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Ho = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Ho;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Ho;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Wc(e) {
        Ho.setTimeout(() => {
          const { onUnhandledError: t } = pn;
          if (!t) throw e;
          t(e);
        });
      }
      function Zc() {}
      const QD = Ws("C", void 0, void 0);
      function Ws(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let gn = null;
      function $o(e) {
        if (pn.useDeprecatedSynchronousErrorHandling) {
          const t = !gn;
          if ((t && (gn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = gn;
            if (((gn = null), n)) throw r;
          }
        } else e();
      }
      class Zs extends gt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Gc(t) && t.add(this))
              : (this.destination = r_);
        }
        static create(t, n, r) {
          return new Or(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Qs(
                (function XD(e) {
                  return Ws("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Qs(
                (function KD(e) {
                  return Ws("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Qs(QD, this)
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
      const e_ = Function.prototype.bind;
      function Ys(e, t) {
        return e_.call(e, t);
      }
      class t_ {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Uo(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Uo(r);
            }
          else Uo(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Uo(n);
            }
        }
      }
      class Or extends Zs {
        constructor(t, n, r) {
          let o;
          if ((super(), ne(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && pn.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && Ys(t.next, i),
                  error: t.error && Ys(t.error, i),
                  complete: t.complete && Ys(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new t_(o);
        }
      }
      function Uo(e) {
        pn.useDeprecatedSynchronousErrorHandling
          ? (function JD(e) {
              pn.useDeprecatedSynchronousErrorHandling &&
                gn &&
                ((gn.errorThrown = !0), (gn.error = e));
            })(e)
          : Wc(e);
      }
      function Qs(e, t) {
        const { onStoppedNotification: n } = pn;
        n && Ho.setTimeout(() => n(e, t));
      }
      const r_ = {
          closed: !0,
          next: Zc,
          error: function n_(e) {
            throw e;
          },
          complete: Zc,
        },
        Ks =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Xs(e) {
        return e;
      }
      let be = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function i_(e) {
              return (
                (e && e instanceof Zs) ||
                ((function o_(e) {
                  return e && ne(e.next) && ne(e.error) && ne(e.complete);
                })(e) &&
                  Gc(e))
              );
            })(n)
              ? n
              : new Or(n, r, o);
            return (
              $o(() => {
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
            return new (r = Qc(r))((o, i) => {
              const s = new Or({
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
          [Ks]() {
            return this;
          }
          pipe(...n) {
            return (function Yc(e) {
              return 0 === e.length
                ? Xs
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = Qc(n))((r, o) => {
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
      function Qc(e) {
        var t;
        return null !== (t = e ?? pn.Promise) && void 0 !== t ? t : Promise;
      }
      const s_ = jo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let zo = (() => {
        class e extends be {
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
            const r = new Kc(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new s_();
          }
          next(n) {
            $o(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            $o(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            $o(() => {
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
              ? zc
              : ((this.currentObservers = null),
                i.push(n),
                new gt(() => {
                  (this.currentObservers = null), Nr(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new be();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Kc(t, n)), e;
      })();
      class Kc extends zo {
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
            : zc;
        }
      }
      function mn(e) {
        return (t) => {
          if (
            (function a_(e) {
              return ne(e?.lift);
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
      function Zt(e, t, n, r, o) {
        return new u_(e, t, n, r, o);
      }
      class u_ extends Zs {
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
      function Js(e, t) {
        return mn((n, r) => {
          let o = 0;
          n.subscribe(
            Zt(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function Yt(e) {
        return this instanceof Yt ? ((this.v = e), this) : new Yt(e);
      }
      function td(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function ra(e) {
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
      const nd = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function rd(e) {
        return ne(e?.then);
      }
      function od(e) {
        return ne(e[Ks]);
      }
      function id(e) {
        return Symbol.asyncIterator && ne(e?.[Symbol.asyncIterator]);
      }
      function sd(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const ad = (function N_() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function ud(e) {
        return ne(e?.[ad]);
      }
      function ld(e) {
        return (function ed(e, t, n) {
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
                f.value instanceof Yt
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
              const { value: r, done: o } = yield Yt(n.read());
              if (o) return yield Yt(void 0);
              yield yield Yt(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function cd(e) {
        return ne(e?.getReader);
      }
      function mt(e) {
        if (e instanceof be) return e;
        if (null != e) {
          if (od(e))
            return (function O_(e) {
              return new be((t) => {
                const n = e[Ks]();
                if (ne(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (nd(e))
            return (function x_(e) {
              return new be((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (rd(e))
            return (function F_(e) {
              return new be((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Wc);
              });
            })(e);
          if (id(e)) return dd(e);
          if (ud(e))
            return (function P_(e) {
              return new be((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (cd(e))
            return (function R_(e) {
              return dd(ld(e));
            })(e);
        }
        throw sd(e);
      }
      function dd(e) {
        return new be((t) => {
          (function k_(e, t) {
            var n, r, o, i;
            return (function Xc(e, t, n, r) {
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
                for (n = td(e); !(r = yield n.next()).done; )
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
      function Qt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function fd(e, t, n = 1 / 0) {
        return ne(t)
          ? fd((r, o) => Js((i, s) => t(r, i, o, s))(mt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            mn((r, o) =>
              (function L_(e, t, n, r, o, i, s, a) {
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
                    let v = !1;
                    mt(n(g, c++)).subscribe(
                      Zt(
                        t,
                        (_) => {
                          o?.(_), i ? h(_) : t.next(_);
                        },
                        () => {
                          v = !0;
                        },
                        void 0,
                        () => {
                          if (v)
                            try {
                              for (l--; u.length && l < r; ) {
                                const _ = u.shift();
                                s ? Qt(t, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              t.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Zt(t, h, () => {
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
      const hd = new be((e) => e.complete());
      function oa(e) {
        return e[e.length - 1];
      }
      function pd(e) {
        return (function B_(e) {
          return e && ne(e.schedule);
        })(oa(e))
          ? e.pop()
          : void 0;
      }
      function gd(e, t = 0) {
        return mn((n, r) => {
          n.subscribe(
            Zt(
              r,
              (o) => Qt(r, e, () => r.next(o), t),
              () => Qt(r, e, () => r.complete(), t),
              (o) => Qt(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function md(e, t = 0) {
        return mn((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function yd(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new be((n) => {
          Qt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Qt(
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
      function ia(e, t) {
        return t
          ? (function Z_(e, t) {
              if (null != e) {
                if (od(e))
                  return (function U_(e, t) {
                    return mt(e).pipe(md(t), gd(t));
                  })(e, t);
                if (nd(e))
                  return (function G_(e, t) {
                    return new be((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (rd(e))
                  return (function z_(e, t) {
                    return mt(e).pipe(md(t), gd(t));
                  })(e, t);
                if (id(e)) return yd(e, t);
                if (ud(e))
                  return (function q_(e, t) {
                    return new be((n) => {
                      let r;
                      return (
                        Qt(n, t, () => {
                          (r = e[ad]()),
                            Qt(
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
                        () => ne(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (cd(e))
                  return (function W_(e, t) {
                    return yd(ld(e), t);
                  })(e, t);
              }
              throw sd(e);
            })(e, t)
          : mt(e);
      }
      function Y_(...e) {
        const t = pd(e),
          n = (function $_(e, t) {
            return "number" == typeof oa(e) ? e.pop() : t;
          })(e, 1 / 0),
          r = e;
        return r.length
          ? 1 === r.length
            ? mt(r[0])
            : (function V_(e = 1 / 0) {
                return fd(Xs, e);
              })(n)(ia(r, t))
          : hd;
      }
      class Q_ extends zo {
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
      function vd(e = {}) {
        const {
          connector: t = () => new zo(),
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
          return mn((g, v) => {
            l++, !d && !c && f();
            const _ = (u = u ?? t());
            v.add(() => {
              l--, 0 === l && !d && !c && (a = sa(p, o));
            }),
              _.subscribe(v),
              !s &&
                l > 0 &&
                ((s = new Or({
                  next: (m) => _.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = sa(h, n, m)), _.error(m);
                  },
                  complete: () => {
                    (c = !0), f(), (a = sa(h, r)), _.complete();
                  },
                })),
                mt(g).subscribe(s));
          })(i);
        };
      }
      function sa(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new Or({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return mt(t(...n)).subscribe(r);
      }
      function eC(e, t) {
        return e === t;
      }
      function z(e) {
        for (let t in e) if (e[t] === z) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Go(e, t) {
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
      function aa(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const tC = z({ __forward_ref__: z });
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
        return ua(e) ? e() : e;
      }
      function ua(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(tC) &&
          e.__forward_ref__ === Y
        );
      }
      function la(e) {
        return e && !!e.ɵproviders;
      }
      class C extends Error {
        constructor(t, n) {
          super(
            (function qo(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function T(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function ca(e, t) {
        throw new C(-201, !1);
      }
      function Xe(e, t) {
        null == e &&
          (function I(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function q(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Nt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Wo(e) {
        return _d(e, Yo) || _d(e, Cd);
      }
      function _d(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Zo(e) {
        return e && (e.hasOwnProperty(da) || e.hasOwnProperty(uC))
          ? e[da]
          : null;
      }
      const Yo = z({ ɵprov: z }),
        da = z({ ɵinj: z }),
        Cd = z({ ngInjectableDef: z }),
        uC = z({ ngInjectorDef: z });
      var k = (function (e) {
        return (
          (e[(e.Default = 0)] = "Default"),
          (e[(e.Host = 1)] = "Host"),
          (e[(e.Self = 2)] = "Self"),
          (e[(e.SkipSelf = 4)] = "SkipSelf"),
          (e[(e.Optional = 8)] = "Optional"),
          e
        );
      })(k || {});
      let fa;
      function Le(e) {
        const t = fa;
        return (fa = e), t;
      }
      function Ed(e, t, n) {
        const r = Wo(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & k.Optional
          ? null
          : void 0 !== t
          ? t
          : void ca(de(e));
      }
      const Q = globalThis,
        xr = {},
        ya = "__NG_DI_FLAG__",
        Qo = "ngTempTokenPath",
        dC = /\n/gm,
        Id = "__source";
      let Pn;
      function Kt(e) {
        const t = Pn;
        return (Pn = e), t;
      }
      function pC(e, t = k.Default) {
        if (void 0 === Pn) throw new C(-203, !1);
        return null === Pn
          ? Ed(e, void 0, t)
          : Pn.get(e, t & k.Optional ? null : void 0, t);
      }
      function L(e, t = k.Default) {
        return (
          (function wd() {
            return fa;
          })() || pC
        )(A(e), t);
      }
      function W(e, t = k.Default) {
        return L(e, Ko(t));
      }
      function Ko(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function va(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = A(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = k.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = gC(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(L(o, i));
          } else t.push(L(r));
        }
        return t;
      }
      function Fr(e, t) {
        return (e[ya] = t), (e.prototype[ya] = t), e;
      }
      function gC(e) {
        return e[ya];
      }
      function Ot(e) {
        return { toString: e }.toString();
      }
      var Xo = (function (e) {
          return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
          );
        })(Xo || {}),
        it = (function (e) {
          return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
          );
        })(it || {});
      const yt = {},
        B = [],
        Jo = z({ ɵcmp: z }),
        Da = z({ ɵdir: z }),
        _a = z({ ɵpipe: z }),
        Sd = z({ ɵmod: z }),
        xt = z({ ɵfac: z }),
        Pr = z({ __NG_ELEMENT_ID__: z }),
        Ad = z({ __NG_ENV_ID__: z });
      function Td(e, t, n) {
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
      function Ca(e, t, n) {
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
            Od(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function Nd(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Od(e) {
        return 64 === e.charCodeAt(0);
      }
      function Rr(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  xd(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function xd(e, t, n, r, o) {
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
      const Fd = "ng-template";
      function vC(e, t, n) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (n && "class" === i && -1 !== Td(s.toLowerCase(), t, 0))
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
      function Pd(e) {
        return 4 === e.type && e.value !== Fd;
      }
      function DC(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Fd);
      }
      function _C(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function EC(e) {
            for (let t = 0; t < e.length; t++) if (Nd(e[t])) return t;
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
                  ("" !== u && !DC(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (st(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!vC(e.attrs, l, n)) {
                    if (st(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = CC(8 & r ? "class" : u, o, Pd(e), n);
                if (-1 === d) {
                  if (st(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Td(h, l, 0)) || (2 & r && l !== f)) {
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
      function CC(e, t, n, r) {
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
        return (function MC(e, t) {
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
      function Rd(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (_C(e, t[r], n)) return !0;
        return !1;
      }
      function kd(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function bC(e) {
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
            "" !== o && !st(s) && ((t += kd(i, o)), (o = "")),
              (r = s),
              (i = i || !st(r));
          n++;
        }
        return "" !== o && (t += kd(i, o)), t;
      }
      function wa(e) {
        return Ot(() => {
          const t = Vd(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Xo.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || it.Emulated,
              styles: e.styles || B,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          jd(n);
          const r = e.dependencies;
          return (
            (n.directiveDefs = ei(r, !1)),
            (n.pipeDefs = ei(r, !0)),
            (n.id = (function PC(e) {
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
      function NC(e) {
        return V(e) || ge(e);
      }
      function OC(e) {
        return null !== e;
      }
      function Xt(e) {
        return Ot(() => ({
          type: e.type,
          bootstrap: e.bootstrap || B,
          declarations: e.declarations || B,
          imports: e.imports || B,
          exports: e.exports || B,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Ld(e, t) {
        if (null == e) return yt;
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
      function O(e) {
        return Ot(() => {
          const t = Vd(e);
          return jd(t), t;
        });
      }
      function V(e) {
        return e[Jo] || null;
      }
      function ge(e) {
        return e[Da] || null;
      }
      function Se(e) {
        return e[_a] || null;
      }
      function Vd(e) {
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
          inputConfig: e.inputs || yt,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || B,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: Ld(e.inputs, t),
          outputs: Ld(e.outputs),
        };
      }
      function jd(e) {
        e.features?.forEach((t) => t(e));
      }
      function ei(e, t) {
        if (!e) return null;
        const n = t ? Se : NC;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => n(r)).filter(OC);
      }
      const oe = 0,
        w = 1,
        F = 2,
        ee = 3,
        at = 4,
        Lr = 5,
        De = 6,
        Rn = 7,
        ae = 8,
        Jt = 9,
        kn = 10,
        N = 11,
        Vr = 12,
        Bd = 13,
        Ln = 14,
        ue = 15,
        jr = 16,
        Vn = 17,
        vt = 18,
        Br = 19,
        Hd = 20,
        en = 21,
        Ft = 22,
        Hr = 23,
        $r = 24,
        P = 25,
        Ea = 1,
        $d = 2,
        Dt = 7,
        jn = 9,
        me = 11;
      function je(e) {
        return Array.isArray(e) && "object" == typeof e[Ea];
      }
      function Ae(e) {
        return Array.isArray(e) && !0 === e[Ea];
      }
      function Ma(e) {
        return 0 != (4 & e.flags);
      }
      function vn(e) {
        return e.componentOffset > -1;
      }
      function ni(e) {
        return 1 == (1 & e.flags);
      }
      function ut(e) {
        return !!e.template;
      }
      function Ia(e) {
        return 0 != (512 & e[F]);
      }
      function Dn(e, t) {
        return e.hasOwnProperty(xt) ? e[xt] : null;
      }
      let ye = null,
        ri = !1;
      function Je(e) {
        const t = ye;
        return (ye = e), t;
      }
      const Gd = {
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
      function Wd(e) {
        if (!zr(e) || e.dirty) {
          if (!e.producerMustRecompute(e) && !Qd(e)) return void (e.dirty = !1);
          e.producerRecomputeValue(e), (e.dirty = !1);
        }
      }
      function Yd(e) {
        (e.dirty = !0),
          (function Zd(e) {
            if (void 0 === e.liveConsumerNode) return;
            const t = ri;
            ri = !0;
            try {
              for (const n of e.liveConsumerNode) n.dirty || Yd(n);
            } finally {
              ri = t;
            }
          })(e),
          e.consumerMarkedDirty?.(e);
      }
      function Sa(e) {
        return e && (e.nextProducerIndex = 0), Je(e);
      }
      function Aa(e, t) {
        if (
          (Je(t),
          e &&
            void 0 !== e.producerNode &&
            void 0 !== e.producerIndexOfThis &&
            void 0 !== e.producerLastReadVersion)
        ) {
          if (zr(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
              oi(e.producerNode[n], e.producerIndexOfThis[n]);
          for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
              e.producerLastReadVersion.pop(),
              e.producerIndexOfThis.pop();
        }
      }
      function Qd(e) {
        Bn(e);
        for (let t = 0; t < e.producerNode.length; t++) {
          const n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
          if (r !== n.version || (Wd(n), r !== n.version)) return !0;
        }
        return !1;
      }
      function Kd(e) {
        if ((Bn(e), zr(e)))
          for (let t = 0; t < e.producerNode.length; t++)
            oi(e.producerNode[t], e.producerIndexOfThis[t]);
        (e.producerNode.length =
          e.producerLastReadVersion.length =
          e.producerIndexOfThis.length =
            0),
          e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
      }
      function oi(e, t) {
        if (
          ((function Jd(e) {
            (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
          })(e),
          Bn(e),
          1 === e.liveConsumerNode.length)
        )
          for (let r = 0; r < e.producerNode.length; r++)
            oi(e.producerNode[r], e.producerIndexOfThis[r]);
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
          Bn(o), (o.producerIndexOfThis[r] = t);
        }
      }
      function zr(e) {
        return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
      }
      function Bn(e) {
        (e.producerNode ??= []),
          (e.producerIndexOfThis ??= []),
          (e.producerLastReadVersion ??= []);
      }
      let ef = null;
      const of = () => {},
        WC = (() => ({
          ...Gd,
          consumerIsAlwaysLive: !0,
          consumerAllowSignalWrites: !1,
          consumerMarkedDirty: (e) => {
            e.schedule(e.ref);
          },
          hasRun: !1,
          cleanupFn: of,
        }))();
      class ZC {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Pt() {
        return sf;
      }
      function sf(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = QC), YC;
      }
      function YC() {
        const e = uf(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === yt) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function QC(e, t, n, r) {
        const o = this.declaredInputs[n],
          i =
            uf(e) ||
            (function KC(e, t) {
              return (e[af] = t);
            })(e, { previous: yt, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new ZC(u && u.currentValue, t, a === yt)), (e[r] = t);
      }
      Pt.ngInherit = !0;
      const af = "__ngSimpleChanges__";
      function uf(e) {
        return e[af] || null;
      }
      const _t = function (e, t, n) {};
      function K(e) {
        for (; Array.isArray(e); ) e = e[oe];
        return e;
      }
      function ii(e, t) {
        return K(t[e]);
      }
      function Be(e, t) {
        return K(t[e.index]);
      }
      function df(e, t) {
        return e.data[t];
      }
      function We(e, t) {
        const n = t[e];
        return je(n) ? n : n[oe];
      }
      function nn(e, t) {
        return null == t ? null : e[t];
      }
      function ff(e) {
        e[Vn] = 0;
      }
      function rw(e) {
        1024 & e[F] || ((e[F] |= 1024), pf(e, 1));
      }
      function hf(e) {
        1024 & e[F] && ((e[F] &= -1025), pf(e, -1));
      }
      function pf(e, t) {
        let n = e[ee];
        if (null === n) return;
        n[Lr] += t;
        let r = n;
        for (
          n = n[ee];
          null !== n && ((1 === t && 1 === r[Lr]) || (-1 === t && 0 === r[Lr]));

        )
          (n[Lr] += t), (r = n), (n = n[ee]);
      }
      const b = {
        lFrame: If(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function yf() {
        return b.bindingsEnabled;
      }
      function y() {
        return b.lFrame.lView;
      }
      function j() {
        return b.lFrame.tView;
      }
      function ve() {
        let e = vf();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function vf() {
        return b.lFrame.currentTNode;
      }
      function Ct(e, t) {
        const n = b.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Fa() {
        return b.lFrame.isParent;
      }
      function Un() {
        return b.lFrame.bindingIndex++;
      }
      function yw(e, t) {
        const n = b.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Ra(t);
      }
      function Ra(e) {
        b.lFrame.currentDirectiveIndex = e;
      }
      function La(e) {
        b.lFrame.currentQueryIndex = e;
      }
      function Dw(e) {
        const t = e[w];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[De] : null;
      }
      function Ef(e, t, n) {
        if (n & k.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & k.Host ||
              ((o = Dw(i)), null === o || ((i = i[Ln]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (b.lFrame = Mf());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Va(e) {
        const t = Mf(),
          n = e[w];
        (b.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Mf() {
        const e = b.lFrame,
          t = null === e ? null : e.child;
        return null === t ? If(e) : t;
      }
      function If(e) {
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
      function bf() {
        const e = b.lFrame;
        return (
          (b.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Sf = bf;
      function ja() {
        const e = bf();
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
      function Ne() {
        return b.lFrame.selectedIndex;
      }
      function _n(e) {
        b.lFrame.selectedIndex = e;
      }
      let Tf = !0;
      function si() {
        return Tf;
      }
      function rn(e) {
        Tf = e;
      }
      function ai(e, t) {
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
      function ui(e, t, n) {
        Nf(e, t, 3, n);
      }
      function li(e, t, n, r) {
        (3 & e[F]) === n && Nf(e, t, n, r);
      }
      function Ba(e, t) {
        let n = e[F];
        (3 & n) === t && ((n &= 8191), (n += 1), (e[F] = n));
      }
      function Nf(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[Vn] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[Vn] += 65536),
              (a < i || -1 == i) &&
                (Sw(e, n, t, u), (e[Vn] = (4294901760 & e[Vn]) + u + 2)),
              u++;
      }
      function Of(e, t) {
        _t(4, e, t);
        const n = Je(null);
        try {
          t.call(e);
        } finally {
          Je(n), _t(5, e, t);
        }
      }
      function Sw(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        o
          ? e[F] >> 13 < e[Vn] >> 16 &&
            (3 & e[F]) === t &&
            ((e[F] += 8192), Of(a, i))
          : Of(a, i);
      }
      const zn = -1;
      class qr {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function $a(e) {
        return e !== zn;
      }
      function Wr(e) {
        return 32767 & e;
      }
      function Zr(e, t) {
        let n = (function Ow(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[Ln]), n--;
        return r;
      }
      let Ua = !0;
      function ci(e) {
        const t = Ua;
        return (Ua = e), t;
      }
      const xf = 255,
        Ff = 5;
      let xw = 0;
      const wt = {};
      function di(e, t) {
        const n = Pf(e, t);
        if (-1 !== n) return n;
        const r = t[w];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          za(r.data, e),
          za(t, null),
          za(r.blueprint, null));
        const o = fi(e, t),
          i = e.injectorIndex;
        if ($a(o)) {
          const s = Wr(o),
            a = Zr(o, t),
            u = a[w].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function za(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Pf(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function fi(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = Hf(o)), null === r)) return zn;
          if ((n++, (o = o[Ln]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return zn;
      }
      function Ga(e, t, n) {
        !(function Fw(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Pr) && (r = n[Pr]),
            null == r && (r = n[Pr] = xw++);
          const o = r & xf;
          t.data[e + (o >> Ff)] |= 1 << o;
        })(e, t, n);
      }
      function Rf(e, t, n) {
        if (n & k.Optional || void 0 !== e) return e;
        ca();
      }
      function kf(e, t, n, r) {
        if (
          (n & k.Optional && void 0 === r && (r = null),
          !(n & (k.Self | k.Host)))
        ) {
          const o = e[Jt],
            i = Le(void 0);
          try {
            return o ? o.get(t, r, n & k.Optional) : Ed(t, r, n & k.Optional);
          } finally {
            Le(i);
          }
        }
        return Rf(r, 0, n);
      }
      function Lf(e, t, n, r = k.Default, o) {
        if (null !== e) {
          if (2048 & t[F] && !(r & k.Self)) {
            const s = (function jw(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 2048 & s[F] && !(512 & s[F]);

              ) {
                const a = Vf(i, s, n, r | k.Self, wt);
                if (a !== wt) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[Hd];
                  if (l) {
                    const c = l.get(n, wt, r);
                    if (c !== wt) return c;
                  }
                  (u = Hf(s)), (s = s[Ln]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, wt);
            if (s !== wt) return s;
          }
          const i = Vf(e, t, n, r, wt);
          if (i !== wt) return i;
        }
        return kf(t, n, r, o);
      }
      function Vf(e, t, n, r, o) {
        const i = (function kw(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Pr) ? e[Pr] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & xf : Vw) : t;
        })(n);
        if ("function" == typeof i) {
          if (!Ef(t, e, r)) return r & k.Host ? Rf(o, 0, r) : kf(t, n, r, o);
          try {
            let s;
            if (((s = i(r)), null != s || r & k.Optional)) return s;
            ca();
          } finally {
            Sf();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = Pf(e, t),
            u = zn,
            l = r & k.Host ? t[ue][De] : null;
          for (
            (-1 === a || r & k.SkipSelf) &&
            ((u = -1 === a ? fi(e, t) : t[a + 8]),
            u !== zn && Bf(r, !1)
              ? ((s = t[w]), (a = Wr(u)), (t = Zr(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[w];
            if (jf(i, a, c.data)) {
              const d = Rw(a, t, n, s, r, l);
              if (d !== wt) return d;
            }
            (u = t[a + 8]),
              u !== zn && Bf(r, t[w].data[a + 8] === l) && jf(i, a, t)
                ? ((s = c), (a = Wr(u)), (t = Zr(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function Rw(e, t, n, r, o, i) {
        const s = t[w],
          a = s.data[e + 8],
          c = (function hi(e, t, n, r, o) {
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
            null == r ? vn(a) && Ua : r != s && 0 != (3 & a.type),
            o & k.Host && i === a
          );
        return null !== c ? Cn(t, s, c, a) : wt;
      }
      function Cn(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function Aw(e) {
            return e instanceof qr;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function nC(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function U(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : T(e);
              })(i[n])
            );
          const a = ci(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Le(s.injectImpl) : null;
          Ef(e, r, k.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function bw(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = sf(t);
                    (n.preOrderHooks ??= []).push(e, s),
                      (n.preOrderCheckHooks ??= []).push(e, s);
                  }
                  o && (n.preOrderHooks ??= []).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks ??= []).push(e, i),
                      (n.preOrderCheckHooks ??= []).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== l && Le(l), ci(a), (s.resolving = !1), Sf();
          }
        }
        return o;
      }
      function jf(e, t, n) {
        return !!(n[t + (e >> Ff)] & (1 << e));
      }
      function Bf(e, t) {
        return !(e & k.Self || (e & k.Host && t));
      }
      class Oe {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return Lf(this._tNode, this._lView, t, Ko(r), n);
        }
      }
      function Vw() {
        return new Oe(ve(), y());
      }
      function _e(e) {
        return Ot(() => {
          const t = e.prototype.constructor,
            n = t[xt] || qa(t),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[xt] || qa(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function qa(e) {
        return ua(e)
          ? () => {
              const t = qa(A(e));
              return t && t();
            }
          : Dn(e);
      }
      function Hf(e) {
        const t = e[w],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[De] : null;
      }
      const qn = "__parameters__";
      function Zn(e, t, n) {
        return Ot(() => {
          const r = (function Za(e) {
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
              const d = u.hasOwnProperty(qn)
                ? u[qn]
                : Object.defineProperty(u, qn, { value: [] })[qn];
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
      function Qn(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Qn(n, t) : t(n)));
      }
      function Uf(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function pi(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function Ze(e, t, n) {
        let r = Kn(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function qw(e, t, n, r) {
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
      function Ya(e, t) {
        const n = Kn(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Kn(e, t) {
        return (function zf(e, t, n) {
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
      const Ka = Fr(Zn("Optional"), 8),
        Xa = Fr(Zn("SkipSelf"), 4);
      function _i(e) {
        return 128 == (128 & e.flags);
      }
      var on = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(on || {});
      const nu = new Map();
      let mE = 0;
      const ou = "__ngContext__";
      function Ce(e, t) {
        je(t)
          ? ((e[ou] = t[Br]),
            (function vE(e) {
              nu.set(e[Br], e);
            })(t))
          : (e[ou] = t);
      }
      let iu;
      function su(e, t) {
        return iu(e, t);
      }
      function eo(e) {
        const t = e[ee];
        return Ae(t) ? t[ee] : t;
      }
      function ch(e) {
        return fh(e[Vr]);
      }
      function dh(e) {
        return fh(e[at]);
      }
      function fh(e) {
        for (; null !== e && !Ae(e); ) e = e[at];
        return e;
      }
      function er(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          Ae(r) ? (i = r) : je(r) && ((s = !0), (r = r[oe]));
          const a = K(r);
          0 === e && null !== n
            ? null == o
              ? mh(t, n, a)
              : wn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? wn(t, n, a, o || null, !0)
            : 2 === e
            ? (function Si(e, t, n) {
                const r = Ii(e, t);
                r &&
                  (function LE(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function BE(e, t, n, r, o) {
                const i = n[Dt];
                i !== K(n) && er(t, e, r, i, o);
                for (let a = me; a < n.length; a++) {
                  const u = n[a];
                  no(u[w], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function Ei(e, t, n) {
        return e.createElement(t, n);
      }
      function ph(e, t) {
        const n = e[jn],
          r = n.indexOf(t);
        hf(t), n.splice(r, 1);
      }
      function Mi(e, t) {
        if (e.length <= me) return;
        const n = me + t,
          r = e[n];
        if (r) {
          const o = r[jr];
          null !== o && o !== e && ph(o, r), t > 0 && (e[n - 1][at] = r[at]);
          const i = pi(e, me + t);
          !(function TE(e, t) {
            no(e, t, t[N], 2, null, null), (t[oe] = null), (t[De] = null);
          })(r[w], r);
          const s = i[vt];
          null !== s && s.detachView(i[w]),
            (r[ee] = null),
            (r[at] = null),
            (r[F] &= -129);
        }
        return r;
      }
      function uu(e, t) {
        if (!(256 & t[F])) {
          const n = t[N];
          t[Hr] && Kd(t[Hr]),
            t[$r] && Kd(t[$r]),
            n.destroyNode && no(e, t, n, 3, null, null),
            (function xE(e) {
              let t = e[Vr];
              if (!t) return lu(e[w], e);
              for (; t; ) {
                let n = null;
                if (je(t)) n = t[Vr];
                else {
                  const r = t[me];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[at] && t !== e; )
                    je(t) && lu(t[w], t), (t = t[ee]);
                  null === t && (t = e), je(t) && lu(t[w], t), (n = t && t[at]);
                }
                t = n;
              }
            })(t);
        }
      }
      function lu(e, t) {
        if (!(256 & t[F])) {
          (t[F] &= -129),
            (t[F] |= 256),
            (function kE(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof qr)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        _t(4, a, u);
                        try {
                          u.call(a);
                        } finally {
                          _t(5, a, u);
                        }
                      }
                    else {
                      _t(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        _t(5, o, i);
                      }
                    }
                  }
                }
            })(e, t),
            (function RE(e, t) {
              const n = e.cleanup,
                r = t[Rn];
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else n[i].call(r[n[i + 1]]);
              null !== r && (t[Rn] = null);
              const o = t[en];
              if (null !== o) {
                t[en] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(e, t),
            1 === t[w].type && t[N].destroy();
          const n = t[jr];
          if (null !== n && Ae(t[ee])) {
            n !== t[ee] && ph(n, t);
            const r = t[vt];
            null !== r && r.detachView(e);
          }
          !(function DE(e) {
            nu.delete(e[Br]);
          })(t);
        }
      }
      function cu(e, t, n) {
        return (function gh(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[oe];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === it.None || i === it.Emulated) return null;
            }
            return Be(r, n);
          }
        })(e, t.parent, n);
      }
      function wn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function mh(e, t, n) {
        e.appendChild(t, n);
      }
      function yh(e, t, n, r, o) {
        null !== r ? wn(e, t, n, r, o) : mh(e, t, n);
      }
      function Ii(e, t) {
        return e.parentNode(t);
      }
      let du,
        gu,
        _h = function Dh(e, t, n) {
          return 40 & e.type ? Be(e, n) : null;
        };
      function bi(e, t, n, r) {
        const o = cu(e, r, t),
          i = t[N],
          a = (function vh(e, t, n) {
            return _h(e, t, n);
          })(r.parent || t[De], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) yh(i, o, n[u], a, !1);
          else yh(i, o, n, a, !1);
        void 0 !== du && du(i, r, t, n, o);
      }
      function to(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return Be(t, e);
          if (4 & n) return fu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return to(e, r);
            {
              const o = e[t.index];
              return Ae(o) ? fu(-1, o) : K(o);
            }
          }
          if (32 & n) return su(t, e)() || K(e[t.index]);
          {
            const r = wh(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : to(eo(e[ue]), r)
              : to(e, t.next);
          }
        }
        return null;
      }
      function wh(e, t) {
        return null !== t ? e[ue][De].projection[t.projection] : null;
      }
      function fu(e, t) {
        const n = me + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[w].firstChild;
          if (null !== o) return to(r, o);
        }
        return t[Dt];
      }
      function hu(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && Ce(K(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & u) hu(e, t, n.child, r, o, i, !1), er(t, e, o, a, i);
            else if (32 & u) {
              const l = su(n, r);
              let c;
              for (; (c = l()); ) er(t, e, o, c, i);
              er(t, e, o, a, i);
            } else 16 & u ? Mh(e, t, r, n, o, i) : er(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function no(e, t, n, r, o, i) {
        hu(n, r, e.firstChild, t, o, i, !1);
      }
      function Mh(e, t, n, r, o, i) {
        const s = n[ue],
          u = s[De].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) er(t, e, o, u[l], i);
        else {
          let l = u;
          const c = s[ee];
          _i(r) && (l.flags |= 128), hu(e, t, l, c, o, i, !0);
        }
      }
      function Ih(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function bh(e, t, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && Ca(e, t, r),
          null !== o && Ih(e, t, o),
          null !== i &&
            (function $E(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, i);
      }
      class Nh {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      class M {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = q({
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
      const Oi = new M("ENVIRONMENT_INITIALIZER"),
        jh = new M("INJECTOR", -1),
        Bh = new M("INJECTOR_DEF_TYPES");
      class Cu {
        get(t, n = xr) {
          if (n === xr) {
            const r = new Error(`NullInjectorError: No provider for ${de(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function mM(...e) {
        return { ɵproviders: $h(0, e), ɵfromNgModule: !0 };
      }
      function $h(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        const i = (s) => {
          n.push(s);
        };
        return (
          Qn(t, (s) => {
            const a = s;
            xi(a, i, [], r) && ((o ||= []), o.push(a));
          }),
          void 0 !== o && Uh(o, i),
          n
        );
      }
      function Uh(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { ngModule: r, providers: o } = e[n];
          wu(o, (i) => {
            t(i, r);
          });
        }
      }
      function xi(e, t, n, r) {
        if (!(e = A(e))) return !1;
        let o = null,
          i = Zo(e);
        const s = !i && V(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = Zo(u)), !i)) return !1;
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
            for (const l of u) xi(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                Qn(i.imports, (c) => {
                  xi(c, t, n, r) && ((l ||= []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && Uh(l, t);
            }
            if (!a) {
              const l = Dn(o) || (() => new o());
              t({ provide: o, useFactory: l, deps: B }, o),
                t({ provide: Bh, useValue: o, multi: !0 }, o),
                t({ provide: Oi, useValue: () => L(o), multi: !0 }, o);
            }
            const u = i.providers;
            if (null != u && !a) {
              const l = e;
              wu(u, (c) => {
                t(c, l);
              });
            }
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function wu(e, t) {
        for (let n of e)
          la(n) && (n = n.ɵproviders), Array.isArray(n) ? wu(n, t) : t(n);
      }
      const yM = z({ provide: String, useValue: z });
      function Eu(e) {
        return null !== e && "object" == typeof e && yM in e;
      }
      function En(e) {
        return "function" == typeof e;
      }
      const Mu = new M("Set Injector scope."),
        Fi = {},
        DM = {};
      let Iu;
      function Pi() {
        return void 0 === Iu && (Iu = new Cu()), Iu;
      }
      class Vt {}
      class Ri extends Vt {
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
            Su(t, (s) => this.processProvider(s)),
            this.records.set(jh, or(void 0, this)),
            o.has("environment") && this.records.set(Vt, or(void 0, this));
          const i = this.records.get(Mu);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Bh.multi, B, k.Self)));
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
          const n = Kt(this),
            r = Le(void 0);
          try {
            return t();
          } finally {
            Kt(n), Le(r);
          }
        }
        get(t, n = xr, r = k.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(Ad)))
            return t[Ad](this);
          r = Ko(r);
          const i = Kt(this),
            s = Le(void 0);
          try {
            if (!(r & k.SkipSelf)) {
              let u = this.records.get(t);
              if (void 0 === u) {
                const l =
                  (function MM(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof M)
                    );
                  })(t) && Wo(t);
                (u = l && this.injectableDefInScope(l) ? or(bu(t), Fi) : null),
                  this.records.set(t, u);
              }
              if (null != u) return this.hydrate(t, u);
            }
            return (r & k.Self ? Pi() : this.parent).get(
              t,
              (n = r & k.Optional && n === xr ? null : n)
            );
          } catch (a) {
            if ("NullInjectorError" === a.name) {
              if (((a[Qo] = a[Qo] || []).unshift(de(t)), i)) throw a;
              return (function mC(e, t, n, r) {
                const o = e[Qo];
                throw (
                  (t[Id] && o.unshift(t[Id]),
                  (e.message = (function yC(e, t, n, r = null) {
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
                      dC,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[Qo] = null),
                  e)
                );
              })(a, t, "R3InjectorError", this.source);
            }
            throw a;
          } finally {
            Le(s), Kt(i);
          }
        }
        resolveInjectorInitializers() {
          const t = Kt(this),
            n = Le(void 0);
          try {
            const o = this.get(Oi.multi, B, k.Self);
            for (const i of o) i();
          } finally {
            Kt(t), Le(n);
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
          let n = En((t = A(t))) ? t : A(t && t.provide);
          const r = (function CM(e) {
            return Eu(e) ? or(void 0, e.useValue) : or(qh(e), Fi);
          })(t);
          if (En(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = or(void 0, Fi, !0)),
              (o.factory = () => va(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === Fi && ((n.value = DM), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function EM(e) {
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
      function bu(e) {
        const t = Wo(e),
          n = null !== t ? t.factory : Dn(e);
        if (null !== n) return n;
        if (e instanceof M) throw new C(204, !1);
        if (e instanceof Function)
          return (function _M(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Kr(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function aC(e) {
              return (e && (e[Yo] || e[Cd])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function qh(e, t, n) {
        let r;
        if (En(e)) {
          const o = A(e);
          return Dn(o) || bu(o);
        }
        if (Eu(e)) r = () => A(e.useValue);
        else if (
          (function Gh(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...va(e.deps || []));
        else if (
          (function zh(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => L(A(e.useExisting));
        else {
          const o = A(e && (e.useClass || e.provide));
          if (
            !(function wM(e) {
              return !!e.deps;
            })(e)
          )
            return Dn(o) || bu(o);
          r = () => new o(...va(e.deps));
        }
        return r;
      }
      function or(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Su(e, t) {
        for (const n of e)
          Array.isArray(n) ? Su(n, t) : n && la(n) ? Su(n.ɵproviders, t) : t(n);
      }
      const ki = new M("AppId", { providedIn: "root", factory: () => IM }),
        IM = "ng",
        Wh = new M("Platform Initializer"),
        ir = new M("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        Zh = new M("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function nr() {
              if (void 0 !== gu) return gu;
              if (typeof document < "u") return document;
              throw new C(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let Yh = (e, t, n) => null;
      function Ru(e, t, n = !1) {
        return Yh(e, t, n);
      }
      class RM {}
      class Xh {}
      class LM {
        resolveComponentFactory(t) {
          throw (function kM(e) {
            const t = Error(`No component factory found for ${de(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let $i = (() => {
        class e {
          static #e = (this.NULL = new LM());
        }
        return e;
      })();
      function VM() {
        return ur(ve(), y());
      }
      function ur(e, t) {
        return new lt(Be(e, t));
      }
      let lt = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
          static #e = (this.__NG_ELEMENT_ID__ = VM);
        }
        return e;
      })();
      class ep {}
      let Mn = (() => {
          class e {
            constructor() {
              this.destroyNode = null;
            }
            static #e = (this.__NG_ELEMENT_ID__ = () =>
              (function BM() {
                const e = y(),
                  n = We(ve().index, e);
                return (je(n) ? n : e)[N];
              })());
          }
          return e;
        })(),
        HM = (() => {
          class e {
            static #e = (this.ɵprov = q({
              token: e,
              providedIn: "root",
              factory: () => null,
            }));
          }
          return e;
        })();
      class Ui {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const $M = new Ui("16.2.8"),
        Vu = {};
      function op(e, t = null, n = null, r) {
        const o = ip(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function ip(e, t = null, n = null, r, o = new Set()) {
        const i = [n || B, mM(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : de(e))),
          new Ri(i, t || Pi(), r || null, o)
        );
      }
      let ct = (() => {
        class e {
          static #e = (this.THROW_IF_NOT_FOUND = xr);
          static #t = (this.NULL = new Cu());
          static create(n, r) {
            if (Array.isArray(n)) return op({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return op({ name: o }, n.parent, n.providers, o);
            }
          }
          static #n = (this.ɵprov = q({
            token: e,
            providedIn: "any",
            factory: () => L(jh),
          }));
          static #r = (this.__NG_ELEMENT_ID__ = -1);
        }
        return e;
      })();
      function Bu(e) {
        return e.ngOriginalError;
      }
      class jt {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Bu(t);
          for (; n && Bu(n); ) n = Bu(n);
          return n || null;
        }
      }
      function $u(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const we = class YM extends zo {
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
          this.__isAsync && ((i = $u(i)), o && (o = $u(o)), s && (s = $u(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof gt && t.add(a), a;
        }
      };
      function ap(...e) {}
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
            (this.onUnstable = new we(!1)),
            (this.onMicrotaskEmpty = new we(!1)),
            (this.onStable = new we(!1)),
            (this.onError = new we(!1)),
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
            (o.nativeRequestAnimationFrame = (function QM() {
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
            (function JM(e) {
              const t = () => {
                !(function XM(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(Q, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                zu(e),
                                (e.isCheckStableRunning = !0),
                                Uu(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    zu(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  if (
                    (function tI(e) {
                      return (
                        !(!Array.isArray(e) || 1 !== e.length) &&
                        !0 === e[0].data?.__ignore_ng_zone__
                      );
                    })(a)
                  )
                    return n.invokeTask(o, i, s, a);
                  try {
                    return up(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      lp(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return up(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), lp(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          zu(e),
                          Uu(e))
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
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, KM, ap, ap);
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
      const KM = {};
      function Uu(e) {
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
      function zu(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function up(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function lp(e) {
        e._nesting--, Uu(e);
      }
      class eI {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new we()),
            (this.onMicrotaskEmpty = new we()),
            (this.onStable = new we()),
            (this.onError = new we());
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
      const cp = new M("", { providedIn: "root", factory: dp });
      function dp() {
        const e = W(ie);
        let t = !0;
        return Y_(
          new be((o) => {
            (t =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                o.next(t), o.complete();
              });
          }),
          new be((o) => {
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
          }).pipe(vd())
        );
      }
      let Gu = (() => {
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
          static #e = (this.ɵprov = q({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function uo(e) {
        for (; e; ) {
          e[F] |= 64;
          const t = eo(e);
          if (Ia(e) && !t) return e;
          e = t;
        }
        return null;
      }
      const mp = new M("", { providedIn: "root", factory: () => !1 });
      let Gi = null;
      function _p(e, t) {
        return e[t] ?? Ep();
      }
      function Cp(e, t) {
        const n = Ep();
        n.producerNode?.length && ((e[t] = Gi), (n.lView = e), (Gi = wp()));
      }
      const dI = {
        ...Gd,
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
          uo(e.lView);
        },
        lView: null,
      };
      function wp() {
        return Object.create(dI);
      }
      function Ep() {
        return (Gi ??= wp()), Gi;
      }
      const x = {};
      function xe(e) {
        Mp(j(), y(), Ne() + e, !1);
      }
      function Mp(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[F])) {
            const i = e.preOrderCheckHooks;
            null !== i && ui(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && li(t, i, 0, n);
          }
        _n(n);
      }
      function D(e, t = k.Default) {
        const n = y();
        return null === n ? L(e, t) : Lf(ve(), n, A(e), t);
      }
      function qi(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[oe] = o),
          (d[F] = 140 | r),
          (null !== l || (e && 2048 & e[F])) && (d[F] |= 2048),
          ff(d),
          (d[ee] = d[Ln] = e),
          (d[ae] = n),
          (d[kn] = s || (e && e[kn])),
          (d[N] = a || (e && e[N])),
          (d[Jt] = u || (e && e[Jt]) || null),
          (d[De] = i),
          (d[Br] = (function yE() {
            return mE++;
          })()),
          (d[Ft] = c),
          (d[Hd] = l),
          (d[ue] = 2 == t.type ? e[ue] : d),
          d
        );
      }
      function dr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function qu(e, t, n, r, o) {
            const i = vf(),
              s = Fa(),
              u = (e.data[t] = (function _I(e, t, n, r, o, i) {
                let s = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  (function $n() {
                    return null !== b.skipHydrationRootTNode;
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
            (function mw() {
              return b.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Gr() {
            const e = b.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Ct(i, !0), i;
      }
      function lo(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Ip(e, t, n, r, o) {
        const i = _p(t, Hr),
          s = Ne(),
          a = 2 & r;
        try {
          _n(-1), a && t.length > P && Mp(e, t, P, !1), _t(a ? 2 : 0, o);
          const l = a ? i : null,
            c = Sa(l);
          try {
            null !== l && (l.dirty = !1), n(r, o);
          } finally {
            Aa(l, c);
          }
        } finally {
          a && null === t[Hr] && Cp(t, Hr), _n(s), _t(a ? 3 : 1, o);
        }
      }
      function Wu(e, t, n) {
        if (Ma(t)) {
          const r = Je(null);
          try {
            const i = t.directiveEnd;
            for (let s = t.directiveStart; s < i; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            Je(r);
          }
        }
      }
      function Zu(e, t, n) {
        yf() &&
          ((function SI(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            vn(n) &&
              (function PI(e, t, n) {
                const r = Be(t, e),
                  o = bp(n);
                let s = 16;
                n.signals ? (s = 4096) : n.onPush && (s = 64);
                const a = Wi(
                  e,
                  qi(
                    e,
                    o,
                    null,
                    s,
                    r,
                    t,
                    null,
                    e[kn].rendererFactory.createRenderer(r, n),
                    null,
                    null,
                    null
                  )
                );
                e[t.index] = a;
              })(t, n, e.data[o + n.componentOffset]),
              e.firstCreatePass || di(n, t),
              Ce(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                l = Cn(t, e, a, n);
              Ce(l, t),
                null !== s && RI(0, a - o, l, u, 0, s),
                ut(u) && (We(n.index, t)[ae] = Cn(t, e, a, n));
            }
          })(e, t, n, Be(n, t)),
          64 == (64 & n.flags) && Op(e, t, n));
      }
      function Yu(e, t, n = Be) {
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
      function bp(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Qu(
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
      function Qu(e, t, n, r, o, i, s, a, u, l, c) {
        const d = P + r,
          f = d + o,
          h = (function pI(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : x);
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
      let Sp = (e) => null;
      function Ap(e, t, n, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = e[o];
            null === r
              ? Tp(n, t, o, i)
              : r.hasOwnProperty(o) && Tp(n, t, r[o], i);
          }
        return n;
      }
      function Tp(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function Ku(e, t, n, r) {
        if (yf()) {
          const o = null === r ? null : { "": -1 },
            i = (function TI(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if (Rd(t, s.selectors, !1))
                    if ((r || (r = []), ut(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          Xu(e, t, a.length);
                      } else r.unshift(s), Xu(e, t, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, n);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Np(e, t, n, s, o, a),
            o &&
              (function NI(e, t, n) {
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
        n.mergedAttrs = Rr(n.mergedAttrs, n.attrs);
      }
      function Np(e, t, n, r, o, i) {
        for (let l = 0; l < r.length; l++) Ga(di(n, t), e, r[l].type);
        !(function xI(e, t, n) {
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
          u = lo(e, t, r.length, null);
        for (let l = 0; l < r.length; l++) {
          const c = r[l];
          (n.mergedAttrs = Rr(n.mergedAttrs, c.hostAttrs)),
            FI(e, n, t, u, c),
            OI(u, c, o),
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
        !(function CI(e, t, n) {
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
            (u = Ap(d.inputs, c, u, f ? f.inputs : null)),
              (l = Ap(d.outputs, c, l, p));
            const g = null === u || null === s || Pd(t) ? null : kI(u, c, s);
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
      function Op(e, t, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function vw() {
            return b.lFrame.currentDirectiveIndex;
          })();
        try {
          _n(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              l = t[a];
            Ra(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                AI(u, l);
          }
        } finally {
          _n(-1), Ra(s);
        }
      }
      function AI(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Xu(e, t, n) {
        (t.componentOffset = n), (e.components ??= []).push(t.index);
      }
      function OI(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          ut(t) && (n[""] = e);
        }
      }
      function FI(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Dn(o.type)),
          s = new qr(i, ut(o), D);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function II(e, t, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function bI(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(e, t, r, lo(e, n, o.hostVars, x), o);
      }
      function RI(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s)
          for (let a = 0; a < s.length; ) xp(r, n, s[a++], s[a++], s[a++]);
      }
      function xp(e, t, n, r, o) {
        const i = Je(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(t, o)),
            null !== e.setInput ? e.setInput(t, o, n, r) : (t[r] = o);
        } finally {
          Je(i);
        }
      }
      function kI(e, t, n) {
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
      function Fp(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null, null];
      }
      function Pp(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              La(n[r]), s.contentQueries(2, t[i], i);
            }
          }
      }
      function Wi(e, t) {
        return e[Vr] ? (e[Bd][at] = t) : (e[Vr] = t), (e[Bd] = t), t;
      }
      function el(e, t, n) {
        La(0);
        const r = Je(null);
        try {
          t(e, n);
        } finally {
          Je(r);
        }
      }
      function Vp(e, t) {
        const n = e[Jt],
          r = n ? n.get(jt, null) : null;
        r && r.handleError(t);
      }
      function tl(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++];
          xp(e.data[s], t[s], r, a, o);
        }
      }
      function LI(e, t) {
        const n = We(t, e),
          r = n[w];
        !(function VI(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n);
        const o = n[oe];
        null !== o && null === n[Ft] && (n[Ft] = Ru(o, n[Jt])), nl(r, n, n[ae]);
      }
      function nl(e, t, n) {
        Va(t);
        try {
          const r = e.viewQuery;
          null !== r && el(1, r, n);
          const o = e.template;
          null !== o && Ip(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && Pp(e, t),
            e.staticViewQueries && el(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function jI(e, t) {
              for (let n = 0; n < t.length; n++) LI(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[F] &= -5), ja();
        }
      }
      let jp = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = (function qC(e, t, n) {
                const r = Object.create(WC);
                n && (r.consumerAllowSignalWrites = !0),
                  (r.fn = e),
                  (r.schedule = t);
                const o = (s) => {
                  r.cleanupFn = s;
                };
                return (
                  (r.ref = {
                    notify: () => Yd(r),
                    run: () => {
                      if (((r.dirty = !1), r.hasRun && !Qd(r))) return;
                      r.hasRun = !0;
                      const s = Sa(r);
                      try {
                        r.cleanupFn(), (r.cleanupFn = of), r.fn(o);
                      } finally {
                        Aa(r, s);
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
          static #e = (this.ɵprov = q({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function Zi(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = aa(o, a))
              : 2 == i && (r = aa(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function co(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          null !== i && r.push(K(i)), Ae(i) && Bp(i, r);
          const s = n.type;
          if (8 & s) co(e, t, n.child, r);
          else if (32 & s) {
            const a = su(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = wh(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = eo(t[ue]);
              co(u[w], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      function Bp(e, t) {
        for (let n = me; n < e.length; n++) {
          const r = e[n],
            o = r[w].firstChild;
          null !== o && co(r[w], r, o, t);
        }
        e[Dt] !== e[oe] && t.push(e[Dt]);
      }
      function Yi(e, t, n, r = !0) {
        const o = t[kn],
          i = o.rendererFactory,
          s = o.afterRenderEventManager;
        i.begin?.(), s?.begin();
        try {
          Hp(e, t, e.template, n);
        } catch (u) {
          throw (r && Vp(t, u), u);
        } finally {
          i.end?.(), o.effectManager?.flush(), s?.end();
        }
      }
      function Hp(e, t, n, r) {
        const o = t[F];
        if (256 != (256 & o)) {
          t[kn].effectManager?.flush(), Va(t);
          try {
            ff(t),
              (function _f(e) {
                return (b.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && Ip(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && ui(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && li(t, l, 0, null), Ba(t, 0);
            }
            if (
              ((function $I(e) {
                for (let t = ch(e); null !== t; t = dh(t)) {
                  if (!t[$d]) continue;
                  const n = t[jn];
                  for (let r = 0; r < n.length; r++) {
                    rw(n[r]);
                  }
                }
              })(t),
              $p(t, 2),
              null !== e.contentQueries && Pp(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && ui(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && li(t, l, 1), Ba(t, 1);
            }
            !(function hI(e, t) {
              const n = e.hostBindingOpCodes;
              if (null === n) return;
              const r = _p(t, $r);
              try {
                for (let o = 0; o < n.length; o++) {
                  const i = n[o];
                  if (i < 0) _n(~i);
                  else {
                    const s = i,
                      a = n[++o],
                      u = n[++o];
                    yw(a, s), (r.dirty = !1);
                    const l = Sa(r);
                    try {
                      u(2, t[s]);
                    } finally {
                      Aa(r, l);
                    }
                  }
                }
              } finally {
                null === t[$r] && Cp(t, $r), _n(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a && zp(t, a, 0);
            const u = e.viewQuery;
            if ((null !== u && el(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && ui(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && li(t, l, 2), Ba(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[F] &= -73),
              hf(t);
          } finally {
            ja();
          }
        }
      }
      function $p(e, t) {
        for (let n = ch(e); null !== n; n = dh(n))
          for (let r = me; r < n.length; r++) Up(n[r], t);
      }
      function UI(e, t, n) {
        Up(We(t, e), n);
      }
      function Up(e, t) {
        if (
          !(function tw(e) {
            return 128 == (128 & e[F]);
          })(e)
        )
          return;
        const n = e[w],
          r = e[F];
        if ((80 & r && 0 === t) || 1024 & r || 2 === t)
          Hp(n, e, n.template, e[ae]);
        else if (e[Lr] > 0) {
          $p(e, 1);
          const o = n.components;
          null !== o && zp(e, o, 1);
        }
      }
      function zp(e, t, n) {
        for (let r = 0; r < t.length; r++) UI(e, t[r], n);
      }
      class fo {
        get rootNodes() {
          const t = this._lView,
            n = t[w];
          return co(n, t, n.firstChild, []);
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
            const t = this._lView[ee];
            if (Ae(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (Mi(t, r), pi(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          uu(this._lView[w], this._lView);
        }
        onDestroy(t) {
          !(function gf(e, t) {
            if (256 == (256 & e[F])) throw new C(911, !1);
            null === e[en] && (e[en] = []), e[en].push(t);
          })(this._lView, t);
        }
        markForCheck() {
          uo(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[F] &= -129;
        }
        reattach() {
          this._lView[F] |= 128;
        }
        detectChanges() {
          Yi(this._lView[w], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function OE(e, t) {
              no(e, t, t[N], 2, null, null);
            })(this._lView[w], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class zI extends fo {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          Yi(t[w], t, t[ae], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Gp extends $i {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = V(t);
          return new ho(n, this.ngModule);
        }
      }
      function qp(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class qI {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = Ko(r);
          const o = this.injector.get(t, Vu, r);
          return o !== Vu || n === Vu ? o : this.parentInjector.get(t, n, r);
        }
      }
      class ho extends Xh {
        get inputs() {
          const t = this.componentDef,
            n = t.inputTransforms,
            r = qp(t.inputs);
          if (null !== n)
            for (const o of r)
              n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
          return r;
        }
        get outputs() {
          return qp(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function SC(e) {
              return e.map(bC).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof Vt ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new qI(t, i) : t,
            a = s.get(ep, null);
          if (null === a) throw new C(407, !1);
          const d = {
              rendererFactory: a,
              sanitizer: s.get(HM, null),
              effectManager: s.get(jp, null),
              afterRenderEventManager: s.get(Gu, null),
            },
            f = a.createRenderer(null, this.componentDef),
            h = this.componentDef.selectors[0][0] || "div",
            p = r
              ? (function gI(e, t, n, r) {
                  const i = r.get(mp, !1) || n === it.ShadowDom,
                    s = e.selectRootElement(t, i);
                  return (
                    (function mI(e) {
                      Sp(e);
                    })(s),
                    s
                  );
                })(f, r, this.componentDef.encapsulation, s)
              : Ei(
                  f,
                  h,
                  (function GI(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(h)
                ),
            _ = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528;
          let m = null;
          null !== p && (m = Ru(p, s, !0));
          const E = Qu(0, null, null, 1, 0, null, null, null, null, null, null),
            S = qi(null, E, null, _, null, null, d, f, s, null, m);
          let R, ze;
          Va(S);
          try {
            const Wt = this.componentDef;
            let Tr,
              Uc = null;
            Wt.findHostDirectiveDefs
              ? ((Tr = []),
                (Uc = new Map()),
                Wt.findHostDirectiveDefs(Wt, Tr, Uc),
                Tr.push(Wt))
              : (Tr = [Wt]);
            const Qx = (function ZI(e, t) {
                const n = e[w],
                  r = P;
                return (e[r] = t), dr(n, r, 2, "#host", null);
              })(S, p),
              Kx = (function YI(e, t, n, r, o, i, s) {
                const a = o[w];
                !(function QI(e, t, n, r) {
                  for (const o of e)
                    t.mergedAttrs = Rr(t.mergedAttrs, o.hostAttrs);
                  null !== t.mergedAttrs &&
                    (Zi(t, t.mergedAttrs, !0), null !== n && bh(r, n, t));
                })(r, e, t, s);
                let u = null;
                null !== t && (u = Ru(t, o[Jt]));
                const l = i.rendererFactory.createRenderer(t, n);
                let c = 16;
                n.signals ? (c = 4096) : n.onPush && (c = 64);
                const d = qi(
                  o,
                  bp(n),
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
                  a.firstCreatePass && Xu(a, e, r.length - 1),
                  Wi(o, d),
                  (o[e.index] = d)
                );
              })(Qx, p, Wt, Tr, S, d, f);
            (ze = df(E, P)),
              p &&
                (function XI(e, t, n, r) {
                  if (r) Ca(e, n, ["ng-version", $M.full]);
                  else {
                    const { attrs: o, classes: i } = (function AC(e) {
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
                    o && Ca(e, n, o),
                      i && i.length > 0 && Ih(e, n, i.join(" "));
                  }
                })(f, Wt, p, r),
              void 0 !== n &&
                (function JI(e, t, n) {
                  const r = (e.projection = []);
                  for (let o = 0; o < t.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(ze, this.ngContentSelectors, n),
              (R = (function KI(e, t, n, r, o, i) {
                const s = ve(),
                  a = o[w],
                  u = Be(s, o);
                Np(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  Ce(Cn(o, a, s.directiveStart + c, s), o);
                Op(a, o, s), u && Ce(u, o);
                const l = Cn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ae] = o[ae] = l), null !== i))
                  for (const c of i) c(l, t);
                return Wu(a, s, e), l;
              })(Kx, Wt, Tr, Uc, S, [eb])),
              nl(E, S, null);
          } finally {
            ja();
          }
          return new WI(this.componentType, R, ur(ze, S), S, ze);
        }
      }
      class WI extends RM {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new zI(o)),
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
            tl(i[w], i, o, t, n),
              this.previousInputValues.set(t, n),
              uo(We(this._tNode.index, i));
          }
        }
        get injector() {
          return new Oe(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function eb() {
        const e = ve();
        ai(y()[w], e);
      }
      function G(e) {
        let t = (function Wp(e) {
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
              (s.inputs = Qi(e.inputs)),
                (s.inputTransforms = Qi(e.inputTransforms)),
                (s.declaredInputs = Qi(e.declaredInputs)),
                (s.outputs = Qi(e.outputs));
              const a = o.hostBindings;
              a && ob(e, a);
              const u = o.viewQuery,
                l = o.contentQueries;
              if (
                (u && nb(e, u),
                l && rb(e, l),
                Go(e.inputs, o.inputs),
                Go(e.declaredInputs, o.declaredInputs),
                Go(e.outputs, o.outputs),
                null !== o.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  Go(s.inputTransforms, o.inputTransforms)),
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
                a && a.ngInherit && a(e), a === G && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function tb(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Rr(o.hostAttrs, (n = Rr(n, o.hostAttrs))));
          }
        })(r);
      }
      function Qi(e) {
        return e === yt ? {} : e === B ? [] : e;
      }
      function nb(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function rb(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function ob(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function Ki(e) {
        return (
          !!(function rl(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Ee(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function bn(e, t, n, r, o, i, s, a) {
        const u = y(),
          l = j(),
          c = e + P,
          d = l.firstCreatePass
            ? (function Nb(e, t, n, r, o, i, s, a, u) {
                const l = t.consts,
                  c = dr(t, e, 4, s || null, nn(l, a));
                Ku(t, n, c, nn(l, u)), ai(t, c);
                const d = (c.tView = Qu(
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
        Ct(d, !1);
        const f = lg(l, u, d, e);
        si() && bi(l, u, f, d),
          Ce(f, u),
          Wi(u, (u[c] = Fp(f, u, f, d))),
          ni(d) && Zu(l, u, d),
          null != s && Yu(u, d, a);
      }
      let lg = function cg(e, t, n, r) {
        return rn(!0), t[N].createComment("");
      };
      function nt(e, t, n) {
        const r = y();
        return (
          Ee(r, Un(), t) &&
            (function Ye(e, t, n, r, o, i, s, a) {
              const u = Be(t, n);
              let c,
                l = t.inputs;
              !a && null != l && (c = l[r])
                ? (tl(e, n, c, r, o),
                  vn(t) &&
                    (function EI(e, t) {
                      const n = We(t, e);
                      16 & n[F] || (n[F] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function wI(e) {
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
                const e = b.lFrame;
                return df(e.tView, e.selectedIndex);
              })(),
              r,
              e,
              t,
              r[N],
              n,
              !1
            ),
          nt
        );
      }
      function ll(e, t, n, r, o) {
        const s = o ? "class" : "style";
        tl(e, n, t.inputs[s], s, r);
      }
      function Me(e, t, n, r) {
        const o = y(),
          i = j(),
          s = P + e,
          a = o[N],
          u = i.firstCreatePass
            ? (function Rb(e, t, n, r, o, i) {
                const s = t.consts,
                  u = dr(t, e, 2, r, nn(s, o));
                return (
                  Ku(t, n, u, nn(s, i)),
                  null !== u.attrs && Zi(u, u.attrs, !1),
                  null !== u.mergedAttrs && Zi(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, i, o, t, n, r)
            : i.data[s],
          l = dg(i, o, u, a, t, e);
        o[s] = l;
        const c = ni(u);
        return (
          Ct(u, !0),
          bh(a, l, u),
          32 != (32 & u.flags) && si() && bi(i, o, l, u),
          0 ===
            (function iw() {
              return b.lFrame.elementDepthCount;
            })() && Ce(l, o),
          (function sw() {
            b.lFrame.elementDepthCount++;
          })(),
          c && (Zu(i, o, u), Wu(i, u, o)),
          null !== r && Yu(o, u),
          Me
        );
      }
      function pe() {
        let e = ve();
        Fa()
          ? (function Pa() {
              b.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Ct(e, !1));
        const t = e;
        (function uw(e) {
          return b.skipHydrationRootTNode === e;
        })(t) &&
          (function fw() {
            b.skipHydrationRootTNode = null;
          })(),
          (function aw() {
            b.lFrame.elementDepthCount--;
          })();
        const n = j();
        return (
          n.firstCreatePass && (ai(n, e), Ma(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function Tw(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            ll(n, t, y(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function Nw(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            ll(n, t, y(), t.stylesWithoutHost, !1),
          pe
        );
      }
      function ns(e, t, n, r) {
        return Me(e, t, n, r), pe(), ns;
      }
      let dg = (e, t, n, r, o, i) => (
        rn(!0),
        Ei(
          r,
          o,
          (function Af() {
            return b.lFrame.currentNamespace;
          })()
        )
      );
      function rs(e) {
        return !!e && "function" == typeof e.then;
      }
      function pg(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function Qe(e, t, n, r) {
        const o = y(),
          i = j(),
          s = ve();
        return (
          (function mg(e, t, n, r, o, i, s) {
            const a = ni(r),
              l =
                e.firstCreatePass &&
                (function kp(e) {
                  return e.cleanup || (e.cleanup = []);
                })(e),
              c = t[ae],
              d = (function Rp(e) {
                return e[Rn] || (e[Rn] = []);
              })(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = Be(r, t),
                v = s ? s(g) : g,
                _ = d.length,
                m = s ? (S) => s(K(S[r.index])) : r.index;
              let E = null;
              if (
                (!s &&
                  a &&
                  (E = (function $b(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[Rn],
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
                i = vg(r, t, c, i, !1);
                const S = n.listen(v, o, i);
                d.push(i, S), l && l.push(o, m, _, _ + 1);
              }
            } else i = vg(r, t, c, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let v = 0; v < g; v += 2) {
                  const R = t[p[v]][p[v + 1]].subscribe(i),
                    ze = d.length;
                  d.push(i, R), l && l.push(o, r.index, ze, -(ze + 1));
                }
            }
          })(i, o, o[N], s, e, t, r),
          Qe
        );
      }
      function yg(e, t, n, r) {
        try {
          return _t(6, t, n), !1 !== n(r);
        } catch (o) {
          return Vp(e, o), !1;
        } finally {
          _t(7, t, n);
        }
      }
      function vg(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          uo(e.componentOffset > -1 ? We(e.index, t) : t);
          let u = yg(t, n, r, s),
            l = i.__ngNextListenerFn__;
          for (; l; ) (u = yg(t, n, l, s) && u), (l = l.__ngNextListenerFn__);
          return o && !1 === u && s.preventDefault(), u;
        };
      }
      function os(e = 1) {
        return (function _w(e) {
          return (b.lFrame.contextLView = (function Cw(e, t) {
            for (; e > 0; ) (t = t[Ln]), e--;
            return t;
          })(e, b.lFrame.contextLView))[ae];
        })(e);
      }
      function is(e, t) {
        return (e << 17) | (t << 2);
      }
      function an(e) {
        return (e >> 17) & 32767;
      }
      function hl(e) {
        return 2 | e;
      }
      function Sn(e) {
        return (131068 & e) >> 2;
      }
      function pl(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function gl(e) {
        return 1 | e;
      }
      function Ag(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? an(i) : Sn(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const c = e[a + 1];
          Kb(e[a], t) && ((u = !0), (e[a + 1] = r ? gl(c) : hl(c))),
            (a = r ? an(c) : Sn(c));
        }
        u && (e[n + 1] = r ? hl(i) : gl(i));
      }
      function Kb(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Kn(e, t) >= 0)
        );
      }
      function ss(e, t) {
        return (
          (function dt(e, t, n, r) {
            const o = y(),
              i = j(),
              s = (function kt(e) {
                const t = b.lFrame,
                  n = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + e), n;
              })(2);
            i.firstUpdatePass &&
              (function Lg(e, t, n, r) {
                const o = e.data;
                if (null === o[n + 1]) {
                  const i = o[Ne()],
                    s = (function kg(e, t) {
                      return t >= e.expandoStartIndex;
                    })(e, n);
                  (function Hg(e, t) {
                    return 0 != (e.flags & (t ? 8 : 16));
                  })(i, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function a0(e, t, n, r) {
                      const o = (function ka(e) {
                        const t = b.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : e[t];
                      })(e);
                      let i = r ? t.residualClasses : t.residualStyles;
                      if (null === o)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((n = vo((n = ml(null, e, t, n, r)), t.attrs, r)),
                          (i = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((n = ml(o, e, t, n, r)), null === i)) {
                            let u = (function u0(e, t, n) {
                              const r = n ? t.classBindings : t.styleBindings;
                              if (0 !== Sn(r)) return e[an(r)];
                            })(e, t, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = ml(null, e, t, u[1], r)),
                              (u = vo(u, t.attrs, r)),
                              (function l0(e, t, n, r) {
                                e[an(n ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(e, t, r, u));
                          } else
                            i = (function c0(e, t, n) {
                              let r;
                              const o = t.directiveEnd;
                              for (
                                let i = 1 + t.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = vo(r, e[i].hostAttrs, n);
                              return vo(r, t.attrs, n);
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
                    (function Yb(e, t, n, r, o, i) {
                      let s = i ? t.classBindings : t.styleBindings,
                        a = an(s),
                        u = Sn(s);
                      e[r] = n;
                      let c,
                        l = !1;
                      if (
                        (Array.isArray(n)
                          ? ((c = n[1]),
                            (null === c || Kn(n, c) > 0) && (l = !0))
                          : (c = n),
                        o)
                      )
                        if (0 !== u) {
                          const f = an(e[a + 1]);
                          (e[r + 1] = is(f, a)),
                            0 !== f && (e[f + 1] = pl(e[f + 1], r)),
                            (e[a + 1] = (function Wb(e, t) {
                              return (131071 & e) | (t << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = is(a, 0)),
                            0 !== a && (e[a + 1] = pl(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = is(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = pl(e[u + 1], r)),
                          (u = r);
                      l && (e[r + 1] = hl(e[r + 1])),
                        Ag(e, c, r, !0),
                        Ag(e, c, r, !1),
                        (function Qb(e, t, n, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof t &&
                            Kn(i, t) >= 0 &&
                            (n[r + 1] = gl(n[r + 1]));
                        })(t, c, e, r, i),
                        (s = is(a, u)),
                        i ? (t.classBindings = s) : (t.styleBindings = s);
                    })(o, i, t, n, s, r);
                }
              })(i, e, s, r),
              t !== x &&
                Ee(o, s, t) &&
                (function jg(e, t, n, r, o, i, s, a) {
                  if (!(3 & t.type)) return;
                  const u = e.data,
                    l = u[a + 1],
                    c = (function Zb(e) {
                      return 1 == (1 & e);
                    })(l)
                      ? Bg(u, t, n, o, Sn(l), s)
                      : void 0;
                  as(c) ||
                    (as(i) ||
                      ((function qb(e) {
                        return 2 == (2 & e);
                      })(l) &&
                        (i = Bg(u, null, n, o, a, s))),
                    (function HE(e, t, n, r, o) {
                      if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : on.DashCase;
                        null == o
                          ? e.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= on.Important)),
                            e.setStyle(n, r, o, i));
                      }
                    })(r, s, ii(Ne(), n), o, i));
                })(
                  i,
                  i.data[Ne()],
                  o,
                  o[N],
                  e,
                  (o[s + 1] = (function p0(e, t) {
                    return (
                      null == e ||
                        "" === e ||
                        ("string" == typeof t
                          ? (e += t)
                          : "object" == typeof e &&
                            (e = de(
                              (function sn(e) {
                                return e instanceof Nh
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
          ss
        );
      }
      function ml(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = vo(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function vo(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                Ze(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function Bg(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            l = Array.isArray(u),
            c = l ? u[1] : u,
            d = null === c;
          let f = n[o + 1];
          f === x && (f = d ? B : void 0);
          let h = d ? Ya(f, r) : c === r ? f : void 0;
          if ((l && !as(h) && (h = Ya(u, r)), as(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? an(p) : Sn(p);
        }
        if (null !== t) {
          let u = i ? t.residualClasses : t.residualStyles;
          null != u && (a = Ya(u, r));
        }
        return a;
      }
      function as(e) {
        return void 0 !== e;
      }
      function St(e, t = "") {
        const n = y(),
          r = j(),
          o = e + P,
          i = r.firstCreatePass ? dr(r, o, 1, t, null) : r.data[o],
          s = $g(r, n, i, t, e);
        (n[o] = s), si() && bi(r, n, s, i), Ct(i, !1);
      }
      let $g = (e, t, n, r, o) => (
        rn(!0),
        (function wi(e, t) {
          return e.createText(t);
        })(t[N], r)
      );
      function yl(e) {
        return un("", e, ""), yl;
      }
      function un(e, t, n) {
        const r = y(),
          o = (function hr(e, t, n, r) {
            return Ee(e, Un(), n) ? t + T(n) + r : x;
          })(r, e, t, n);
        return (
          o !== x &&
            (function Ht(e, t, n) {
              const r = ii(t, e);
              !(function hh(e, t, n) {
                e.setValue(t, n);
              })(e[N], r, n);
            })(r, Ne(), o),
          un
        );
      }
      const Er = "en-US";
      let cm = Er;
      function _l(e, t, n, r, o) {
        if (((e = A(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) _l(e[i], t, n, r, o);
        else {
          const i = j(),
            s = y(),
            a = ve();
          let u = En(e) ? e : A(e.provide);
          const l = qh(e),
            c = 1048575 & a.providerIndexes,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
          if (En(e) || !e.multi) {
            const h = new qr(l, o, D),
              p = wl(u, t, o ? c : c + f, d);
            -1 === p
              ? (Ga(di(a, s), i, u),
                Cl(i, e, t.length),
                t.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = wl(u, t, c + f, d),
              p = wl(u, t, c, c + f),
              v = p >= 0 && n[p];
            if ((o && !v) || (!o && !(h >= 0 && n[h]))) {
              Ga(di(a, s), i, u);
              const _ = (function RS(e, t, n, r, o) {
                const i = new qr(e, n, D);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  Rm(i, o, r && !n),
                  i
                );
              })(o ? PS : FS, n.length, o, r, l);
              !o && v && (n[p].providerFactory = _),
                Cl(i, e, t.length, 0),
                t.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                n.push(_),
                s.push(_);
            } else Cl(i, e, h > -1 ? h : p, Rm(n[o ? p : h], l, !o && r));
            !o && r && v && n[p].componentProviders++;
          }
        }
      }
      function Cl(e, t, n, r) {
        const o = En(t),
          i = (function vM(e) {
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
      function Rm(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function wl(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function FS(e, t, n, r) {
        return El(this.multi, []);
      }
      function PS(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Cn(n, n[w], this.providerFactory.index, r);
          (i = a.slice(0, s)), El(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), El(o, i);
        return i;
      }
      function El(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function te(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function xS(e, t, n) {
              const r = j();
              if (r.firstCreatePass) {
                const o = ut(e);
                _l(n, r.data, r.blueprint, o, !0),
                  _l(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class Tn {}
      class kS {}
      class Ml extends Tn {
        constructor(t, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Gp(this));
          const o = (function qe(e, t) {
            const n = e[Sd] || null;
            if (!n && !0 === t)
              throw new Error(
                `Type ${de(e)} does not have '\u0275mod' property.`
              );
            return n;
          })(t);
          (this._bootstrapComponents = (function Bt(e) {
            return e instanceof Function ? e() : e;
          })(o.bootstrap)),
            (this._r3Injector = ip(
              t,
              n,
              [
                { provide: Tn, useValue: this },
                { provide: $i, useValue: this.componentFactoryResolver },
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
      class Il extends kS {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new Ml(this.moduleType, t, []);
        }
      }
      function gA(e, t, n, r = !0) {
        const o = t[w];
        if (
          ((function FE(e, t, n, r) {
            const o = me + r,
              i = n.length;
            r > 0 && (n[o - 1][at] = t),
              r < i - me
                ? ((t[at] = n[o]), Uf(n, me + r, t))
                : (n.push(t), (t[at] = null)),
              (t[ee] = n);
            const s = t[jr];
            null !== s &&
              n !== s &&
              (function PE(e, t) {
                const n = e[jn];
                t[ue] !== t[ee][ee][ue] && (e[$d] = !0),
                  null === n ? (e[jn] = [t]) : n.push(t);
              })(s, t);
            const a = t[vt];
            null !== a && a.insertView(e), (t[F] |= 128);
          })(o, t, e, n),
          r)
        ) {
          const i = fu(n, e),
            s = t[N],
            a = Ii(s, e[Dt]);
          null !== a &&
            (function NE(e, t, n, r, o, i) {
              (r[oe] = o), (r[De] = t), no(e, r, n, 1, o, i);
            })(o, e[De], s, t, a, i);
        }
      }
      Symbol;
      let Ut = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = vA);
        }
        return e;
      })();
      const mA = Ut,
        yA = class extends mA {
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
            const o = (function pA(e, t, n, r) {
              const o = t.tView,
                a = qi(
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
              a[jr] = e[t.index];
              const l = e[vt];
              return (
                null !== l && (a[vt] = l.createEmbeddedView(o)), nl(o, a, n), a
              );
            })(this._declarationLView, this._declarationTContainer, t, {
              injector: n,
              hydrationInfo: r,
            });
            return new fo(o);
          }
        };
      function vA() {
        return (function fs(e, t) {
          return 4 & e.type ? new yA(t, e, ur(e, t)) : null;
        })(ve(), y());
      }
      let At = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = MA);
        }
        return e;
      })();
      function MA() {
        return (function ey(e, t) {
          let n;
          const r = t[e.index];
          return (
            Ae(r)
              ? (n = r)
              : ((n = Fp(r, t, null, e)), (t[e.index] = n), Wi(t, n)),
            ty(n, t, e, r),
            new Xm(n, e, t)
          );
        })(ve(), y());
      }
      const IA = At,
        Xm = class extends IA {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return ur(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Oe(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = fi(this._hostTNode, this._hostLView);
            if ($a(t)) {
              const n = Zr(t, this._hostLView),
                r = Wr(t);
              return new Oe(n[w].data[r + 8], n);
            }
            return new Oe(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = Jm(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - me;
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
              !(function Qr(e) {
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
            const u = s ? t : new ho(V(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const v = (s ? l : this.parentInjector).get(Vt, null);
              v && (i = v);
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
              (function nw(e) {
                return Ae(e[ee]);
              })(o)
            ) {
              const u = this.indexOf(t);
              if (-1 !== u) this.detach(u);
              else {
                const l = o[ee],
                  c = new Xm(l, l[De], l[ee]);
                c.detach(c.indexOf(t));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            return (
              gA(a, o, s, !r), t.attachToViewContainerRef(), Uf(Al(a), s, t), t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = Jm(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = Mi(this._lContainer, n);
            r && (pi(Al(this._lContainer), n), uu(r[w], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = Mi(this._lContainer, n);
            return r && null != pi(Al(this._lContainer), n) ? new fo(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function Jm(e) {
        return e[8];
      }
      function Al(e) {
        return e[8] || (e[8] = []);
      }
      let ty = function ny(e, t, n, r) {
        if (e[Dt]) return;
        let o;
        (o =
          8 & n.type
            ? K(r)
            : (function bA(e, t) {
                const n = e[N],
                  r = n.createComment(""),
                  o = Be(t, e);
                return (
                  wn(
                    n,
                    Ii(n, o),
                    r,
                    (function VE(e, t) {
                      return e.nextSibling(t);
                    })(n, o),
                    !1
                  ),
                  r
                );
              })(t, n)),
          (e[Dt] = o);
      };
      const sT = new M("Application Initializer");
      let Vl = (() => {
        class e {
          constructor() {
            (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((n, r) => {
                (this.resolve = n), (this.reject = r);
              })),
              (this.appInits = W(sT, { optional: !0 }) ?? []);
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [];
            for (const o of this.appInits) {
              const i = o();
              if (rs(i)) n.push(i);
              else if (pg(i)) {
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
          static #t = (this.ɵprov = q({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const zt = new M("LocaleId", {
        providedIn: "root",
        factory: () =>
          W(zt, k.Optional | k.SkipSelf) ||
          (function uT() {
            return (typeof $localize < "u" && $localize.locale) || Er;
          })(),
      });
      let dT = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new Q_(!1));
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
          static #t = (this.ɵprov = q({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const Ay = new M(""),
        ms = new M("");
      let Ul,
        Hl = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Ul ||
                  ((function xT(e) {
                    Ul = e;
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
              return new (r || e)(L(ie), L($l), L(ms));
            });
            static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        $l = (() => {
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
              return Ul?.findTestabilityInTree(this, n, r) ?? null;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = q({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })(),
        ln = null;
      const Ty = new M("AllowMultipleToken"),
        zl = new M("PlatformDestroyListeners"),
        Ny = new M("appBootstrapListener");
      function Fy(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new M(r);
        return (i = []) => {
          let s = Gl();
          if (!s || s.injector.get(Ty, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function RT(e) {
                  if (ln && !ln.get(Ty, !1)) throw new C(400, !1);
                  (function Oy() {
                    !(function HC(e) {
                      ef = e;
                    })(() => {
                      throw new C(600, !1);
                    });
                  })(),
                    (ln = e);
                  const t = e.get(Ry);
                  (function xy(e) {
                    e.get(Wh, null)?.forEach((n) => n());
                  })(e);
                })(
                  (function Py(e = [], t) {
                    return ct.create({
                      name: t,
                      providers: [
                        { provide: Mu, useValue: "platform" },
                        { provide: zl, useValue: new Set([() => (ln = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function LT(e) {
            const t = Gl();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function Gl() {
        return ln?.get(Ry) ?? null;
      }
      let Ry = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function VT(e = "zone.js", t) {
              return "noop" === e ? new eI() : "zone.js" === e ? new ie(t) : e;
            })(
              r?.ngZone,
              (function ky(e) {
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
              const i = (function VS(e, t, n) {
                  return new Ml(e, t, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function Hy(e) {
                    return [
                      { provide: ie, useFactory: e },
                      {
                        provide: Oi,
                        multi: !0,
                        useFactory: () => {
                          const t = W(BT, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: By, useFactory: jT },
                      { provide: cp, useFactory: dp },
                    ];
                  })(() => o)
                ),
                s = i.injector.get(jt, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (u) => {
                      s.handleError(u);
                    },
                  });
                  i.onDestroy(() => {
                    ys(this._modules, i), a.unsubscribe();
                  });
                }),
                (function Ly(e, t, n) {
                  try {
                    const r = n();
                    return rs(r)
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
                  const a = i.injector.get(Vl);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function dm(e) {
                          Xe(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (cm = e.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(zt, Er) || Er),
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
            const o = Vy({}, r);
            return (function FT(e, t, n) {
              const r = new Il(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Ao);
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
            const n = this._injector.get(zl, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(L(ct));
          });
          static #t = (this.ɵprov = q({
            token: e,
            factory: e.ɵfac,
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function Vy(e, t) {
        return Array.isArray(t) ? t.reduce(Vy, e) : { ...e, ...t };
      }
      let Ao = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = W(By)),
              (this.zoneIsStable = W(cp)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = W(dT).hasPendingTasks.pipe(
                (function X_(e, t) {
                  return mn((n, r) => {
                    let o = null,
                      i = 0,
                      s = !1;
                    const a = () => s && !o && r.complete();
                    n.subscribe(
                      Zt(
                        r,
                        (u) => {
                          o?.unsubscribe();
                          let l = 0;
                          const c = i++;
                          mt(e(u, c)).subscribe(
                            (o = Zt(
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
                })((n) =>
                  n
                    ? (function K_(...e) {
                        return ia(e, pd(e));
                      })(!1)
                    : this.zoneIsStable
                ),
                (function J_(e, t = Xs) {
                  return (
                    (e = e ?? eC),
                    mn((n, r) => {
                      let o,
                        i = !0;
                      n.subscribe(
                        Zt(r, (s) => {
                          const a = t(s);
                          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                        })
                      );
                    })
                  );
                })(),
                vd()
              )),
              (this._injector = W(Vt));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof Xh;
            if (!this._injector.get(Vl).done)
              throw (
                (!o &&
                  (function kr(e) {
                    const t = V(e) || ge(e) || Se(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, !1))
              );
            let s;
            (s = o ? n : this._injector.get($i).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function PT(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Tn),
              l = s.create(ct.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(Ay, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  ys(this.components, l),
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
            ys(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(Ny, []);
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
              () => ys(this._destroyListeners, n)
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
          static #t = (this.ɵprov = q({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function ys(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const By = new M("", {
        providedIn: "root",
        factory: () => W(jt).handleError.bind(void 0),
      });
      function jT() {
        const e = W(ie),
          t = W(jt);
        return (n) => e.runOutsideAngular(() => t.handleError(n));
      }
      let BT = (() => {
        class e {
          constructor() {
            (this.zone = W(ie)), (this.applicationRef = W(Ao));
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
          static #t = (this.ɵprov = q({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      let Uy = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = $T);
        }
        return e;
      })();
      function $T(e) {
        return (function UT(e, t, n) {
          if (vn(e) && !n) {
            const r = We(e.index, t);
            return new fo(r, r);
          }
          return 47 & e.type ? new fo(t[ue], t) : null;
        })(ve(), y(), 16 == (16 & e));
      }
      class qy {
        constructor() {}
        supports(t) {
          return Ki(t);
        }
        create(t) {
          return new YT(t);
        }
      }
      const ZT = (e, t) => t;
      class YT {
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
            (this._trackByFn = t || ZT);
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
            const s = !r || (n && n.currentIndex < Zy(r, o, i)) ? n : r,
              a = Zy(s, o, i),
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
          if ((null == t && (t = []), !Ki(t))) throw new C(900, !1);
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
              (function fb(e, t) {
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
              : (t = this._addAfter(new QT(n, r), i, o)),
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
            null === this._linkedRecords && (this._linkedRecords = new Wy()),
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
              (this._unlinkedRecords = new Wy()),
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
      class QT {
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
      class KT {
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
      class Wy {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new KT()), this.map.set(n, r)), r.add(t);
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
      function Zy(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      function Qy() {
        return new _s([new qy()]);
      }
      let _s = (() => {
        class e {
          static #e = (this.ɵprov = q({
            token: e,
            providedIn: "root",
            factory: Qy,
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
              useFactory: (r) => e.create(n, r || Qy()),
              deps: [[e, new Xa(), new Ka()]],
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
      const nN = Fy(null, "core", []);
      let rN = (() => {
        class e {
          constructor(n) {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(L(Ao));
          });
          static #t = (this.ɵmod = Xt({ type: e }));
          static #n = (this.ɵinj = Nt({}));
        }
        return e;
      })();
      let Xl = null;
      function No() {
        return Xl;
      }
      class mN {}
      const On = new M("DocumentToken");
      class i1 {
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
      let mv = (() => {
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
                  new i1(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), yv(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              yv(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(D(At), D(Ut), D(_s));
          });
          static #t = (this.ɵdir = O({
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
      function yv(e, t) {
        e.context.$implicit = t.item;
      }
      let vv = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new s1()),
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
            Dv("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            Dv("ngIfElse", n),
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
            return new (r || e)(D(At), D(Ut));
          });
          static #t = (this.ɵdir = O({
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
      class s1 {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function Dv(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${de(t)}'.`
          );
      }
      let O1 = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵmod = Xt({ type: e }));
          static #n = (this.ɵinj = Nt({}));
        }
        return e;
      })();
      function Ev(e) {
        return "server" === e;
      }
      class iO extends mN {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class gc extends iO {
        static makeCurrent() {
          !(function gN(e) {
            Xl || (Xl = e);
          })(new gc());
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
          const n = (function sO() {
            return (
              (Po = Po || document.querySelector("base")),
              Po ? Po.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function aO(e) {
                (Ps = Ps || document.createElement("a")),
                  Ps.setAttribute("href", e);
                const t = Ps.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          Po = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function n1(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Ps,
        Po = null,
        lO = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
          }
          return e;
        })();
      const mc = new M("EventManagerPlugins");
      let Av = (() => {
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
            return new (r || e)(L(mc), L(ie));
          });
          static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class Tv {
        constructor(t) {
          this._doc = t;
        }
      }
      const yc = "ng-app-id";
      let Nv = (() => {
        class e {
          constructor(n, r, o, i = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = Ev(i)),
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
              `style[${yc}="${this.appId}"]`
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
              return o.delete(r), i.removeAttribute(yc), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(yc, this.appId),
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
            return new (r || e)(L(On), L(ki), L(Zh, 8), L(ir));
          });
          static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const vc = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Dc = /%COMP%/g,
        hO = new M("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function xv(e, t) {
        return t.map((n) => n.replace(Dc, e));
      }
      let Fv = (() => {
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
              (this.platformIsServer = Ev(a)),
              (this.defaultRenderer = new _c(n, s, u, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === it.ShadowDom &&
              (r = { ...r, encapsulation: it.Emulated });
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof Rv
                ? o.applyToHost(n)
                : o instanceof Cc && o.applyStyles(),
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
                  i = new Rv(u, l, r, this.appId, c, s, a, d);
                  break;
                case it.ShadowDom:
                  return new yO(u, l, n, r, s, a, this.nonce, d);
                default:
                  i = new Cc(u, l, r, c, s, a, d);
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
              L(Av),
              L(Nv),
              L(ki),
              L(hO),
              L(On),
              L(ir),
              L(ie),
              L(Zh)
            );
          });
          static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class _c {
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
            ? this.doc.createElementNS(vc[n] || n, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (Pv(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Pv(t) ? t.content : t).insertBefore(n, r);
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
            const i = vc[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = vc[r];
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
          o & (on.DashCase | on.Important)
            ? t.style.setProperty(n, r, o & on.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & on.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
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
            !(t = No().getGlobalEventTarget(this.doc, t))
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
      function Pv(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class yO extends _c {
        constructor(t, n, r, o, i, s, a, u) {
          super(t, i, s, u),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const l = xv(o.id, o.styles);
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
      class Cc extends _c {
        constructor(t, n, r, o, i, s, a, u) {
          super(t, i, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = u ? xv(u, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class Rv extends Cc {
        constructor(t, n, r, o, i, s, a, u) {
          const l = o + "-" + r.id;
          super(t, n, r, i, s, a, u, l),
            (this.contentAttr = (function pO(e) {
              return "_ngcontent-%COMP%".replace(Dc, e);
            })(l)),
            (this.hostAttr = (function gO(e) {
              return "_nghost-%COMP%".replace(Dc, e);
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
      let vO = (() => {
        class e extends Tv {
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
            return new (r || e)(L(On));
          });
          static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const kv = ["alt", "control", "meta", "shift"],
        DO = {
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
        _O = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let CO = (() => {
        class e extends Tv {
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
              .runOutsideAngular(() => No().onAndCancel(n, i.domEventName, s));
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
              kv.forEach((l) => {
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
            let o = DO[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                kv.forEach((s) => {
                  s !== o && (0, _O[s])(n) && (i += s + ".");
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
            return new (r || e)(L(On));
          });
          static #t = (this.ɵprov = q({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const IO = Fy(nN, "browser", [
          { provide: ir, useValue: "browser" },
          {
            provide: Wh,
            useValue: function wO() {
              gc.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: On,
            useFactory: function MO() {
              return (
                (function qE(e) {
                  gu = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        bO = new M(""),
        jv = [
          {
            provide: ms,
            useClass: class uO {
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
                        ? No().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: Ay, useClass: Hl, deps: [ie, $l, ms] },
          { provide: Hl, useClass: Hl, deps: [ie, $l, ms] },
        ],
        Bv = [
          { provide: Mu, useValue: "root" },
          {
            provide: jt,
            useFactory: function EO() {
              return new jt();
            },
            deps: [],
          },
          { provide: mc, useClass: vO, multi: !0, deps: [On, ie, ir] },
          { provide: mc, useClass: CO, multi: !0, deps: [On] },
          Fv,
          Nv,
          Av,
          { provide: ep, useExisting: Fv },
          { provide: class k1 {}, useClass: lO, deps: [] },
          [],
        ];
      let SO = (() => {
        class e {
          constructor(n) {}
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [{ provide: ki, useValue: n.appId }],
            };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(L(bO, 12));
          });
          static #t = (this.ɵmod = Xt({ type: e }));
          static #n = (this.ɵinj = Nt({
            providers: [...Bv, ...jv],
            imports: [O1, rN],
          }));
        }
        return e;
      })();
      typeof window < "u" && window;
      const Rs = {
          przystanki: [
            {
              nazwa: "My\u015bleniceDA",
              kierunek: "Krak\xf3w",
              odjazdy: [
                "4:30",
                "5:15",
                "6:00",
                "6:30",
                "7:00",
                "7:45",
                "8:45",
                "9:45",
                "10:45",
                "11:45",
                "12:30",
                "13:15",
                "13:45",
                "14:35",
                "15:25",
                "16:15",
                "17:15",
                "18:15",
                "19:45",
                "21:00",
                "22:15",
              ],
              typ: "pon-pt",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "My\u015blenice S\u0142owackiego",
              kierunek: "Krak\xf3w",
              odjazdy: [
                "4:32",
                "5:18",
                "6:04",
                "6:34",
                "7:04",
                "7:49",
                "8:49",
                "9:48",
                "10:48",
                "11:48",
                "12:33",
                "13:18",
                "13:49",
                "14:39",
                "15:29",
                "16:19",
                "17:19",
                "18:18",
                "19:48",
                "21:02",
                "22:17",
              ],
              typ: "pon-pt",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "My\u015blenice Pardyaka",
              kierunek: "Krak\xf3w",
              odjazdy: [
                "4:34",
                "5:21",
                "6:08",
                "6:38",
                "7:08",
                "7:53",
                "8:53",
                "9:51",
                "10:51",
                "11:51",
                "12:36",
                "13:21",
                "13:53",
                "14:43",
                "15:33",
                "16:23",
                "17:23",
                "18:21",
                "19:51",
                "21:04",
                "22:19",
              ],
              typ: "pon-pt",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3wMDA",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:45",
                "6:30",
                "7:30",
                "8:15",
                "8:45",
                "9:30",
                "10:15",
                "11:15",
                "12:15",
                "13:15",
                "14:00",
                "14:45",
                "15:15",
                "16:00",
                "17:00",
                "17:45",
                "18:45",
                "19:45",
                "21:00",
                "22:15",
                "23:30",
              ],
              typ: "pon-pt",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3w Plac inwalid\xf3w",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:52",
                "6:38",
                "7:38",
                "8:23",
                "8:53",
                "9:38",
                "10:23",
                "11:23",
                "12:23",
                "13:23",
                "14:11",
                "14:56",
                "15:26",
                "16:11",
                "17:11",
                "17:56",
                "18:56",
                "19:53",
                "21:08",
                "22:22",
                "23:37",
              ],
              typ: "pon-pt",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3w AGH/UR",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:53",
                "6:40",
                "7:40",
                "8:25",
                "8:55",
                "9:40",
                "10:25",
                "11:25",
                "12:25",
                "13:25",
                "14:14",
                "14:59",
                "15:29",
                "16:14",
                "17:14",
                "17:59",
                "18:59",
                "19:55",
                "21:10",
                "22:23",
                "23:38",
              ],
              typ: "pon-pt",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3w Wita Stwosza (Kowal)",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:00",
                "5:40",
                "6:16",
                "6:45",
                "7:10",
                "7:30",
                "7:55",
                "8:13",
                "8:40",
                "9:02",
                "9:30",
                "10:15",
                "10:40",
                "11:03",
                "11:45",
                "12:10",
                "12:40",
                "13:10",
                "13:40",
                "14:05",
                "14:35",
                "15:10",
                "15:35",
                "15:50",
                "16:08",
                "16:45",
                "17:10",
                "17:50",
                "18:20",
                "18:50",
                "19:30",
                "20:50",
                "21:15",
              ],
              typ: "pon-pt",
              przewoźnik: "Kowal Bus",
            },
            {
              nazwa: "My\u015blenice DA (Kowal)",
              kierunek: "Krak\xf3w",
              odjazdy: [
                "4:05",
                "4:35",
                "5:20",
                "5:32",
                "5:55",
                "6:15",
                "6:30",
                "6:55",
                "7:34",
                "7:55",
                "8:24",
                "8:40",
                "9:00",
                "9:35",
                "10:00",
                "10:35",
                "11:00",
                "11:35",
                "12:00",
                "12:25",
                "13:00",
                "13:35",
                "14:10",
                "14:30",
                "14:50",
                "15:25",
                "16:00",
                "16:35",
                "17:00",
                "17:30",
                "18:20",
                "19:20",
                "20:00",
              ],
              typ: "pon-pt",
              przewoźnik: "Kowal Bus",
            },
            {
              nazwa: "My\u015blenice DA (sobota)",
              kierunek: "Krak\xf3w",
              odjazdy: [
                "4:30",
                "5:30",
                "7:30",
                "9:30",
                "11:30",
                "13:30",
                "15:30",
                "17:30",
                "19:30",
                "21:30",
              ],
              typ: "sobota",
            },
            {
              nazwa: "Krak\xf3wMDA",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:30",
                "7:30",
                "9:30",
                "11:30",
                "14:15",
                "15:30",
                "17:30",
                "19:30",
                "22:15",
                "23:30",
              ],
              typ: "sobota",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3w Plac Inwalid\xf3w",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:37",
                "7:37",
                "9:38",
                "11:38",
                "14:23",
                "15:38",
                "17:38",
                "19:38",
                "22:22",
                "23:37",
              ],
              typ: "sobota",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3w AGH/UR",
              kierunek: "My\u015blenice",
              odjazdy: [
                "5:38",
                "7:38",
                "9:40",
                "11:40",
                "14:25",
                "15:40",
                "17:40",
                "19:40",
                "22:23",
                "23:38",
              ],
              typ: "sobota",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "My\u015blenice DA (niedziela)",
              kierunek: "Krak\xf3w",
              odjazdy: [
                "5:30",
                "7:30",
                "9:30",
                "11:30",
                "13:30",
                "15:30",
                "17:30",
                "19:30",
              ],
              typ: "niedziela",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
            {
              nazwa: "Krak\xf3wMDA",
              kierunek: "My\u015blenice",
              odjazdy: [
                "7:30",
                "9:30",
                "11:30",
                "13:30",
                "15:30",
                "17:30",
                "19:30",
                "21:30",
              ],
              typ: "niedziela",
              przewoźnik: "Koleje Ma\u0142opolskie",
            },
          ],
        },
        { isArray: PO } = Array,
        { getPrototypeOf: RO, prototype: kO, keys: LO } = Object;
      const { isArray: BO } = Array;
      function UO(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      function zO(...e) {
        const t = (function H_(e) {
            return ne(oa(e)) ? e.pop() : void 0;
          })(e),
          { args: n, keys: r } = (function VO(e) {
            if (1 === e.length) {
              const t = e[0];
              if (PO(t)) return { args: t, keys: null };
              if (
                (function jO(e) {
                  return e && "object" == typeof e && RO(e) === kO;
                })(t)
              ) {
                const n = LO(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e),
          o = new be((i) => {
            const { length: s } = n;
            if (!s) return void i.complete();
            const a = new Array(s);
            let u = s,
              l = s;
            for (let c = 0; c < s; c++) {
              let d = !1;
              mt(n[c]).subscribe(
                Zt(
                  i,
                  (f) => {
                    d || ((d = !0), l--), (a[c] = f);
                  },
                  () => u--,
                  void 0,
                  () => {
                    (!u || !d) && (l || i.next(r ? UO(r, a) : a), i.complete());
                  }
                )
              );
            }
          });
        return t
          ? o.pipe(
              (function $O(e) {
                return Js((t) =>
                  (function HO(e, t) {
                    return BO(t) ? e(...t) : e(t);
                  })(e, t)
                );
              })(t)
            )
          : o;
      }
      let zv = (() => {
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
              return new (r || e)(D(Mn), D(lt));
            });
            static #t = (this.ɵdir = O({ type: e }));
          }
          return e;
        })(),
        xn = (() => {
          class e extends zv {
            static #e = (this.ɵfac = (function () {
              let n;
              return function (o) {
                return (n || (n = _e(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = O({ type: e, features: [G] }));
          }
          return e;
        })();
      const Tt = new M("NgValueAccessor"),
        qO = { provide: Tt, useExisting: Y(() => Ec), multi: !0 },
        ZO = new M("CompositionEventMode");
      let Ec = (() => {
        class e extends zv {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function WO() {
                  const e = No() ? No().getUserAgent() : "";
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
            return new (r || e)(D(Mn), D(lt), D(ZO, 8));
          });
          static #t = (this.ɵdir = O({
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
                Qe("input", function (s) {
                  return o._handleInput(s.target.value);
                })("blur", function () {
                  return o.onTouched();
                })("compositionstart", function () {
                  return o._compositionStart();
                })("compositionend", function (s) {
                  return o._compositionEnd(s.target.value);
                });
            },
            features: [te([qO]), G],
          }));
        }
        return e;
      })();
      const Ie = new M("NgValidators"),
        fn = new M("NgAsyncValidators");
      function tD(e) {
        return null != e;
      }
      function nD(e) {
        return rs(e) ? ia(e) : e;
      }
      function rD(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function oD(e, t) {
        return t.map((n) => n(e));
      }
      function iD(e) {
        return e.map((t) =>
          (function QO(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function Mc(e) {
        return null != e
          ? (function sD(e) {
              if (!e) return null;
              const t = e.filter(tD);
              return 0 == t.length
                ? null
                : function (n) {
                    return rD(oD(n, t));
                  };
            })(iD(e))
          : null;
      }
      function Ic(e) {
        return null != e
          ? (function aD(e) {
              if (!e) return null;
              const t = e.filter(tD);
              return 0 == t.length
                ? null
                : function (n) {
                    return zO(oD(n, t).map(nD)).pipe(Js(rD));
                  };
            })(iD(e))
          : null;
      }
      function uD(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function bc(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function Ls(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function dD(e, t) {
        const n = bc(t);
        return (
          bc(e).forEach((o) => {
            Ls(n, o) || n.push(o);
          }),
          n
        );
      }
      function fD(e, t) {
        return bc(t).filter((n) => !Ls(e, n));
      }
      class hD {
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
            (this._composedValidatorFn = Mc(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = Ic(this._rawAsyncValidators));
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
      class ke extends hD {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class hn extends hD {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class pD {
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
      let gD = (() => {
        class e extends pD {
          constructor(n) {
            super(n);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(D(hn, 2));
          });
          static #t = (this.ɵdir = O({
            type: e,
            selectors: [
              ["", "formControlName", ""],
              ["", "ngModel", ""],
              ["", "formControl", ""],
            ],
            hostVars: 14,
            hostBindings: function (r, o) {
              2 & r &&
                ss("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                  "ng-pristine",
                  o.isPristine
                )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                  "ng-invalid",
                  o.isInvalid
                )("ng-pending", o.isPending);
            },
            features: [G],
          }));
        }
        return e;
      })();
      const Ro = "VALID",
        js = "INVALID",
        Sr = "PENDING",
        ko = "DISABLED";
      function Bs(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      class DD {
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
          return this.status === Ro;
        }
        get invalid() {
          return this.status === js;
        }
        get pending() {
          return this.status == Sr;
        }
        get disabled() {
          return this.status === ko;
        }
        get enabled() {
          return this.status !== ko;
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
          this.setValidators(dD(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(dD(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(fD(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(fD(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return Ls(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return Ls(this._rawAsyncValidators, t);
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
          (this.status = Sr),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = ko),
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
          (this.status = Ro),
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
              (this.status === Ro || this.status === Sr) &&
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
          this.status = this._allControlsDisabled() ? ko : Ro;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = Sr), (this._hasOwnPendingAsyncValidator = !0);
            const n = nD(this.asyncValidator(this));
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
          (this.valueChanges = new we()), (this.statusChanges = new we());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? ko
            : this.errors
            ? js
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Sr)
            ? Sr
            : this._anyControlsHaveStatus(js)
            ? js
            : Ro;
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
          Bs(t) && null != t.updateOn && (this._updateOn = t.updateOn);
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
            (this._composedValidatorFn = (function tx(e) {
              return Array.isArray(e) ? Mc(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function nx(e) {
              return Array.isArray(e) ? Ic(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      const Ar = new M("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Hs,
        }),
        Hs = "always";
      function Lo(e, t, n = Hs) {
        (function xc(e, t) {
          const n = (function lD(e) {
            return e._rawValidators;
          })(e);
          null !== t.validator
            ? e.setValidators(uD(n, t.validator))
            : "function" == typeof n && e.setValidators([n]);
          const r = (function cD(e) {
            return e._rawAsyncValidators;
          })(e);
          null !== t.asyncValidator
            ? e.setAsyncValidators(uD(r, t.asyncValidator))
            : "function" == typeof r && e.setAsyncValidators([r]);
          const o = () => e.updateValueAndValidity();
          zs(t._rawValidators, o), zs(t._rawAsyncValidators, o);
        })(e, t),
          t.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === n) &&
            t.valueAccessor.setDisabledState?.(e.disabled),
          (function ix(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && _D(e, t);
            });
          })(e, t),
          (function ax(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function sx(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && _D(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function ox(e, t) {
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
      function zs(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function _D(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function ED(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function MD(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const ID = class extends DD {
          constructor(t = null, n, r) {
            super(
              (function Tc(e) {
                return (Bs(e) ? e.validators : e) || null;
              })(n),
              (function Nc(e, t) {
                return (Bs(t) ? t.asyncValidators : e) || null;
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
              Bs(n) &&
                (n.nonNullable || n.initialValueIsDefault) &&
                (this.defaultValue = MD(t) ? t.value : t);
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
            ED(this._onChange, t);
          }
          registerOnDisabledChange(t) {
            this._onDisabledChange.push(t);
          }
          _unregisterOnDisabledChange(t) {
            ED(this._onDisabledChange, t);
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
            MD(t)
              ? ((this.value = this._pendingValue = t.value),
                t.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = t);
          }
        },
        gx = { provide: hn, useExisting: Y(() => Lc) },
        AD = (() => Promise.resolve())();
      let Lc = (() => {
          class e extends hn {
            constructor(n, r, o, i, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new ID()),
                (this._registered = !1),
                (this.name = ""),
                (this.update = new we()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function Rc(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === Ec
                        ? (n = i)
                        : (function cx(e) {
                            return Object.getPrototypeOf(e.constructor) === xn;
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
                (function Pc(e, t) {
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
              Lo(this.control, this, this.callSetDisabledState),
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
              AD.then(() => {
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o =
                  0 !== r &&
                  (function Kl(e) {
                    return "boolean" == typeof e
                      ? e
                      : null != e && "false" !== e;
                  })(r);
              AD.then(() => {
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent
                ? (function $s(e, t) {
                    return [...t.path, e];
                  })(n, this._parent)
                : [n];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(
                D(ke, 9),
                D(Ie, 10),
                D(fn, 10),
                D(Tt, 10),
                D(Uy, 8),
                D(Ar, 8)
              );
            });
            static #t = (this.ɵdir = O({
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
              features: [te([gx]), G, Pt],
            }));
          }
          return e;
        })(),
        ND = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = Xt({ type: e }));
            static #n = (this.ɵinj = Nt({}));
          }
          return e;
        })();
      const bx = { provide: Tt, useExisting: Y(() => qs), multi: !0 };
      function LD(e, t) {
        return null == e
          ? `${t}`
          : (t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let qs = (() => {
          class e extends xn {
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
              const o = LD(this._getOptionId(n), n);
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
              const r = (function Sx(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r) : n;
            }
            static #e = (this.ɵfac = (function () {
              let n;
              return function (o) {
                return (n || (n = _e(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = O({
              type: e,
              selectors: [
                ["select", "formControlName", "", 3, "multiple", ""],
                ["select", "formControl", "", 3, "multiple", ""],
                ["select", "ngModel", "", 3, "multiple", ""],
              ],
              hostBindings: function (r, o) {
                1 & r &&
                  Qe("change", function (s) {
                    return o.onChange(s.target.value);
                  })("blur", function () {
                    return o.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [te([bx]), G],
            }));
          }
          return e;
        })(),
        VD = (() => {
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
                this._setElementValue(LD(this.id, n)),
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
              return new (r || e)(D(lt), D(Mn), D(qs, 9));
            });
            static #t = (this.ɵdir = O({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            }));
          }
          return e;
        })();
      const Ax = { provide: Tt, useExisting: Y(() => Hc), multi: !0 };
      function jD(e, t) {
        return null == e
          ? `${t}`
          : ("string" == typeof t && (t = `'${t}'`),
            t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let Hc = (() => {
          class e extends xn {
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
              const r = (function Tx(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r)._value : n;
            }
            static #e = (this.ɵfac = (function () {
              let n;
              return function (o) {
                return (n || (n = _e(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = O({
              type: e,
              selectors: [
                ["select", "multiple", "", "formControlName", ""],
                ["select", "multiple", "", "formControl", ""],
                ["select", "multiple", "", "ngModel", ""],
              ],
              hostBindings: function (r, o) {
                1 & r &&
                  Qe("change", function (s) {
                    return o.onChange(s.target);
                  })("blur", function () {
                    return o.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [te([Ax]), G],
            }));
          }
          return e;
        })(),
        BD = (() => {
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
                this._setElementValue(jD(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._select
                ? ((this._value = n),
                  this._setElementValue(jD(this.id, n)),
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
              return new (r || e)(D(lt), D(Mn), D(Hc, 9));
            });
            static #t = (this.ɵdir = O({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            }));
          }
          return e;
        })(),
        Vx = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = Xt({ type: e }));
            static #n = (this.ɵinj = Nt({ imports: [ND] }));
          }
          return e;
        })(),
        Bx = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: Ar, useValue: n.callSetDisabledState ?? Hs },
                ],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = Xt({ type: e }));
            static #n = (this.ɵinj = Nt({ imports: [Vx] }));
          }
          return e;
        })();
      function Hx(e, t) {
        if ((1 & e && (Me(0, "option", 7), St(1), pe()), 2 & e)) {
          const n = t.$implicit;
          nt("value", n), xe(1), un(" ", n, " ");
        }
      }
      function $x(e, t) {
        if ((1 & e && (Me(0, "option", 7), St(1), pe()), 2 & e)) {
          const n = t.$implicit;
          nt("value", n), xe(1), un(" ", n, " ");
        }
      }
      function Ux(e, t) {
        if ((1 & e && (Me(0, "h4"), St(1), pe()), 2 & e)) {
          const n = os(2);
          xe(1), yl(n.nextDepartureTime);
        }
      }
      function zx(e, t) {
        if (
          (1 & e &&
            (Me(0, "div")(1, "h3"),
            St(2),
            pe(),
            bn(3, Ux, 2, 1, "h4", 6),
            pe()),
          2 & e)
        ) {
          const n = os();
          xe(2),
            un("Najbli\u017cszy odjazd z ", n.selectedPrzystanek, ""),
            xe(1),
            nt("ngIf", n.nextDepartureTime);
        }
      }
      function Gx(e, t) {
        if ((1 & e && (Me(0, "p"), St(1), pe()), 2 & e)) {
          const n = t.$implicit;
          xe(1), un(" ", n, " ");
        }
      }
      function qx(e, t) {
        if (
          (1 & e &&
            (Me(0, "div")(1, "h3"),
            St(2),
            pe(),
            Me(3, "div", 8),
            bn(4, Gx, 2, 1, "p", 9),
            pe()()),
          2 & e)
        ) {
          const n = os();
          xe(2),
            un("Godziny odjazd\xf3w dla ", n.selectedPrzystanek, ""),
            xe(2),
            nt("ngForOf", n.getOdjazdyForPrzystanek(n.selectedPrzystanek));
        }
      }
      let Wx = (() => {
          class e {
            constructor() {
              (this.kierunki = []),
                (this.przystanki = Rs.przystanki),
                (this.uniqueBusStops = []),
                (this.today = "");
            }
            ngOnInit() {
              this.uniqueBusStops = this.getUniqueBusStops();
              const n = new Set(Rs.przystanki.map((r) => r.kierunek));
              (this.kierunki = Array.from(n)),
                (this.selectedKierunek =
                  "Krak\xf3w" === this.selectedKierunek
                    ? this.selectedKierunek
                    : "My\u015blenice"),
                (this.przystanki = Rs.przystanki),
                (this.today = this.getDayOfWeek(new Date())),
                this.onKierunekChange();
            }
            getUniqueBusStops() {
              const n = new Set();
              return (
                Rs.przystanki.forEach((r) => {
                  n.add(r.kierunek);
                }),
                Array.from(n)
              );
            }
            getDayOfWeek(n) {
              return [
                "niedziela",
                "poniedzia\u0142ek",
                "wtorek",
                "\u015broda",
                "czwartek",
                "pi\u0105tek",
                "sobota",
              ][n.getDay()];
            }
            get filteredPrzystanki() {
              if (!this.selectedKierunek) return [];
              let n;
              return (
                (n =
                  "sobota" === this.today || "niedziela" === this.today
                    ? this.today
                    : "pon-pt"),
                this.przystanki
                  .filter(
                    (o) => o.kierunek === this.selectedKierunek && o.typ === n
                  )
                  .map((o) => o.nazwa)
              );
            }
            onPrzystanekChange() {
              this.nextDepartureTime = this.getNextDepartureTime(
                this.selectedPrzystanek
              );
            }
            onKierunekChange() {
              "My\u015blenice" === this.selectedKierunek
                ? (this.selectedPrzystanek = "Krak\xf3wMDA")
                : "Krak\xf3w" === this.selectedKierunek &&
                  (this.selectedPrzystanek = "My\u015bleniceDA"),
                this.updateNextDepartureTime();
            }
            updateNextDepartureTime() {
              this.nextDepartureTime = this.getNextDepartureTime(
                this.selectedPrzystanek
              );
            }
            getOdjazdyForPrzystanek(n) {
              const r = this.przystanki.find((o) => o.nazwa === n);
              return r ? r.odjazdy : [];
            }
            getNextDepartureTime(n) {
              const r = new Date(),
                o = r.getHours(),
                i = r.getMinutes(),
                s = this.przystanki.find((a) => a.nazwa === n);
              if (s) {
                const a = s.odjazdy.map((c) => {
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
              return new (r || e)();
            });
            static #t = (this.ɵcmp = wa({
              type: e,
              selectors: [["app-bus-departures"]],
              decls: 13,
              vars: 6,
              consts: [
                [1, "departures"],
                ["for", "kierunek"],
                ["id", "kierunek", 3, "ngModel", "ngModelChange", "change"],
                [3, "value", 4, "ngFor", "ngForOf"],
                ["for", "przystanek"],
                ["id", "przystanek", 3, "ngModel", "ngModelChange", "change"],
                [4, "ngIf"],
                [3, "value"],
                [1, "departure-times"],
                [4, "ngFor", "ngForOf"],
              ],
              template: function (r, o) {
                1 & r &&
                  (Me(0, "div", 0)(1, "div")(2, "label", 1),
                  St(3, "Wybierz kierunek:"),
                  pe(),
                  Me(4, "select", 2),
                  Qe("ngModelChange", function (s) {
                    return (o.selectedKierunek = s);
                  })("change", function () {
                    return o.onKierunekChange();
                  }),
                  bn(5, Hx, 2, 2, "option", 3),
                  pe()(),
                  Me(6, "div")(7, "label", 4),
                  St(8, "Wybierz przystanek:"),
                  pe(),
                  Me(9, "select", 5),
                  Qe("ngModelChange", function (s) {
                    return (o.selectedPrzystanek = s);
                  })("change", function () {
                    return o.onPrzystanekChange();
                  }),
                  bn(10, $x, 2, 2, "option", 3),
                  pe()(),
                  bn(11, zx, 4, 2, "div", 6),
                  bn(12, qx, 5, 2, "div", 6),
                  pe()),
                  2 & r &&
                    (xe(4),
                    nt("ngModel", o.selectedKierunek),
                    xe(1),
                    nt("ngForOf", o.kierunki),
                    xe(4),
                    nt("ngModel", o.selectedPrzystanek),
                    xe(1),
                    nt("ngForOf", o.filteredPrzystanki),
                    xe(1),
                    nt("ngIf", o.selectedPrzystanek),
                    xe(1),
                    nt("ngIf", o.selectedPrzystanek));
              },
              dependencies: [mv, vv, VD, BD, qs, gD, Lc],
              styles: [
                ".departures[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;text-align:center}.departures[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:16px}.departures[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin-bottom:8px}.departures[_ngcontent-%COMP%]   .departure-times[_ngcontent-%COMP%]{align-items:center;display:flex;flex-wrap:wrap;margin:0 32px}.departures[_ngcontent-%COMP%]   .departure-times[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{width:25%}",
              ],
            }));
          }
          return e;
        })(),
        Zx = (() => {
          class e {
            constructor() {
              this.title = "busola-web";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = wa({
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
                  (Me(0, "header"),
                  ns(1, "img", 0),
                  pe(),
                  ns(2, "app-bus-departures"),
                  Me(3, "footer")(4, "a", 1),
                  St(5, "\xa9Projekt i realizacja Maciej Kusiak"),
                  pe()());
              },
              dependencies: [Wx],
              styles: [
                "header[_ngcontent-%COMP%]{width:100%;display:flex;justify-content:center;margin:16px 0}.logo--img[_ngcontent-%COMP%]{width:150px}footer[_ngcontent-%COMP%]{position:fixed;bottom:32px;width:100%;text-align:center}footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#000;text-decoration:none}",
              ],
            }));
          }
          return e;
        })(),
        Yx = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = Xt({ type: e, bootstrap: [Zx] }));
            static #n = (this.ɵinj = Nt({ imports: [SO, Bx] }));
          }
          return e;
        })();
      IO()
        .bootstrapModule(Yx)
        .catch((e) => console.error(e));
    },
  },
  (ne) => {
    ne((ne.s = 630));
  },
]);
