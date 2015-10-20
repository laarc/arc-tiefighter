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
(rebuild 3)
(test)

