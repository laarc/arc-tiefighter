

if (typeof jseval === 'undefined') {
  jseval = eval;
}

global = window;

var foo	= ml(function(){ /*
  this
  is
  a
  multiline
  string.
*/})

function innerSplit(s, by) {
  by = by || "\n";
  return s.split(by).slice(1, -1).join(by);
}

function ml(x) {
  return innerSplit(x.toString());
}

function require(name) {
  if(!(name in modules)) {
    console.error(name + " unknown requirement");
  }
  if(global[name] === undefined) {
    modules[name]["require"]()
  }
  if(global[name] === undefined) {
    console.error("failed to require " + name);
    return;
  }
  return global[name];
}

function jsrep(s) {
  //console.log(s);
  return jseval(s);
}

modules = {}
exports = {}

function pkg(name, f) {
  modules[name] = {}
  modules[name]["require"] = function() {
    f.bind(modules[name])();
    modules[name]["exports"] = exports;
    global[name] = exports;
    exports = {}
  }
  return modules[name]
}

pkg("path", function(){ 
   exports.sep = "/";   
});
require("path");

pkg("process", function() {
   exports.argv = [];
   exports.stdout = {};
   exports.stdout.write = console.log.bind(console);
   exports.stdin = {};
   exports.stdin.setEncoding = function (enc) { }
   exports.stdin.on = function (kind, cb) { }
});
require("process");

pkg("fs", function() {
  exports.readFileSync = function(path, encoding) { return ""; }
  exports.writeFileSync = function(path, data, encoding) { return ""; }
  exports.existsSync = function(path) { return false; }
});
require("fs");

