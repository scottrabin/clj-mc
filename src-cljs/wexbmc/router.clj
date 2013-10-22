(ns wexbmc.router)

(defmacro hashfrag
  "Get the current hash fragment"
  []
  `(clojure.string/replace (.-hash (.-location js/window)) #"^#" ""))

; TODO - this isn't compiling correctly
(defmacro route
  [& route-defs]
  (let [fragsym (gensym "frag__")
        make-route (fn mk-rte [fsym [[path bindings & body] & more]]
                     `(if-let [match# (re-matches ~path ~fsym)]
                        (let [~bindings (drop 1 match#)]
                          ~@body)
                        ~(when (< 0 (count more))
                           (mk-rte fsym more))))]
    `(let [retchan# (cljs.core.async/chan)
           hashchan# (wexbmc.util/evt-chan js/window :hashchange :navigate)]
       (cljs.core.async.macros/go
         (loop [_ nil]
           (let [~fragsym (hashfrag)]
             (cljs.core.async/>! retchan# ~(make-route fragsym route-defs))
             (recur (cljs.core.async/<! hashchan#)))))
       retchan#)))

(defmacro doroute
  [& route-defs]
  (let [fragsym (gensym "frag__")
        make-route (fn mk-rte [fsym [[path bindings & body] & more]]
                     `(if-let [match# (re-matches ~path ~fsym)]
                        (let [~bindings (drop 1 match#)]
                          ~@body)
                        ~(when (< 0 (count more))
                           (mk-rte fsym more))))]
    `(let [~fragsym (hashfrag)]
       (.log js/console ~(make-route fragsym route-defs)))))
