(clone "sctb/motor")

;
; Add lib/freebsd/system.l
;
(mkdir "bin/freebsd")
(w/mkdir "lib/freebsd"
  (create "system.l"
"""
;; -*- mode: lisp -*-

(define ffi (require 'ffi))

(define-c ffi |
struct sockaddr_in {
        uint8_t sin_len;
        sa_family_t     sin_family;
        in_port_t       sin_port;
        struct  in_addr sin_addr;
        char    sin_zero[8];
};
|)

(define-global SOL_SOCKET 0xffff)
(define-global SO_REUSEADDR 0x0004)
"""))

(patch "makefile"
"""
	bin/linux/system.lua	\
	bin/darwin/system.lua	\
"""
"""
	bin/linux/system.lua	\
	bin/darwin/system.lua	\
	bin/freebsd/system.lua	\
""")

(patch "makefile"
"""
bin/darwin/%.lua : lib/darwin/%.l obj/lib.lua
	@echo $@
	@$(LUMEN) obj/lib.lua -c $< -o $@ -t lua
"""
"""
bin/darwin/%.lua : lib/darwin/%.l obj/lib.lua
	@echo $@
	@$(LUMEN) obj/lib.lua -c $< -o $@ -t lua

bin/freebsd/%.lua : lib/freebsd/%.l obj/lib.lua
	@echo $@
	@$(LUMEN) obj/lib.lua -c $< -o $@ -t lua
""")

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
(clean)
(step path (tree "bin" "\\.lua$")
  ($ "rm" (j "bin" path)))
(step path (tree (j ".." "lib") "\\.lua$")
  ($ "rm" (j ".." "lib" path)))
(repeat 2
  (build))

; copy libs to ../lib/
(step path (tree "bin" "\\.lua$")
  (mkdir (j ".." "lib" (dirname path)))
  ($ "cp" "-r" "-f" (j "bin" path) (j ".." "lib" path)))


