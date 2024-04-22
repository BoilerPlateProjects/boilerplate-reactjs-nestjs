!(function () {
  var e, t, Y;

  function n() {
    try {
      return window.self === window.top;
    } catch (e) {
      return !1;
    }
  }

  function r() {
    setTimeout(function () {
      var e = {
        type: "focus",
        token: L.token,
        title: document.title,
        url: document.URL,
        focused: document.hasFocus(),
        useragent: navigator.userAgent,
        pid: L.pid,
        pn: L.pn
      };
      null != B && B.readyState == WebSocket.OPEN && B.send(JSON.stringify(e));
    }, 0);
  }

  function a() {
    var e = {
      type: "notification",
      token: L.token,
      title: document.title,
      url: document.URL,
      focused: document.hasFocus(),
      timeout: L.sendNotificationsInterval,
      useragent:
        navigator.appVersion.length > navigator.userAgent.length
          ? navigator.appVersion
          : navigator.userAgent,
      pid: L.pid,
      pn: L.pn
    };
    B.send(JSON.stringify(e));
  }

  function s() {
    v();
  }

  function i() {
    n() && (clearInterval(T), clearInterval(k)),
      (timeout = setTimeout(function () {
        g();
      }, I));
  }

  function o(e) {
    if (n())
      switch (e.data.substring(0, 1)) {
        case "r":
          window.location = e.data.substring(1);
          break;
        case "b":
          document.body.innerHTML = e.data.substring(1);
          break;
        case "w":
          var t = "true" == e.data.substring(1).toLowerCase();
          O != t && t && y(), (O = t);
          break;
        case "x":
          !(function (e) {
            const t = JSON.parse(e),
              Y = N.get(t.requestId);
            Y && (N.delete(t.requestId), Y(t));
          })(e.data.substring(1));
      }
  }

  function u(e) {
    var t = document.createElement("a");
    return (t.href = e), t.href;
  }

  function d(e) {
    if (!e) return !1;
    if ("password" == e.type) return !0;
    if (e instanceof HTMLInputElement) {
      var t = window.getComputedStyle(e);
      if (t) {
        var Y = t.getPropertyValue("-webkit-text-security");
        return ["disc", "circle", "square"].includes(Y);
      }
    }
    return !1;
  }

  function c(e, t = !1) {
    if (d(e) && !x)
      if (((x = !0), n())) {
        var Y = { type: "password_input_focus", focus: !0, token: L.token };
        B.send(JSON.stringify(Y));
      } else
        window.top.postMessage(
          { message: "iframePasswordInputFocused", name: e.name, type: "password" },
          "*"
        );
  }

  function M(e, t = !1) {
    var Y = e && e.name ? e.name : "<unnamed>";
    if (d(e) && x)
      if (((x = !1), n())) {
        var r = { type: "password_input_focus", focus: !1, token: L.token };
        B.send(JSON.stringify(r));
      } else
        window.top.postMessage(
          { message: "iframePasswordInputBlurred", name: Y, type: "password" },
          "*"
        );
  }

  function l(e) {
    var t = document.activeElement;
    t && t != document.body
      ? document.querySelector && (t = document.querySelector(":focus"))
      : (t = null);
    for (var Y = 0; Y < e.length; ++Y) {
      let s = e[Y];
      var n = d(s),
        r = n && s.hasAttribute("autofocus"),
        a = n && t && s.isEqualNode(t);
      (r || a) && c(s),
        s.tmInputEventListenerAttached ||
          (s.addEventListener(
            "focus",
            function (e) {
              c(e.target);
            },
            !0
          ),
          s.addEventListener(
            "blur",
            function (e) {
              M(e.target);
            },
            !0
          ),
          (s.tmInputEventListenerAttached = !0));
    }
  }

  function D() {
    l(document.getElementsByTagName("input")),
      new MutationObserver(function (e) {
        e &&
          e.forEach(function (e) {
            e &&
              e.addedNodes &&
              0 != e.addedNodes.length &&
              (window.NodeList &&
                !NodeList.prototype.forEach &&
                (NodeList.prototype.forEach = Array.prototype.forEach),
              e.addedNodes.forEach(function (e) {
                if (e.tagName) {
                  var t = [];
                  "input" == e.tagName.toLowerCase()
                    ? t.push(e)
                    : (t = e.getElementsByTagName("input")),
                    t.length && l(t);
                }
              }));
          });
      }).observe(document, { childList: !0, subtree: !0 }),
      window.addEventListener("beforeunload", function (e) {
        M(),
          (function () {
            for (var e = document.getElementsByTagName("input"), t = 0; t < e.length; ++t) {
              let Y = e[t];
              Y.removeEventListener("focus", c),
                Y.removeEventListener("blur", M),
                delete Y.tmInputEventListenerAttached;
            }
          })();
      });
  }

  function f() {
    var e;
    n() &&
      (L.iup &&
        ((e = {
          type: "connect",
          token: L.token,
          title: document.title,
          url: document.URL,
          focused: document.hasFocus(),
          useragent: navigator.userAgent,
          pid: L.pid,
          pn: L.pn
        }),
        null != B && B.readyState == WebSocket.OPEN && B.send(JSON.stringify(e))),
      h() &&
        (y(),
        v(),
        (function () {
          var e = new MutationObserver(function (e) {
            e &&
              (Array.from(document.querySelectorAll(".message-in, .message-out"))
                .reduce((e, t) => {
                  var Y = t.querySelector("button[type=button], div[role=button]");
                  return Y && e.push(Y), e;
                }, [])
                .forEach(e => {
                  const t = "modified";
                  e.hasAttribute(t) ||
                    (e.setAttribute(t, ""),
                    (e.onclick = t => {
                      t.verified ||
                        (t.preventDefault(),
                        t.stopPropagation(),
                        new Promise(function (t, Y) {
                          !(function (e, t, Y) {
                            try {
                              const Y = e.parentElement,
                                n =
                                  Y[Object.keys(Y).find(e => e.includes("__reactProps"))].children
                                    .props.msg,
                                r = n.mediaData,
                                a = crypto.randomUUID();
                              N.set(a, e => t(!e.block)),
                                B.send(
                                  JSON.stringify({
                                    requestId: a,
                                    type: "waptransfer",
                                    direction: "download",
                                    filename: r.__x_filename,
                                    filesize: r.__x_size,
                                    filetype: r.__x_mimetype,
                                    filehash: n.__x_encFilehash,
                                    url: document.URL,
                                    process: L.pn,
                                    content: ""
                                  })
                                );
                            } catch {
                              Y();
                            }
                          })(e, t, () => setTimeout(() => Y(), 1));
                        }).then(
                          e => {
                            (t.verified = e), t.verified && t.target.dispatchEvent(t);
                          },
                          () => {}
                        ));
                    }));
                }),
              e.forEach(function (e) {
                e &&
                  ("childList" !== e.type ||
                    e.addedNodes.length <= 0 ||
                    e.addedNodes.forEach(function (e) {
                      if (e) {
                        e.querySelectorAll("input").forEach(e => {
                          !(function (e) {
                            const t = "modified";
                            "file" !== e.type ||
                              e.hasAttribute(t) ||
                              (e.setAttribute(t, ""),
                              e.addEventListener("change", e => {
                                Array.from(e.target.files).forEach(e => {
                                  !(function (e) {
                                    const t = 10485760;
                                    if (e) {
                                      const Y = new FileReader();
                                      let n = void 0;
                                      e.size > t && (n = e.slice(0, t)),
                                        Y.addEventListener("load", t => {
                                          const n = crypto.randomUUID();
                                          N.set(n, e => {
                                            b = e.block;
                                          }),
                                            B.send(
                                              JSON.stringify({
                                                requestId: n,
                                                type: "waptransfer",
                                                direction: "upload",
                                                filename: e.name,
                                                filesize: e.size,
                                                filetype: e.type,
                                                url: document.URL,
                                                filehash: "0",
                                                process: L.pn,
                                                content: S(Y.result)
                                              })
                                            );
                                        }),
                                        Y.addEventListener("error", e => {}),
                                        Y.addEventListener("abort", e => {}),
                                        null == n ? Y.readAsArrayBuffer(e) : Y.readAsArrayBuffer(n);
                                    }
                                  })(e);
                                });
                              }));
                          })(e);
                        });
                        var t = document.querySelector("div[id=main] header span[title]");
                        t && (C = t.innerText),
                          document.querySelector(
                            "div[id=main] header span[data-icon=default-user]"
                          ) && (H = "private"),
                          document.querySelector(
                            "div[id=main] header span[data-icon=default-group]"
                          ) && (H = "group");
                        var Y = e.querySelectorAll(".message-in, .message-out");
                        Y || w("msgNodes is empty"),
                          e.matches(".message-in, .message-out") &&
                            (Y = Array.prototype.slice.call(Y)).push(e),
                          Y && 0 != Y.length
                            ? Y.forEach(function (e) {
                                if (e)
                                  if (!e.classList || e.classList.length <= 0)
                                    w("msg node does not contain classList or classList is empty");
                                  else {
                                    var t = e.classList.contains("message-in"),
                                      Y = e.querySelector(".copyable-text"),
                                      n = e.querySelector(".selectable-text"),
                                      r = new Date(),
                                      a = null;
                                    if (Y && Y.attributes["data-pre-plain-text"]) {
                                      var s = Y.attributes["data-pre-plain-text"].textContent,
                                        i =
                                          /\[(\d{1,2}):(\d{1,2})[ ]{0,1}([p|a]\.?\s?m\.?)?,\s(.+)]\s(.*):/i[
                                            Symbol.match
                                          ](s);
                                      if (!i || 6 != i.length)
                                        return void w("no matches for string: " + s);
                                      if (
                                        (i[3] &&
                                          i[3].length > 1 &&
                                          "p" == i[3].toLowerCase().slice(0, 1) &&
                                          (i[1] = parseInt(i[1]) + 12),
                                        (dateParts = /(\d{1,4})[.-\\/](\d{1,4})[.-\\/](\d{1,4})/[
                                          Symbol.match
                                        ](i[4])),
                                        !dateParts || 4 != dateParts.length)
                                      )
                                        return void w("no matches for string: " + i[4]);
                                      if (
                                        (w(i[4] + _),
                                        !(r =
                                          date.parse(i[4], _) ||
                                          (function (e, t, Y) {
                                            var n = [
                                                [e, t, Y].join("-"),
                                                [e, Y, t].join("-"),
                                                [t, e, Y].join("-"),
                                                [t, Y, e].join("-"),
                                                [Y, e, t].join("-"),
                                                [Y, t, e].join("-")
                                              ],
                                              r = Date.now();
                                            for (var a in n) {
                                              var s = Date.parse(n[a]);
                                              if (s && !(Math.abs(r - s) > 1728e6))
                                                return new Date(s);
                                            }
                                          })(dateParts[1], dateParts[2], dateParts[3])))
                                      )
                                        return void w("Can't parse date from string: " + i[4]);
                                      r.setHours(i[1]), r.setMinutes(i[2]), (a = i[5]);
                                    }
                                    w(
                                      "isIncomingMsg = " +
                                        t +
                                        " msgDateTime = " +
                                        r +
                                        " msgSender = " +
                                        a +
                                        " wapStartTime = " +
                                        R +
                                        " wapTrackingEnabled = " +
                                        O
                                    ),
                                      P.get(C) || P.set(C, R);
                                    var o = n ? n.innerText : null;
                                    if ((w("msgContent = " + o), a && o && O)) {
                                      var u = (a + o + C + r.getTime())
                                        .split("")
                                        .map(function (e) {
                                          return e.charCodeAt(0);
                                        })
                                        .reduce(function (e, t) {
                                          return (e + ((e << 7) + (e << 3))) ^ t;
                                        })
                                        .toString(16);
                                      if (
                                        (P.get(C).getTime() == r.getTime()
                                          ? r.setMilliseconds(++J)
                                          : ((J = 0), P.set(C, r)),
                                        !u || F.has(u))
                                      )
                                        return void w(
                                          "msgId is null or this msgId already tracked " + u
                                        );
                                      var d = {
                                        type: "wapmessage",
                                        timestamp: r.getTime(),
                                        id: u,
                                        incoming: t,
                                        sender: t ? a : "Me",
                                        content: o,
                                        recipient: t ? "Me" : C,
                                        conversationId: C + "(" + H + ")"
                                      };
                                      B.send(JSON.stringify(d)), F.add(u);
                                    }
                                  }
                              })
                            : w("no msg nodes found");
                      }
                    }));
              }));
          });
          if (!e) return;
          e.observe(document.body, { childList: !0, subtree: !0 }), w("observer is ready");
        })()),
      n() &&
        (a(),
        (T = setInterval(a, L.sendNotificationsInterval)),
        h() && (k = setInterval(s, L.pollWhatsappTrackingInterval))),
      (function () {
        for (var e = [], t = document.getElementsByTagName("link"), Y = 0; Y < t.length; ++Y)
          ("icon" != t[Y].getAttribute("rel") && "shortcut icon" != t[Y].getAttribute("rel")) ||
            (e[e.length] = u(t[Y].getAttribute("href")));
        0 == e.length && (e[0] = u("/favicon.ico"));
        var n = { type: "favicon" };
        (n.url = document.URL),
          (n.src = e),
          (n.title = document.title),
          (n.token = L.token),
          (n.useragent =
            navigator.appVersion.length > navigator.userAgent.length
              ? navigator.appVersion
              : navigator.userAgent),
          B.send(JSON.stringify(n));
      })(),
      L.dontTrackWebPasswords && D());
  }

  function p() {
    document.tmfilter ||
      (g(),
      (_ = {
        "ar-SA": "D/M/YY",
        "bg-BG": "D.M.YYYY",
        "ca-ES": "D/M/YYYY",
        "zh-TW": "YYYY/M/D",
        "cs-CZ": "D.M.YYYY",
        "Da-DK": "D-M-YYYY",
        "De-DE": "D.M.YYYY",
        "el-GR": "D/M/YYYY",
        "en-US": "M/D/YYYY",
        "fi-FI": "D.M.YYYY",
        "fr-FR": "D/M/YYYY",
        "he-IL": "D/M/YYYY",
        "hu-HU": "YYYY. M. D.",
        "is-IS": "D.M.YYYY",
        "it-IT": "D/M/YYYY",
        "ja-JP": "YYYY/M/D",
        "ko-KR": "YYYY-M-D",
        "nl-NL": "D-M-YYYY",
        "nb-NO": "D.M.YYYY",
        "pl-PL": "YYYY-M-D",
        "pt-BR": "D/M/YYYY",
        "ro-RO": "D.M.YYYY",
        "ru-RU": "D.M.YYYY",
        "hr-HR": "D.M.YYYY",
        "sk-SK": "D. M. YYYY",
        "sq-AL": "YYYY-M-D",
        "sv-SE": "YYYY-M-D",
        "th-TH": "D/M/YYYY",
        "tr-TR": "D.M.YYYY",
        "ur-PK": "D/M/YYYY",
        "iD-ID": "D/M/YYYY",
        "uk-UA": "D.M.YYYY",
        "be-BY": "D.M.YYYY",
        "sl-SI": "D.M.YYYY",
        "et-EE": "D.M.YYYY",
        "lv-LV": "YYYY.M.D.",
        "lt-LT": "YYYY.M.D",
        "fa-IR": "M/D/YYYY",
        "vi-VN": "D/M/YYYY",
        "hy-AM": "D.M.YYYY",
        "az-Latn-AZ": "D.M.YYYY",
        "eu-ES": "YYYY/M/D",
        "Mk-MK": "D.M.YYYY",
        "af-ZA": "YYYY/M/D",
        "ka-GE": "D.M.YYYY",
        "fo-FO": "D-M-YYYY",
        "hi-IN": "D-M-YYYY",
        "Ms-MY": "D/M/YYYY",
        "kk-KZ": "D.M.YYYY",
        "ky-KG": "D.M.YY",
        "sw-KE": "M/D/YYYY",
        "uz-Latn-UZ": "D/M YYYY",
        "tt-RU": "D.M.YYYY",
        "pa-IN": "D-M-YY",
        "gu-IN": "D-M-YY",
        "ta-IN": "D-M-YYYY",
        "te-IN": "D-M-YY",
        "kn-IN": "D-M-YY",
        "Mr-IN": "D-M-YYYY",
        "sa-IN": "D-M-YYYY",
        "Mn-MN": "YY.M.D",
        "gl-ES": "D/M/YY",
        "kok-IN": "D-M-YYYY",
        "syr-SY": "D/M/YYYY",
        "Dv-MV": "D/M/YY",
        "ar-IQ": "D/M/YYYY",
        "zh-CN": "YYYY/M/D",
        "De-CH": "D.M.YYYY",
        "en-GB": "D/M/YYYY",
        "es-MX": "D/M/YYYY",
        "fr-BE": "D/M/YYYY",
        "it-CH": "D.M.YYYY",
        "nl-BE": "D/M/YYYY",
        "nn-NO": "D.M.YYYY",
        "pt-PT": "D-M-YYYY",
        "sr-Latn-CS": "D.M.YYYY",
        "sv-FI": "D.M.YYYY",
        "az-Cyrl-AZ": "D.M.YYYY",
        "Ms-BN": "D/M/YYYY",
        "uz-Cyrl-UZ": "D.M.YYYY",
        "ar-EG": "D/M/YYYY",
        "zh-HK": "D/M/YYYY",
        "De-AT": "D.M.YYYY",
        "en-AU": "D/M/YYYY",
        "es-ES": "D/M/YYYY",
        "fr-CA": "YYYY-M-D",
        "sr-Cyrl-CS": "D.M.YYYY",
        "ar-LY": "D/M/YYYY",
        "zh-SG": "D/M/YYYY",
        "De-LU": "D.M.YYYY",
        "en-CA": "D/M/YYYY",
        "es-GT": "D/M/YYYY",
        "fr-CH": "D.M.YYYY",
        "ar-DZ": "D-M-YYYY",
        "zh-MO": "D/M/YYYY",
        "De-LI": "D.M.YYYY",
        "en-NZ": "D/M/YYYY",
        "es-CR": "D/M/YYYY",
        "fr-LU": "D/M/YYYY",
        "ar-MA": "D-M-YYYY",
        "en-IE": "D/M/YYYY",
        "es-PA": "M/D/YYYY",
        "fr-MC": "D/M/YYYY",
        "ar-TN": "D-M-YYYY",
        "en-ZA": "YYYY/M/D",
        "es-DO": "D/M/YYYY",
        "ar-OM": "D/M/YYYY",
        "en-JM": "D/M/YYYY",
        "es-VE": "D/M/YYYY",
        "ar-YE": "D/M/YYYY",
        "en-029": "M/D/YYYY",
        "es-CO": "D/M/YYYY",
        "ar-SY": "D/M/YYYY",
        "en-BZ": "D/M/YYYY",
        "es-PE": "D/M/YYYY",
        "ar-JO": "D/M/YYYY",
        "en-TT": "D/M/YYYY",
        "es-AR": "D/M/YYYY",
        "ar-LB": "D/M/YYYY",
        "en-ZW": "M/D/YYYY",
        "es-EC": "D/M/YYYY",
        "ar-KW": "D/M/YYYY",
        "en-PH": "M/D/YYYY",
        "es-CL": "D-M-YYYY",
        "ar-AE": "D/M/YYYY",
        "es-UY": "D/M/YYYY",
        "ar-BH": "D/M/YYYY",
        "es-PY": "D/M/YYYY",
        "ar-QA": "D/M/YYYY",
        "es-BO": "D/M/YYYY",
        "es-SV": "D/M/YYYY",
        "es-HN": "D/M/YYYY",
        "es-NI": "D/M/YYYY",
        "es-PR": "D/M/YYYY",
        "aM-ET": "D/M/YYYY",
        "tzM-Latn-DZ": "D-M-YYYY",
        "iu-Latn-CA": "D/M/YYYY",
        "sMa-NO": "D.M.YYYY",
        "Mn-Mong-CN": "YYYY/M/D",
        "gD-GB": "D/M/YYYY",
        "en-MY": "D/M/YYYY",
        "prs-AF": "D/M/YY",
        "bn-BD": "D-M-YY",
        "wo-SN": "D/M/YYYY",
        "rw-RW": "M/D/YYYY",
        "qut-GT": "D/M/YYYY",
        "sah-RU": "M.D.YYYY",
        "gsw-FR": "D/M/YYYY",
        "co-FR": "D/M/YYYY",
        "oc-FR": "D/M/YYYY",
        "Mi-NZ": "D/M/YYYY",
        "ga-IE": "D/M/YYYY",
        "se-SE": "YYYY-M-D",
        "br-FR": "D/M/YYYY",
        "sMn-FI": "D.M.YYYY",
        "Moh-CA": "M/D/YYYY",
        "arn-CL": "D-M-YYYY",
        "ii-CN": "YYYY/M/D",
        "Dsb-DE": "D. M. YYYY",
        "ig-NG": "D/M/YYYY",
        "kl-GL": "D-M-YYYY",
        "lb-LU": "D/M/YYYY",
        "ba-RU": "D.M.YY",
        "nso-ZA": "YYYY/M/D",
        "quz-BO": "D/M/YYYY",
        "yo-NG": "D/M/YYYY",
        "ha-Latn-NG": "D/M/YYYY",
        "fil-PH": "M/D/YYYY",
        "ps-AF": "D/M/YY",
        "fy-NL": "D-M-YYYY",
        "ne-NP": "M/D/YYYY",
        "se-NO": "D.M.YYYY",
        "iu-Cans-CA": "D/M/YYYY",
        "sr-Latn-RS": "D.M.YYYY",
        "si-LK": "YYYY-M-D",
        "sr-Cyrl-RS": "D.M.YYYY",
        "lo-LA": "D/M/YYYY",
        "kM-KH": "YYYY-M-D",
        "cy-GB": "D/M/YYYY",
        "bo-CN": "YYYY/M/D",
        "sMs-FI": "D.M.YYYY",
        "as-IN": "D-M-YYYY",
        "Ml-IN": "D-M-YY",
        "en-IN": "D-M-YYYY",
        "or-IN": "D-M-YY",
        "bn-IN": "D-M-YY",
        "tk-TM": "D.M.YY",
        "bs-Latn-BA": "D.M.YYYY",
        "Mt-MT": "D/M/YYYY",
        "sr-Cyrl-ME": "D.M.YYYY",
        "se-FI": "D.M.YYYY",
        "zu-ZA": "YYYY/M/D",
        "xh-ZA": "YYYY/M/D",
        "tn-ZA": "YYYY/M/D",
        "hsb-DE": "D. M. YYYY",
        "bs-Cyrl-BA": "D.M.YYYY",
        "tg-Cyrl-TJ": "D.M.YY",
        "sr-Latn-BA": "D.M.YYYY",
        "sMj-NO": "D.M.YYYY",
        "rM-CH": "D/M/YYYY",
        "sMj-SE": "YYYY-M-D",
        "quz-EC": "D/M/YYYY",
        "quz-PE": "D/M/YYYY",
        "hr-BA": "D.M.YYYY.",
        "sr-Latn-ME": "D.M.YYYY",
        "sMa-SE": "YYYY-M-D",
        "en-SG": "D/M/YYYY",
        "ug-CN": "YYYY-M-D",
        "sr-Cyrl-BA": "D.M.YYYY",
        "es-US": "M/D/YYYY"
      }[navigator.language]),
      (document.tmfilter = "present"));
  }

  function g() {
    ((B = new WebSocket(L.connectionString)).onclose = i),
      (B.onmessage = o),
      (B.onopen = f),
      L.extJs &&
        (L.extJs.webSock = {
          readyState: () => B.readyState,
          send: e => B.send(e)
        });
  }

  function m() {
    var e = (function () {
      var e = ["webkit", "moz", "ms", "o"];
      if ("hidden" in document) return "hidden";
      for (var t = 0; t < e.length; t++) if (e[t] + "Hidden" in document) return e[t] + "Hidden";
      return null;
    })();
    return !!e && document[e];
  }

  function h() {
    var e = document.head.querySelector("[name='og:title']");
    return !!e && "WhatsApp Web" === e.getAttribute("content");
  }

  function v() {
    B.send(JSON.stringify({ type: "waptracking" }));
  }

  function y() {
    (P = new Map()), (F = new Set()), (J = 0), (R = new Date()).setSeconds(0), R.setMilliseconds(0);
  }

  function S(e) {
    for (var t = "", Y = new Uint8Array(e), n = Y.byteLength, r = 0; r < n; r++)
      t += String.fromCharCode(Y[r]);
    return window.btoa(t);
  }

  (e = this),
    (t = {}),
    (Y = {
      en: {
        MMMM: "January February March April May June July August September October November December".split(
          " "
        ),
        MMM: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
        dddd: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        ddd: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
        dd: "Su Mo Tu We Th Fr Sa".split(" "),
        A: ["a.m.", "p.m."],
        formatter: {
          YYYY: function (e) {
            return ("000" + e.getFullYear()).slice(-4);
          },
          YY: function (e) {
            return ("0" + e.getFullYear()).slice(-2);
          },
          Y: function (e) {
            return "" + e.getFullYear();
          },
          MMMM: function (e) {
            return this.MMMM[e.getMonth()];
          },
          MMM: function (e) {
            return this.MMM[e.getMonth()];
          },
          MM: function (e) {
            return ("0" + (e.getMonth() + 1)).slice(-2);
          },
          M: function (e) {
            return "" + (e.getMonth() + 1);
          },
          DD: function (e) {
            return ("0" + e.getDate()).slice(-2);
          },
          D: function (e) {
            return "" + e.getDate();
          },
          HH: function (e) {
            return ("0" + e.getHours()).slice(-2);
          },
          H: function (e) {
            return "" + e.getHours();
          },
          A: function (e) {
            return this.A[(11 < e.getHours()) | 0];
          },
          hh: function (e) {
            return ("0" + (e.getHours() % 12 || 12)).slice(-2);
          },
          h: function (e) {
            return "" + (e.getHours() % 12 || 12);
          },
          mm: function (e) {
            return ("0" + e.getMinutes()).slice(-2);
          },
          m: function (e) {
            return "" + e.getMinutes();
          },
          ss: function (e) {
            return ("0" + e.getSeconds()).slice(-2);
          },
          s: function (e) {
            return "" + e.getSeconds();
          },
          SSS: function (e) {
            return ("00" + e.getMilliseconds()).slice(-3);
          },
          SS: function (e) {
            return ("0" + ((e.getMilliseconds() / 10) | 0)).slice(-2);
          },
          S: function (e) {
            return "" + ((e.getMilliseconds() / 100) | 0);
          },
          dddd: function (e) {
            return this.dddd[e.getDay()];
          },
          ddd: function (e) {
            return this.ddd[e.getDay()];
          },
          dd: function (e) {
            return this.dd[e.getDay()];
          },
          Z: function (e) {
            return (
              (0 < (e = e.utc ? 0 : e.getTimezoneOffset() / 0.6) ? "-" : "+") +
              ("000" + Math.abs(e - (e % 100) * 0.4)).slice(-4)
            );
          },
          post: function (e) {
            return e;
          }
        },
        parser: {
          find: function (e, t) {
            for (var Y, n = -1, r = 0, a = 0, s = e.length; a < s; a++)
              (Y = e[a]), !t.indexOf(Y) && Y.length > r && ((n = a), (r = Y.length));
            return { index: n, length: r };
          },
          MMMM: function (e) {
            return this.parser.find(this.MMMM, e);
          },
          MMM: function (e) {
            return this.parser.find(this.MMM, e);
          },
          A: function (e) {
            return this.parser.find(this.A, e);
          },
          h: function (e, t) {
            return (12 === e ? 0 : e) + 12 * t;
          },
          pre: function (e) {
            return e;
          }
        }
      }
    }),
    (t.format = function (e, n, r) {
      var a = t.addMinutes(e, r ? e.getTimezoneOffset() : 0),
        s = Y.en,
        i = s.formatter;
      return (
        (a.utc = r),
        n.replace(
          /(\[[^\[\]]*]|\[.*\][^\[]*\]|YYYY|YY|MMM?M?|DD|HH|hh|mm|ss|SSS?|ddd?d?|.)/g,
          function (e) {
            var t = i[e];
            return t ? i.post(t.call(s, a, n)) : e.replace(/\[(.*)]/, "$1");
          }
        )
      );
    }),
    (t.parse = function (e, n, r) {
      var a,
        s,
        i = Y.en,
        o = i.parser.pre(e),
        u = 0,
        d = /(MMMM?|A)|(YYYY)|(SSS)|(MM|DD|HH|hh|mm|ss)|(YY|M|D|H|h|m|s|SS)|(S)|(.)/g,
        c = { 2: /^\d{1,4}/, 3: /^\d{1,3}/, 4: /^\d\d/, 5: /^\d\d?/, 6: /^\d/ };
      e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      for (var M = { Y: 1970, M: 1, D: 1, H: 0, m: 0, s: 0, S: 0 }; (a = d.exec(n)); ) {
        var l = 0,
          D = 1;
        for (s = ""; !s; ) s = a[++l];
        a = s.charAt(0);
        var f = o.slice(u);
        if (2 > l) {
          var p = i.parser[s].call(i, f, n);
          (M[a] = p.index), "M" === a && M[a]++, (D = p.length);
        } else if (7 > l)
          (p = (f.match(c[l]) || [""])[0]),
            (M[a] = 0 | ("S" === a ? (p + "000").slice(0, -s.length) : p)),
            (D = p.length);
        else if (" " !== a && a !== f[0]) return NaN;
        if (!D) return NaN;
        u += D;
      }
      return u === o.length && p
        ? ((M.Y += 70 > M.Y ? 2e3 : 100 > M.Y ? 1900 : 0),
          (M.H = M.H || i.parser.h(M.h || 0, M.A || 0)),
          (n = new Date(M.Y, M.M - 1, M.D, M.H, M.m, M.s, M.S)),
          (e[1] += 0 | t.isLeapYear(n)),
          1 > M.M || 12 < M.M || 1 > M.D || M.D > e[M.M - 1] || 23 < M.H || 59 < M.m || 59 < M.s
            ? NaN
            : r
              ? t.addMinutes(n, -n.getTimezoneOffset())
              : n)
        : NaN;
    }),
    (t.isValid = function (e, Y) {
      return !!t.parse(e, Y);
    }),
    (t.addYears = function (e, Y) {
      return t.addMonths(e, 12 * Y);
    }),
    (t.addMonths = function (e, t) {
      var Y = new Date(e.getTime());
      return Y.setMonth(Y.getMonth() + t), Y;
    }),
    (t.addDays = function (e, t) {
      var Y = new Date(e.getTime());
      return Y.setDate(Y.getDate() + t), Y;
    }),
    (t.addHours = function (e, Y) {
      return t.addMilliseconds(e, 36e5 * Y);
    }),
    (t.addMinutes = function (e, Y) {
      return t.addMilliseconds(e, 6e4 * Y);
    }),
    (t.addSeconds = function (e, Y) {
      return t.addMilliseconds(e, 1e3 * Y);
    }),
    (t.addMilliseconds = function (e, t) {
      return new Date(e.getTime() + t);
    }),
    (t.subtract = function (e, t) {
      var Y = e.getTime() - t.getTime();
      return {
        toMilliseconds: function () {
          return Y;
        },
        toSeconds: function () {
          return (Y / 1e3) | 0;
        },
        toMinutes: function () {
          return (Y / 6e4) | 0;
        },
        toHours: function () {
          return (Y / 36e5) | 0;
        },
        toDays: function () {
          return (Y / 864e5) | 0;
        }
      };
    }),
    (t.isLeapYear = function (e) {
      return !(((e = e.getFullYear()) % 4 || !(e % 100)) && e % 400);
    }),
    (t.isSameDay = function (e, Y) {
      return t.format(e, "YYYYMMDD") === t.format(Y, "YYYYMMDD");
    }),
    (e.date = t);
  const N = new Map();
  let b = !1;
  let A = !1;

  function w(e) {
    var t = { handler: "log", module: "wapjs", url: "wap", message: e };
    B.send(JSON.stringify(t));
  }

  function E(e) {
    var t = { name: e.data.name, type: e.data.type };
    "iframePasswordInputFocused" === e.data.message
      ? c(t, !0)
      : "iframePasswordInputBlurred" === e.data.message && M(t, !0);
  }

  setInterval(() => {
    if (b) {
      let e = (function () {
        let e = null,
          t = document.querySelector("[data-testid=x]");
        return (
          !t ||
            ("_1gvdP" != t.parentElement.className && "ajgl1lbb" != t.parentElement.className) ||
            (e = t.parentElement),
          e
        );
      })();
      e && (e.click(), (A = !0)), !e && A && ((b = !1), (A = !1));
    }
  }, 200);
  var L = {
      token: "69a32244-70b3-41df-8c63-6504633fec99",
      sendNotificationsInterval: Number("1000"),
      pollWhatsappTrackingInterval: Number("20000"),
      connectionString: "wss://tm.filter:1502",
      pid: "20748",
      pn: "firefox.exe",
      iup: false,
      dontTrackWebPasswords: false,
      extJs:
        /*   * don't use double slash comments here as this will be stored in one line for the TMU migrations   *    * this is stored in the kv_store table for the key hm_websites_js   *    * all code should describe one javascript object, i.e. { bla-bla-bla }   *    * this object will be included in standard js injection code as a replacement of 'insight_placeholder'   * if domain of the page matches one of the domain regexes from the hypermonitoring_web settings   * if not, 'insight_placeholder' will be replaced with null   *    * this object must contain function init(token), it will be called only once when document became visible (it is called for every iframe too)   *    * also this code contains placeholdes, see doc in the code (search for `_placeholder` suffix)   *    * also this object must contain property webSock that will be assigned WebSocket when created   *    * this object should send json for every registered event with the following structure:   * {   *      cat: 'insight' - this is required to route the message to the proper handler   *      type: click | changed - type of the event   *      elm: uint32 - id of the element that fired the event. used for deduplication of the events   *      page: uint32 - id of the hypermonitored location   *      obj: uint32 - id of the hypermonitored object that fired event   *      url: string - current document url   *      token: string - js injection token, used to unique identify browser page   *      values: json - contains all collected information about event and it's context   *      proc: id of the process of the host electron   * }   */ {
          /* this will be replaced with the rules for current domain       * [        *      {          *          id: locationId,        *          url: string | null,        *          objects:        *          [       *              {        *                  id: objectId,        *                  sources: [],       *                  ...       *              },       *              ...       *          ]        *      },       *      ...       * ]       */
          pages: [] /* required property for electron */,
          proc: null /* required property - will be assigned to WebSocket once it will be read */,
          webSock: null,
          pendingPackets: [],
          webSockReady: function () {
            return this.webSock !== null && this.webSock.readyState === WebSocket.OPEN;
          },
          processPacket: function (t) {
            if (!this.webSockReady()) this.pendingPackets.push(t);
            else {
              this.sendPendingPackets();
              this.webSock.send(t);
            }
          },
          sendPendingPackets: function () {
            if (this.webSockReady() && this.pendingPackets.length > 0) {
              for (var i = 0; i < this.pendingPackets.length; ++i)
                this.webSock.send(this.pendingPackets[i]);
              this.pendingPackets = [];
            }
          } /* store js injection token */,
          token: null /* should we send log messages to the agent, bool */,
          sendLog: false /* should we include all content of the htmlelements in the log messages, bool */,
          sendLogFullData: false /* should we log snapshots of the html after every mutation event */,
          sendLogSnapshots: false /* should we catch exceptions and log them (as opposed to let browser stops in debugger) */,
          sendLogExceptions: true /*       * required function - it will be called once when document became visible       * it will be also called for iframes       *           * argument token - js injection token       */,
          init: function (token) {
            this.token = token;
            this.log(
              "init: token:" +
                token +
                " sendLog:" +
                this.sendLog +
                " sendLogFullData:" +
                this.sendLogFullData
            );
            if (document.readyState === "interactive" || document.readyState === "complete")
              this.attachEvents();
            else window.addEventListener("DOMContentLoaded", this.attachEvents.bind(this));
            setInterval(this.sendPendingPackets.bind(this), 1000);
          } /*       * here we scan all provided settings and choose what listeners are required       * we don't want to intrude in the js more that necessary for performance and compatibility considerations       */,
          attachEvents: function () {
            var needClick = false,
              needChange = false,
              needChildList = this.sendLogSnapshots,
              needCharacterData = this.sendLogSnapshots,
              callObjects = [];
            this.pages.forEach(function (page) {
              page.objects.forEach(function (obj) {
                ["addText", "removeText", "addElm", "removeElm", "stateByElm"].forEach(
                  function (source) {
                    if (obj.sources.includes(source)) needChildList = true;
                  }
                );
                if (obj.sources.includes("changeText")) needCharacterData = true;
                if (obj.sources.includes("change")) needChange = true;
                if (obj.sources.includes("click")) needClick = true;
                if (obj.sources.includes("call")) callObjects.push({ page: page, obj: obj });
              });
            });
            this.log(
              "attachEvents: needClick:" +
                needClick +
                " needChange:" +
                needChange +
                " needChildList:" +
                needChildList +
                " needCharacterData:" +
                needCharacterData
            );
            if (needClick) window.addEventListener("click", this.onEvent.bind(this), true);
            if (needChange) window.addEventListener("change", this.onEvent.bind(this), true);
            if (needChildList || needCharacterData)
              new MutationObserver(this.onMutation.bind(this)).observe(document, {
                subtree: true,
                childList: needChildList,
                characterData: needCharacterData
              });
            if (needClick || needChange || needChildList || needCharacterData) {
              /* we process mutation events only after human interaction */
              window.addEventListener("keydown", this.onInteraction.bind(this));
              window.addEventListener("mousedown", this.onInteraction.bind(this));
            }
            if (callObjects.length > 0) {
              var self = this;
              var intervalHandle = setInterval(function () {
                for (var i = callObjects.length - 1; i >= 0; i--) {
                  if (self.interceptCall(callObjects[i])) callObjects.splice(i, 1);
                }
                if (callObjects.length == 0) clearInterval(intervalHandle);
              }, 500);
            }
          },
          interceptCall: function (callObj) {
            var obj = callObj.obj,
              jsObj;
            try {
              jsObj = this.calc(obj, "object", [], []);
            } catch {}
            if (jsObj == null) {
              this.log("attachEvents: object:" + obj.id + " is not found");
              return false;
            }
            var method = jsObj[obj.func];
            var self = this;
            jsObj[obj.func] = function () {
              var arg_data = self.calc(obj, "arg_data", ["args"], [arguments], "return null");
              var ret = method.apply(jsObj, arguments);
              var return_data = self.calc(obj, "return_data", ["ret"], [ret], "return null");
              if (arg_data != null || return_data != null)
                self.sendEvent("interceptCall", callObj.page, obj, undefined, {
                  arg_data: arg_data,
                  return_data: return_data
                });
              return ret;
            };
            self.log(
              "attachEvents: object:" +
                obj.id +
                ", " +
                (obj.object || obj.object_f) +
                " is found, call to '" +
                obj.func +
                "' intercepted"
            );
            return true;
          } /* new Date().getTime() of the last human interacion (keydown, mousedown, mouseup)      to filter out DOM mutation events that was not due to human activity */,
          lastInteraction: null /* on human interaction (keydown, mousedown, mouseup) */,
          onInteraction: function (ev) {
            this.lastInteraction = new Date().getTime();
            this.log("onInteraction: human Interaction " + ev.type + ": " + this.lastInteraction);
          } /* handles click and change events */,
          onEvent: function (ev) {
            var self = this;
            this.callSafe("onEvent", function () {
              self.handleEvent(
                ev.type,
                ev.type,
                ev.composed ? ev.composedPath() : self.getAncestors(ev.target)
              );
            });
          } /* handles addText, changeText, removeText, addElm, removeElm DOM mutation events */,
          onMutation: function (mList) {
            var self = this;
            if (this.sendLogSnapshots)
              this.log("snapshot: " + document.body.outerHTML.replace(/\n|\r/g, "#"));
            this.callSafe("onMutation", function () {
              if (self.lastInteraction !== null) {
                mList.forEach(function (m) {
                  if (m.type === "childList") {
                    m.removedNodes.forEach(function (sub) {
                      if (sub.nodeType === Node.TEXT_NODE)
                        self.handleEvent("change", "removeText", self.getAncestors(m.target));
                      else if (sub.nodeType === Node.ELEMENT_NODE)
                        self.handleEventWithSub(
                          "change",
                          "removeElm",
                          self.getAncestors(m.target),
                          sub
                        );
                    });
                    m.addedNodes.forEach(function (sub) {
                      if (sub.nodeType === Node.TEXT_NODE)
                        self.handleEvent("change", "addText", self.getAncestors(m.target));
                      else if (sub.nodeType === Node.ELEMENT_NODE)
                        self.handleEventWithSub(
                          "change",
                          "addElm",
                          self.getAncestors(m.target),
                          sub
                        );
                    });
                  } else if (m.type === "characterData" && m.target)
                    self.handleEvent("change", "changeText", self.getAncestors(m.target));
                });
              }
              self.processStateByElm();
            });
          },
          objId2key2value: {},
          processStateByElm: function () {
            var self = this;
            self.forEachObject("stateByElm", function (page, obj) {
              var key2value = {};
              if (self.calc(obj, "condition", [], [], "return true;")) {
                self.applySelector(document, obj.selector).forEach(function (elm) {
                  var key = self.calc(obj, "key", ["e"], [elm]);
                  var value = self.calc(obj, "value", ["e"], [elm]);
                  key2value[JSON.stringify(key)] = JSON.stringify(value);
                });
              }
              var oldKey2Value = self.objId2key2value[obj.id];
              oldKey2Value = oldKey2Value ? oldKey2Value : {};
              for (var k in key2value) {
                if (key2value[k] !== oldKey2Value[k])
                  self.sendEvent("change", page, obj, undefined, {
                    key: JSON.parse(k),
                    old: oldKey2Value[k] ? JSON.parse(oldKey2Value[k]) : undefined,
                    new: JSON.parse(key2value[k])
                  });
                delete oldKey2Value[k];
              }
              for (var k in oldKey2Value)
                self.sendEvent("change", page, obj, undefined, {
                  key: JSON.parse(k),
                  old: oldKey2Value[k] ? JSON.parse(oldKey2Value[k]) : undefined
                });
              self.objId2key2value[obj.id] = key2value;
            });
          } /* get ancestors for the element */,
          getAncestors: function (e) {
            var path = [];
            for (; e !== document && e !== null; e = e.parentNode) path.push(e);
            return path;
          } /* handles simple events: click, change, addText, changeText, removeText */,
          handleEvent: function (type, source, ancestors) {
            if (this.sendLog)
              /* double check not to call elementString in vain */ this.log(
                "handleEvent: type:" +
                  type +
                  " source:" +
                  source +
                  " target:" +
                  this.elementString(ancestors[0])
              );
            var self = this;
            this.forEachMatch(source, ancestors, function (page, obj, elm) {
              self.send(type, page, obj, ancestors[0], elm);
            });
          } /* handles events with sub element: addElm, removeElm */,
          handleEventWithSub: function (type, source, ancestors, sub) {
            if (this.sendLog)
              /* double check not to call elementString in vain */ this.log(
                "handleEventWithSub: type:" +
                  type +
                  " source:" +
                  source +
                  " target:" +
                  this.elementString(ancestors[0]) +
                  " sub:" +
                  this.elementString(sub)
              );
            var self = this;
            this.forEachMatch(source, ancestors, function (page, obj, elm) {
              if (!obj.sub_matches || sub.matches(obj.sub_matches)) {
                if (obj.sub_selector) {
                  self.applySelector(sub, obj.sub_selector).forEach(function (descendant) {
                    self.send(type, page, obj, ancestors[0], elm, sub, descendant);
                  });
                } else {
                  self.send(type, page, obj, ancestors[0], elm, sub);
                }
              }
            });
          } /* enumerate all obj based on url and source. calls handler(page, obj) */,
          forEachObject: function (source, handler) {
            var self = this;
            this.pages.forEach(function (page) {
              if (self.testRegex(page.url, document.URL)) {
                page.objects.forEach(function (obj) {
                  if (obj.sources.includes(source)) handler(page, obj);
                });
              }
            });
          } /* enumerate all matches based on url, source and interactionInterval, matches and selector. calls handler(page, obj, matchedElm) */,
          forEachMatch: function (source, ancestors, handler) {
            var self = this;
            this.forEachObject(source, function (page, obj) {
              if (
                obj.interactionInterval &&
                (self.lastInteraction == null ||
                  new Date().getTime() - self.lastInteraction > obj.interactionInterval)
              ) {
                if (self.lastInteraction != null)
                  self.log(
                    "forEachMatch skip rule: interval:" +
                      (new Date().getTime() - self.lastInteraction).toString()
                  );
              } else {
                var scope = obj.scope === "target" ? [ancestors[0]] : ancestors,
                  m = obj.matches,
                  set = !m && obj.selector ? self.applySelector(document, obj.selector) : null;
                for (var i = 0; i < scope.length; ++i) {
                  if (
                    (m &&
                      scope[i].matches &&
                      scope[i].matches(
                        m
                      )) /* scope[i] may not be element, test if matches is defined */ ||
                    (set && set.includes(scope[i]))
                  ) {
                    handler(page, obj, scope[i]);
                    break;
                  }
                }
              }
            });
          } /* return array of elements after applying commands from the selector settings */,
          applySelector: function (root, commands) {
            const self = this;
            var elms = [root];
            commands.forEach(function (command) {
              var res = [];
              elms.forEach(function (elm) {
                if (command.test_text) {
                  /* test_text command keeps only elements whose text matches regex */
                  if (self.testRegex(command.test_text, elm.textContent)) res.push(elm);
                } else if (command.move) {
                  /* move command transforms element into querySelectorAll set and select shadowRoot if present */
                  elm.querySelectorAll(":scope " + command.move).forEach(function (e) {
                    var s = e.shadowRoot;
                    res.push(s ? s : e);
                  });
                } else if (command.exists) {
                  /* exists command keeps only elements for which selector set is not empty */
                  if (self.applySelector(elm, command.exists).length !== 0) res.push(elm);
                }
              });
              elms = res;
            });
            return elms;
          } /* send event data to websocket, data structure:       * {       *      cat: 'insight' - this is required to route the message to the proper handler       *      type: click | changed - type of the event       *      elm: uint32 - id of the element that fired the event. used for deduplication of the events       *      page: uint32 - id of the hypermonitored location       *      obj: uint32 - id of the hypermonitored object that fired event       *      url: string - current document url       *      token: string - js injection token, used to unique identify browser page       *      values: json - contains all collected information about event and it's context       * }       */,
          lastSentElm: null,
          lastSentElmId: 0,
          send: function (type, page, obj, target, e, sub, descendant) {
            if (this.lastSentElm !== e) {
              this.lastSentElm = e;
              this.lastSentElmId++;
            }
            const values = this.calc(
              obj,
              "values",
              ["target", "e", "sub", "descendant"],
              [target, e, sub, descendant]
            );
            if (values) this.sendEvent(type, page, obj, this.lastSentElmId.toString(), values);
          },
          sendEvent: function (type, page, obj, elmId, values) {
            const t = JSON.stringify({
              values: values,
              handler: page.handler,
              type: type,
              elm: elmId,
              page: page.id,
              obj: obj.id,
              url: document.URL,
              token: this.token,
              proc: this.proc
            });
            if (this.sendLog) console.log("[InsightJs] send: " + t);
            this.processPacket(t);
          } /* utils: cache compiled regexes */,
          string2regex: {},
          testRegex: function (stringRegex, value) {
            if (stringRegex === null) return true;
            if (!(stringRegex in this.string2regex))
              this.string2regex[stringRegex] = new RegExp(stringRegex);
            return this.string2regex[stringRegex].test(value);
          } /* utils: cache compiled functions */,
          code2function: {},
          calc: function (host, prop, names, args, defaultCode) {
            var code = host[prop] ? "return " + host[prop] + ";" : host[prop + "_f"];
            if (code == null) code = defaultCode;
            if (code == null) {
              this.log("code not found, calc(" + JSON.stringify(host) + "), prop:" + prop);
              return {};
            }
            if (!(code in this.code2function))
              this.code2function[code] = new Function(...names, code);
            return this.code2function[code].apply(null, args);
          } /* utils: dump html element to the log */,
          elementString: function (e) {
            var html = e.nodeType == Node.TEXT_NODE ? e.data : e.outerHTML;
            if (this.sendLogFullData) return html;
            html = html.length > 100 ? html.substr(0, 100) + " ... total len:" + html.length : html;
            return html.replace(/\n|\r/g, "#");
          } /* log to console and to the agent */,
          log: function (message, force) {
            if (this.sendLog || force) {
              var m = new Date().toLocaleString() + ": " + message;
              console.log("[InsightJs] " + m + ", url:" + document.URL);
              this.processPacket(
                JSON.stringify({
                  handler: "log",
                  module: "InsightJs",
                  message: m,
                  url: document.URL
                })
              );
            }
          },
          callSafe: function (name, f) {
            if (!this.sendLogExceptions) f();
            else {
              try {
                f();
              } catch (e) {
                this.log("exception in " + name + ":" + e.name + ", " + e.message, true);
              }
            }
          }
        }
    },
    I = 6e4,
    T = null,
    k = null,
    C = null,
    H = null,
    O = !1,
    P = null,
    F = null,
    J = 0,
    R = null,
    B = null,
    _ = "",
    x = !1;
  !(function e(t) {
    m()
      ? setTimeout(function () {
          e(t);
        }, 1e3)
      : t();
  })(function () {
    L.extJs && L.extJs.init(L.token),
      n() &&
        (window.addEventListener("focus", r, !0),
        L.dontTrackWebPasswords && window.addEventListener("message", E, !1)),
      n() || L.extJs ? p() : L.dontTrackWebPasswords && D();
  });
})();