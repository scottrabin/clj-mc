(ns wexbmc.xbmc)

(defprotocol IUniqueIdentity
  (id [_] "The unique identifier for this item"))
