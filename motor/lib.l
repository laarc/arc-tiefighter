;; -*- mode: lisp -*-

(define-macro define-c (v x)
  `(let x ,(cat "|" v ".cdef[[" (inner x) "]]|")
     x))

(define-macro resume args
  `(coroutine.resume ,@args))

(define-macro yield args
  `(coroutine.yield ,@args))

(define-macro thread args
  `(coroutine.create ,@args))
