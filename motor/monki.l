(clone "sctb/motor")

;
; Rename system.l to platform.l
;
(patch "motor.l"
"(require 'system)"
"(require 'platform)")
(patch "makefile"
"/system.lua"
"/platform.lua")
(step path (tree "lib" (j "" "system.l$"))
  ($ "mv" "-f" (j "lib" path) (j "lib" (dirname path) "platform.l")))

; makefile: Use ../lumen/bin/lumen
(patch "makefile"
"""
LUMEN := LUMEN_HOST=luajit lumen
"""
"""
LUMEN := LUMEN_HOST=luajit ../lumen/bin/lumen
""")

; lib.l: Fix define-c
(patch "lib.l"
"""
(define-macro define-c (v x)
  (cat "|" v ".cdef[[" (inner x) "]]|"))
"""
"""
(define-macro define-c (v x)
  `(let x ,(cat "|" v ".cdef[[" (inner x) "]]|")
     x))
""")


; build motor.
(step path (tree "bin" "\\.lua$")
  ($ "rm" (j "bin" path)))
(rebuild 2)

; copy libs to ../lib/
(step path (tree "bin" "\\.lua$")
  (mkdir (j ".." "lib" (dirname path)))
  ($ "cp" "-r" "-f" (j "bin" path) (j ".." "lib" path)))


