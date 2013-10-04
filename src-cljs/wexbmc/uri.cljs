(ns wexbmc.uri)

; Credit to Steven Levithan
; http://blog.stevenlevithan.com/archives/parseuri
(def ^:private parser-regex
  #"^(?:([^:/?#]+):)?(?://((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)")

(def ^:private part-keys
  [:source :protocol :authority :userInfo :user :password :host :port :relative :path :directory :file :query :hash])

(defn parse
  "Parse a given URI into its composite parts"
  [url]
  (zipmap part-keys (re-matches parser-regex url)))
