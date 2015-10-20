;
; Imports.
;

(mac import (name)
  `(def ,name (require ',name)))

(import ffi)
(import buffer)
(import stream)
(import motor)
(import http)

;
; Externals.
;

(mac defc (name val)
  `(do (ffi.cdef ',(if (id-literal? val) (inner val) val))
       (def ,name (get ffi.C ',name))))

(defc usleep | int usleep (unsigned int usecs) |)

(def sleep (secs)
  (usleep (* secs 1000000)))

; (print 'begin)
; (sleep 1.3)
; (print 'end)

;
; App.
;

(def srv (f :port)
  (set port (or port 9999))
  (prn "serving port " port)
  (http.serve port
    (fn (req)
      (prn req)
      (when f (f req)))))

(def recv (req)
  (motor.receive req.fd))

(mac echo l
  (w/uniq g
    (lfn f (x)
      `(let ,g ,x
         (prn ,g)
         (stream.emit req ,g))
      `(do ,@(map f l)))))

;
; Site.
;

(def run (port)
  (srv port: port
    (fn (req)
      (let data (recv req)
        (echo data)
        (echo "hi")))))

(prn "Type (run) to serve port 9999, or (run 2222) to serve 2222.")

