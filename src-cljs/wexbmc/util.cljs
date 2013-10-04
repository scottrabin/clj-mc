(ns wexbmc.util)

(defn slug
  "Convert a movie, TV show, or episode title into a valid URL slug"
  [s]
  (-> s
      clojure.string/lower-case
      (clojure.string/replace #"[^a-z0-9]+" "-")
      (clojure.string/replace #"(?:^-|-$)" "")))
