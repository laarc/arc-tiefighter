(clone "laarc/lumen" "0008-reader-fix")

; compiler.l: Re-enable foo.bar syntax, even though it suffers from
; inconsistent behavior.  (E.g. foo.bar-baz doesn't work.)
(patch "compiler.l"
"""
(define valid-code? (n)
  (or (number-code? n)         ; 0-9
      (and (> n 64) (< n 91))  ; A-Z
      (and (> n 96) (< n 123)) ; a-z
      (= n 95)))               ; _
"""
"""
(define valid-code? (n)
  (or (number-code? n)         ; 0-9
      (and (> n 64) (< n 91))  ; A-Z
      (and (> n 96) (< n 123)) ; a-z
      (= n 46)                 ; .
      (= n 95)))               ; _
""")

; runtime.l: def obj? (x)
(patch "runtime.l"
"""
(define-global atom? (x)
"""
"""
(define-global obj? (x)
  (and (is? x) (= (type x) (target js: 'object lua: 'table))))

(define-global atom? (x)
""")

; runtime.l: string:
;  - detect circular lists
;  - return "fn" for functions rather than "function"
;  - prevent errors for unknown types such as LuaJIT cdata
;
(patch "runtime.l"
"""
(define-global string (x depth)
  (if (and depth (> depth 40)) "circular"
      (nil? x) "nil"
      (nan? x) "nan"
      (= x inf) "inf"
      (= x -inf) "-inf"
      (boolean? x) (if x "true" "false")
      (string? x) (escape x)
      (atom? x) (tostring x)
      (function? x) "function"
    (let (s "(" sp ""
          xs () ks ()
          d (+ (or depth 0) 1))
      (each (k v) x
        (if (number? k)
            (set (get xs k) (string v d))
          (do (add ks (cat k ":"))
              (add ks (string v d)))))
      (each v (join xs ks)
        (cat! s sp v)
        (set sp " "))
      (cat s  ")"))))
"""
"""
(define-global string (x depth ancestors)
  (if (nil? x) "nil"
      (nan? x) "nan"
      (= x inf) "inf"
      (= x -inf) "-inf"
      (boolean? x) (if x "true" "false")
      (string? x) (escape x)
      (atom? x) (tostring x)
      (function? x) "fn"
      (not (obj? x)) (cat "|" (type x) "|")
    (let (s "(" sp ""
          xs () ks ()
          d (+ (or depth 0) 1)
          ans (join (list x) (or ancestors ())))
      (when (in? x (or ancestors ()))
        (return "circular"))
      (each (k v) x
        (if (number? k)
            (set (get xs k) (string v d ans))
          (do (add ks (cat k ":"))
              (add ks (string v d ans)))))
      (each v (join xs ks)
        (cat! s sp v)
        (set sp " "))
      (cat s  ")"))))
""")

; bin/lumen: Fix LUMEN_HOST to handle spaces.
(patch "bin/lumen"
"""
if [ ! -z ${LUMEN_HOST} ]
then
    host=${LUMEN_HOST}
"""
"""
if [ ! -z "${LUMEN_HOST}" ]
then
    host="${LUMEN_HOST}"
""")

; bin/lumen: Use rlwrap when possible.
(patch "bin/lumen"
(rtrim
"""exec ${host} "${home}/${code}" "$@" """)
"""exec $(which rlwrap) ${host} "${home}/${code}" "$@"
""")


; bin/lumen: Export LUMEN_HOST so that users can discern LuaJIT vs Lua.
(patch "bin/lumen"
"""
exec $(which rlwrap) ${host} "${home}/${code}" "$@"
"""
"""
export LUMEN_HOST="${host}"
exec $(which rlwrap) ${host} "${home}/${code}" "$@"
""")

;
; bin/lumen: Add lib/${os} to the LUA_PATH and NODE_PATH.
;
(patch "bin/lumen"
"""
case $host in
"""
"""
os=$(uname | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/")
case $host in
""")

(patch "bin/lumen"
|export NODE_PATH="$NODE_PATH:${home}:${dir}/lib";;|
|export NODE_PATH="$NODE_PATH:${home}:${dir}/lib:${dir}/lib/${os}";;|)

(patch "bin/lumen"
|export LUA_PATH="$LUA_PATH;${home}/?.lua;${dir}/lib/?.lua;;";;|
|export LUA_PATH="$LUA_PATH;${home}/?.lua;${dir}/lib/?.lua;${dir}/lib/${os}/?.lua;;";;|)


; Build and test Lumen.
(rebuild 2)
(test)

