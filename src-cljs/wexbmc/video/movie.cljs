(ns wexbmc.video.movie
  (:require
    [wexbmc.xbmc :refer [IUniqueIdentity id]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.util :refer [slug]]
    [cljs.core.async :refer [>! <!]])
  (:require-macros
    [cljs.core.async.macros :refer [go]]))

(def ^:private Video-Fields-Movie [:title :genre :year :rating :director :trailer
                                   :tagline :plot :plotoutline :originaltitle :lastplayed
                                   :playcount :writer :studio :mpaa :cast :country :imdbnumber
                                   :runtime :set :showlink :streamdetails :top250 :votes :fanart
                                   :thumbnail :file :sorttitle :resume :setid :dateadded :tag :art])

(defrecord Movie [movieid title plot year runtime art]
  IUniqueIdentity
  (id [this] movieid))

(defn fetch-all
  "Fetch all movies"
  []
  (go
    (let [result (<! (rpc/send-command
                       "VideoLibrary.GetMovies"
                       {:properties Video-Fields-Movie}))]
      (apply hash-map
             (mapcat
               #(list (slug (:title %)) (map->Movie %))
               (:movies result))))))

(defn art-poster
  "Get the asset path for a movie's poster artwork"
  [movie]
  (-> movie :art :poster))
