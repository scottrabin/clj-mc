(ns wexbmc.util
  (:require
    [dommy.core :refer [listen!]]
    [cljs.core.async :refer [chan put!]]))

(defn slug
  "Convert a movie, TV show, or episode title into a valid URL slug"
  [s]
  (-> s
      clojure.string/lower-case
      (clojure.string/replace #"[^a-z0-9]+" "-")
      (clojure.string/replace #"(?:^-|-$)" "")))

(defn evt-chan
  "Create an event channel on the given element"
  [el evt-name msg]
  (let [c (chan)]
    (listen! el evt-name (fn [evt]
                           (put! c [msg evt])))
    c))
