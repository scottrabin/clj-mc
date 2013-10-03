(ns wexbmc.type)

(defprotocol IUniqueIdentity
  (id [_] "The unique identifier for this item"))

(defprotocol IArtwork
  (banner [_] "The path to the banner artwork for this item")
  (poster [_] "The path to the poster artwork for this item"))
