(clone "sctb/motor")

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

(rebuild 2)


