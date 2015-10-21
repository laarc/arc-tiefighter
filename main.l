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

(def sep "\r\n")
(def sep2 (cat sep sep))

(def response (data code)
  (cat "HTTP/1.1 " code sep
       "Content-Type: text/html; charset=utf-8" sep
       "Content-Length: " (# data) sep2
       data))

(def respond (s data)
  (stream.emit s (response data "200 OK")))

(def problem (s data)
  (stream.emit s (response data "500 Internal Server Error")))

(def unknown (s)
  (stream.emit s (response "Unknown" "404 Not Found")))

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

; <script src="jquery-1.11.3.min.js"></script>

(def run (port)
  (srv port: port
    (fn (req)
      (let data (recv req)
        (prn data)
        (respond req (cat """
<html>
<head>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script type="text/javascript">
"""
(filechars "browser.js")
"""
</script>
<title>arc.tiefighter</title>
</head>
<body>
<center>
<div>
<button onclick="console.log(ac($('#repl').val()))">
Evaluate (Open JS console to see output)
</button>
</div>
<div>
<textarea id="repl" rows=80 cols=80>
</textarea>
</div>

</body>
</html>
"""))
        ))))

(prn "Type (run) to serve port 9999, or (run 2222) to serve 2222.")

