
;
; Make lumen browser.js bundle.
;

(def bundle-top* """

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
""")


(def bundle-btm*
"""

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
""")
(cat! bundle-btm* (filechars (j "sudoarc" "sudoarc.l")))
(cat! bundle-btm* """
*/ }));

ac("(mac unquote (x) `(do (jseval ',x)))")

""")


(def mkpkg (name body)
  (cat "\n" "pkg(\"" name "\", function () {\n" body "\n});\n"))

(def tree2 (dir match)
  (map [j dir _] (tree dir match)))

(def infiles ()
  (join (tree2 "lumen" "\\.l$")
        (tree2 "sudoarc" "\\.l$")))

(def reorder (l rest: xs)
  (when l
    (step val (rev xs)
      (set l (join (keep val l)
                   (rem val l))))
    l))

; This is an awful hack, but it's fast. TODO: fix.
(mac w/append (name ofile rest: body)
  `(let ,name [do (create (cat ofile ".tmp") _)
                  ($ "cat" (cat ofile ".tmp") ">>" ofile)
                  ($ "rm" "-f" (cat ofile ".tmp"))]
     ,@body))

(def bundle (ofile)
  (set ofile (or ofile "browser.js"))
  (prn "Generating lumen browser bundle " ofile)
  ($ "rm" "-f" ofile)
  ($ "touch" ofile)
  (w/append o ofile
    (o bundle-top*)
    (let pkgs ()
      (step path (infiles)
        (prn path)
        (whenlet base (at (split (basename path) ".") 0)
          (step jspath (tree2 (dirname path) (cat base ".js$"))
            (let jscode ($ "cat" jspath)
              (add pkgs base)
              (o (mkpkg base jscode))))))
      (step pkg (reorder pkgs "runtime" "reader" "compiler" "macros" "system" "main" "test")
        (prn pkg)
        (o (cat "\n" pkg " = require(\"" pkg "\");"))))
    (o bundle-btm*)))

