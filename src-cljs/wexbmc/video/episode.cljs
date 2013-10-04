(ns wexbmc.video.episode
  (:require
    [cljs.core.async :refer [chan >!]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.util :refer [slug]]
    [wexbmc.xbmc :refer [IUniqueIdentity id]])
  (:require-macros
    [cljs.core.async.macros :refer [go]]))

(def ^:private Video-Fields-Episode [:title :plot :votes :rating :writer :firstaired
                                     :playcount :runtime :director :productioncode
                                     :season :episode :originaltitle :showtitle :cast
                                     :streamdetails :lastplayed :fanart :thumbnail
                                     :file :resume :tvshowid :dateadded :uniqueid :art])

(defrecord Episode [title plot season episode episodeid showtitle tvshowid art]
  IUniqueIdentity
  (id [_] episodeid))

(defn fetch-all
  "Get the episodes of a given TV show"
  [tv-show]
  (go (let [result (<! (rpc/send-command "VideoLibrary.GetEpisodes" {:properties Video-Fields-Episode
                                                                     :tvshowid (id tv-show)}))]
        (map map->Episode (:episodes result)))))

; Asset retrieval methods
(defn art-poster
  "Get the asset path for a TV show episode's poster artwork"
  [e]
  (-> e :art :thumb))

(defn art-banner
  "Get the asset path for a TV show episode's banner artwork"
  [e]
  (-> e :art :banner))
