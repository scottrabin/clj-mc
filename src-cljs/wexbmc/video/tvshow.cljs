(ns wexbmc.video.tvshow
  (:require
    [cljs.core.async :refer [>! <!]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.util :refer [slug]]
    [wexbmc.xbmc :refer [IUniqueIdentity id]])
  (:require-macros
    [cljs.core.async.macros :refer [go]]))

(def ^:private Video-Fields-TVShow [:title :genre :year :rating :plot :studio
                                    :mpaa :cast :playcount :episode :imdbnumber
                                    :premiered :votes :lastplayed :fanart :thumbnail
                                    :file :originaltitle :sorttitle :episodeguide
                                    :season :watchedepisodes :dateadded :tag :art])

(defrecord TVShow [title plot season episode showtitle tvshowid art]
  IUniqueIdentity
  (id [this] tvshowid))

(defn fetch-all
  "Fetch all TV Shows"
  []
  (go
    (let [result (<! (rpc/send-command
                       "VideoLibrary.GetTVShows"
                       {:properties Video-Fields-TVShow}))]
      (apply hash-map
             (mapcat
               #(list (slug (:title %)) (map->TVShow %))
               (:tvshows result))))))

; Asset retrieval methods
(defn art-poster
  "Get the asset path for a TV show's poster artwork"
  [s]
  (-> s :art :poster))

(defn art-banner
  "Get the asset path for a TV show's banner artwork"
  [s]
  (-> s :art :banner))