pkg("compiler", function () {
var reader = require("reader");
var getenv = function (k, p) {
  if (string63(k)) {
    var b = find(function (e) {
      return(e[k]);
    }, reverse(environment));
    if (is63(b)) {
      if (p) {
        return(b[p]);
      } else {
        return(b);
      }
    }
  }
};
var macro_function = function (k) {
  return(getenv(k, "macro"));
};
var macro63 = function (k) {
  return(is63(macro_function(k)));
};
var special63 = function (k) {
  return(is63(getenv(k, "special")));
};
var special_form63 = function (form) {
  return(! atom63(form) && special63(hd(form)));
};
var statement63 = function (k) {
  return(special63(k) && getenv(k, "stmt"));
};
var symbol_expansion = function (k) {
  return(getenv(k, "symbol"));
};
var symbol63 = function (k) {
  return(is63(symbol_expansion(k)));
};
var variable63 = function (k) {
  var b = first(function (frame) {
    return(frame[k]);
  }, reverse(environment));
  return(! atom63(b) && is63(b.variable));
};
bound63 = function (x) {
  return(macro63(x) || special63(x) || symbol63(x) || variable63(x));
};
quoted = function (form) {
  if (string63(form)) {
    return(escape(form));
  } else {
    if (atom63(form)) {
      return(form);
    } else {
      return(join(["list"], map(quoted, form)));
    }
  }
};
var literal = function (s) {
  if (string_literal63(s)) {
    return(s);
  } else {
    return(quoted(s));
  }
};
var _names = {};
unique = function (x) {
  if (_names[x]) {
    var i = _names[x];
    _names[x] = _names[x] + 1;
    return(unique(x + i));
  } else {
    _names[x] = 1;
    return("_" + x);
  }
};
var stash42 = function (args) {
  if (keys63(args)) {
    var l = ["%object", "\"_stash\"", true];
    var _o = args;
    var k = undefined;
    for (k in _o) {
      var v = _o[k];
      var _e9;
      if (numeric63(k)) {
        _e9 = parseInt(k);
      } else {
        _e9 = k;
      }
      var _k = _e9;
      if (! number63(_k)) {
        add(l, literal(_k));
        add(l, v);
      }
    }
    return(join(args, [l]));
  } else {
    return(args);
  }
};
var bias = function (k) {
  if (number63(k) && !( target === "js")) {
    if (target === "js") {
      k = k - 1;
    } else {
      k = k + 1;
    }
  }
  return(k);
};
bind = function (lh, rh) {
  if (atom63(lh)) {
    return([lh, rh]);
  } else {
    var id = unique("id");
    var bs = [id, rh];
    var _o1 = lh;
    var k = undefined;
    for (k in _o1) {
      var v = _o1[k];
      var _e10;
      if (numeric63(k)) {
        _e10 = parseInt(k);
      } else {
        _e10 = k;
      }
      var _k1 = _e10;
      var _e11;
      if (_k1 === "rest") {
        _e11 = ["cut", id, _35(lh)];
      } else {
        _e11 = ["get", id, ["quote", bias(_k1)]];
      }
      var x = _e11;
      if (is63(_k1)) {
        var _e12;
        if (v === true) {
          _e12 = _k1;
        } else {
          _e12 = v;
        }
        var _k2 = _e12;
        bs = join(bs, bind(_k2, x));
      }
    }
    return(bs);
  }
};
setenv("arguments%", {_stash: true, macro: function (from) {
  return([["get", ["get", ["get", "Array", ["quote", "prototype"]], ["quote", "slice"]], ["quote", "call"]], "arguments", from]);
}});
bind42 = function (args, body) {
  var args1 = [];
  var rest = function () {
    if (target === "js") {
      return(["unstash", ["arguments%", _35(args1)]]);
    } else {
      add(args1, "|...|");
      return(["unstash", ["list", "|...|"]]);
    }
  };
  if (atom63(args)) {
    return([args1, join(["let", [args, rest()]], body)]);
  } else {
    var bs = [];
    var r = unique("r");
    var _o2 = args;
    var k = undefined;
    for (k in _o2) {
      var v = _o2[k];
      var _e13;
      if (numeric63(k)) {
        _e13 = parseInt(k);
      } else {
        _e13 = k;
      }
      var _k3 = _e13;
      if (number63(_k3)) {
        if (atom63(v)) {
          add(args1, v);
        } else {
          var x = unique("x");
          add(args1, x);
          bs = join(bs, [v, x]);
        }
      }
    }
    if (keys63(args)) {
      bs = join(bs, [r, rest()]);
      bs = join(bs, [keys(args), r]);
    }
    return([args1, join(["let", bs], body)]);
  }
};
var quoting63 = function (depth) {
  return(number63(depth));
};
var quasiquoting63 = function (depth) {
  return(quoting63(depth) && depth > 0);
};
var can_unquote63 = function (depth) {
  return(quoting63(depth) && depth === 1);
};
var quasisplice63 = function (x, depth) {
  return(can_unquote63(depth) && ! atom63(x) && hd(x) === "unquote-splicing");
};
var expand_local = function (_x34) {
  var _id = _x34;
  var x = _id[0];
  var name = _id[1];
  var value = _id[2];
  return(["%local", name, macroexpand(value)]);
};
var expand_function = function (_x36) {
  var _id1 = _x36;
  var x = _id1[0];
  var args = _id1[1];
  var body = cut(_id1, 2);
  add(environment, {});
  var _o3 = args;
  var _i3 = undefined;
  for (_i3 in _o3) {
    var _x37 = _o3[_i3];
    var _e14;
    if (numeric63(_i3)) {
      _e14 = parseInt(_i3);
    } else {
      _e14 = _i3;
    }
    var __i3 = _e14;
    setenv(_x37, {_stash: true, variable: true});
  }
  var _x38 = join(["%function", args], macroexpand(body));
  drop(environment);
  return(_x38);
};
var expand_definition = function (_x40) {
  var _id2 = _x40;
  var x = _id2[0];
  var name = _id2[1];
  var args = _id2[2];
  var body = cut(_id2, 3);
  add(environment, {});
  var _o4 = args;
  var _i4 = undefined;
  for (_i4 in _o4) {
    var _x41 = _o4[_i4];
    var _e15;
    if (numeric63(_i4)) {
      _e15 = parseInt(_i4);
    } else {
      _e15 = _i4;
    }
    var __i4 = _e15;
    setenv(_x41, {_stash: true, variable: true});
  }
  var _x42 = join([x, name, args], macroexpand(body));
  drop(environment);
  return(_x42);
};
var expand_macro = function (_x44) {
  var _id3 = _x44;
  var name = _id3[0];
  var body = cut(_id3, 1);
  return(macroexpand(apply(macro_function(name), body)));
};
macroexpand = function (form) {
  if (symbol63(form)) {
    return(macroexpand(symbol_expansion(form)));
  } else {
    if (atom63(form)) {
      return(form);
    } else {
      var x = hd(form);
      if (x === "%local") {
        return(expand_local(form));
      } else {
        if (x === "%function") {
          return(expand_function(form));
        } else {
          if (x === "%global-function") {
            return(expand_definition(form));
          } else {
            if (x === "%local-function") {
              return(expand_definition(form));
            } else {
              if (macro63(x)) {
                return(expand_macro(form));
              } else {
                return(map(macroexpand, form));
              }
            }
          }
        }
      }
    }
  }
};
var quasiquote_list = function (form, depth) {
  var xs = [["list"]];
  var _o5 = form;
  var k = undefined;
  for (k in _o5) {
    var v = _o5[k];
    var _e16;
    if (numeric63(k)) {
      _e16 = parseInt(k);
    } else {
      _e16 = k;
    }
    var _k4 = _e16;
    if (! number63(_k4)) {
      var _e17;
      if (quasisplice63(v, depth)) {
        _e17 = quasiexpand(v[1]);
      } else {
        _e17 = quasiexpand(v, depth);
      }
      var _v = _e17;
      last(xs)[_k4] = _v;
    }
  }
  var _x47 = form;
  var _n6 = _35(_x47);
  var _i6 = 0;
  while (_i6 < _n6) {
    var x = _x47[_i6];
    if (quasisplice63(x, depth)) {
      var _x48 = quasiexpand(x[1]);
      add(xs, _x48);
      add(xs, ["list"]);
    } else {
      add(last(xs), quasiexpand(x, depth));
    }
    _i6 = _i6 + 1;
  }
  var pruned = keep(function (x) {
    return(_35(x) > 1 || !( hd(x) === "list") || keys63(x));
  }, xs);
  if (one63(pruned)) {
    return(hd(pruned));
  } else {
    return(join(["join"], pruned));
  }
};
quasiexpand = function (form, depth) {
  if (quasiquoting63(depth)) {
    if (atom63(form)) {
      return(["quote", form]);
    } else {
      if (can_unquote63(depth) && hd(form) === "unquote") {
        return(quasiexpand(form[1]));
      } else {
        if (hd(form) === "unquote" || hd(form) === "unquote-splicing") {
          return(quasiquote_list(form, depth - 1));
        } else {
          if (hd(form) === "quasiquote") {
            return(quasiquote_list(form, depth + 1));
          } else {
            return(quasiquote_list(form, depth));
          }
        }
      }
    }
  } else {
    if (atom63(form)) {
      return(form);
    } else {
      if (hd(form) === "quote") {
        return(form);
      } else {
        if (hd(form) === "quasiquote") {
          return(quasiexpand(form[1], 1));
        } else {
          return(map(function (x) {
            return(quasiexpand(x, depth));
          }, form));
        }
      }
    }
  }
};
expand_if = function (_x52) {
  var _id4 = _x52;
  var a = _id4[0];
  var b = _id4[1];
  var c = cut(_id4, 2);
  if (is63(b)) {
    return([join(["%if", a, b], expand_if(c))]);
  } else {
    if (is63(a)) {
      return([a]);
    }
  }
};
indent_level = 0;
indentation = function () {
  var s = "";
  var i = 0;
  while (i < indent_level) {
    s = s + "  ";
    i = i + 1;
  }
  return(s);
};
var reserved = {"else": true, "<": true, "true": true, "/": true, "end": true, "typeof": true, "function": true, "switch": true, "=": true, "or": true, "try": true, "catch": true, "until": true, "local": true, "repeat": true, "-": true, "false": true, "continue": true, "==": true, "and": true, "if": true, "for": true, ">=": true, "<=": true, "with": true, "return": true, "finally": true, "nil": true, "new": true, "do": true, "case": true, "break": true, "elseif": true, "+": true, "not": true, "void": true, "var": true, "%": true, "in": true, "delete": true, "throw": true, "debugger": true, "instanceof": true, "this": true, "while": true, "then": true, "default": true, "*": true, ">": true};
reserved63 = function (x) {
  return(reserved[x]);
};
var valid_code63 = function (n) {
  return(number_code63(n) || n > 64 && n < 91 || n > 96 && n < 123 || n === 46 || n === 95);
};
valid_id63 = function (id) {
  if (none63(id) || reserved63(id)) {
    return(false);
  } else {
    var i = 0;
    while (i < _35(id)) {
      if (! valid_code63(code(id, i))) {
        return(false);
      }
      i = i + 1;
    }
    return(true);
  }
};
key = function (k) {
  var i = inner(k);
  if (valid_id63(i)) {
    return(i);
  } else {
    if (target === "js") {
      return(k);
    } else {
      return("[" + k + "]");
    }
  }
};
mapo = function (f, t) {
  var o = [];
  var _o6 = t;
  var k = undefined;
  for (k in _o6) {
    var v = _o6[k];
    var _e18;
    if (numeric63(k)) {
      _e18 = parseInt(k);
    } else {
      _e18 = k;
    }
    var _k5 = _e18;
    var x = f(v);
    if (is63(x)) {
      add(o, literal(_k5));
      add(o, x);
    }
  }
  return(o);
};
var __x57 = [];
var _x58 = [];
_x58.lua = "not";
_x58.js = "!";
__x57["not"] = _x58;
var __x59 = [];
__x59["/"] = true;
__x59["*"] = true;
__x59["%"] = true;
var __x60 = [];
__x60["+"] = true;
__x60["-"] = true;
var __x61 = [];
var _x62 = [];
_x62.lua = "..";
_x62.js = "+";
__x61.cat = _x62;
var __x63 = [];
__x63["<="] = true;
__x63[">="] = true;
__x63["<"] = true;
__x63[">"] = true;
var __x64 = [];
var _x65 = [];
_x65.lua = "==";
_x65.js = "===";
__x64["="] = _x65;
var __x66 = [];
var _x67 = [];
_x67.lua = "and";
_x67.js = "&&";
__x66["and"] = _x67;
var __x68 = [];
var _x69 = [];
_x69.lua = "or";
_x69.js = "||";
__x68["or"] = _x69;
var infix = [__x57, __x59, __x60, __x61, __x63, __x64, __x66, __x68];
var unary63 = function (form) {
  return(two63(form) && in63(hd(form), ["not", "-"]));
};
var index = function (k) {
  return(k);
};
var precedence = function (form) {
  if (!( atom63(form) || unary63(form))) {
    var _o7 = infix;
    var k = undefined;
    for (k in _o7) {
      var v = _o7[k];
      var _e19;
      if (numeric63(k)) {
        _e19 = parseInt(k);
      } else {
        _e19 = k;
      }
      var _k6 = _e19;
      if (v[hd(form)]) {
        return(index(_k6));
      }
    }
  }
  return(0);
};
var getop = function (op) {
  return(find(function (level) {
    var x = level[op];
    if (x === true) {
      return(op);
    } else {
      if (is63(x)) {
        return(x[target]);
      }
    }
  }, infix));
};
var infix63 = function (x) {
  return(is63(getop(x)));
};
var compile_args = function (args) {
  var s = "(";
  var c = "";
  var _x71 = args;
  var _n9 = _35(_x71);
  var _i9 = 0;
  while (_i9 < _n9) {
    var x = _x71[_i9];
    s = s + c + compile(x);
    c = ", ";
    _i9 = _i9 + 1;
  }
  return(s + ")");
};
var escape_newlines = function (s) {
  var s1 = "";
  var i = 0;
  while (i < _35(s)) {
    var c = char(s, i);
    var _e20;
    if (c === "\n") {
      _e20 = "\\n";
    } else {
      _e20 = c;
    }
    s1 = s1 + _e20;
    i = i + 1;
  }
  return(s1);
};
var id = function (id) {
  var id1 = "";
  var i = 0;
  while (i < _35(id)) {
    var c = char(id, i);
    var n = code(c);
    var _e21;
    if (c === "-") {
      _e21 = "_";
    } else {
      var _e22;
      if (valid_code63(n)) {
        _e22 = c;
      } else {
        var _e23;
        if (i === 0) {
          _e23 = "_" + n;
        } else {
          _e23 = n;
        }
        _e22 = _e23;
      }
      _e21 = _e22;
    }
    var c1 = _e21;
    id1 = id1 + c1;
    i = i + 1;
  }
  return(id1);
};
var compile_atom = function (x) {
  if (x === "nil" && target === "lua") {
    return(x);
  } else {
    if (x === "nil") {
      return("undefined");
    } else {
      if (id_literal63(x)) {
        return(inner(x));
      } else {
        if (string_literal63(x)) {
          return(escape_newlines(x));
        } else {
          if (string63(x)) {
            return(id(x));
          } else {
            if (boolean63(x)) {
              if (x) {
                return("true");
              } else {
                return("false");
              }
            } else {
              if (nan63(x)) {
                return("nan");
              } else {
                if (x === inf) {
                  return("inf");
                } else {
                  if (x === -inf) {
                    return("-inf");
                  } else {
                    if (number63(x)) {
                      return(x + "");
                    } else {
                      throw new Error("Cannot compile atom: " + string(x));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
var terminator = function (stmt63) {
  if (! stmt63) {
    return("");
  } else {
    if (target === "js") {
      return(";\n");
    } else {
      return("\n");
    }
  }
};
var compile_special = function (form, stmt63) {
  var _id5 = form;
  var x = _id5[0];
  var args = cut(_id5, 1);
  var _id6 = getenv(x);
  var self_tr63 = _id6.tr;
  var stmt = _id6.stmt;
  var special = _id6.special;
  var tr = terminator(stmt63 && ! self_tr63);
  return(apply(special, args) + tr);
};
var parenthesize_call63 = function (x) {
  return(! atom63(x) && hd(x) === "%function" || precedence(x) > 0);
};
var compile_call = function (form) {
  var f = hd(form);
  var f1 = compile(f);
  var args = compile_args(stash42(tl(form)));
  if (parenthesize_call63(f)) {
    return("(" + f1 + ")" + args);
  } else {
    return(f1 + args);
  }
};
var op_delims = function (parent, child) {
  var _r56 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id7 = _r56;
  var right = _id7.right;
  var _e24;
  if (right) {
    _e24 = _6261;
  } else {
    _e24 = _62;
  }
  if (_e24(precedence(child), precedence(parent))) {
    return(["(", ")"]);
  } else {
    return(["", ""]);
  }
};
var compile_infix = function (form) {
  var _id8 = form;
  var op = _id8[0];
  var _id9 = cut(_id8, 1);
  var a = _id9[0];
  var b = _id9[1];
  var _id10 = op_delims(form, a);
  var ao = _id10[0];
  var ac = _id10[1];
  var _id11 = op_delims(form, b, {_stash: true, right: true});
  var bo = _id11[0];
  var bc = _id11[1];
  var _a = compile(a);
  var _b = compile(b);
  var _op = getop(op);
  if (unary63(form)) {
    return(_op + ao + " " + _a + ac);
  } else {
    return(ao + _a + ac + " " + _op + " " + bo + _b + bc);
  }
};
compile_function = function (args, body) {
  var _r58 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id12 = _r58;
  var name = _id12.name;
  var prefix = _id12.prefix;
  var _e25;
  if (name) {
    _e25 = compile(name);
  } else {
    _e25 = "";
  }
  var _id13 = _e25;
  var _args = compile_args(args);
  indent_level = indent_level + 1;
  var _x74 = compile(body, {_stash: true, stmt: true});
  indent_level = indent_level - 1;
  var _body = _x74;
  var ind = indentation();
  var _e26;
  if (prefix) {
    _e26 = prefix + " ";
  } else {
    _e26 = "";
  }
  var p = _e26;
  var _e27;
  if (target === "js") {
    _e27 = "";
  } else {
    _e27 = "end";
  }
  var tr = _e27;
  if (name) {
    tr = tr + "\n";
  }
  if (target === "js") {
    return("function " + _id13 + _args + " {\n" + _body + ind + "}" + tr);
  } else {
    return(p + "function " + _id13 + _args + "\n" + _body + ind + tr);
  }
};
var can_return63 = function (form) {
  return(is63(form) && (atom63(form) || !( hd(form) === "return") && ! statement63(hd(form))));
};
compile = function (form) {
  var _r60 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id14 = _r60;
  var stmt = _id14.stmt;
  if (nil63(form)) {
    return("");
  } else {
    if (special_form63(form)) {
      return(compile_special(form, stmt));
    } else {
      var tr = terminator(stmt);
      var _e28;
      if (stmt) {
        _e28 = indentation();
      } else {
        _e28 = "";
      }
      var ind = _e28;
      var _e29;
      if (atom63(form)) {
        _e29 = compile_atom(form);
      } else {
        var _e30;
        if (infix63(hd(form))) {
          _e30 = compile_infix(form);
        } else {
          _e30 = compile_call(form);
        }
        _e29 = _e30;
      }
      var _form = _e29;
      return(ind + _form + tr);
    }
  }
};
var lower_statement = function (form, tail63) {
  var hoist = [];
  var e = lower(form, hoist, true, tail63);
  if (some63(hoist) && is63(e)) {
    return(join(["do"], hoist, [e]));
  } else {
    if (is63(e)) {
      return(e);
    } else {
      if (_35(hoist) > 1) {
        return(join(["do"], hoist));
      } else {
        return(hd(hoist));
      }
    }
  }
};
var lower_body = function (body, tail63) {
  return(lower_statement(join(["do"], body), tail63));
};
var literal63 = function (form) {
  return(atom63(form) || hd(form) === "%array" || hd(form) === "%object");
};
var standalone63 = function (form) {
  return(! atom63(form) && ! infix63(hd(form)) && ! literal63(form) && !( "get" === hd(form)));
};
var lower_do = function (args, hoist, stmt63, tail63) {
  var _x79 = almost(args);
  var _n10 = _35(_x79);
  var _i10 = 0;
  while (_i10 < _n10) {
    var x = _x79[_i10];
    var _y = lower(x, hoist, stmt63);
    if (_y) {
      var e = _y;
      if (standalone63(e)) {
        add(hoist, e);
      }
    }
    _i10 = _i10 + 1;
  }
  var e = lower(last(args), hoist, stmt63, tail63);
  if (tail63 && can_return63(e)) {
    return(["return", e]);
  } else {
    return(e);
  }
};
var lower_set = function (args, hoist, stmt63, tail63) {
  var _id15 = args;
  var lh = _id15[0];
  var rh = _id15[1];
  add(hoist, ["set", lh, lower(rh, hoist)]);
  if (!( stmt63 && ! tail63)) {
    return(lh);
  }
};
var lower_if = function (args, hoist, stmt63, tail63) {
  var _id16 = args;
  var cond = _id16[0];
  var _then = _id16[1];
  var _else = _id16[2];
  if (stmt63 || tail63) {
    var _e32;
    if (_else) {
      _e32 = [lower_body([_else], tail63)];
    }
    return(add(hoist, join(["%if", lower(cond, hoist), lower_body([_then], tail63)], _e32)));
  } else {
    var e = unique("e");
    add(hoist, ["%local", e]);
    var _e31;
    if (_else) {
      _e31 = [lower(["set", e, _else])];
    }
    add(hoist, join(["%if", lower(cond, hoist), lower(["set", e, _then])], _e31));
    return(e);
  }
};
var lower_short = function (x, args, hoist) {
  var _id17 = args;
  var a = _id17[0];
  var b = _id17[1];
  var hoist1 = [];
  var b1 = lower(b, hoist1);
  if (some63(hoist1)) {
    var _id18 = unique("id");
    var _e33;
    if (x === "and") {
      _e33 = ["%if", _id18, b, _id18];
    } else {
      _e33 = ["%if", _id18, _id18, b];
    }
    return(lower(["do", ["%local", _id18, a], _e33], hoist));
  } else {
    return([x, lower(a, hoist), b1]);
  }
};
var lower_try = function (args, hoist, tail63) {
  return(add(hoist, ["%try", lower_body(args, tail63)]));
};
var lower_while = function (args, hoist) {
  var _id19 = args;
  var c = _id19[0];
  var body = cut(_id19, 1);
  return(add(hoist, ["while", lower(c, hoist), lower_body(body)]));
};
var lower_for = function (args, hoist) {
  var _id20 = args;
  var t = _id20[0];
  var k = _id20[1];
  var body = cut(_id20, 2);
  return(add(hoist, ["%for", lower(t, hoist), k, lower_body(body)]));
};
var lower_function = function (args) {
  var _id21 = args;
  var a = _id21[0];
  var body = cut(_id21, 1);
  return(["%function", a, lower_body(body, true)]);
};
var lower_definition = function (kind, args, hoist) {
  var _id22 = args;
  var name = _id22[0];
  var _args1 = _id22[1];
  var body = cut(_id22, 2);
  return(add(hoist, [kind, name, _args1, lower_body(body, true)]));
};
var lower_call = function (form, hoist) {
  var _form1 = map(function (x) {
    return(lower(x, hoist));
  }, form);
  if (some63(_form1)) {
    return(_form1);
  }
};
var lower_infix63 = function (form) {
  return(infix63(hd(form)) && _35(form) > 3);
};
var lower_infix = function (form, hoist) {
  var _id23 = form;
  var x = _id23[0];
  var args = cut(_id23, 1);
  return(lower(reduce(function (a, b) {
    return([x, b, a]);
  }, reverse(args)), hoist));
};
var lower_special = function (form, hoist) {
  var e = lower_call(form, hoist);
  if (e) {
    return(add(hoist, e));
  }
};
lower = function (form, hoist, stmt63, tail63) {
  if (atom63(form)) {
    return(form);
  } else {
    if (empty63(form)) {
      return(["%array"]);
    } else {
      if (nil63(hoist)) {
        return(lower_statement(form));
      } else {
        if (lower_infix63(form)) {
          return(lower_infix(form, hoist));
        } else {
          var _id24 = form;
          var x = _id24[0];
          var args = cut(_id24, 1);
          if (x === "do") {
            return(lower_do(args, hoist, stmt63, tail63));
          } else {
            if (x === "set") {
              return(lower_set(args, hoist, stmt63, tail63));
            } else {
              if (x === "%if") {
                return(lower_if(args, hoist, stmt63, tail63));
              } else {
                if (x === "%try") {
                  return(lower_try(args, hoist, tail63));
                } else {
                  if (x === "while") {
                    return(lower_while(args, hoist));
                  } else {
                    if (x === "%for") {
                      return(lower_for(args, hoist));
                    } else {
                      if (x === "%function") {
                        return(lower_function(args));
                      } else {
                        if (x === "%local-function" || x === "%global-function") {
                          return(lower_definition(x, args, hoist));
                        } else {
                          if (in63(x, ["and", "or"])) {
                            return(lower_short(x, args, hoist));
                          } else {
                            if (statement63(x)) {
                              return(lower_special(form, hoist));
                            } else {
                              return(lower_call(form, hoist));
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
var expand = function (form) {
  return(lower(macroexpand(form)));
};
global.require = require;
var run = eval;
_37result = undefined;
eval = function (form) {
  var previous = target;
  target = "js";
  var code = compile(expand(["set", "%result", form]));
  target = previous;
  run(code);
  return(_37result);
};
setenv("do", {_stash: true, tr: true, special: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var s = "";
  var _x107 = forms;
  var _n12 = _35(_x107);
  var _i12 = 0;
  while (_i12 < _n12) {
    var x = _x107[_i12];
    s = s + compile(x, {_stash: true, stmt: true});
    _i12 = _i12 + 1;
  }
  return(s);
}, stmt: true});
setenv("%if", {_stash: true, tr: true, special: function (cond, cons, alt) {
  var _cond1 = compile(cond);
  indent_level = indent_level + 1;
  var _x110 = compile(cons, {_stash: true, stmt: true});
  indent_level = indent_level - 1;
  var _cons1 = _x110;
  var _e34;
  if (alt) {
    indent_level = indent_level + 1;
    var _x111 = compile(alt, {_stash: true, stmt: true});
    indent_level = indent_level - 1;
    _e34 = _x111;
  }
  var _alt1 = _e34;
  var ind = indentation();
  var s = "";
  if (target === "js") {
    s = s + ind + "if (" + _cond1 + ") {\n" + _cons1 + ind + "}";
  } else {
    s = s + ind + "if " + _cond1 + " then\n" + _cons1;
  }
  if (_alt1 && target === "js") {
    s = s + " else {\n" + _alt1 + ind + "}";
  } else {
    if (_alt1) {
      s = s + ind + "else\n" + _alt1;
    }
  }
  if (target === "lua") {
    return(s + ind + "end\n");
  } else {
    return(s + "\n");
  }
}, stmt: true});
setenv("while", {_stash: true, tr: true, special: function (cond, form) {
  var _cond3 = compile(cond);
  indent_level = indent_level + 1;
  var _x113 = compile(form, {_stash: true, stmt: true});
  indent_level = indent_level - 1;
  var body = _x113;
  var ind = indentation();
  if (target === "js") {
    return(ind + "while (" + _cond3 + ") {\n" + body + ind + "}\n");
  } else {
    return(ind + "while " + _cond3 + " do\n" + body + ind + "end\n");
  }
}, stmt: true});
setenv("%for", {_stash: true, tr: true, special: function (t, k, form) {
  var _t1 = compile(t);
  var ind = indentation();
  indent_level = indent_level + 1;
  var _x115 = compile(form, {_stash: true, stmt: true});
  indent_level = indent_level - 1;
  var body = _x115;
  if (target === "lua") {
    return(ind + "for " + k + " in next, " + _t1 + " do\n" + body + ind + "end\n");
  } else {
    return(ind + "for (" + k + " in " + _t1 + ") {\n" + body + ind + "}\n");
  }
}, stmt: true});
setenv("%try", {_stash: true, tr: true, special: function (form) {
  var e = unique("e");
  var ind = indentation();
  indent_level = indent_level + 1;
  var _x121 = compile(form, {_stash: true, stmt: true});
  indent_level = indent_level - 1;
  var body = _x121;
  var hf = ["return", ["%array", false, ["get", e, "\"message\""]]];
  indent_level = indent_level + 1;
  var _x125 = compile(hf, {_stash: true, stmt: true});
  indent_level = indent_level - 1;
  var h = _x125;
  return(ind + "try {\n" + body + ind + "}\n" + ind + "catch (" + e + ") {\n" + h + ind + "}\n");
}, stmt: true});
setenv("%delete", {_stash: true, special: function (place) {
  return(indentation() + "delete " + compile(place));
}, stmt: true});
setenv("break", {_stash: true, special: function () {
  return(indentation() + "break");
}, stmt: true});
setenv("%function", {_stash: true, special: function (args, body) {
  return(compile_function(args, body));
}});
setenv("%global-function", {_stash: true, tr: true, special: function (name, args, body) {
  if (target === "lua") {
    var x = compile_function(args, body, {_stash: true, name: name});
    return(indentation() + x);
  } else {
    return(compile(["set", name, ["%function", args, body]], {_stash: true, stmt: true}));
  }
}, stmt: true});
setenv("%local-function", {_stash: true, tr: true, special: function (name, args, body) {
  if (target === "lua") {
    var x = compile_function(args, body, {_stash: true, name: name, prefix: "local"});
    return(indentation() + x);
  } else {
    return(compile(["%local", name, ["%function", args, body]], {_stash: true, stmt: true}));
  }
}, stmt: true});
setenv("return", {_stash: true, special: function (x) {
  var _e35;
  if (nil63(x)) {
    _e35 = "return";
  } else {
    _e35 = "return(" + compile(x) + ")";
  }
  var _x135 = _e35;
  return(indentation() + _x135);
}, stmt: true});
setenv("new", {_stash: true, special: function (x) {
  return("new " + compile(x));
}});
setenv("error", {_stash: true, special: function (x) {
  var _e36;
  if (target === "js") {
    _e36 = "throw " + compile(["new", ["Error", x]]);
  } else {
    _e36 = "error(" + compile(x) + ")";
  }
  var e = _e36;
  return(indentation() + e);
}, stmt: true});
setenv("%local", {_stash: true, special: function (name, value) {
  var _id26 = compile(name);
  var value1 = compile(value);
  var _e37;
  if (is63(value)) {
    _e37 = " = " + value1;
  } else {
    _e37 = "";
  }
  var rh = _e37;
  var _e38;
  if (target === "js") {
    _e38 = "var ";
  } else {
    _e38 = "local ";
  }
  var keyword = _e38;
  var ind = indentation();
  return(ind + keyword + _id26 + rh);
}, stmt: true});
setenv("set", {_stash: true, special: function (lh, rh) {
  var _lh1 = compile(lh);
  var _e39;
  if (nil63(rh)) {
    _e39 = "nil";
  } else {
    _e39 = rh;
  }
  var _rh1 = compile(_e39);
  return(indentation() + _lh1 + " = " + _rh1);
}, stmt: true});
setenv("get", {_stash: true, special: function (t, k) {
  var _t3 = compile(t);
  var k1 = compile(k);
  if (target === "lua" && char(_t3, 0) === "{") {
    _t3 = "(" + _t3 + ")";
  }
  if (string_literal63(k) && valid_id63(inner(k))) {
    return(_t3 + "." + inner(k));
  } else {
    return(_t3 + "[" + k1 + "]");
  }
}});
setenv("%array", {_stash: true, special: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var _e40;
  if (target === "lua") {
    _e40 = "{";
  } else {
    _e40 = "[";
  }
  var open = _e40;
  var _e41;
  if (target === "lua") {
    _e41 = "}";
  } else {
    _e41 = "]";
  }
  var close = _e41;
  var s = "";
  var c = "";
  var _o9 = forms;
  var k = undefined;
  for (k in _o9) {
    var v = _o9[k];
    var _e42;
    if (numeric63(k)) {
      _e42 = parseInt(k);
    } else {
      _e42 = k;
    }
    var _k7 = _e42;
    if (number63(_k7)) {
      s = s + c + compile(v);
      c = ", ";
    }
  }
  return(open + s + close);
}});
setenv("%object", {_stash: true, special: function () {
  var forms = unstash(Array.prototype.slice.call(arguments, 0));
  var s = "{";
  var c = "";
  var _e43;
  if (target === "lua") {
    _e43 = " = ";
  } else {
    _e43 = ": ";
  }
  var sep = _e43;
  var _o11 = pair(forms);
  var k = undefined;
  for (k in _o11) {
    var v = _o11[k];
    var _e44;
    if (numeric63(k)) {
      _e44 = parseInt(k);
    } else {
      _e44 = k;
    }
    var _k9 = _e44;
    if (number63(_k9)) {
      var _id28 = v;
      var _k10 = _id28[0];
      var _v2 = _id28[1];
      if (! string63(_k10)) {
        throw new Error("Illegal key: " + string(_k10));
      }
      s = s + c + key(_k10) + sep + compile(_v2);
      c = ", ";
    }
  }
  return(s + "}");
}});
exports.run = run;
exports.eval = eval;
exports.expand = expand;
exports.compile = compile;
});

pkg("macros", function () {
setenv("quote", {_stash: true, macro: function (form) {
  return(quoted(form));
}});
setenv("quasiquote", {_stash: true, macro: function (form) {
  return(quasiexpand(form, 1));
}});
setenv("at", {_stash: true, macro: function (l, i) {
  if (target === "lua" && number63(i)) {
    i = i + 1;
  } else {
    if (target === "lua") {
      i = ["+", i, 1];
    }
  }
  return(["get", l, i]);
}});
setenv("wipe", {_stash: true, macro: function (place) {
  if (target === "lua") {
    return(["set", place, "nil"]);
  } else {
    return(["%delete", place]);
  }
}});
setenv("list", {_stash: true, macro: function () {
  var body = unstash(Array.prototype.slice.call(arguments, 0));
  var x = unique("x");
  var l = [];
  var forms = [];
  var _o1 = body;
  var k = undefined;
  for (k in _o1) {
    var v = _o1[k];
    var _e3;
    if (numeric63(k)) {
      _e3 = parseInt(k);
    } else {
      _e3 = k;
    }
    var _k = _e3;
    if (number63(_k)) {
      l[_k] = v;
    } else {
      add(forms, ["set", ["get", x, ["quote", _k]], v]);
    }
  }
  if (some63(forms)) {
    return(join(["let", x, join(["%array"], l)], forms, [x]));
  } else {
    return(join(["%array"], l));
  }
}});
setenv("if", {_stash: true, macro: function () {
  var branches = unstash(Array.prototype.slice.call(arguments, 0));
  return(hd(expand_if(branches)));
}});
setenv("case", {_stash: true, macro: function (x) {
  var _r10 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id2 = _r10;
  var clauses = cut(_id2, 0);
  var bs = map(function (_x31) {
    var _id3 = _x31;
    var a = _id3[0];
    var b = _id3[1];
    if (nil63(b)) {
      return([a]);
    } else {
      return([["=", ["quote", a], x], b]);
    }
  }, pair(clauses));
  return(join(["if"], apply(join, bs)));
}});
setenv("when", {_stash: true, macro: function (cond) {
  var _r13 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id5 = _r13;
  var body = cut(_id5, 0);
  return(["if", cond, join(["do"], body)]);
}});
setenv("unless", {_stash: true, macro: function (cond) {
  var _r15 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id7 = _r15;
  var body = cut(_id7, 0);
  return(["if", ["not", cond], join(["do"], body)]);
}});
setenv("obj", {_stash: true, macro: function () {
  var body = unstash(Array.prototype.slice.call(arguments, 0));
  return(join(["%object"], mapo(function (x) {
    return(x);
  }, body)));
}});
setenv("let", {_stash: true, macro: function (bs) {
  var _r19 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id11 = _r19;
  var body = cut(_id11, 0);
  if (atom63(bs)) {
    return(join(["let", [bs, hd(body)]], tl(body)));
  } else {
    if (none63(bs)) {
      return(join(["do"], body));
    } else {
      var _id12 = bs;
      var lh = _id12[0];
      var rh = _id12[1];
      var bs2 = cut(_id12, 2);
      var _id13 = bind(lh, rh);
      var id = _id13[0];
      var val = _id13[1];
      var bs1 = cut(_id13, 2);
      var renames = [];
      if (bound63(id) || reserved63(id) || toplevel63()) {
        var id1 = unique(id);
        renames = [id, id1];
        id = id1;
      } else {
        setenv(id, {_stash: true, variable: true});
      }
      return(["do", ["%local", id, val], ["let-symbol", renames, join(["let", join(bs1, bs2)], body)]]);
    }
  }
}});
setenv("with", {_stash: true, macro: function (x, v) {
  var _r21 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id15 = _r21;
  var body = cut(_id15, 0);
  return(join(["let", [x, v]], body, [x]));
}});
setenv("let-when", {_stash: true, macro: function (x, v) {
  var _r23 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id17 = _r23;
  var body = cut(_id17, 0);
  var y = unique("y");
  return(["let", y, v, ["when", y, join(["let", [x, y]], body)]]);
}});
setenv("define-macro", {_stash: true, macro: function (name, args) {
  var _r25 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id19 = _r25;
  var body = cut(_id19, 0);
  var _x89 = ["setenv", ["quote", name]];
  _x89.macro = join(["fn", args], body);
  var form = _x89;
  eval(form);
  return(form);
}});
setenv("define-special", {_stash: true, macro: function (name, args) {
  var _r27 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id21 = _r27;
  var body = cut(_id21, 0);
  var _x96 = ["setenv", ["quote", name]];
  _x96.special = join(["fn", args], body);
  var form = join(_x96, keys(body));
  eval(form);
  return(form);
}});
setenv("define-symbol", {_stash: true, macro: function (name, expansion) {
  setenv(name, {_stash: true, symbol: expansion});
  var _x102 = ["setenv", ["quote", name]];
  _x102.symbol = ["quote", expansion];
  return(_x102);
}});
setenv("define-reader", {_stash: true, macro: function (_x111) {
  var _id24 = _x111;
  var char = _id24[0];
  var s = _id24[1];
  var _r31 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id25 = _r31;
  var body = cut(_id25, 0);
  return(["set", ["get", "read-table", char], join(["fn", [s]], body)]);
}});
setenv("define", {_stash: true, macro: function (name, x) {
  var _r33 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id27 = _r33;
  var body = cut(_id27, 0);
  setenv(name, {_stash: true, variable: true});
  if (some63(body)) {
    return(join(["%local-function", name], bind42(x, body)));
  } else {
    return(["%local", name, x]);
  }
}});
setenv("define-global", {_stash: true, macro: function (name, x) {
  var _r35 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id29 = _r35;
  var body = cut(_id29, 0);
  setenv(name, {_stash: true, toplevel: true, variable: true});
  if (some63(body)) {
    return(join(["%global-function", name], bind42(x, body)));
  } else {
    return(["set", name, x]);
  }
}});
setenv("with-frame", {_stash: true, macro: function () {
  var body = unstash(Array.prototype.slice.call(arguments, 0));
  var x = unique("x");
  return(["do", ["add", "environment", ["obj"]], ["with", x, join(["do"], body), ["drop", "environment"]]]);
}});
setenv("with-bindings", {_stash: true, macro: function (_x144) {
  var _id32 = _x144;
  var names = _id32[0];
  var _r37 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id33 = _r37;
  var body = cut(_id33, 0);
  var x = unique("x");
  var _x147 = ["setenv", x];
  _x147.variable = true;
  return(join(["with-frame", ["each", x, names, _x147]], body));
}});
setenv("let-macro", {_stash: true, macro: function (definitions) {
  var _r40 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id35 = _r40;
  var body = cut(_id35, 0);
  add(environment, {});
  map(function (m) {
    return(macroexpand(join(["define-macro"], m)));
  }, definitions);
  var _x152 = join(["do"], macroexpand(body));
  drop(environment);
  return(_x152);
}});
setenv("let-symbol", {_stash: true, macro: function (expansions) {
  var _r44 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id38 = _r44;
  var body = cut(_id38, 0);
  add(environment, {});
  map(function (_x161) {
    var _id39 = _x161;
    var name = _id39[0];
    var exp = _id39[1];
    return(macroexpand(["define-symbol", name, exp]));
  }, pair(expansions));
  var _x160 = join(["do"], macroexpand(body));
  drop(environment);
  return(_x160);
}});
setenv("let-unique", {_stash: true, macro: function (names) {
  var _r48 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id41 = _r48;
  var body = cut(_id41, 0);
  var bs = map(function (n) {
    return([n, ["unique", ["quote", n]]]);
  }, names);
  return(join(["let", apply(join, bs)], body));
}});
setenv("fn", {_stash: true, macro: function (args) {
  var _r51 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id43 = _r51;
  var body = cut(_id43, 0);
  return(join(["%function"], bind42(args, body)));
}});
setenv("guard", {_stash: true, macro: function (expr) {
  if (target === "js") {
    return([["fn", join(), ["%try", ["list", true, expr]]]]);
  } else {
    var e = unique("e");
    var x = unique("x");
    var msg = unique("msg");
    return(["let", [x, "nil", msg, "nil", e, ["xpcall", ["fn", join(), ["set", x, expr]], ["fn", ["m"], ["set", msg, ["%message-handler", "m"]]]]], ["list", e, ["if", e, x, msg]]]);
  }
}});
setenv("each", {_stash: true, macro: function (x, t) {
  var _r55 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id46 = _r55;
  var body = cut(_id46, 0);
  var o = unique("o");
  var n = unique("n");
  var i = unique("i");
  var _e4;
  if (atom63(x)) {
    _e4 = [i, x];
  } else {
    var _e5;
    if (_35(x) > 1) {
      _e5 = x;
    } else {
      _e5 = [i, hd(x)];
    }
    _e4 = _e5;
  }
  var _id47 = _e4;
  var k = _id47[0];
  var v = _id47[1];
  var _e6;
  if (target === "lua") {
    _e6 = body;
  } else {
    _e6 = [join(["let", k, ["if", ["numeric?", k], ["parseInt", k], k]], body)];
  }
  return(["let", [o, t, k, "nil"], ["%for", o, k, join(["let", [v, ["get", o, k]]], _e6)]]);
}});
setenv("for", {_stash: true, macro: function (i, to) {
  var _r57 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id49 = _r57;
  var body = cut(_id49, 0);
  return(["let", i, 0, join(["while", ["<", i, to]], body, [["inc", i]])]);
}});
setenv("step", {_stash: true, macro: function (v, t) {
  var _r59 = unstash(Array.prototype.slice.call(arguments, 2));
  var _id51 = _r59;
  var body = cut(_id51, 0);
  var x = unique("x");
  var n = unique("n");
  var i = unique("i");
  return(["let", [x, t, n, ["#", x]], ["for", i, n, join(["let", [v, ["at", x, i]]], body)]]);
}});
setenv("set-of", {_stash: true, macro: function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  var l = [];
  var _o3 = xs;
  var _i3 = undefined;
  for (_i3 in _o3) {
    var x = _o3[_i3];
    var _e7;
    if (numeric63(_i3)) {
      _e7 = parseInt(_i3);
    } else {
      _e7 = _i3;
    }
    var __i3 = _e7;
    l[x] = true;
  }
  return(join(["obj"], l));
}});
setenv("language", {_stash: true, macro: function () {
  return(["quote", target]);
}});
setenv("target", {_stash: true, macro: function () {
  var clauses = unstash(Array.prototype.slice.call(arguments, 0));
  return(clauses[target]);
}});
setenv("join!", {_stash: true, macro: function (a) {
  var _r63 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id53 = _r63;
  var bs = cut(_id53, 0);
  return(["set", a, join(["join", a], bs)]);
}});
setenv("cat!", {_stash: true, macro: function (a) {
  var _r65 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id55 = _r65;
  var bs = cut(_id55, 0);
  return(["set", a, join(["cat", a], bs)]);
}});
setenv("inc", {_stash: true, macro: function (n, by) {
  return(["set", n, ["+", n, by || 1]]);
}});
setenv("dec", {_stash: true, macro: function (n, by) {
  return(["set", n, ["-", n, by || 1]]);
}});
setenv("with-indent", {_stash: true, macro: function (form) {
  var x = unique("x");
  return(["do", ["inc", "indent-level"], ["with", x, form, ["dec", "indent-level"]]]);
}});
setenv("export", {_stash: true, macro: function () {
  var names = unstash(Array.prototype.slice.call(arguments, 0));
  if (target === "js") {
    return(join(["do"], map(function (k) {
      return(["set", ["get", "exports", ["quote", k]], k]);
    }, names)));
  } else {
    var x = {};
    var _o5 = names;
    var _i5 = undefined;
    for (_i5 in _o5) {
      var k = _o5[_i5];
      var _e8;
      if (numeric63(_i5)) {
        _e8 = parseInt(_i5);
      } else {
        _e8 = _i5;
      }
      var __i5 = _e8;
      x[k] = k;
    }
    return(["return", join(["obj"], x)]);
  }
}});
});

pkg("main", function () {
var reader = require("reader");
var compiler = require("compiler");
var system = require("system");
var eval_print = function (form) {
  var _id = (function () {
    try {
      return([true, compiler.eval(form)]);
    }
    catch (_e) {
      return([false, _e.message]);
    }
  })();
  var ok = _id[0];
  var x = _id[1];
  if (! ok) {
    return(print("error: " + x));
  } else {
    if (is63(x)) {
      print(string(x));
      return(x);
    }
  }
};
rep = function (s) {
  return(eval_print(reader["read-string"](s)));
};
var repl = function () {
  var buf = "";
  var rep1 = function (s) {
    buf = buf + s;
    var more = [];
    var form = reader["read-string"](buf, more);
    if (!( form === more)) {
      eval_print(form);
      buf = "";
      return(system.write("> "));
    }
  };
  system.write("> ");
  var _in = process.stdin;
  _in.setEncoding("utf8");
  return(_in.on("data", rep1));
};
compile_file = function (path) {
  var s = reader.stream(system["read-file"](path));
  var body = reader["read-all"](s);
  var form = compiler.expand(join(["do"], body));
  return(compiler.compile(form, {_stash: true, stmt: true}));
};
load = function (path) {
  return(compiler.run(compile_file(path)));
};
var run_file = function (path) {
  return(compiler.run(system["read-file"](path)));
};
var usage = function () {
  print("usage: lumen [options] <object files>");
  print("options:");
  print("  -c <input>\tCompile input file");
  print("  -o <output>\tOutput file");
  print("  -t <target>\tTarget language (default: lua)");
  print("  -e <expr>\tExpression to evaluate");
  return(system.exit());
};
var main = function () {
  var arg = hd(system.argv);
  if (arg === "-h" || arg === "--help") {
    usage();
  }
  var pre = [];
  var input = undefined;
  var output = undefined;
  var target1 = undefined;
  var expr = undefined;
  var argv = system.argv;
  var n = _35(argv);
  var i = 0;
  while (i < n) {
    var a = argv[i];
    if (a === "-c" || a === "-o" || a === "-t" || a === "-e") {
      if (i === n - 1) {
        print("missing argument for " + a);
      } else {
        i = i + 1;
        var val = argv[i];
        if (a === "-c") {
          input = val;
        } else {
          if (a === "-o") {
            output = val;
          } else {
            if (a === "-t") {
              target1 = val;
            } else {
              if (a === "-e") {
                expr = val;
              }
            }
          }
        }
      }
    } else {
      if (!( "-" === char(a, 0))) {
        add(pre, a);
      }
    }
    i = i + 1;
  }
  var _x2 = pre;
  var _n = _35(_x2);
  var _i = 0;
  while (_i < _n) {
    var file = _x2[_i];
    run_file(file);
    _i = _i + 1;
  }
  if (nil63(input)) {
    if (expr) {
      return(rep(expr));
    } else {
      return(repl());
    }
  } else {
    if (target1) {
      target = target1;
    }
    var code = compile_file(input);
    if (nil63(output) || output === "-") {
      return(print(code));
    } else {
      return(system["write-file"](output, code));
    }
  }
};
main();
});

pkg("reader", function () {
var delimiters = {"(": true, ")": true, ";": true, "\n": true, "}": true, "]": true, "{": true, "[": true};
var whitespace = {" ": true, "\n": true, "\t": true};
var stream = function (str, more) {
  return({more: more, pos: 0, len: _35(str), string: str});
};
var peek_char = function (s, count, offset) {
  var _id = s;
  var pos = _id.pos;
  var len = _id.len;
  var string = _id.string;
  var from = pos + (offset || 0);
  var n = count || 1;
  if (from <= len - n) {
    if (n === 1) {
      return(char(string, from));
    } else {
      return(clip(string, from, from + n));
    }
  }
};
var read_char = function (s, count, offset) {
  var c = peek_char(s, count, offset);
  if (c) {
    s.pos = s.pos + _35(c);
    return(c);
  }
};
var skip_non_code = function (s) {
  while (true) {
    var c = peek_char(s);
    if (nil63(c)) {
      break;
    } else {
      if (whitespace[c]) {
        read_char(s);
      } else {
        if (c === ";") {
          while (c && !( c === "\n")) {
            c = read_char(s);
          }
          skip_non_code(s);
        } else {
          break;
        }
      }
    }
  }
};
var read_table = {};
var eof = {};
var read = function (s) {
  skip_non_code(s);
  var c = peek_char(s);
  if (is63(c)) {
    return((read_table[c] || read_table[""])(s));
  } else {
    return(eof);
  }
};
var read_all = function (s) {
  var l = [];
  while (true) {
    var form = read(s);
    if (form === eof) {
      break;
    }
    add(l, form);
  }
  return(l);
};
var read_string = function (str, more) {
  var x = read(stream(str, more));
  if (!( x === eof)) {
    return(x);
  }
};
var key63 = function (atom) {
  return(string63(atom) && _35(atom) > 1 && char(atom, edge(atom)) === ":");
};
var flag63 = function (atom) {
  return(string63(atom) && _35(atom) > 1 && char(atom, 0) === ":");
};
var expected = function (s, c) {
  var _id1 = s;
  var more = _id1.more;
  var pos = _id1.pos;
  var _id2 = more;
  var _e;
  if (_id2) {
    _e = _id2;
  } else {
    throw new Error("Expected " + c + " at " + pos);
    _e = undefined;
  }
  return(_e);
};
var wrap = function (s, x) {
  var y = read(s);
  if (y === s.more) {
    return(y);
  } else {
    return([x, y]);
  }
};
read_table[""] = function (s) {
  var str = "";
  while (true) {
    var c = peek_char(s);
    if (c && (! whitespace[c] && ! delimiters[c])) {
      str = str + read_char(s);
    } else {
      break;
    }
  }
  if (str === "true") {
    return(true);
  } else {
    if (str === "false") {
      return(false);
    } else {
      if (str === "nan") {
        return(nan);
      } else {
        if (str === "-nan") {
          return(nan);
        } else {
          if (str === "inf") {
            return(inf);
          } else {
            if (str === "-inf") {
              return(-inf);
            } else {
              var n = number(str);
              if (nil63(n) || nan63(n) || inf63(n)) {
                return(str);
              } else {
                return(n);
              }
            }
          }
        }
      }
    }
  }
};
read_table["("] = function (s) {
  read_char(s);
  var r = undefined;
  var l = [];
  while (nil63(r)) {
    skip_non_code(s);
    var c = peek_char(s);
    if (c === ")") {
      read_char(s);
      r = l;
    } else {
      if (nil63(c)) {
        r = expected(s, ")");
      } else {
        var x = read(s);
        if (key63(x)) {
          var k = clip(x, 0, edge(x));
          var v = read(s);
          l[k] = v;
        } else {
          if (flag63(x)) {
            l[clip(x, 1)] = true;
          } else {
            add(l, x);
          }
        }
      }
    }
  }
  return(r);
};
read_table[")"] = function (s) {
  throw new Error("Unexpected ) at " + s.pos);
};
read_table["["] = function (s) {
  read_char(s);
  var r = undefined;
  var l = [];
  while (nil63(r)) {
    skip_non_code(s);
    var c = peek_char(s);
    if (c === "]") {
      read_char(s);
      r = ["fn", ["_"], l];
    } else {
      if (nil63(c)) {
        r = expected(s, "]");
      } else {
        var x = read(s);
        add(l, x);
      }
    }
  }
  return(r);
};
read_table["{"] = function (s) {
  read_char(s);
  var r = undefined;
  var l = [];
  while (nil63(r)) {
    skip_non_code(s);
    var c = peek_char(s);
    if (c === "}") {
      read_char(s);
      r = join(["curly"], l);
    } else {
      if (nil63(c)) {
        r = expected(s, "}");
      } else {
        var x = read(s);
        add(l, x);
      }
    }
  }
  return(r);
};
read_table["\"\"\""] = function (s) {
  read_char(s, 3);
  var r = undefined;
  var str = "\"";
  while (nil63(r)) {
    var c = peek_char(s, 3);
    if (c === "\"\"\"") {
      read_char(s, 3);
      r = str + "\"";
    } else {
      if (nil63(c)) {
        r = expected(s, "\"\"\"");
      } else {
        var x = read_char(s);
        var _e1;
        if (x === "\"" || x === "\\") {
          _e1 = "\\" + x;
        } else {
          _e1 = x;
        }
        str = str + _e1;
      }
    }
  }
  return(r);
};
read_table["\""] = function (s) {
  if (peek_char(s, 3) === "\"\"\"") {
    return(read_table["\"\"\""](s));
  }
  read_char(s);
  var r = undefined;
  var str = "\"";
  while (nil63(r)) {
    var c = peek_char(s);
    if (c === "\"") {
      r = str + read_char(s);
    } else {
      if (nil63(c)) {
        r = expected(s, "\"");
      } else {
        if (c === "\\") {
          str = str + read_char(s);
        }
        str = str + read_char(s);
      }
    }
  }
  return(r);
};
read_table["|"] = function (s) {
  read_char(s);
  var r = undefined;
  var str = "|";
  while (nil63(r)) {
    var c = peek_char(s);
    if (c === "|") {
      r = str + read_char(s);
    } else {
      if (nil63(c)) {
        r = expected(s, "|");
      } else {
        str = str + read_char(s);
      }
    }
  }
  return(r);
};
read_table["'"] = function (s) {
  read_char(s);
  return(wrap(s, "quote"));
};
read_table["`"] = function (s) {
  read_char(s);
  return(wrap(s, "quasiquote"));
};
read_table[","] = function (s) {
  read_char(s);
  if (peek_char(s) === "@") {
    read_char(s);
    return(wrap(s, "unquote-splicing"));
  } else {
    return(wrap(s, "unquote"));
  }
};
exports.stream = stream;
exports.read = read;
exports["read-all"] = read_all;
exports["read-string"] = read_string;
exports["read-table"] = read_table;
});

pkg("runtime", function () {
environment = [{}];
target = "js";
nil63 = function (x) {
  return(x === undefined || x === null);
};
is63 = function (x) {
  return(! nil63(x));
};
_35 = function (x) {
  return(x.length || 0);
};
none63 = function (x) {
  return(_35(x) === 0);
};
some63 = function (x) {
  return(_35(x) > 0);
};
one63 = function (x) {
  return(_35(x) === 1);
};
two63 = function (x) {
  return(_35(x) === 2);
};
hd = function (l) {
  return(l[0]);
};
type = function (x) {
  return(typeof(x));
};
string63 = function (x) {
  return(type(x) === "string");
};
number63 = function (x) {
  return(type(x) === "number");
};
boolean63 = function (x) {
  return(type(x) === "boolean");
};
function63 = function (x) {
  return(type(x) === "function");
};
obj63 = function (x) {
  return(is63(x) && type(x) === "object");
};
atom63 = function (x) {
  return(nil63(x) || string63(x) || number63(x) || boolean63(x));
};
nan = 0 / 0;
inf = 1 / 0;
nan63 = function (n) {
  return(!( n === n));
};
inf63 = function (n) {
  return(n === inf || n === -inf);
};
clip = function (s, from, upto) {
  return(s.substring(from, upto));
};
cut = function (x, from, upto) {
  var l = [];
  var j = 0;
  var _e;
  if (nil63(from) || from < 0) {
    _e = 0;
  } else {
    _e = from;
  }
  var i = _e;
  var n = _35(x);
  var _e1;
  if (nil63(upto) || upto > n) {
    _e1 = n;
  } else {
    _e1 = upto;
  }
  var _upto = _e1;
  while (i < _upto) {
    l[j] = x[i];
    i = i + 1;
    j = j + 1;
  }
  var _o = x;
  var k = undefined;
  for (k in _o) {
    var v = _o[k];
    var _e2;
    if (numeric63(k)) {
      _e2 = parseInt(k);
    } else {
      _e2 = k;
    }
    var _k = _e2;
    if (! number63(_k)) {
      l[_k] = v;
    }
  }
  return(l);
};
keys = function (x) {
  var t = [];
  var _o1 = x;
  var k = undefined;
  for (k in _o1) {
    var v = _o1[k];
    var _e3;
    if (numeric63(k)) {
      _e3 = parseInt(k);
    } else {
      _e3 = k;
    }
    var _k1 = _e3;
    if (! number63(_k1)) {
      t[_k1] = v;
    }
  }
  return(t);
};
edge = function (x) {
  return(_35(x) - 1);
};
inner = function (x) {
  return(clip(x, 1, edge(x)));
};
tl = function (l) {
  return(cut(l, 1));
};
char = function (s, n) {
  return(s.charAt(n));
};
code = function (s, n) {
  return(s.charCodeAt(n));
};
string_literal63 = function (x) {
  return(string63(x) && char(x, 0) === "\"");
};
id_literal63 = function (x) {
  return(string63(x) && char(x, 0) === "|");
};
add = function (l, x) {
  l.push(x);
  return(undefined);
};
drop = function (l) {
  return(l.pop());
};
last = function (l) {
  return(l[edge(l)]);
};
almost = function (l) {
  return(cut(l, 0, edge(l)));
};
reverse = function (l) {
  var l1 = keys(l);
  var i = edge(l);
  while (i >= 0) {
    add(l1, l[i]);
    i = i - 1;
  }
  return(l1);
};
reduce = function (f, x) {
  if (none63(x)) {
    return(x);
  } else {
    if (one63(x)) {
      return(hd(x));
    } else {
      return(f(hd(x), reduce(f, tl(x))));
    }
  }
};
join = function () {
  var ls = unstash(Array.prototype.slice.call(arguments, 0));
  if (two63(ls)) {
    var _id = ls;
    var a = _id[0];
    var b = _id[1];
    if (a && b) {
      var c = [];
      var o = _35(a);
      var _o2 = a;
      var k = undefined;
      for (k in _o2) {
        var v = _o2[k];
        var _e4;
        if (numeric63(k)) {
          _e4 = parseInt(k);
        } else {
          _e4 = k;
        }
        var _k2 = _e4;
        c[_k2] = v;
      }
      var _o3 = b;
      var k = undefined;
      for (k in _o3) {
        var v = _o3[k];
        var _e5;
        if (numeric63(k)) {
          _e5 = parseInt(k);
        } else {
          _e5 = k;
        }
        var _k3 = _e5;
        if (number63(_k3)) {
          _k3 = _k3 + o;
        }
        c[_k3] = v;
      }
      return(c);
    } else {
      return(a || b || []);
    }
  } else {
    return(reduce(join, ls));
  }
};
find = function (f, t) {
  var _o4 = t;
  var _i4 = undefined;
  for (_i4 in _o4) {
    var x = _o4[_i4];
    var _e6;
    if (numeric63(_i4)) {
      _e6 = parseInt(_i4);
    } else {
      _e6 = _i4;
    }
    var __i4 = _e6;
    var y = f(x);
    if (y) {
      return(y);
    }
  }
};
first = function (f, l) {
  var _x1 = l;
  var _n5 = _35(_x1);
  var _i5 = 0;
  while (_i5 < _n5) {
    var x = _x1[_i5];
    var y = f(x);
    if (y) {
      return(y);
    }
    _i5 = _i5 + 1;
  }
};
in63 = function (x, t) {
  return(find(function (y) {
    return(x === y);
  }, t));
};
pair = function (l) {
  var l1 = [];
  var i = 0;
  while (i < _35(l)) {
    add(l1, [l[i], l[i + 1]]);
    i = i + 1;
    i = i + 1;
  }
  return(l1);
};
sort = function (l, f) {
  var _e7;
  if (f) {
    _e7 = function (a, b) {
      if (f(a, b)) {
        return(-1);
      } else {
        return(1);
      }
    };
  }
  return(l.sort(_e7));
};
map = function (f, x) {
  var t = [];
  var _x3 = x;
  var _n6 = _35(_x3);
  var _i6 = 0;
  while (_i6 < _n6) {
    var v = _x3[_i6];
    var y = f(v);
    if (is63(y)) {
      add(t, y);
    }
    _i6 = _i6 + 1;
  }
  var _o5 = x;
  var k = undefined;
  for (k in _o5) {
    var v = _o5[k];
    var _e8;
    if (numeric63(k)) {
      _e8 = parseInt(k);
    } else {
      _e8 = k;
    }
    var _k4 = _e8;
    if (! number63(_k4)) {
      var y = f(v);
      if (is63(y)) {
        t[_k4] = y;
      }
    }
  }
  return(t);
};
keep = function (f, x) {
  return(map(function (v) {
    if (f(v)) {
      return(v);
    }
  }, x));
};
keys63 = function (t) {
  var _o6 = t;
  var k = undefined;
  for (k in _o6) {
    var v = _o6[k];
    var _e9;
    if (numeric63(k)) {
      _e9 = parseInt(k);
    } else {
      _e9 = k;
    }
    var _k5 = _e9;
    if (! number63(_k5)) {
      return(true);
    }
  }
  return(false);
};
empty63 = function (t) {
  var _o7 = t;
  var _i9 = undefined;
  for (_i9 in _o7) {
    var x = _o7[_i9];
    var _e10;
    if (numeric63(_i9)) {
      _e10 = parseInt(_i9);
    } else {
      _e10 = _i9;
    }
    var __i9 = _e10;
    return(false);
  }
  return(true);
};
stash = function (args) {
  if (keys63(args)) {
    var p = [];
    var _o8 = args;
    var k = undefined;
    for (k in _o8) {
      var v = _o8[k];
      var _e11;
      if (numeric63(k)) {
        _e11 = parseInt(k);
      } else {
        _e11 = k;
      }
      var _k6 = _e11;
      if (! number63(_k6)) {
        p[_k6] = v;
      }
    }
    p._stash = true;
    add(args, p);
  }
  return(args);
};
unstash = function (args) {
  if (none63(args)) {
    return([]);
  } else {
    var l = last(args);
    if (! atom63(l) && l._stash) {
      var args1 = almost(args);
      var _o9 = l;
      var k = undefined;
      for (k in _o9) {
        var v = _o9[k];
        var _e12;
        if (numeric63(k)) {
          _e12 = parseInt(k);
        } else {
          _e12 = k;
        }
        var _k7 = _e12;
        if (!( _k7 === "_stash")) {
          args1[_k7] = v;
        }
      }
      return(args1);
    } else {
      return(args);
    }
  }
};
search = function (s, pattern, start) {
  var i = s.indexOf(pattern, start);
  if (i >= 0) {
    return(i);
  }
};
split = function (s, sep) {
  if (s === "" || sep === "") {
    return([]);
  } else {
    var l = [];
    var n = _35(sep);
    while (true) {
      var i = search(s, sep);
      if (nil63(i)) {
        break;
      } else {
        add(l, clip(s, 0, i));
        s = clip(s, i + n);
      }
    }
    add(l, s);
    return(l);
  }
};
cat = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  if (none63(xs)) {
    return("");
  } else {
    return(reduce(function (a, b) {
      return(a + b);
    }, xs));
  }
};
_43 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (a, b) {
    return(a + b);
  }, xs));
};
_ = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (b, a) {
    return(a - b);
  }, reverse(xs)));
};
_42 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (a, b) {
    return(a * b);
  }, xs));
};
_47 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (b, a) {
    return(a / b);
  }, reverse(xs)));
};
_37 = function () {
  var xs = unstash(Array.prototype.slice.call(arguments, 0));
  return(reduce(function (b, a) {
    return(a % b);
  }, reverse(xs)));
};
_62 = function (a, b) {
  return(a > b);
};
_60 = function (a, b) {
  return(a < b);
};
_61 = function (a, b) {
  return(a === b);
};
_6261 = function (a, b) {
  return(a >= b);
};
_6061 = function (a, b) {
  return(a <= b);
};
number = function (s) {
  var n = parseFloat(s);
  if (! isNaN(n)) {
    return(n);
  }
};
number_code63 = function (n) {
  return(n > 47 && n < 58);
};
numeric63 = function (s) {
  var n = _35(s);
  var i = 0;
  while (i < n) {
    if (! number_code63(code(s, i))) {
      return(false);
    }
    i = i + 1;
  }
  return(true);
};
var tostring = function (x) {
  return(x.toString());
};
escape = function (s) {
  var s1 = "\"";
  var i = 0;
  while (i < _35(s)) {
    var c = char(s, i);
    var _e13;
    if (c === "\n") {
      _e13 = "\\n";
    } else {
      var _e14;
      if (c === "\"") {
        _e14 = "\\\"";
      } else {
        var _e15;
        if (c === "\\") {
          _e15 = "\\\\";
        } else {
          _e15 = c;
        }
        _e14 = _e15;
      }
      _e13 = _e14;
    }
    var c1 = _e13;
    s1 = s1 + c1;
    i = i + 1;
  }
  return(s1 + "\"");
};
string = function (x, depth, ancestors) {
  if (nil63(x)) {
    return("nil");
  } else {
    if (nan63(x)) {
      return("nan");
    } else {
      if (x === inf) {
        return("inf");
      } else {
        if (x === -inf) {
          return("-inf");
        } else {
          if (boolean63(x)) {
            if (x) {
              return("true");
            } else {
              return("false");
            }
          } else {
            if (string63(x)) {
              return(escape(x));
            } else {
              if (atom63(x)) {
                return(tostring(x));
              } else {
                if (function63(x)) {
                  return("fn");
                } else {
                  if (! obj63(x)) {
                    return("|" + type(x) + "|");
                  } else {
                    var s = "(";
                    var sp = "";
                    var xs = [];
                    var ks = [];
                    var d = (depth || 0) + 1;
                    var ans = join([x], ancestors || []);
                    if (in63(x, ancestors || [])) {
                      return("circular");
                    }
                    var _o10 = x;
                    var k = undefined;
                    for (k in _o10) {
                      var v = _o10[k];
                      var _e16;
                      if (numeric63(k)) {
                        _e16 = parseInt(k);
                      } else {
                        _e16 = k;
                      }
                      var _k8 = _e16;
                      if (number63(_k8)) {
                        xs[_k8] = string(v, d, ans);
                      } else {
                        add(ks, _k8 + ":");
                        add(ks, string(v, d, ans));
                      }
                    }
                    var _o11 = join(xs, ks);
                    var _i13 = undefined;
                    for (_i13 in _o11) {
                      var v = _o11[_i13];
                      var _e17;
                      if (numeric63(_i13)) {
                        _e17 = parseInt(_i13);
                      } else {
                        _e17 = _i13;
                      }
                      var __i13 = _e17;
                      s = s + sp + v;
                      sp = " ";
                    }
                    return(s + ")");
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
apply = function (f, args) {
  var _args = stash(args);
  return(f.apply(f, _args));
};
call = function (f) {
  return(f());
};
toplevel63 = function () {
  return(one63(environment));
};
setenv = function (k) {
  var _r69 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id1 = _r69;
  var _keys = cut(_id1, 0);
  if (string63(k)) {
    var _e18;
    if (_keys.toplevel) {
      _e18 = hd(environment);
    } else {
      _e18 = last(environment);
    }
    var frame = _e18;
    var entry = frame[k] || {};
    var _o12 = _keys;
    var _k9 = undefined;
    for (_k9 in _o12) {
      var v = _o12[_k9];
      var _e19;
      if (numeric63(_k9)) {
        _e19 = parseInt(_k9);
      } else {
        _e19 = _k9;
      }
      var _k10 = _e19;
      entry[_k10] = v;
    }
    frame[k] = entry;
    return(frame[k]);
  }
};
print = function (x) {
  return(console.log(x));
};
var math = Math;
abs = math.abs;
acos = math.acos;
asin = math.asin;
atan = math.atan;
atan2 = math.atan2;
ceil = math.ceil;
cos = math.cos;
floor = math.floor;
log = math.log;
log10 = math.log10;
max = math.max;
min = math.min;
pow = math.pow;
random = math.random;
sin = math.sin;
sinh = math.sinh;
sqrt = math.sqrt;
tan = math.tan;
tanh = math.tanh;
});

pkg("system", function () {
var fs = require("fs");
var read_file = function (path) {
  return(fs.readFileSync(path, "utf8"));
};
var write_file = function (path, data) {
  return(fs.writeFileSync(path, data, "utf8"));
};
var file_exists63 = function (path) {
  return(fs.existsSync(path, "utf8"));
};
var path_separator = require("path").sep;
var path_join = function () {
  var parts = unstash(Array.prototype.slice.call(arguments, 0));
  if (none63(parts)) {
    return("");
  } else {
    return(reduce(function (x, y) {
      return(x + path_separator + y);
    }, parts));
  }
};
var get_environment_variable = function (name) {
  return(process.env[name]);
};
var write = function (x) {
  var out = process.stdout;
  return(out.write(x));
};
var exit = function (code) {
  return(process.exit(code));
};
var argv = cut(process.argv, 2);
exports["read-file"] = read_file;
exports["write-file"] = write_file;
exports["file-exists?"] = file_exists63;
exports["path-separator"] = path_separator;
exports["path-join"] = path_join;
exports["get-environment-variable"] = get_environment_variable;
exports.write = write;
exports.exit = exit;
exports.argv = argv;
});

pkg("test", function () {
var passed = 0;
var failed = 0;
var tests = [];
var reader = require("reader");
var compiler = require("compiler");
setenv("test", {_stash: true, macro: function (x, msg) {
  return(["if", ["not", x], ["do", ["set", "failed", ["+", "failed", 1]], ["return", msg]], ["inc", "passed"]]);
}});
var equal63 = function (a, b) {
  if (atom63(a)) {
    return(a === b);
  } else {
    return(string(a) === string(b));
  }
};
setenv("test=", {_stash: true, macro: function (a, b) {
  return(["test", ["equal?", a, b], ["cat", "\"failed: expected \"", ["string", a], "\", was \"", ["string", b]]]);
}});
setenv("define-test", {_stash: true, macro: function (name) {
  var _r6 = unstash(Array.prototype.slice.call(arguments, 1));
  var _id1 = _r6;
  var body = cut(_id1, 0);
  return(["add", "tests", ["list", ["quote", name], join(["fn", join()], body)]]);
}});
run = function () {
  var _o = tests;
  var _i = undefined;
  for (_i in _o) {
    var _id2 = _o[_i];
    var name = _id2[0];
    var f = _id2[1];
    var _e;
    if (numeric63(_i)) {
      _e = parseInt(_i);
    } else {
      _e = _i;
    }
    var __i = _e;
    var result = f();
    if (string63(result)) {
      print(" " + name + " " + result);
    }
  }
  return(print(" " + passed + " passed, " + failed + " failed"));
};
add(tests, ["reader", function () {
  var read = reader["read-string"];
  if (! equal63(undefined, read(""))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(read("")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("nil", read("nil"))) {
    failed = failed + 1;
    return("failed: expected " + string("nil") + ", was " + string(read("nil")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, read("17"))) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(read("17")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0.015, read("1.5e-2"))) {
    failed = failed + 1;
    return("failed: expected " + string(0.015) + ", was " + string(read("1.5e-2")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, read("true"))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(read("true")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(! true, read("false"))) {
    failed = failed + 1;
    return("failed: expected " + string(! true) + ", was " + string(read("false")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("hi", read("hi"))) {
    failed = failed + 1;
    return("failed: expected " + string("hi") + ", was " + string(read("hi")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"hi\"", read("\"hi\""))) {
    failed = failed + 1;
    return("failed: expected " + string("\"hi\"") + ", was " + string(read("\"hi\"")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("|hi|", read("|hi|"))) {
    failed = failed + 1;
    return("failed: expected " + string("|hi|") + ", was " + string(read("|hi|")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2], read("(1 2)"))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2]) + ", was " + string(read("(1 2)")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, ["a"]], read("(1 (a))"))) {
    failed = failed + 1;
    return("failed: expected " + string([1, ["a"]]) + ", was " + string(read("(1 (a))")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "a"], read("'a"))) {
    failed = failed + 1;
    return("failed: expected " + string(["quote", "a"]) + ", was " + string(read("'a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", "a"], read("`a"))) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", "a"]) + ", was " + string(read("`a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", "a"]], read("`,a"))) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", ["unquote", "a"]]) + ", was " + string(read("`,a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote-splicing", "a"]], read("`,@a"))) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", ["unquote-splicing", "a"]]) + ", was " + string(read("`,@a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _35(read("(1 2 a: 7)")))) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(_35(read("(1 2 a: 7)"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, read("(1 2 a: 7)").a)) {
    failed = failed + 1;
    return("failed: expected " + string(7) + ", was " + string(read("(1 2 a: 7)").a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, read("(:a)").a)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(read("(:a)").a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, - -1)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(- -1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(read("nan")))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(nan63(read("nan"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(read("-nan")))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(nan63(read("-nan"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, inf63(read("inf")))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(inf63(read("inf"))));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, inf63(read("-inf")))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(inf63(read("-inf"))));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["read-more", function () {
  var read = reader["read-string"];
  if (! equal63(17, read("17", true))) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(read("17", true)));
  } else {
    passed = passed + 1;
  }
  var more = [];
  if (! equal63(more, read("(open", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("(open", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("\"unterminated ", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("\"unterminated ", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("|identifier", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("|identifier", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("'(a b c", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("'(a b c", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("`(a b c", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("`(a b c", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("`(a b ,(z", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("`(a b ,(z", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("`\"biz", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("`\"biz", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(more, read("'\"boz", more))) {
    failed = failed + 1;
    return("failed: expected " + string(more) + ", was " + string(read("'\"boz", more)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "Expected ) at 5"], (function () {
    try {
      return([true, read("(open")]);
    }
    catch (_e60) {
      return([false, _e60.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([false, "Expected ) at 5"]) + ", was " + string((function () {
      try {
        return([true, read("(open")]);
      }
      catch (_e61) {
        return([false, _e61.message]);
      }
    })()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["boolean", function () {
  if (! equal63(true, true || false)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(true || false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false || false)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(false || false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, false || false || true)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(false || false || true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, ! false)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(! false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, !( false && true))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(!( false && true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, !( false || true))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(!( false || true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, true && true)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(true && true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, true && false)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(true && false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, true && true && false)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(true && true && false));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["short", function () {
  var _id45 = true;
  var _e1;
  if (_id45) {
    _e1 = _id45;
  } else {
    throw new Error("bad");
    _e1 = undefined;
  }
  if (! equal63(true, _e1)) {
    failed = failed + 1;
    var _id46 = true;
    var _e2;
    if (_id46) {
      _e2 = _id46;
    } else {
      throw new Error("bad");
      _e2 = undefined;
    }
    return("failed: expected " + string(true) + ", was " + string(_e2));
  } else {
    passed = passed + 1;
  }
  var _id47 = false;
  var _e3;
  if (_id47) {
    throw new Error("bad");
    _e3 = undefined;
  } else {
    _e3 = _id47;
  }
  if (! equal63(false, _e3)) {
    failed = failed + 1;
    var _id48 = false;
    var _e4;
    if (_id48) {
      throw new Error("bad");
      _e4 = undefined;
    } else {
      _e4 = _id48;
    }
    return("failed: expected " + string(false) + ", was " + string(_e4));
  } else {
    passed = passed + 1;
  }
  var a = true;
  var _id49 = true;
  var _e5;
  if (_id49) {
    _e5 = _id49;
  } else {
    a = false;
    _e5 = false;
  }
  if (! equal63(true, _e5)) {
    failed = failed + 1;
    var _id50 = true;
    var _e6;
    if (_id50) {
      _e6 = _id50;
    } else {
      a = false;
      _e6 = false;
    }
    return("failed: expected " + string(true) + ", was " + string(_e6));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, a)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  var _id51 = false;
  var _e7;
  if (_id51) {
    a = false;
    _e7 = true;
  } else {
    _e7 = _id51;
  }
  if (! equal63(false, _e7)) {
    failed = failed + 1;
    var _id52 = false;
    var _e8;
    if (_id52) {
      a = false;
      _e8 = true;
    } else {
      _e8 = _id52;
    }
    return("failed: expected " + string(false) + ", was " + string(_e8));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, a)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  var b = true;
  b = false;
  var _id53 = false;
  var _e9;
  if (_id53) {
    _e9 = _id53;
  } else {
    b = true;
    _e9 = b;
  }
  if (! equal63(true, _e9)) {
    failed = failed + 1;
    b = false;
    var _id54 = false;
    var _e10;
    if (_id54) {
      _e10 = _id54;
    } else {
      b = true;
      _e10 = b;
    }
    return("failed: expected " + string(true) + ", was " + string(_e10));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, b)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  b = true;
  var _id55 = b;
  var _e11;
  if (_id55) {
    _e11 = _id55;
  } else {
    b = true;
    _e11 = b;
  }
  if (! equal63(true, _e11)) {
    failed = failed + 1;
    b = true;
    var _id56 = b;
    var _e12;
    if (_id56) {
      _e12 = _id56;
    } else {
      b = true;
      _e12 = b;
    }
    return("failed: expected " + string(true) + ", was " + string(_e12));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, b)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  b = false;
  var _id57 = true;
  var _e13;
  if (_id57) {
    b = true;
    _e13 = b;
  } else {
    _e13 = _id57;
  }
  if (! equal63(true, _e13)) {
    failed = failed + 1;
    b = false;
    var _id58 = true;
    var _e14;
    if (_id58) {
      b = true;
      _e14 = b;
    } else {
      _e14 = _id58;
    }
    return("failed: expected " + string(true) + ", was " + string(_e14));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, b)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  b = false;
  var _id59 = b;
  var _e15;
  if (_id59) {
    b = true;
    _e15 = b;
  } else {
    _e15 = _id59;
  }
  if (! equal63(false, _e15)) {
    failed = failed + 1;
    b = false;
    var _id60 = b;
    var _e16;
    if (_id60) {
      b = true;
      _e16 = b;
    } else {
      _e16 = _id60;
    }
    return("failed: expected " + string(false) + ", was " + string(_e16));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, b)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(b));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["numeric", function () {
  if (! equal63(4, 2 + 2)) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(2 + 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return("failed: expected " + string(18) + ", was " + string(18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, 7 - 3)) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(7 - 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, 10 / 2)) {
    failed = failed + 1;
    return("failed: expected " + string(5) + ", was " + string(10 / 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, 2 * 3)) {
    failed = failed + 1;
    return("failed: expected " + string(6) + ", was " + string(2 * 3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2.01 > 2)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(2.01 > 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 5 >= 5)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(5 >= 5));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2100 > 2000)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(2100 > 2000));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 0.002 < 0.0021)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(0.002 < 0.0021));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, 2 < 2)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(2 < 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, 2 <= 2)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(2 <= 2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(-7, - 7)) {
    failed = failed + 1;
    return("failed: expected " + string(-7) + ", was " + string(- 7));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["math", function () {
  if (! equal63(3, max(1, 3))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(max(1, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, min(2, 7))) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(min(2, 7)));
  } else {
    passed = passed + 1;
  }
  var n = random();
  if (! equal63(true, n > 0 && n < 1)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(n > 0 && n < 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, floor(4.78))) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(floor(4.78)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["precedence", function () {
  if (! equal63(-3, -( 1 + 2))) {
    failed = failed + 1;
    return("failed: expected " + string(-3) + ", was " + string(-( 1 + 2)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, 12 - (1 + 1))) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(12 - (1 + 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(11, 12 - 1 * 1)) {
    failed = failed + 1;
    return("failed: expected " + string(11) + ", was " + string(12 - 1 * 1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, 4 / 2 + 8)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(4 / 2 + 8));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["standalone", function () {
  if (! equal63(10, 10)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(10));
  } else {
    passed = passed + 1;
  }
  var x = undefined;
  x = 10;
  if (! equal63(9, 9)) {
    failed = failed + 1;
    x = 10;
    return("failed: expected " + string(9) + ", was " + string(9));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, x)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, 12)) {
    failed = failed + 1;
    return("failed: expected " + string(12) + ", was " + string(12));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["string", function () {
  if (! equal63(3, _35("foo"))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(_35("foo")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _35("\"a\""))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(_35("\"a\"")));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", char("bar", 1))) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(char("bar", 1)));
  } else {
    passed = passed + 1;
  }
  var s = "a\nb";
  if (! equal63(3, _35(s))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(_35(s)));
  } else {
    passed = passed + 1;
  }
  var _s = "a\nb\nc";
  if (! equal63(5, _35(_s))) {
    failed = failed + 1;
    return("failed: expected " + string(5) + ", was " + string(_35(_s)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _35("a\nb"))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(_35("a\nb")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _35("a\\b"))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(_35("a\\b")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["quote", function () {
  if (! equal63(7, 7)) {
    failed = failed + 1;
    return("failed: expected " + string(7) + ", was " + string(7));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, true)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(false));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "a"], ["quote", "a"])) {
    failed = failed + 1;
    return("failed: expected " + string(["quote", "a"]) + ", was " + string(["quote", "a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"a\"", "\"a\"")) {
    failed = failed + 1;
    return("failed: expected " + string("\"a\"") + ", was " + string("\"a\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"\\n\"", "\"\\n\"")) {
    failed = failed + 1;
    return("failed: expected " + string("\"\\n\"") + ", was " + string("\"\\n\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"\\\\\"", "\"\\\\\"")) {
    failed = failed + 1;
    return("failed: expected " + string("\"\\\\\"") + ", was " + string("\"\\\\\""));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quote", "\"a\""], ["quote", "\"a\""])) {
    failed = failed + 1;
    return("failed: expected " + string(["quote", "\"a\""]) + ", was " + string(["quote", "\"a\""]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("|(|", "|(|")) {
    failed = failed + 1;
    return("failed: expected " + string("|(|") + ", was " + string("|(|"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("unquote", "unquote")) {
    failed = failed + 1;
    return("failed: expected " + string("unquote") + ", was " + string("unquote"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["unquote"], ["unquote"])) {
    failed = failed + 1;
    return("failed: expected " + string(["unquote"]) + ", was " + string(["unquote"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["unquote", "a"], ["unquote", "a"])) {
    failed = failed + 1;
    return("failed: expected " + string(["unquote", "a"]) + ", was " + string(["unquote", "a"]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["list", function () {
  if (! equal63([], [])) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], [])) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string([]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], ["a"])) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], ["a"])) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(["a"]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[]], [[]])) {
    failed = failed + 1;
    return("failed: expected " + string([[]]) + ", was " + string([[]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, _35([]))) {
    failed = failed + 1;
    return("failed: expected " + string(0) + ", was " + string(_35([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _35([1, 2]))) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(_35([1, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], [1, 2, 3])) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string([1, 2, 3]));
  } else {
    passed = passed + 1;
  }
  var _x114 = [];
  _x114.foo = 17;
  if (! equal63(17, _x114.foo)) {
    failed = failed + 1;
    var _x115 = [];
    _x115.foo = 17;
    return("failed: expected " + string(17) + ", was " + string(_x115.foo));
  } else {
    passed = passed + 1;
  }
  var _x116 = [1];
  _x116.foo = 17;
  if (! equal63(17, _x116.foo)) {
    failed = failed + 1;
    var _x117 = [1];
    _x117.foo = 17;
    return("failed: expected " + string(17) + ", was " + string(_x117.foo));
  } else {
    passed = passed + 1;
  }
  var _x118 = [];
  _x118.foo = true;
  if (! equal63(true, _x118.foo)) {
    failed = failed + 1;
    var _x119 = [];
    _x119.foo = true;
    return("failed: expected " + string(true) + ", was " + string(_x119.foo));
  } else {
    passed = passed + 1;
  }
  var _x120 = [];
  _x120.foo = true;
  if (! equal63(true, _x120.foo)) {
    failed = failed + 1;
    var _x121 = [];
    _x121.foo = true;
    return("failed: expected " + string(true) + ", was " + string(_x121.foo));
  } else {
    passed = passed + 1;
  }
  var _x123 = [];
  _x123.foo = true;
  if (! equal63(true, hd([_x123]).foo)) {
    failed = failed + 1;
    var _x125 = [];
    _x125.foo = true;
    return("failed: expected " + string(true) + ", was " + string(hd([_x125]).foo));
  } else {
    passed = passed + 1;
  }
  var _x126 = [];
  _x126.a = true;
  var _x127 = [];
  _x127.a = true;
  if (! equal63(_x126, _x127)) {
    failed = failed + 1;
    var _x128 = [];
    _x128.a = true;
    var _x129 = [];
    _x129.a = true;
    return("failed: expected " + string(_x128) + ", was " + string(_x129));
  } else {
    passed = passed + 1;
  }
  var _x130 = [];
  _x130.b = false;
  var _x131 = [];
  _x131.b = false;
  if (! equal63(_x130, _x131)) {
    failed = failed + 1;
    var _x132 = [];
    _x132.b = false;
    var _x133 = [];
    _x133.b = false;
    return("failed: expected " + string(_x132) + ", was " + string(_x133));
  } else {
    passed = passed + 1;
  }
  var _x134 = [];
  _x134.c = 0;
  var _x135 = [];
  _x135.c = 0;
  if (! equal63(_x134, _x135)) {
    failed = failed + 1;
    var _x136 = [];
    _x136.c = 0;
    var _x137 = [];
    _x137.c = 0;
    return("failed: expected " + string(_x136) + ", was " + string(_x137));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["quasiquote", function () {
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", "a")) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join())) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(join()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, undefined)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(undefined));
  } else {
    passed = passed + 1;
  }
  var a = 42;
  if (! equal63(42, a)) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, a)) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", "a"]], ["quasiquote", ["unquote", "a"]])) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", ["unquote", "a"]]) + ", was " + string(["quasiquote", ["unquote", "a"]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["unquote", 42]], ["quasiquote", ["unquote", a]])) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", ["unquote", 42]]) + ", was " + string(["quasiquote", ["unquote", a]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]], ["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]])) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]]) + ", was " + string(["quasiquote", ["quasiquote", ["unquote", ["unquote", "a"]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", ["quasiquote", ["unquote", ["unquote", 42]]]], ["quasiquote", ["quasiquote", ["unquote", ["unquote", a]]]])) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", ["quasiquote", ["unquote", ["unquote", 42]]]]) + ", was " + string(["quasiquote", ["quasiquote", ["unquote", ["unquote", a]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ["quasiquote", ["b", ["unquote", "c"]]]], ["a", ["quasiquote", ["b", ["unquote", "c"]]]])) {
    failed = failed + 1;
    return("failed: expected " + string(["a", ["quasiquote", ["b", ["unquote", "c"]]]]) + ", was " + string(["a", ["quasiquote", ["b", ["unquote", "c"]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ["quasiquote", ["b", ["unquote", 42]]]], ["a", ["quasiquote", ["b", ["unquote", a]]]])) {
    failed = failed + 1;
    return("failed: expected " + string(["a", ["quasiquote", ["b", ["unquote", 42]]]]) + ", was " + string(["a", ["quasiquote", ["b", ["unquote", a]]]]));
  } else {
    passed = passed + 1;
  }
  var b = "c";
  if (! equal63(["quote", "c"], ["quote", b])) {
    failed = failed + 1;
    return("failed: expected " + string(["quote", "c"]) + ", was " + string(["quote", b]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([42], [a])) {
    failed = failed + 1;
    return("failed: expected " + string([42]) + ", was " + string([a]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[42]], [[a]])) {
    failed = failed + 1;
    return("failed: expected " + string([[42]]) + ", was " + string([[a]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([41, [42]], [41, [a]])) {
    failed = failed + 1;
    return("failed: expected " + string([41, [42]]) + ", was " + string([41, [a]]));
  } else {
    passed = passed + 1;
  }
  var c = [1, 2, 3];
  if (! equal63([[1, 2, 3]], [c])) {
    failed = failed + 1;
    return("failed: expected " + string([[1, 2, 3]]) + ", was " + string([c]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], c)) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(c));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, 1, 2, 3], join([0], c))) {
    failed = failed + 1;
    return("failed: expected " + string([0, 1, 2, 3]) + ", was " + string(join([0], c)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, 1, 2, 3, 4], join([0], c, [4]))) {
    failed = failed + 1;
    return("failed: expected " + string([0, 1, 2, 3, 4]) + ", was " + string(join([0], c, [4])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([0, [1, 2, 3], 4], [0, c, 4])) {
    failed = failed + 1;
    return("failed: expected " + string([0, [1, 2, 3], 4]) + ", was " + string([0, c, 4]));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3, 1, 2, 3], join(c, c))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3, 1, 2, 3]) + ", was " + string(join(c, c)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[1, 2, 3], 1, 2, 3], join([c], c))) {
    failed = failed + 1;
    return("failed: expected " + string([[1, 2, 3], 1, 2, 3]) + ", was " + string(join([c], c)));
  } else {
    passed = passed + 1;
  }
  var _a = 42;
  if (! equal63(["quasiquote", [["unquote-splicing", ["list", "a"]]]], ["quasiquote", [["unquote-splicing", ["list", "a"]]]])) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", [["unquote-splicing", ["list", "a"]]]]) + ", was " + string(["quasiquote", [["unquote-splicing", ["list", "a"]]]]));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["quasiquote", [["unquote-splicing", ["list", 42]]]], ["quasiquote", [["unquote-splicing", ["list", _a]]]])) {
    failed = failed + 1;
    return("failed: expected " + string(["quasiquote", [["unquote-splicing", ["list", 42]]]]) + ", was " + string(["quasiquote", [["unquote-splicing", ["list", _a]]]]));
  } else {
    passed = passed + 1;
  }
  var _x308 = [];
  _x308.foo = true;
  if (! equal63(true, _x308.foo)) {
    failed = failed + 1;
    var _x309 = [];
    _x309.foo = true;
    return("failed: expected " + string(true) + ", was " + string(_x309.foo));
  } else {
    passed = passed + 1;
  }
  var _a1 = 17;
  var b = [1, 2];
  var _c = {a: 10};
  var _x311 = [];
  _x311.a = 10;
  var d = _x311;
  var _x312 = [];
  _x312.foo = _a1;
  if (! equal63(17, _x312.foo)) {
    failed = failed + 1;
    var _x313 = [];
    _x313.foo = _a1;
    return("failed: expected " + string(17) + ", was " + string(_x313.foo));
  } else {
    passed = passed + 1;
  }
  var _x314 = [];
  _x314.foo = _a1;
  if (! equal63(2, _35(join(_x314, b)))) {
    failed = failed + 1;
    var _x315 = [];
    _x315.foo = _a1;
    return("failed: expected " + string(2) + ", was " + string(_35(join(_x315, b))));
  } else {
    passed = passed + 1;
  }
  var _x316 = [];
  _x316.foo = _a1;
  if (! equal63(17, _x316.foo)) {
    failed = failed + 1;
    var _x317 = [];
    _x317.foo = _a1;
    return("failed: expected " + string(17) + ", was " + string(_x317.foo));
  } else {
    passed = passed + 1;
  }
  var _x318 = [1];
  _x318.a = 10;
  if (! equal63(_x318, join([1], _c))) {
    failed = failed + 1;
    var _x320 = [1];
    _x320.a = 10;
    return("failed: expected " + string(_x320) + ", was " + string(join([1], _c)));
  } else {
    passed = passed + 1;
  }
  var _x322 = [1];
  _x322.a = 10;
  if (! equal63(_x322, join([1], d))) {
    failed = failed + 1;
    var _x324 = [1];
    _x324.a = 10;
    return("failed: expected " + string(_x324) + ", was " + string(join([1], d)));
  } else {
    passed = passed + 1;
  }
  var _x327 = [];
  _x327.foo = true;
  if (! equal63(true, hd([_x327]).foo)) {
    failed = failed + 1;
    var _x329 = [];
    _x329.foo = true;
    return("failed: expected " + string(true) + ", was " + string(hd([_x329]).foo));
  } else {
    passed = passed + 1;
  }
  var _x331 = [];
  _x331.foo = true;
  if (! equal63(true, hd([_x331]).foo)) {
    failed = failed + 1;
    var _x333 = [];
    _x333.foo = true;
    return("failed: expected " + string(true) + ", was " + string(hd([_x333]).foo));
  } else {
    passed = passed + 1;
  }
  var _x334 = [];
  _x334.foo = true;
  if (! equal63(true, _x334.foo)) {
    failed = failed + 1;
    var _x335 = [];
    _x335.foo = true;
    return("failed: expected " + string(true) + ", was " + string(_x335.foo));
  } else {
    passed = passed + 1;
  }
  var _x337 = [];
  _x337.foo = true;
  if (! equal63(true, join([1, 2, 3], _x337).foo)) {
    failed = failed + 1;
    var _x339 = [];
    _x339.foo = true;
    return("failed: expected " + string(true) + ", was " + string(join([1, 2, 3], _x339).foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, {foo: true}.foo)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string({foo: true}.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, {bar: 17}.bar)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string({bar: 17}.bar));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, {baz: function () {
    return(17);
  }}.baz())) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string({baz: function () {
      return(17);
    }}.baz()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["quasiexpand", function () {
  if (! equal63("a", macroexpand("a"))) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(macroexpand("a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([17], macroexpand([17]))) {
    failed = failed + 1;
    return("failed: expected " + string([17]) + ", was " + string(macroexpand([17])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, "z"], macroexpand([1, "z"]))) {
    failed = failed + 1;
    return("failed: expected " + string([1, "z"]) + ", was " + string(macroexpand([1, "z"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", 1, "\"z\""], macroexpand(["quasiquote", [1, "z"]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", 1, "\"z\""]) + ", was " + string(macroexpand(["quasiquote", [1, "z"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", 1, "z"], macroexpand(["quasiquote", [["unquote", 1], ["unquote", "z"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", 1, "z"]) + ", was " + string(macroexpand(["quasiquote", [["unquote", 1], ["unquote", "z"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("z", macroexpand(["quasiquote", [["unquote-splicing", "z"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string("z") + ", was " + string(macroexpand(["quasiquote", [["unquote-splicing", "z"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z"], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["join", ["%array", 1], "z"]) + ", was " + string(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "x", "y"], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "x"], ["unquote-splicing", "y"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["join", ["%array", 1], "x", "y"]) + ", was " + string(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "x"], ["unquote-splicing", "y"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z", ["%array", 2]], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], ["unquote", 2]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["join", ["%array", 1], "z", ["%array", 2]]) + ", was " + string(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], ["unquote", 2]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["join", ["%array", 1], "z", ["%array", "\"a\""]], macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], "a"]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["join", ["%array", 1], "z", ["%array", "\"a\""]]) + ", was " + string(macroexpand(["quasiquote", [["unquote", 1], ["unquote-splicing", "z"], "a"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("\"x\"", macroexpand(["quasiquote", "x"]))) {
    failed = failed + 1;
    return("failed: expected " + string("\"x\"") + ", was " + string(macroexpand(["quasiquote", "x"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", "\"x\""], macroexpand(["quasiquote", ["quasiquote", "x"]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", "\"quasiquote\"", "\"x\""]) + ", was " + string(macroexpand(["quasiquote", ["quasiquote", "x"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"quasiquote\"", "\"x\""]], macroexpand(["quasiquote", ["quasiquote", ["quasiquote", "x"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", "\"quasiquote\"", ["%array", "\"quasiquote\"", "\"x\""]]) + ", was " + string(macroexpand(["quasiquote", ["quasiquote", ["quasiquote", "x"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("x", macroexpand(["quasiquote", ["unquote", "x"]]))) {
    failed = failed + 1;
    return("failed: expected " + string("x") + ", was " + string(macroexpand(["quasiquote", ["unquote", "x"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quote\"", "x"], macroexpand(["quasiquote", ["quote", ["unquote", "x"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", "\"quote\"", "x"]) + ", was " + string(macroexpand(["quasiquote", ["quote", ["unquote", "x"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"x\""]], macroexpand(["quasiquote", ["quasiquote", ["x"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", "\"quasiquote\"", ["%array", "\"x\""]]) + ", was " + string(macroexpand(["quasiquote", ["quasiquote", ["x"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", "\"unquote\"", "\"a\""]], macroexpand(["quasiquote", ["quasiquote", ["unquote", "a"]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", "\"quasiquote\"", ["%array", "\"unquote\"", "\"a\""]]) + ", was " + string(macroexpand(["quasiquote", ["quasiquote", ["unquote", "a"]]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%array", "\"quasiquote\"", ["%array", ["%array", "\"unquote\"", "\"x\""]]], macroexpand(["quasiquote", ["quasiquote", [["unquote", "x"]]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%array", "\"quasiquote\"", ["%array", ["%array", "\"unquote\"", "\"x\""]]]) + ", was " + string(macroexpand(["quasiquote", ["quasiquote", [["unquote", "x"]]]])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["calls", function () {
  var f = function () {
    return(42);
  };
  var l = [f];
  var t = {f: f};
  if (! equal63(42, f())) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(f()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, l[0]())) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(l[0]()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, t.f())) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(t.f()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, (function () {
    return;
  })())) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string((function () {
      return;
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, (function (x) {
    return(x - 2);
  })(12))) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string((function (x) {
      return(x - 2);
    })(12)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["id", function () {
  var a = 10;
  var b = {x: 20};
  var f = function () {
    return(30);
  };
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b.x)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(b.x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, f())) {
    failed = failed + 1;
    return("failed: expected " + string(30) + ", was " + string(f()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["names", function () {
  var a33 = 0;
  var b63 = 1;
  var _37 = 2;
  var _4242 = 3;
  var _break = 4;
  if (! equal63(0, a33)) {
    failed = failed + 1;
    return("failed: expected " + string(0) + ", was " + string(a33));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, b63)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(b63));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _37)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(_37));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, _4242)) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(_4242));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, _break)) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(_break));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["set", function () {
  var a = 42;
  a = "bar";
  if (! equal63("bar", a)) {
    failed = failed + 1;
    return("failed: expected " + string("bar") + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  a = 10;
  var x = a;
  if (! equal63(10, x)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  a = false;
  if (! equal63(false, a)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  a = undefined;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(a));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["wipe", function () {
  var _x504 = [];
  _x504.b = true;
  _x504.c = true;
  _x504.a = true;
  var x = _x504;
  delete x.a;
  if (! equal63(undefined, x.a)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(x.a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, x.b)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(x.b));
  } else {
    passed = passed + 1;
  }
  delete x.c;
  if (! equal63(undefined, x.c)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(x.c));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, x.b)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(x.b));
  } else {
    passed = passed + 1;
  }
  delete x.b;
  if (! equal63(undefined, x.b)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(x.b));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], x)) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(x));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["do", function () {
  var a = 17;
  a = 10;
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  a = 2;
  var b = a + 5;
  if (! equal63(a, 2)) {
    failed = failed + 1;
    return("failed: expected " + string(a) + ", was " + string(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(b, 7)) {
    failed = failed + 1;
    return("failed: expected " + string(b) + ", was " + string(7));
  } else {
    passed = passed + 1;
  }
  a = 10;
  a = 20;
  if (! equal63(20, a)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  a = 10;
  a = 20;
  if (! equal63(20, a)) {
    failed = failed + 1;
    a = 10;
    a = 20;
    return("failed: expected " + string(20) + ", was " + string(a));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["if", function () {
  if (! equal63("a", macroexpand(["if", "a"]))) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(macroexpand(["if", "a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b"], macroexpand(["if", "a", "b"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%if", "a", "b"]) + ", was " + string(macroexpand(["if", "a", "b"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", "c"], macroexpand(["if", "a", "b", "c"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%if", "a", "b", "c"]) + ", was " + string(macroexpand(["if", "a", "b", "c"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", ["%if", "c", "d"]], macroexpand(["if", "a", "b", "c", "d"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%if", "a", "b", ["%if", "c", "d"]]) + ", was " + string(macroexpand(["if", "a", "b", "c", "d"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["%if", "a", "b", ["%if", "c", "d", "e"]], macroexpand(["if", "a", "b", "c", "d", "e"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["%if", "a", "b", ["%if", "c", "d", "e"]]) + ", was " + string(macroexpand(["if", "a", "b", "c", "d", "e"])));
  } else {
    passed = passed + 1;
  }
  if (true) {
    if (! equal63(true, true)) {
      failed = failed + 1;
      return("failed: expected " + string(true) + ", was " + string(true));
    } else {
      passed = passed + 1;
    }
  } else {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + string(true) + ", was " + string(false));
    } else {
      passed = passed + 1;
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + string(true) + ", was " + string(false));
    } else {
      passed = passed + 1;
    }
  } else {
    if (false) {
      if (! equal63(false, true)) {
        failed = failed + 1;
        return("failed: expected " + string(false) + ", was " + string(true));
      } else {
        passed = passed + 1;
      }
    } else {
      if (! equal63(true, true)) {
        failed = failed + 1;
        return("failed: expected " + string(true) + ", was " + string(true));
      } else {
        passed = passed + 1;
      }
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + string(true) + ", was " + string(false));
    } else {
      passed = passed + 1;
    }
  } else {
    if (false) {
      if (! equal63(false, true)) {
        failed = failed + 1;
        return("failed: expected " + string(false) + ", was " + string(true));
      } else {
        passed = passed + 1;
      }
    } else {
      if (false) {
        if (! equal63(false, true)) {
          failed = failed + 1;
          return("failed: expected " + string(false) + ", was " + string(true));
        } else {
          passed = passed + 1;
        }
      } else {
        if (! equal63(true, true)) {
          failed = failed + 1;
          return("failed: expected " + string(true) + ", was " + string(true));
        } else {
          passed = passed + 1;
        }
      }
    }
  }
  if (false) {
    if (! equal63(true, false)) {
      failed = failed + 1;
      return("failed: expected " + string(true) + ", was " + string(false));
    } else {
      passed = passed + 1;
    }
  } else {
    if (true) {
      if (! equal63(true, true)) {
        failed = failed + 1;
        return("failed: expected " + string(true) + ", was " + string(true));
      } else {
        passed = passed + 1;
      }
    } else {
      if (false) {
        if (! equal63(false, true)) {
          failed = failed + 1;
          return("failed: expected " + string(false) + ", was " + string(true));
        } else {
          passed = passed + 1;
        }
      } else {
        if (! equal63(true, true)) {
          failed = failed + 1;
          return("failed: expected " + string(true) + ", was " + string(true));
        } else {
          passed = passed + 1;
        }
      }
    }
  }
  var _e17;
  if (true) {
    _e17 = 1;
  } else {
    _e17 = 2;
  }
  if (! equal63(1, _e17)) {
    failed = failed + 1;
    var _e18;
    if (true) {
      _e18 = 1;
    } else {
      _e18 = 2;
    }
    return("failed: expected " + string(1) + ", was " + string(_e18));
  } else {
    passed = passed + 1;
  }
  var _e19;
  var a = 10;
  if (a) {
    _e19 = 1;
  } else {
    _e19 = 2;
  }
  if (! equal63(1, _e19)) {
    failed = failed + 1;
    var _e20;
    var _a2 = 10;
    if (_a2) {
      _e20 = 1;
    } else {
      _e20 = 2;
    }
    return("failed: expected " + string(1) + ", was " + string(_e20));
  } else {
    passed = passed + 1;
  }
  var _e21;
  if (true) {
    var _a3 = 1;
    _e21 = _a3;
  } else {
    _e21 = 2;
  }
  if (! equal63(1, _e21)) {
    failed = failed + 1;
    var _e22;
    if (true) {
      var _a4 = 1;
      _e22 = _a4;
    } else {
      _e22 = 2;
    }
    return("failed: expected " + string(1) + ", was " + string(_e22));
  } else {
    passed = passed + 1;
  }
  var _e23;
  if (false) {
    _e23 = 2;
  } else {
    var _a5 = 1;
    _e23 = _a5;
  }
  if (! equal63(1, _e23)) {
    failed = failed + 1;
    var _e24;
    if (false) {
      _e24 = 2;
    } else {
      var _a6 = 1;
      _e24 = _a6;
    }
    return("failed: expected " + string(1) + ", was " + string(_e24));
  } else {
    passed = passed + 1;
  }
  var _e25;
  if (false) {
    _e25 = 2;
  } else {
    var _e26;
    if (true) {
      var _a7 = 1;
      _e26 = _a7;
    }
    _e25 = _e26;
  }
  if (! equal63(1, _e25)) {
    failed = failed + 1;
    var _e27;
    if (false) {
      _e27 = 2;
    } else {
      var _e28;
      if (true) {
        var _a8 = 1;
        _e28 = _a8;
      }
      _e27 = _e28;
    }
    return("failed: expected " + string(1) + ", was " + string(_e27));
  } else {
    passed = passed + 1;
  }
  var _e29;
  if (false) {
    _e29 = 2;
  } else {
    var _e30;
    if (false) {
      _e30 = 3;
    } else {
      var _a9 = 1;
      _e30 = _a9;
    }
    _e29 = _e30;
  }
  if (! equal63(1, _e29)) {
    failed = failed + 1;
    var _e31;
    if (false) {
      _e31 = 2;
    } else {
      var _e32;
      if (false) {
        _e32 = 3;
      } else {
        var _a10 = 1;
        _e32 = _a10;
      }
      _e31 = _e32;
    }
    return("failed: expected " + string(1) + ", was " + string(_e31));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["case", function () {
  var x = 10;
  var _e33;
  if (9 === x) {
    _e33 = 9;
  } else {
    var _e34;
    if (10 === x) {
      _e34 = 2;
    } else {
      _e34 = 4;
    }
    _e33 = _e34;
  }
  if (! equal63(2, _e33)) {
    failed = failed + 1;
    var _e35;
    if (9 === x) {
      _e35 = 9;
    } else {
      var _e36;
      if (10 === x) {
        _e36 = 2;
      } else {
        _e36 = 4;
      }
      _e35 = _e36;
    }
    return("failed: expected " + string(2) + ", was " + string(_e35));
  } else {
    passed = passed + 1;
  }
  var _x530 = "z";
  var _e37;
  if ("z" === _x530) {
    _e37 = 9;
  } else {
    _e37 = 10;
  }
  if (! equal63(9, _e37)) {
    failed = failed + 1;
    var _e38;
    if ("z" === _x530) {
      _e38 = 9;
    } else {
      _e38 = 10;
    }
    return("failed: expected " + string(9) + ", was " + string(_e38));
  } else {
    passed = passed + 1;
  }
  var _e39;
  if ("a" === _x530) {
    _e39 = 1;
  } else {
    var _e40;
    if ("b" === _x530) {
      _e40 = 2;
    } else {
      _e40 = 7;
    }
    _e39 = _e40;
  }
  if (! equal63(7, _e39)) {
    failed = failed + 1;
    var _e41;
    if ("a" === _x530) {
      _e41 = 1;
    } else {
      var _e42;
      if ("b" === _x530) {
        _e42 = 2;
      } else {
        _e42 = 7;
      }
      _e41 = _e42;
    }
    return("failed: expected " + string(7) + ", was " + string(_e41));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["while", function () {
  var i = 0;
  while (i < 5) {
    if (i === 3) {
      break;
    } else {
      i = i + 1;
    }
  }
  if (! equal63(3, i)) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(i));
  } else {
    passed = passed + 1;
  }
  while (i < 10) {
    i = i + 1;
  }
  if (! equal63(10, i)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(i));
  } else {
    passed = passed + 1;
  }
  while (i < 15) {
    i = i + 1;
  }
  var a;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(15, i)) {
    failed = failed + 1;
    return("failed: expected " + string(15) + ", was " + string(i));
  } else {
    passed = passed + 1;
  }
  while (i < 20) {
    if (i === 19) {
      break;
    } else {
      i = i + 1;
    }
  }
  var b;
  if (! equal63(undefined, a)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(19, i)) {
    failed = failed + 1;
    return("failed: expected " + string(19) + ", was " + string(i));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["for", function () {
  var l = [];
  var i = 0;
  while (i < 5) {
    add(l, i);
    i = i + 1;
  }
  if (! equal63([0, 1, 2, 3, 4], l)) {
    failed = failed + 1;
    return("failed: expected " + string([0, 1, 2, 3, 4]) + ", was " + string(l));
  } else {
    passed = passed + 1;
  }
  var _l = [];
  var i = 0;
  while (i < 2) {
    add(_l, i);
    i = i + 1;
  }
  if (! equal63([0, 1], _l)) {
    failed = failed + 1;
    var _l1 = [];
    var i = 0;
    while (i < 2) {
      add(_l1, i);
      i = i + 1;
    }
    return("failed: expected " + string([0, 1]) + ", was " + string(_l1));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["table", function () {
  if (! equal63(10, {a: 10}.a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string({a: 10}.a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, {a: true}.a)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string({a: true}.a));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["empty", function () {
  if (! equal63(true, empty63([]))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(empty63([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, empty63({}))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(empty63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63([1]))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(empty63([1])));
  } else {
    passed = passed + 1;
  }
  var _x541 = [];
  _x541.a = true;
  if (! equal63(false, empty63(_x541))) {
    failed = failed + 1;
    var _x542 = [];
    _x542.a = true;
    return("failed: expected " + string(false) + ", was " + string(empty63(_x542)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, empty63({a: true}))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(empty63({a: true})));
  } else {
    passed = passed + 1;
  }
  var _x543 = [];
  _x543.b = false;
  if (! equal63(false, empty63(_x543))) {
    failed = failed + 1;
    var _x544 = [];
    _x544.b = false;
    return("failed: expected " + string(false) + ", was " + string(empty63(_x544)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["at", function () {
  var l = ["a", "b", "c", "d"];
  if (! equal63("a", l[0])) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(l[0]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", l[1])) {
    failed = failed + 1;
    return("failed: expected " + string("b") + ", was " + string(l[1]));
  } else {
    passed = passed + 1;
  }
  l[0] = 9;
  if (! equal63(9, l[0])) {
    failed = failed + 1;
    return("failed: expected " + string(9) + ", was " + string(l[0]));
  } else {
    passed = passed + 1;
  }
  l[3] = 10;
  if (! equal63(10, l[3])) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(l[3]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["get-set", function () {
  var t = {};
  t.foo = "bar";
  if (! equal63("bar", t.foo)) {
    failed = failed + 1;
    return("failed: expected " + string("bar") + ", was " + string(t.foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", t.foo)) {
    failed = failed + 1;
    return("failed: expected " + string("bar") + ", was " + string(t.foo));
  } else {
    passed = passed + 1;
  }
  var k = "foo";
  if (! equal63("bar", t[k])) {
    failed = failed + 1;
    return("failed: expected " + string("bar") + ", was " + string(t[k]));
  } else {
    passed = passed + 1;
  }
  if (! equal63("bar", t["f" + "oo"])) {
    failed = failed + 1;
    return("failed: expected " + string("bar") + ", was " + string(t["f" + "oo"]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["each", function () {
  var _x549 = [1, 2, 3];
  _x549.b = false;
  _x549.a = true;
  var t = _x549;
  var a = 0;
  var b = 0;
  var _o1 = t;
  var k = undefined;
  for (k in _o1) {
    var v = _o1[k];
    var _e43;
    if (numeric63(k)) {
      _e43 = parseInt(k);
    } else {
      _e43 = k;
    }
    var _k = _e43;
    if (number63(_k)) {
      a = a + 1;
    } else {
      b = b + 1;
    }
  }
  if (! equal63(3, a)) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, b)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  var _a11 = 0;
  var _o2 = t;
  var _i2 = undefined;
  for (_i2 in _o2) {
    var x = _o2[_i2];
    var _e44;
    if (numeric63(_i2)) {
      _e44 = parseInt(_i2);
    } else {
      _e44 = _i2;
    }
    var __i2 = _e44;
    _a11 = _a11 + 1;
  }
  if (! equal63(5, _a11)) {
    failed = failed + 1;
    return("failed: expected " + string(5) + ", was " + string(_a11));
  } else {
    passed = passed + 1;
  }
  var _x550 = [[1], [2]];
  _x550.b = [3];
  var _t = _x550;
  var _o3 = _t;
  var _i3 = undefined;
  for (_i3 in _o3) {
    var x = _o3[_i3];
    var _e45;
    if (numeric63(_i3)) {
      _e45 = parseInt(_i3);
    } else {
      _e45 = _i3;
    }
    var __i3 = _e45;
    if (! equal63(false, atom63(x))) {
      failed = failed + 1;
      return("failed: expected " + string(false) + ", was " + string(atom63(x)));
    } else {
      passed = passed + 1;
    }
  }
  var _o4 = _t;
  var _i4 = undefined;
  for (_i4 in _o4) {
    var x = _o4[_i4];
    var _e46;
    if (numeric63(_i4)) {
      _e46 = parseInt(_i4);
    } else {
      _e46 = _i4;
    }
    var __i4 = _e46;
    if (! equal63(false, atom63(x))) {
      failed = failed + 1;
      return("failed: expected " + string(false) + ", was " + string(atom63(x)));
    } else {
      passed = passed + 1;
    }
  }
  var _o5 = _t;
  var _i5 = undefined;
  for (_i5 in _o5) {
    var _id3 = _o5[_i5];
    var x = _id3[0];
    var _e47;
    if (numeric63(_i5)) {
      _e47 = parseInt(_i5);
    } else {
      _e47 = _i5;
    }
    var __i5 = _e47;
    if (! equal63(true, number63(x))) {
      failed = failed + 1;
      return("failed: expected " + string(true) + ", was " + string(number63(x)));
    } else {
      passed = passed + 1;
    }
  }
}]);
add(tests, ["fn", function () {
  var f = function (n) {
    return(n + 10);
  };
  if (! equal63(20, f(10))) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(f(10)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, f(20))) {
    failed = failed + 1;
    return("failed: expected " + string(30) + ", was " + string(f(20)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, (function (n) {
    return(n + 10);
  })(30))) {
    failed = failed + 1;
    return("failed: expected " + string(40) + ", was " + string((function (n) {
      return(n + 10);
    })(30)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 3, 4], map(function (x) {
    return(x + 1);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string([2, 3, 4]) + ", was " + string(map(function (x) {
      return(x + 1);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["define", function () {
  var x = 20;
  var f = function () {
    return(42);
  };
  if (! equal63(20, x)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, f())) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(f()));
  } else {
    passed = passed + 1;
  }
  (function () {
    var f = function () {
      return(38);
    };
    if (! equal63(38, f())) {
      failed = failed + 1;
      return("failed: expected " + string(38) + ", was " + string(f()));
    } else {
      passed = passed + 1;
      return(passed);
    }
  })();
  if (! equal63(42, f())) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(f()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["return", function () {
  var a = (function () {
    return(17);
  })();
  if (! equal63(17, a)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  var _a12 = (function () {
    if (true) {
      return(10);
    } else {
      return(20);
    }
  })();
  if (! equal63(10, _a12)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(_a12));
  } else {
    passed = passed + 1;
  }
  var _a13 = (function () {
    while (false) {
      blah();
    }
  })();
  if (! equal63(undefined, _a13)) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(_a13));
  } else {
    passed = passed + 1;
  }
  var _a14 = 11;
  var b = (function () {
    _a14 = _a14 + 1;
    return(_a14);
  })();
  if (! equal63(12, b)) {
    failed = failed + 1;
    return("failed: expected " + string(12) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, _a14)) {
    failed = failed + 1;
    return("failed: expected " + string(12) + ", was " + string(_a14));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["guard", function () {
  if (! equal63([true, 42], (function () {
    try {
      return([true, 42]);
    }
    catch (_e62) {
      return([false, _e62.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([true, 42]) + ", was " + string((function () {
      try {
        return([true, 42]);
      }
      catch (_e63) {
        return([false, _e63.message]);
      }
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "foo"], (function () {
    try {
      throw new Error("foo");
      return([true]);
    }
    catch (_e64) {
      return([false, _e64.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([false, "foo"]) + ", was " + string((function () {
      try {
        throw new Error("foo");
        return([true]);
      }
      catch (_e65) {
        return([false, _e65.message]);
      }
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "foo"], (function () {
    try {
      throw new Error("foo");
      throw new Error("baz");
      return([true]);
    }
    catch (_e66) {
      return([false, _e66.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([false, "foo"]) + ", was " + string((function () {
      try {
        throw new Error("foo");
        throw new Error("baz");
        return([true]);
      }
      catch (_e67) {
        return([false, _e67.message]);
      }
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "baz"], (function () {
    try {
      (function () {
        try {
          throw new Error("foo");
          return([true]);
        }
        catch (_e69) {
          return([false, _e69.message]);
        }
      })();
      throw new Error("baz");
      return([true]);
    }
    catch (_e68) {
      return([false, _e68.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([false, "baz"]) + ", was " + string((function () {
      try {
        (function () {
          try {
            throw new Error("foo");
            return([true]);
          }
          catch (_e71) {
            return([false, _e71.message]);
          }
        })();
        throw new Error("baz");
        return([true]);
      }
      catch (_e70) {
        return([false, _e70.message]);
      }
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([true, 42], (function () {
    try {
      var _e48;
      if (true) {
        _e48 = 42;
      } else {
        throw new Error("baz");
        _e48 = undefined;
      }
      return([true, _e48]);
    }
    catch (_e72) {
      return([false, _e72.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([true, 42]) + ", was " + string((function () {
      try {
        var _e49;
        if (true) {
          _e49 = 42;
        } else {
          throw new Error("baz");
          _e49 = undefined;
        }
        return([true, _e49]);
      }
      catch (_e73) {
        return([false, _e73.message]);
      }
    })()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([false, "baz"], (function () {
    try {
      var _e50;
      if (false) {
        _e50 = 42;
      } else {
        throw new Error("baz");
        _e50 = undefined;
      }
      return([true, _e50]);
    }
    catch (_e74) {
      return([false, _e74.message]);
    }
  })())) {
    failed = failed + 1;
    return("failed: expected " + string([false, "baz"]) + ", was " + string((function () {
      try {
        var _e51;
        if (false) {
          _e51 = 42;
        } else {
          throw new Error("baz");
          _e51 = undefined;
        }
        return([true, _e51]);
      }
      catch (_e75) {
        return([false, _e75.message]);
      }
    })()));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let", function () {
  var a = 10;
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  var _a15 = 10;
  if (! equal63(10, _a15)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(_a15));
  } else {
    passed = passed + 1;
  }
  var _a16 = 11;
  var b = 12;
  if (! equal63(11, _a16)) {
    failed = failed + 1;
    return("failed: expected " + string(11) + ", was " + string(_a16));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, b)) {
    failed = failed + 1;
    return("failed: expected " + string(12) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  var _a17 = 1;
  if (! equal63(1, _a17)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(_a17));
  } else {
    passed = passed + 1;
  }
  var _a18 = 2;
  if (! equal63(2, _a18)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(_a18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, _a17)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(_a17));
  } else {
    passed = passed + 1;
  }
  var _a19 = 1;
  var _a20 = 2;
  var _a21 = 3;
  if (! equal63(_a21, 3)) {
    failed = failed + 1;
    return("failed: expected " + string(_a21) + ", was " + string(3));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a20, 2)) {
    failed = failed + 1;
    return("failed: expected " + string(_a20) + ", was " + string(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_a19, 1)) {
    failed = failed + 1;
    return("failed: expected " + string(_a19) + ", was " + string(1));
  } else {
    passed = passed + 1;
  }
  var _a22 = 20;
  if (! equal63(20, _a22)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(_a22));
  } else {
    passed = passed + 1;
  }
  var _a23 = _a22 + 7;
  if (! equal63(27, _a23)) {
    failed = failed + 1;
    return("failed: expected " + string(27) + ", was " + string(_a23));
  } else {
    passed = passed + 1;
  }
  var _a24 = _a22 + 10;
  if (! equal63(30, _a24)) {
    failed = failed + 1;
    return("failed: expected " + string(30) + ", was " + string(_a24));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _a22)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(_a22));
  } else {
    passed = passed + 1;
  }
  var _a25 = 10;
  if (! equal63(10, _a25)) {
    failed = failed + 1;
    var _a26 = 10;
    return("failed: expected " + string(10) + ", was " + string(_a26));
  } else {
    passed = passed + 1;
  }
  var b = 12;
  var _a27 = b;
  if (! equal63(12, _a27)) {
    failed = failed + 1;
    return("failed: expected " + string(12) + ", was " + string(_a27));
  } else {
    passed = passed + 1;
  }
  var _a29 = 10;
  var _a28 = _a29;
  if (! equal63(10, _a28)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(_a28));
  } else {
    passed = passed + 1;
  }
  var _a31 = 0;
  _a31 = 10;
  var _a30 = _a31 + 2 + 3;
  if (! equal63(_a30, 15)) {
    failed = failed + 1;
    return("failed: expected " + string(_a30) + ", was " + string(15));
  } else {
    passed = passed + 1;
  }
  (function (zz) {
    if (! equal63(20, zz)) {
      failed = failed + 1;
      return("failed: expected " + string(20) + ", was " + string(zz));
    } else {
      passed = passed + 1;
    }
    var _zz = 21;
    if (! equal63(21, _zz)) {
      failed = failed + 1;
      return("failed: expected " + string(21) + ", was " + string(_zz));
    } else {
      passed = passed + 1;
    }
    if (! equal63(20, zz)) {
      failed = failed + 1;
      return("failed: expected " + string(20) + ", was " + string(zz));
    } else {
      passed = passed + 1;
      return(passed);
    }
  })(20);
  var q = 9;
  return((function () {
    var _q = 10;
    if (! equal63(10, _q)) {
      failed = failed + 1;
      return("failed: expected " + string(10) + ", was " + string(_q));
    } else {
      passed = passed + 1;
    }
    if (! equal63(9, q)) {
      failed = failed + 1;
      return("failed: expected " + string(9) + ", was " + string(q));
    } else {
      passed = passed + 1;
      return(passed);
    }
  })());
}]);
add(tests, ["with", function () {
  var x = 9;
  x = x + 1;
  if (! equal63(10, x)) {
    failed = failed + 1;
    var _x590 = 9;
    _x590 = _x590 + 1;
    return("failed: expected " + string(10) + ", was " + string(_x590));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-when", function () {
  var _y = "a" === "b";
  var _e52;
  if (_y) {
    var frips = _y;
    _e52 = 19;
  }
  if (! equal63(undefined, _e52)) {
    failed = failed + 1;
    var _y1 = "a" === "b";
    var _e53;
    if (_y1) {
      var frips = _y1;
      _e53 = 19;
    }
    return("failed: expected " + string(undefined) + ", was " + string(_e53));
  } else {
    passed = passed + 1;
  }
  var _y2 = 20;
  var _e54;
  if (_y2) {
    var frips = _y2;
    _e54 = frips - 1;
  }
  if (! equal63(19, _e54)) {
    failed = failed + 1;
    var _y3 = 20;
    var _e55;
    if (_y3) {
      var frips = _y3;
      _e55 = frips - 1;
    }
    return("failed: expected " + string(19) + ", was " + string(_e55));
  } else {
    passed = passed + 1;
  }
  var _y4 = [19, 20];
  var _e56;
  if (_y4) {
    var _id4 = _y4;
    var a = _id4[0];
    var b = _id4[1];
    _e56 = b;
  }
  if (! equal63(20, _e56)) {
    failed = failed + 1;
    var _y5 = [19, 20];
    var _e57;
    if (_y5) {
      var _id5 = _y5;
      var a = _id5[0];
      var b = _id5[1];
      _e57 = b;
    }
    return("failed: expected " + string(20) + ", was " + string(_e57));
  } else {
    passed = passed + 1;
  }
  var _y6 = undefined;
  var _e58;
  if (_y6) {
    var _id6 = _y6;
    var a = _id6[0];
    var b = _id6[1];
    _e58 = b;
  }
  if (! equal63(undefined, _e58)) {
    failed = failed + 1;
    var _y7 = undefined;
    var _e59;
    if (_y7) {
      var _id7 = _y7;
      var a = _id7[0];
      var b = _id7[1];
      _e59 = b;
    }
    return("failed: expected " + string(undefined) + ", was " + string(_e59));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
var zzop = 99;
var zzap = 100;
var _zzop = 10;
var _zzap = _zzop + 10;
var _x594 = [1, 2, 3];
_x594.b = 20;
_x594.a = 10;
var _id8 = _x594;
var zza = _id8[0];
var zzb = _id8[1];
add(tests, ["let-toplevel1", function () {
  if (! equal63(10, _zzop)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(_zzop));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, _zzap)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(_zzap));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, zza)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(zza));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, zzb)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(zzb));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-toplevel", function () {
  if (! equal63(99, zzop)) {
    failed = failed + 1;
    return("failed: expected " + string(99) + ", was " + string(zzop));
  } else {
    passed = passed + 1;
  }
  if (! equal63(100, zzap)) {
    failed = failed + 1;
    return("failed: expected " + string(100) + ", was " + string(zzap));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["reserved", function () {
  var _end = "zz";
  var _try = "yy";
  var _return = 99;
  if (! equal63("zz", _end)) {
    failed = failed + 1;
    _return("failed: expected " + string("zz") + ", was " + string(_end));
  } else {
    passed = passed + 1;
  }
  if (! equal63("yy", _try)) {
    failed = failed + 1;
    _return("failed: expected " + string("yy") + ", was " + string(_try));
  } else {
    passed = passed + 1;
  }
  if (! equal63(99, _return)) {
    failed = failed + 1;
    return(_return("failed: expected " + string(99) + ", was " + string(_return)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["destructuring", function () {
  var _id9 = [1, 2, 3];
  var a = _id9[0];
  var b = _id9[1];
  var c = _id9[2];
  if (! equal63(1, a)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, b)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, c)) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(c));
  } else {
    passed = passed + 1;
  }
  var _id10 = [1, [2, [3], 4]];
  var w = _id10[0];
  var _id11 = _id10[1];
  var x = _id11[0];
  var _id12 = _id11[1];
  var y = _id12[0];
  var z = _id11[2];
  if (! equal63(1, w)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(w));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, x)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(x));
  } else {
    passed = passed + 1;
  }
  if (! equal63(3, y)) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(y));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, z)) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(z));
  } else {
    passed = passed + 1;
  }
  var _id13 = [1, 2, 3, 4];
  var a = _id13[0];
  var b = _id13[1];
  var c = cut(_id13, 2);
  if (! equal63([3, 4], c)) {
    failed = failed + 1;
    return("failed: expected " + string([3, 4]) + ", was " + string(c));
  } else {
    passed = passed + 1;
  }
  var _id14 = [1, [2, 3, 4], 5, 6, 7];
  var w = _id14[0];
  var _id15 = _id14[1];
  var x = _id15[0];
  var y = cut(_id15, 1);
  var z = cut(_id14, 2);
  if (! equal63([3, 4], y)) {
    failed = failed + 1;
    return("failed: expected " + string([3, 4]) + ", was " + string(y));
  } else {
    passed = passed + 1;
  }
  if (! equal63([5, 6, 7], z)) {
    failed = failed + 1;
    return("failed: expected " + string([5, 6, 7]) + ", was " + string(z));
  } else {
    passed = passed + 1;
  }
  var _id16 = {foo: 99};
  var foo = _id16.foo;
  if (! equal63(99, foo)) {
    failed = failed + 1;
    return("failed: expected " + string(99) + ", was " + string(foo));
  } else {
    passed = passed + 1;
  }
  var _x612 = [];
  _x612.foo = 99;
  var _id17 = _x612;
  var foo = _id17.foo;
  if (! equal63(99, foo)) {
    failed = failed + 1;
    return("failed: expected " + string(99) + ", was " + string(foo));
  } else {
    passed = passed + 1;
  }
  var _id18 = {foo: 99};
  var a = _id18.foo;
  if (! equal63(99, a)) {
    failed = failed + 1;
    return("failed: expected " + string(99) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  var _id19 = {foo: [98, 99]};
  var _id20 = _id19.foo;
  var a = _id20[0];
  var b = _id20[1];
  if (! equal63(98, a)) {
    failed = failed + 1;
    return("failed: expected " + string(98) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(99, b)) {
    failed = failed + 1;
    return("failed: expected " + string(99) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  var _x614 = [99];
  _x614.baz = true;
  var _id21 = {foo: 42, bar: _x614};
  var foo = _id21.foo;
  var _id22 = _id21.bar;
  var baz = _id22.baz;
  if (! equal63(42, foo)) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, baz)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(baz));
  } else {
    passed = passed + 1;
  }
  var _x616 = [20];
  _x616.foo = 17;
  var _x615 = [10, _x616];
  _x615.bar = [1, 2, 3];
  var _id23 = _x615;
  var a = _id23[0];
  var _id24 = _id23[1];
  var b = _id24[0];
  var foo = _id24.foo;
  var bar = _id23.bar;
  if (! equal63(10, a)) {
    failed = failed + 1;
    return("failed: expected " + string(10) + ", was " + string(a));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, foo)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(foo));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], bar)) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(bar));
  } else {
    passed = passed + 1;
  }
  var yy = [1, 2, 3];
  var _id25 = yy;
  var xx = _id25[0];
  var _yy = _id25[1];
  var zz = cut(_id25, 2);
  if (! equal63(1, xx)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(xx));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, _yy)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(_yy));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3], zz)) {
    failed = failed + 1;
    return("failed: expected " + string([3]) + ", was " + string(zz));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-macro", function () {
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(17));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, 32 + 10)) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(32 + 10));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(17));
  } else {
    passed = passed + 1;
  }
  var b = function () {
    return(20);
  };
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return("failed: expected " + string(18) + ", was " + string(18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b())) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(b()));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 1 + 1)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(1 + 1));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-symbol", function () {
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(17));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 10 + 7)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(10 + 7));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(17, 17)) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(17));
  } else {
    passed = passed + 1;
  }
  var b = 20;
  if (! equal63(18, 18)) {
    failed = failed + 1;
    return("failed: expected " + string(18) + ", was " + string(18));
  } else {
    passed = passed + 1;
  }
  if (! equal63(20, b)) {
    failed = failed + 1;
    return("failed: expected " + string(20) + ", was " + string(b));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["define-symbol", function () {
  setenv("zzz", {_stash: true, symbol: 42});
  if (! equal63(42, 42)) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(42));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["macros-and-symbols", function () {
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(1, 1)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, 2)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(2));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["macros-and-let", function () {
  var a = 10;
  if (! equal63(a, 10)) {
    failed = failed + 1;
    return("failed: expected " + string(a) + ", was " + string(10));
  } else {
    passed = passed + 1;
  }
  if (! equal63(12, 12)) {
    failed = failed + 1;
    return("failed: expected " + string(12) + ", was " + string(12));
  } else {
    passed = passed + 1;
  }
  if (! equal63(a, 10)) {
    failed = failed + 1;
    return("failed: expected " + string(a) + ", was " + string(10));
  } else {
    passed = passed + 1;
  }
  var b = 20;
  if (! equal63(b, 20)) {
    failed = failed + 1;
    return("failed: expected " + string(b) + ", was " + string(20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(22, 22)) {
    failed = failed + 1;
    return("failed: expected " + string(22) + ", was " + string(22));
  } else {
    passed = passed + 1;
  }
  if (! equal63(b, 20)) {
    failed = failed + 1;
    return("failed: expected " + string(b) + ", was " + string(20));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, 30)) {
    failed = failed + 1;
    return("failed: expected " + string(30) + ", was " + string(30));
  } else {
    passed = passed + 1;
  }
  var _c1 = 32;
  if (! equal63(32, _c1)) {
    failed = failed + 1;
    return("failed: expected " + string(32) + ", was " + string(_c1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(30, 30)) {
    failed = failed + 1;
    return("failed: expected " + string(30) + ", was " + string(30));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, 40)) {
    failed = failed + 1;
    return("failed: expected " + string(40) + ", was " + string(40));
  } else {
    passed = passed + 1;
  }
  var _d = 42;
  if (! equal63(42, _d)) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(_d));
  } else {
    passed = passed + 1;
  }
  if (! equal63(40, 40)) {
    failed = failed + 1;
    return("failed: expected " + string(40) + ", was " + string(40));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["let-unique", function () {
  var ham = unique("ham");
  var chap = unique("chap");
  if (! equal63("_ham", ham)) {
    failed = failed + 1;
    return("failed: expected " + string("_ham") + ", was " + string(ham));
  } else {
    passed = passed + 1;
  }
  if (! equal63("_chap", chap)) {
    failed = failed + 1;
    return("failed: expected " + string("_chap") + ", was " + string(chap));
  } else {
    passed = passed + 1;
  }
  var _ham = unique("ham");
  if (! equal63("_ham1", _ham)) {
    failed = failed + 1;
    return("failed: expected " + string("_ham1") + ", was " + string(_ham));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["literals", function () {
  if (! equal63(true, true)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(true));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, false)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(false));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, -inf < -10000000000)) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(-inf < -10000000000));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, inf < -10000000000)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(inf < -10000000000));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, nan === nan)) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(nan === nan));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(nan))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(nan63(nan)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, nan63(nan * 20))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(nan63(nan * 20)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(-inf, - inf)) {
    failed = failed + 1;
    return("failed: expected " + string(-inf) + ", was " + string(- inf));
  } else {
    passed = passed + 1;
  }
  if (! equal63(inf, - -inf)) {
    failed = failed + 1;
    return("failed: expected " + string(inf) + ", was " + string(- -inf));
  } else {
    passed = passed + 1;
  }
  var Inf = 1;
  var NaN = 2;
  var _Inf = "a";
  var _NaN = "b";
  if (! equal63(Inf, 1)) {
    failed = failed + 1;
    return("failed: expected " + string(Inf) + ", was " + string(1));
  } else {
    passed = passed + 1;
  }
  if (! equal63(NaN, 2)) {
    failed = failed + 1;
    return("failed: expected " + string(NaN) + ", was " + string(2));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_Inf, "a")) {
    failed = failed + 1;
    return("failed: expected " + string(_Inf) + ", was " + string("a"));
  } else {
    passed = passed + 1;
  }
  if (! equal63(_NaN, "b")) {
    failed = failed + 1;
    return("failed: expected " + string(_NaN) + ", was " + string("b"));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["add", function () {
  var l = [];
  add(l, "a");
  add(l, "b");
  add(l, "c");
  if (! equal63(["a", "b", "c"], l)) {
    failed = failed + 1;
    return("failed: expected " + string(["a", "b", "c"]) + ", was " + string(l));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, add([], "a"))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(add([], "a")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["drop", function () {
  var l = ["a", "b", "c"];
  if (! equal63("c", drop(l))) {
    failed = failed + 1;
    return("failed: expected " + string("c") + ", was " + string(drop(l)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", drop(l))) {
    failed = failed + 1;
    return("failed: expected " + string("b") + ", was " + string(drop(l)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", drop(l))) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(drop(l)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, drop(l))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(drop(l)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["last", function () {
  if (! equal63(3, last([1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string(3) + ", was " + string(last([1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, last([]))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(last([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63("c", last(["a", "b", "c"]))) {
    failed = failed + 1;
    return("failed: expected " + string("c") + ", was " + string(last(["a", "b", "c"])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["join", function () {
  if (! equal63([1, 2, 3], join([1, 2], [3]))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(join([1, 2], [3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2], join([], [1, 2]))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2]) + ", was " + string(join([], [1, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join([], []))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(join([], [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join(undefined, undefined))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(join(undefined, undefined)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join(undefined, []))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(join(undefined, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join())) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(join()));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], join([]))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(join([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], join([1], undefined))) {
    failed = failed + 1;
    return("failed: expected " + string([1]) + ", was " + string(join([1], undefined)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(["a"], []))) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(join(["a"], [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(undefined, ["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(join(undefined, ["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], join(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(join(["a"])));
  } else {
    passed = passed + 1;
  }
  var _x674 = ["a"];
  _x674.b = true;
  if (! equal63(_x674, join(["a"], {b: true}))) {
    failed = failed + 1;
    var _x676 = ["a"];
    _x676.b = true;
    return("failed: expected " + string(_x676) + ", was " + string(join(["a"], {b: true})));
  } else {
    passed = passed + 1;
  }
  var _x678 = ["a", "b"];
  _x678.b = true;
  var _x680 = ["b"];
  _x680.b = true;
  if (! equal63(_x678, join(["a"], _x680))) {
    failed = failed + 1;
    var _x681 = ["a", "b"];
    _x681.b = true;
    var _x683 = ["b"];
    _x683.b = true;
    return("failed: expected " + string(_x681) + ", was " + string(join(["a"], _x683)));
  } else {
    passed = passed + 1;
  }
  var _x684 = ["a"];
  _x684.b = 10;
  var _x685 = ["a"];
  _x685.b = true;
  if (! equal63(_x684, join(_x685, {b: 10}))) {
    failed = failed + 1;
    var _x686 = ["a"];
    _x686.b = 10;
    var _x687 = ["a"];
    _x687.b = true;
    return("failed: expected " + string(_x686) + ", was " + string(join(_x687, {b: 10})));
  } else {
    passed = passed + 1;
  }
  var _x688 = [];
  _x688.b = 10;
  var _x689 = [];
  _x689.b = 10;
  if (! equal63(_x688, join({b: true}, _x689))) {
    failed = failed + 1;
    var _x690 = [];
    _x690.b = 10;
    var _x691 = [];
    _x691.b = 10;
    return("failed: expected " + string(_x690) + ", was " + string(join({b: true}, _x691)));
  } else {
    passed = passed + 1;
  }
  var _x692 = ["a"];
  _x692.b = 1;
  var _x693 = ["b"];
  _x693.c = 2;
  var t = join(_x692, _x693);
  if (! equal63(1, t.b)) {
    failed = failed + 1;
    return("failed: expected " + string(1) + ", was " + string(t.b));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, t.c)) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(t.c));
  } else {
    passed = passed + 1;
  }
  if (! equal63("b", t[1])) {
    failed = failed + 1;
    return("failed: expected " + string("b") + ", was " + string(t[1]));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["reverse", function () {
  if (! equal63([], reverse([]))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(reverse([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], reverse([1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string([3, 2, 1]) + ", was " + string(reverse([1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  var _x699 = [3, 2, 1];
  _x699.a = true;
  var _x700 = [1, 2, 3];
  _x700.a = true;
  if (! equal63(_x699, reverse(_x700))) {
    failed = failed + 1;
    var _x701 = [3, 2, 1];
    _x701.a = true;
    var _x702 = [1, 2, 3];
    _x702.a = true;
    return("failed: expected " + string(_x701) + ", was " + string(reverse(_x702)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["map", function () {
  if (! equal63([], map(function (x) {
    return(x);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(map(function (x) {
      return(x);
    }, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], map(function (x) {
    return(x);
  }, [1]))) {
    failed = failed + 1;
    return("failed: expected " + string([1]) + ", was " + string(map(function (x) {
      return(x);
    }, [1])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 3, 4], map(function (x) {
    return(x + 1);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string([2, 3, 4]) + ", was " + string(map(function (x) {
      return(x + 1);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  var _x712 = [2, 3, 4];
  _x712.a = 5;
  var _x713 = [1, 2, 3];
  _x713.a = 4;
  if (! equal63(_x712, map(function (x) {
    return(x + 1);
  }, _x713))) {
    failed = failed + 1;
    var _x714 = [2, 3, 4];
    _x714.a = 5;
    var _x715 = [1, 2, 3];
    _x715.a = 4;
    return("failed: expected " + string(_x714) + ", was " + string(map(function (x) {
      return(x + 1);
    }, _x715)));
  } else {
    passed = passed + 1;
  }
  var _x716 = [];
  _x716.a = true;
  var _x717 = [];
  _x717.a = true;
  if (! equal63(_x716, map(function (x) {
    return(x);
  }, _x717))) {
    failed = failed + 1;
    var _x718 = [];
    _x718.a = true;
    var _x719 = [];
    _x719.a = true;
    return("failed: expected " + string(_x718) + ", was " + string(map(function (x) {
      return(x);
    }, _x719)));
  } else {
    passed = passed + 1;
  }
  var _x720 = [];
  _x720.b = false;
  var _x721 = [];
  _x721.b = false;
  if (! equal63(_x720, map(function (x) {
    return(x);
  }, _x721))) {
    failed = failed + 1;
    var _x722 = [];
    _x722.b = false;
    var _x723 = [];
    _x723.b = false;
    return("failed: expected " + string(_x722) + ", was " + string(map(function (x) {
      return(x);
    }, _x723)));
  } else {
    passed = passed + 1;
  }
  var _x724 = [];
  _x724.b = false;
  _x724.a = true;
  var _x725 = [];
  _x725.b = false;
  _x725.a = true;
  if (! equal63(_x724, map(function (x) {
    return(x);
  }, _x725))) {
    failed = failed + 1;
    var _x726 = [];
    _x726.b = false;
    _x726.a = true;
    var _x727 = [];
    _x727.b = false;
    _x727.a = true;
    return("failed: expected " + string(_x726) + ", was " + string(map(function (x) {
      return(x);
    }, _x727)));
  } else {
    passed = passed + 1;
  }
  var evens = function (x) {
    if (x % 2 === 0) {
      return(x);
    }
  };
  if (! equal63([2, 4, 6], map(evens, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return("failed: expected " + string([2, 4, 6]) + ", was " + string(map(evens, [1, 2, 3, 4, 5, 6])));
  } else {
    passed = passed + 1;
  }
  var _x732 = [2, 4, 6];
  _x732.b = 8;
  var _x733 = [1, 2, 3, 4, 5, 6];
  _x733.b = 8;
  _x733.a = 7;
  if (! equal63(_x732, map(evens, _x733))) {
    failed = failed + 1;
    var _x734 = [2, 4, 6];
    _x734.b = 8;
    var _x735 = [1, 2, 3, 4, 5, 6];
    _x735.b = 8;
    _x735.a = 7;
    return("failed: expected " + string(_x734) + ", was " + string(map(evens, _x735)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["cut", function () {
  if (! equal63([], cut([]))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(cut([])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], cut(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(cut(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["b", "c"], cut(["a", "b", "c"], 1))) {
    failed = failed + 1;
    return("failed: expected " + string(["b", "c"]) + ", was " + string(cut(["a", "b", "c"], 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["b", "c"], cut(["a", "b", "c", "d"], 1, 3))) {
    failed = failed + 1;
    return("failed: expected " + string(["b", "c"]) + ", was " + string(cut(["a", "b", "c", "d"], 1, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], cut([1, 2, 3], 0, 10))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(cut([1, 2, 3], 0, 10)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1], cut([1, 2, 3], -4, 1))) {
    failed = failed + 1;
    return("failed: expected " + string([1]) + ", was " + string(cut([1, 2, 3], -4, 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3], cut([1, 2, 3], -4))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(cut([1, 2, 3], -4)));
  } else {
    passed = passed + 1;
  }
  var _x761 = [2];
  _x761.a = true;
  var _x762 = [1, 2];
  _x762.a = true;
  if (! equal63(_x761, cut(_x762, 1))) {
    failed = failed + 1;
    var _x763 = [2];
    _x763.a = true;
    var _x764 = [1, 2];
    _x764.a = true;
    return("failed: expected " + string(_x763) + ", was " + string(cut(_x764, 1)));
  } else {
    passed = passed + 1;
  }
  var _x765 = [];
  _x765.b = 2;
  _x765.a = true;
  var _x766 = [];
  _x766.b = 2;
  _x766.a = true;
  if (! equal63(_x765, cut(_x766))) {
    failed = failed + 1;
    var _x767 = [];
    _x767.b = 2;
    _x767.a = true;
    var _x768 = [];
    _x768.b = 2;
    _x768.a = true;
    return("failed: expected " + string(_x767) + ", was " + string(cut(_x768)));
  } else {
    passed = passed + 1;
  }
  var t = [1, 2, 3];
  if (! equal63([], cut(t, _35(t)))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(cut(t, _35(t))));
  } else {
    passed = passed + 1;
  }
  var _x770 = [1, 2, 3];
  _x770.a = true;
  var _t1 = _x770;
  var _x771 = [];
  _x771.a = true;
  if (! equal63(_x771, cut(_t1, _35(_t1)))) {
    failed = failed + 1;
    var _x772 = [];
    _x772.a = true;
    return("failed: expected " + string(_x772) + ", was " + string(cut(_t1, _35(_t1))));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["clip", function () {
  if (! equal63("uux", clip("quux", 1))) {
    failed = failed + 1;
    return("failed: expected " + string("uux") + ", was " + string(clip("quux", 1)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("uu", clip("quux", 1, 3))) {
    failed = failed + 1;
    return("failed: expected " + string("uu") + ", was " + string(clip("quux", 1, 3)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("", clip("quux", 5))) {
    failed = failed + 1;
    return("failed: expected " + string("") + ", was " + string(clip("quux", 5)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("ab", clip("ab", 0, 4))) {
    failed = failed + 1;
    return("failed: expected " + string("ab") + ", was " + string(clip("ab", 0, 4)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("ab", clip("ab", -4, 4))) {
    failed = failed + 1;
    return("failed: expected " + string("ab") + ", was " + string(clip("ab", -4, 4)));
  } else {
    passed = passed + 1;
  }
  if (! equal63("a", clip("ab", -1, 1))) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(clip("ab", -1, 1)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["search", function () {
  if (! equal63(undefined, search("", "a"))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(search("", "a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("", ""))) {
    failed = failed + 1;
    return("failed: expected " + string(0) + ", was " + string(search("", "")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("a", ""))) {
    failed = failed + 1;
    return("failed: expected " + string(0) + ", was " + string(search("a", "")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(0, search("abc", "a"))) {
    failed = failed + 1;
    return("failed: expected " + string(0) + ", was " + string(search("abc", "a")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(2, search("abcd", "cd"))) {
    failed = failed + 1;
    return("failed: expected " + string(2) + ", was " + string(search("abcd", "cd")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, search("abcd", "ce"))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(search("abcd", "ce")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, search("abc", "z"))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(search("abc", "z")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["split", function () {
  if (! equal63([], split("", ""))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(split("", "")));
  } else {
    passed = passed + 1;
  }
  if (! equal63([], split("", ","))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(split("", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a"], split("a", ","))) {
    failed = failed + 1;
    return("failed: expected " + string(["a"]) + ", was " + string(split("a", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", ""], split("a,", ","))) {
    failed = failed + 1;
    return("failed: expected " + string(["a", ""]) + ", was " + string(split("a,", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b"], split("a,b", ","))) {
    failed = failed + 1;
    return("failed: expected " + string(["a", "b"]) + ", was " + string(split("a,b", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b", ""], split("a,b,", ","))) {
    failed = failed + 1;
    return("failed: expected " + string(["a", "b", ""]) + ", was " + string(split("a,b,", ",")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b"], split("azzb", "zz"))) {
    failed = failed + 1;
    return("failed: expected " + string(["a", "b"]) + ", was " + string(split("azzb", "zz")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(["a", "b", ""], split("azzbzz", "zz"))) {
    failed = failed + 1;
    return("failed: expected " + string(["a", "b", ""]) + ", was " + string(split("azzbzz", "zz")));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["reduce", function () {
  if (! equal63("a", reduce(function (a, b) {
    return(a + b);
  }, ["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string("a") + ", was " + string(reduce(function (a, b) {
      return(a + b);
    }, ["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, reduce(function (a, b) {
    return(a + b);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string(6) + ", was " + string(reduce(function (a, b) {
      return(a + b);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, [2, 3]], reduce(function (a, b) {
    return([a, b]);
  }, [1, 2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string([1, [2, 3]]) + ", was " + string(reduce(function (a, b) {
      return([a, b]);
    }, [1, 2, 3])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([1, 2, 3, 4, 5], reduce(function (a, b) {
    return(join(a, b));
  }, [[1], [2, 3], [4, 5]]))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3, 4, 5]) + ", was " + string(reduce(function (a, b) {
      return(join(a, b));
    }, [[1], [2, 3], [4, 5]])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["keep", function () {
  if (! equal63([], keep(function (x) {
    return(x);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + string([]) + ", was " + string(keep(function (x) {
      return(x);
    }, [])));
  } else {
    passed = passed + 1;
  }
  var even = function (x) {
    return(x % 2 === 0);
  };
  if (! equal63([6], keep(even, [5, 6, 7]))) {
    failed = failed + 1;
    return("failed: expected " + string([6]) + ", was " + string(keep(even, [5, 6, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([[1], [2, 3]], keep(some63, [[], [1], [], [2, 3]]))) {
    failed = failed + 1;
    return("failed: expected " + string([[1], [2, 3]]) + ", was " + string(keep(some63, [[], [1], [], [2, 3]])));
  } else {
    passed = passed + 1;
  }
  var even63 = function (x) {
    return(x % 2 === 0);
  };
  if (! equal63([2, 4, 6], keep(even63, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return("failed: expected " + string([2, 4, 6]) + ", was " + string(keep(even63, [1, 2, 3, 4, 5, 6])));
  } else {
    passed = passed + 1;
  }
  var _x836 = [2, 4, 6];
  _x836.b = 8;
  var _x837 = [1, 2, 3, 4, 5, 6];
  _x837.b = 8;
  _x837.a = 7;
  if (! equal63(_x836, keep(even63, _x837))) {
    failed = failed + 1;
    var _x838 = [2, 4, 6];
    _x838.b = 8;
    var _x839 = [1, 2, 3, 4, 5, 6];
    _x839.b = 8;
    _x839.a = 7;
    return("failed: expected " + string(_x838) + ", was " + string(keep(even63, _x839)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["in?", function () {
  if (! equal63(true, in63("x", ["x", "y", "z"]))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(in63("x", ["x", "y", "z"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [5, 6, 7]))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(in63(7, [5, 6, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(undefined, in63("baz", ["no", "can", "do"]))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(in63("baz", ["no", "can", "do"])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["find", function () {
  if (! equal63(undefined, find(function (x) {
    return(x);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(find(function (x) {
      return(x);
    }, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, find(function (x) {
    return(x);
  }, [7]))) {
    failed = failed + 1;
    return("failed: expected " + string(7) + ", was " + string(find(function (x) {
      return(x);
    }, [7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, find(function (x) {
    return(x === 7);
  }, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(find(function (x) {
      return(x === 7);
    }, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  var _x852 = [2, 4];
  _x852.foo = 7;
  if (! equal63(true, find(function (x) {
    return(x === 7);
  }, _x852))) {
    failed = failed + 1;
    var _x853 = [2, 4];
    _x853.foo = 7;
    return("failed: expected " + string(true) + ", was " + string(find(function (x) {
      return(x === 7);
    }, _x853)));
  } else {
    passed = passed + 1;
  }
  var _x854 = [2, 4];
  _x854.bar = true;
  if (! equal63(true, find(function (x) {
    return(x === true);
  }, _x854))) {
    failed = failed + 1;
    var _x855 = [2, 4];
    _x855.bar = true;
    return("failed: expected " + string(true) + ", was " + string(find(function (x) {
      return(x === true);
    }, _x855)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, in63(7, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(in63(7, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  var _x858 = [2, 4];
  _x858.foo = 7;
  if (! equal63(true, in63(7, _x858))) {
    failed = failed + 1;
    var _x859 = [2, 4];
    _x859.foo = 7;
    return("failed: expected " + string(true) + ", was " + string(in63(7, _x859)));
  } else {
    passed = passed + 1;
  }
  var _x860 = [2, 4];
  _x860.bar = true;
  if (! equal63(true, in63(true, _x860))) {
    failed = failed + 1;
    var _x861 = [2, 4];
    _x861.bar = true;
    return("failed: expected " + string(true) + ", was " + string(in63(true, _x861)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["find", function () {
  if (! equal63(undefined, first(function (x) {
    return(x);
  }, []))) {
    failed = failed + 1;
    return("failed: expected " + string(undefined) + ", was " + string(first(function (x) {
      return(x);
    }, [])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(7, first(function (x) {
    return(x);
  }, [7]))) {
    failed = failed + 1;
    return("failed: expected " + string(7) + ", was " + string(first(function (x) {
      return(x);
    }, [7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, first(function (x) {
    return(x === 7);
  }, [2, 4, 7]))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(first(function (x) {
      return(x === 7);
    }, [2, 4, 7])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(4, first(function (x) {
    return(x > 3 && x);
  }, [1, 2, 3, 4, 5, 6]))) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(first(function (x) {
      return(x > 3 && x);
    }, [1, 2, 3, 4, 5, 6])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["sort", function () {
  if (! equal63(["a", "b", "c"], sort(["c", "a", "b"]))) {
    failed = failed + 1;
    return("failed: expected " + string(["a", "b", "c"]) + ", was " + string(sort(["c", "a", "b"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 2, 1], sort([1, 2, 3], _62))) {
    failed = failed + 1;
    return("failed: expected " + string([3, 2, 1]) + ", was " + string(sort([1, 2, 3], _62)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["type", function () {
  if (! equal63(true, string63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(string63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63(17))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(string63(17)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(string63(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63(true))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(string63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, string63({}))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(string63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(number63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, number63(17))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(number63(17)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(number63(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63(true))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(number63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, number63({}))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(number63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(boolean63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63(17))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(boolean63(17)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63(["a"]))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(boolean63(["a"])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, boolean63(true))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(boolean63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, boolean63({}))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(boolean63({})));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63(undefined))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(atom63(undefined)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63("abc"))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(atom63("abc")));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63(42))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(atom63(42)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(true, atom63(true))) {
    failed = failed + 1;
    return("failed: expected " + string(true) + ", was " + string(atom63(true)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, atom63(function () {
  }))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(atom63(function () {
    })));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, atom63([1]))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(atom63([1])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(false, atom63({}))) {
    failed = failed + 1;
    return("failed: expected " + string(false) + ", was " + string(atom63({})));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["apply", function () {
  if (! equal63(4, apply(function (a, b) {
    return(a + b);
  }, [2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(apply(function (a, b) {
      return(a + b);
    }, [2, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63([2, 2], apply(function () {
    var a = unstash(Array.prototype.slice.call(arguments, 0));
    return(a);
  }, [2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + string([2, 2]) + ", was " + string(apply(function () {
      var a = unstash(Array.prototype.slice.call(arguments, 0));
      return(a);
    }, [2, 2])));
  } else {
    passed = passed + 1;
  }
  var t = [1];
  t.foo = 17;
  if (! equal63(17, apply(function () {
    var a = unstash(Array.prototype.slice.call(arguments, 0));
    return(a.foo);
  }, t))) {
    failed = failed + 1;
    return("failed: expected " + string(17) + ", was " + string(apply(function () {
      var a = unstash(Array.prototype.slice.call(arguments, 0));
      return(a.foo);
    }, t)));
  } else {
    passed = passed + 1;
  }
  var _x895 = [];
  _x895.foo = 42;
  if (! equal63(42, apply(function () {
    var _r180 = unstash(Array.prototype.slice.call(arguments, 0));
    var _id26 = _r180;
    var foo = _id26.foo;
    return(foo);
  }, _x895))) {
    failed = failed + 1;
    var _x896 = [];
    _x896.foo = 42;
    return("failed: expected " + string(42) + ", was " + string(apply(function () {
      var _r181 = unstash(Array.prototype.slice.call(arguments, 0));
      var _id27 = _r181;
      var foo = _id27.foo;
      return(foo);
    }, _x896)));
  } else {
    passed = passed + 1;
  }
  var _x899 = [];
  _x899.foo = 42;
  if (! equal63(42, apply(function (_x897) {
    var _id28 = _x897;
    var foo = _id28.foo;
    return(foo);
  }, [_x899]))) {
    failed = failed + 1;
    var _x902 = [];
    _x902.foo = 42;
    return("failed: expected " + string(42) + ", was " + string(apply(function (_x900) {
      var _id29 = _x900;
      var foo = _id29.foo;
      return(foo);
    }, [_x902])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["eval", function () {
  var eval = compiler.eval;
  if (! equal63(4, eval(["+", 2, 2]))) {
    failed = failed + 1;
    return("failed: expected " + string(4) + ", was " + string(eval(["+", 2, 2])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(5, eval(["let", "a", 3, ["+", 2, "a"]]))) {
    failed = failed + 1;
    return("failed: expected " + string(5) + ", was " + string(eval(["let", "a", 3, ["+", 2, "a"]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(9, eval(["do", ["define", "x", 7], ["+", "x", 2]]))) {
    failed = failed + 1;
    return("failed: expected " + string(9) + ", was " + string(eval(["do", ["define", "x", 7], ["+", "x", 2]])));
  } else {
    passed = passed + 1;
  }
  if (! equal63(6, eval(["apply", "+", ["quote", [1, 2, 3]]]))) {
    failed = failed + 1;
    return("failed: expected " + string(6) + ", was " + string(eval(["apply", "+", ["quote", [1, 2, 3]]])));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["call", function () {
  var f = function () {
    return(42);
  };
  if (! equal63(42, call(f))) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string(call(f)));
  } else {
    passed = passed + 1;
  }
  var fs = [function () {
    return(1);
  }, function () {
    return(10);
  }];
  if (! equal63([1, 10], map(call, fs))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 10]) + ", was " + string(map(call, fs)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
add(tests, ["parameters", function () {
  if (! equal63(42, (function (_x927) {
    var _id30 = _x927;
    var a = _id30[0];
    return(a);
  })([42]))) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string((function (_x929) {
      var _id31 = _x929;
      var a = _id31[0];
      return(a);
    })([42])));
  } else {
    passed = passed + 1;
  }
  var f = function (a, _x931) {
    var _id32 = _x931;
    var b = _id32[0];
    var c = _id32[1];
    return([a, b, c]);
  };
  if (! equal63([1, 2, 3], f(1, [2, 3]))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(f(1, [2, 3])));
  } else {
    passed = passed + 1;
  }
  var _f = function (a, _x937) {
    var _id33 = _x937;
    var b = _id33[0];
    var c = cut(_id33, 1);
    var _r193 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id34 = _r193;
    var d = cut(_id34, 0);
    return([a, b, c, d]);
  };
  if (! equal63([1, 2, [3, 4], [5, 6, 7]], _f(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, [3, 4], [5, 6, 7]]) + ", was " + string(_f(1, [2, 3, 4], 5, 6, 7)));
  } else {
    passed = passed + 1;
  }
  if (! equal63([3, 4], (function (a, b) {
    var _r194 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id35 = _r194;
    var c = cut(_id35, 0);
    return(c);
  })(1, 2, 3, 4))) {
    failed = failed + 1;
    return("failed: expected " + string([3, 4]) + ", was " + string((function (a, b) {
      var _r195 = unstash(Array.prototype.slice.call(arguments, 2));
      var _id36 = _r195;
      var c = cut(_id36, 0);
      return(c);
    })(1, 2, 3, 4)));
  } else {
    passed = passed + 1;
  }
  var _f1 = function (w, _x949) {
    var _id37 = _x949;
    var x = _id37[0];
    var y = cut(_id37, 1);
    var _r196 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id38 = _r196;
    var z = cut(_id38, 0);
    return([y, z]);
  };
  if (! equal63([[3, 4], [5, 6, 7]], _f1(1, [2, 3, 4], 5, 6, 7))) {
    failed = failed + 1;
    return("failed: expected " + string([[3, 4], [5, 6, 7]]) + ", was " + string(_f1(1, [2, 3, 4], 5, 6, 7)));
  } else {
    passed = passed + 1;
  }
  if (! equal63(42, (function () {
    var _r197 = unstash(Array.prototype.slice.call(arguments, 0));
    var _id39 = _r197;
    var foo = _id39.foo;
    return(foo);
  })({_stash: true, foo: 42}))) {
    failed = failed + 1;
    return("failed: expected " + string(42) + ", was " + string((function () {
      var _r198 = unstash(Array.prototype.slice.call(arguments, 0));
      var _id40 = _r198;
      var foo = _id40.foo;
      return(foo);
    })({_stash: true, foo: 42})));
  } else {
    passed = passed + 1;
  }
  var _x960 = [];
  _x960.foo = 42;
  if (! equal63(42, (function (_x959) {
    var _id41 = _x959;
    var foo = _id41.foo;
    return(foo);
  })(_x960))) {
    failed = failed + 1;
    var _x962 = [];
    _x962.foo = 42;
    return("failed: expected " + string(42) + ", was " + string((function (_x961) {
      var _id42 = _x961;
      var foo = _id42.foo;
      return(foo);
    })(_x962)));
  } else {
    passed = passed + 1;
  }
  var _f2 = function (a, _x963) {
    var _id43 = _x963;
    var foo = _id43.foo;
    var _r201 = unstash(Array.prototype.slice.call(arguments, 2));
    var _id44 = _r201;
    var b = _id44.bar;
    return([a, b, foo]);
  };
  var _x966 = [];
  _x966.foo = 42;
  if (! equal63([10, 20, 42], _f2(10, _x966, {_stash: true, bar: 20}))) {
    failed = failed + 1;
    var _x968 = [];
    _x968.foo = 42;
    return("failed: expected " + string([10, 20, 42]) + ", was " + string(_f2(10, _x968, {_stash: true, bar: 20})));
  } else {
    passed = passed + 1;
  }
  var _f3 = function () {
    var args = unstash(Array.prototype.slice.call(arguments, 0));
    return(args);
  };
  if (! equal63([1, 2, 3], _f3(1, 2, 3))) {
    failed = failed + 1;
    return("failed: expected " + string([1, 2, 3]) + ", was " + string(_f3(1, 2, 3)));
  } else {
    passed = passed + 1;
    return(passed);
  }
}]);
});

runtime = require("runtime");
reader = require("reader");
compiler = require("compiler");
macros = require("macros");
system = require("system");
main = require("main");
test = require("test");

ac = function (s) {
  if (function63(s)) {
    // extract multiline string from the comments inside the fn.
    s = ml(s);
  }
  var forms = reader["read-all"](reader.stream(s))
  var n = _35(forms);
  var i = 0;
  var result;
  while (i < n) {
    result = compiler.eval(forms[i]);
    console.log(result);
    i = i + 1;
  }
  return null;
};

ac(ml(function () { /*

; TODO: Is this necessary?
(define-macro define l
  `(define-global ,@l))

; Useful shorthand for seeing what a Lumen expression compiles to.  It
; can be used anywhere eval is used, and it shows you what code eval
; would have run.  E.g. try:
;
;   (let exprs '(let (adder (fn (x) (fn (n) (+ x n))) add2 (adder 2)) (add2 42))
;     (comp exprs)
;     (eval exprs))
;

(define-global comp (expr)
  (print (compile (macroexpand expr))))

(define reader (require 'reader))
(define reader-stream (get reader 'stream))
(define read-all (get reader 'read-all))

(define system (require 'system))
(define write (get system 'write))
(define read-file (get system 'read-file))
(define write-file (get system 'write-file))
(define-global env (get system 'get-environment-variable))

(define-global readstr (s)
    (read-all (reader-stream s)))

;
; Let's see how far we can push Lumen in the direction of Arc.
;

(define-global load (file :verbose)
  (when verbose
    (print (cat "Loading " file)))
  (step expr (readstr (read-file file))
    (when (= "1" (env "VERBOSE")) (prn (string expr)))
    (when (= "1" (env "COMP")) (prn (comp expr)))
    (let ((ok x) (guard (eval expr)))
      (unless ok
        (prn "Error in " file ": ")
        (prn "   " x)
        (prn "The error occurred while evaluating: ")
        (prn expr)))))

(define-macro mac l
  `(define-macro ,@l))

(mac macex (e)
  `(macroexpand ,e))

(mac len l
  `(# ,@l))

(mac letmac (name args body rest: l)
  `(let-macro ((,name ,args ,body))
     ,@l))

(mac def l
  `(define-global ,@l))

(def idfn (fn (x) x))

(mac w/uniq (x rest: body)
  (if (atom? x)
    `(let-unique (,x) ,@body)
    `(let-unique (,@x) ,@body)))

(mac void l
  `(do ,@l nil))

(mac lfn (name args body rest: l)
  `(let ,name nil
     (set ,name (fn ,args ,body))
     ,@(if (some? l) l
         (list name))))

(mac afn (args body rest: l)
  `(lfn self ,args ,body ,@l))

(mac accum (name rest: body)
  (w/uniq g
    `(let ,g ()
       (lfn ,name (item) (add ,g item)
         ,@body)
       ,g)))

(mac acc l `(accum a ,@l))

; This serves as an example of how to write a metamacro.  There are
; probably better ways to write it, and the idea isn't very good in
; this case.  But it's a general technique worth knowing.

; (each form (list "let" "each" "step" "for" "when" "while")
;   (eval `(mac ,(cat "acc:" form) l
;            `(acc (,',form ,@l)))))

; (eval (acc:let x 42 (a '+) (a x) (a 2))) ; gives 44
; (map print (acc:for i 10 (unless (= i 2) (a (cat "Current line is " i)))))
; (sort (acc:each (k v) (hd environment) (a k)))

(mac nor l
  `(not (or ,@l)))

(def lst? (x)
  (nor (atom? x) (function? x)))

(def any? (x)
  (and (lst? x) (some? x)))

; Just an experiment.

; (mac iffy l
;   (if (none? l) nil
;       (one? l) (hd l)
;       (let ((x a rest: bs) l)
;         `(if ,x ,a (iffy ,@bs)))))

(mac iflet (name rest: l)
  (when (some? l)
    (let ((x a rest: bs) l)
      `(let ,name ,x
        ,(if (one? l) name
          `(if ,name ,a (iflet ,name ,@bs)))))))

(mac whenlet (name rest: l)
  (when (some? l)
    (let ((x rest: ys) l)
      `(let ,name ,x
         ,(if (one? l) name
            `(do ,@ys))))))

(mac aif l
  `(iflet it ,@l))

(mac awhen l
  `(let-when it ,@l))

(mac repeat (n rest: l)
  (w/uniq g
    `(for ,g ,n
      ,@l)))

(def atom (x)
  (or (atom? x) (function? x)))

(def acons (x)
  (not (atom x)))

(def car (x)
  (if (and (acons x) (some? x))
      (hd x)))
 
(def cdr (x)
  (if (and (acons x) (some? x))
      (tl x)))        

(def caar (x) (car (car x)))
(def cadr (x) (car (cdr x)))
(def cddr (x) (cdr (cdr x)))

(def cons (x y)
  (join (list x) y))

(def copylist (xs)
  (let l ()
    (each (k v) xs
      (set (get l k) v))
    l))

(def listify (x)
  (if (atom? x) (list x)
    x))

(def intersperse (x lst)
  (let sep nil
    (acc (each item lst
      (if sep (a sep)
        (set sep x))
      (a item)))))

(mac complement (f)
  (w/uniq g
    `(fn ,g (not (apply ,f ,g)))))

(def testify (x)
  (if (function? x) x
    [= _ x]))

(def keep (f xs)
  (set f (testify f))
  (acc (step x xs
    (when (f x)
      (a x)))))

(def rem (f xs)
  (keep (complement (testify f)) xs))

(def rev reverse)

; Useful benchmark?

; (let lines (split (read-file "test.l") "\n")
;   (apply cat 
;     (intersperse "\n"
;       (intersperse "foo" lines))))
  
(def str (x)
  (if (string? x) x
    (string x)))

(def wschars (list " " "\t" "\n" "\r"))

(def ws? (s)
  (for i (len s)
    (let c (char s i)
      (when (in? c wschars)
        (return true)))))

(def rtrim (s :f)
  (while (and (some? s) ((or f ws?) (char s (edge s))))
    (set s (clip s 0 (edge s))))
  s)

(def ltrim (s :f)
  (while (and (some? s) ((or f ws?) (char s 0)))
    (set s (clip s 1 (len s))))
  s)

(def trim (s :f)
  (rtrim (ltrim s f: f) f: f))

(def endswith (s ending)
  (let i (- (len s) (len ending))
    (= i (search s ending i))))

(def startswith (s prefix)
  (= (search s prefix) 0))

(def pr (:sep rest: l)
  (let c nil
    (if sep
      (step x l
        (if c (write c)
          (set c (str sep)))
        (write (str x)))
      (step x l
        (write (str x)))))
  (when l (hd l)))

(mac do1 (a rest: bs)
  (w/uniq g
    `(let ,g ,a
       (do ,@bs)
       ,g)))

(def prn l
  (do1 (apply pr l)
       (pr "\n")))

(def filechars (path)
  (read-file path))

(def readfile (path) (readstr (filechars path)))

(def doshell args
  (rtrim (shell (apply cat (intersperse " " args)))))

(def mvfile (src dst)
  (doshell "mv" (escape src) (escape dst))
  dst) ; todo: nil for failure, non-nil for success.

(def getmod (file)
  (doshell "stat -r" (escape file) "| awk '{ print $3; }'"))

(def chmod (spec file)
  (doshell "chmod" (escape spec) (escape file)))

(def chmodx (file)
  (chmod "+x" file))

(def writefile (path contents)
  (doshell "cp -fp" (escape path) (escape (cat path ".tmp")))
  (write-file (cat path ".tmp") contents)
  (mvfile (cat path ".tmp") path)
  contents)

(mac w/file (v path rest: l)
  (w/uniq gp
    `(let (,gp ,path
           ,v (filechars ,gp))
       (set ,v (do ,@l))
       (writefile ,gp ,v))))

(def args () (split (env 'cmdline) " "))
(def host () (or (env "LUMEN_HOST") ""))
(def host? (x) (search (host) x))

(mac import (name)
  `(def ,name (require ',name)))

;
; These run only on LuaJIT.
;

(target lua:
  (when (host? 'luajit)

    (import ffi)

    (mac defc (name val)
      `(do ((get ffi 'cdef) ',(if (id-literal? val) (inner val) val))
           (def ,name (get (get ffi 'C) ',name))))

    ; (sleep secs) to sleep for a number of seconds. 
    ; E.g.
    ;   (print 'begin)
    ;   (sleep 1.3)
    ;   (print 'end)
    (defc usleep |int usleep (unsigned int usecs)|)
    (def sleep (secs)
      (do (usleep (* secs 1000000)) nil))))

;
; These run on all hosts.
;

; (shell cmd) to execute a shell command.
; E.g.
;   (shell "echo hi") => "hi\n"
(def shell (cmd)
  (target js: (do
    (define childproc (require 'child_process))
    (define exec (get childproc 'execSync))
         ; http://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
         ; https://nodejs.org/api/child_process.html#child_process_child_process_execsync_command_options
         ;
         ; Returns the stdout of the command.  Throws if the process
         ; times out or has a non-zero exit code.
         (let o (exec cmd)
           ; ((get o 'toString)) ; TODO: Research why this breaks.
           ((get o "toString")))))
  (target lua: (do
    (define exec (s)
      ; http://stackoverflow.com/questions/9676113/lua-os-execute-return-value
      ; Watch out, popen() sometimes fails to block:
      ; http://lua-users.org/lists/lua-l/2013-10/msg00727.html
      (let h ((get io 'popen) cmd)
        (do1 ((get h 'read) h "*a")
             ((get h 'close) h))))
    (exec cmd))))


*/ }));

ac("(mac unquote (x) `(do (jseval ',x)))")

