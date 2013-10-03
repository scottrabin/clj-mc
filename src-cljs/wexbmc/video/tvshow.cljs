(ns wexbmc.video.tvshow
  (:require
    [cljs.core.async :refer [>! <!]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.type :refer [IUniqueIdentity IArtwork id]])
  (:require-macros
    [cljs.core.async.macros :refer [go]]))

(def ^:private Video-Fields-TVShow [:title :genre :year :rating :plot :studio
                                    :mpaa :cast :playcount :episode :imdbnumber
                                    :premiered :votes :lastplayed :fanart :thumbnail
                                    :file :originaltitle :sorttitle :episodeguide
                                    :season :watchedepisodes :dateadded :tag :art])

(defrecord TVShow [title plot season episode showtitle tvshowid art]
  IUniqueIdentity
  (id [this] tvshowid)
  IArtwork
  (banner [this] (->> art :banner js/encodeURI (str "/vfs/")))
  (poster [this] (->> art :poster js/encodeURI (str "/vfs/"))))

(defn fetch-all
  "Fetch all TV Shows"
  []
  (go (let [result (<! (rpc/send-command "VideoLibrary.GetTVShows" {:properties Video-Fields-TVShow}))]
        (map map->TVShow (:tvshows result)))))

(defn by-id
  "Fetch a specific TV show by ID"
  [tvshowid]
  (go (first (filter #(= (id %) tvshowid) (<! (fetch-all))))))
