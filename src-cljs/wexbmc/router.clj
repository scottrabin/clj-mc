(ns wexbmc.router)

(defmacro hashfrag
  "Get the current hash fragment"
  []
  `(clojure.string/replace (.-hash (.-location js/window)) #"^#" ""))

(defmacro route
  [& route-defs]
  (let [routes (drop-last route-defs)
        default (last route-defs)
        fragsym (gensym "frag__")
        make-route (fn mk-rte [fsym [[path bindings & body] & more]]
                     `(if-let [match# (re-matches ~path ~fsym)]
                        (let [~bindings (drop 1 match#)]
                          ~@body)
                        ~(if (< 0 (count more))
                           (mk-rte fsym more)
                           default)))]
    `(let [retchan# (cljs.core.async/chan)
           hashchan# (wexbmc.util/evt-chan js/window :hashchange :navigate)]
       (cljs.core.async.macros/go
         (loop [_ nil]
           (let [~fragsym (hashfrag)]
             (cljs.core.async/>! retchan# ~(make-route fragsym routes))
             (recur (cljs.core.async/<! hashchan#)))))
       retchan#)))
