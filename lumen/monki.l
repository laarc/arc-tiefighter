(clone "sctb/lumen")

(def lumenfiles ()
  (tree "." "/*.l$"))

(def build ()
  (touch (lumenfiles))
  (prn ($ "make")))

(def rebuild (n)
  (prn ($ "make" "clean"))
  (repeat (or n 2)
    (build))
  (prn ($ "make" "test")))

; We prefer having foo.bar syntax in Lumen, even though it suffers
; from inconsistent behavior.  E.g. foo.bar-baz doesn't work.
(patch "compiler.l"
|
(define valid-code? (n)
  (or (number-code? n)         ; 0-9
      (and (> n 64) (< n 91))  ; A-Z
      (and (> n 96) (< n 123)) ; a-z
      (= n 95)))               ; _
||
(define valid-code? (n)
  (or (number-code? n)         ; 0-9
      (and (> n 64) (< n 91))  ; A-Z
      (and (> n 96) (< n 123)) ; a-z
      (= n 46)                 ; .
      (= n 95)))               ; _
|)

; We prefer using rlwrap when possible.
;   old:  exec ${host} "${home}/${code}" "$@"
;   new:  exec $(which rlwrap) ${host} "${home}/${code}" "$@"
(patch "bin/lumen"
       "\nexec "
       "\nexec $(which rlwrap) ")
($ "chmod" "+x" "bin/lumen")

(rebuild)

