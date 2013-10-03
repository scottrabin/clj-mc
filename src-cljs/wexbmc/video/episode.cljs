(ns wexbmc.video.episode
  (:require
    [cljs.core.async :refer [chan >!]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.type :refer [IUniqueIdentity]])
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
  [tvshowid]
  (go (let [result (<! (rpc/send-command "VideoLibrary.GetEpisodes" {:properties Video-Fields-Episode
                                                                     :tvshowid tvshowid}))]
        (map map->Episode (:episodes result)))))
