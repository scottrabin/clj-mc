(ns wexbmc.video.season
  (:require
    [wexbmc.video.tvshow]
    [wexbmc.xbmc :refer [id] :as xbmc]
    [wexbmc.jsonrpc.core :as rpc])
  (:require-macros
    [cljs.core.async.macros :refer [go]]))

(def ^:private Video-Fields-Season [:season :art])

(defrecord Season [season art]
  xbmc/IUniqueIdentity
  (id [_] season))

(defn fetch-all
  "Get the seasons for a given TV show"
  [tv-show]
  (go
    (let [result (<! (rpc/send-command "VideoLibrary.GetSeasons" {:tvshowid (id tv-show)
                                                                  :properties Video-Fields-Season}))]
      (sort-by :season (map map->Season (:seasons result))))))

; Asset retrieval methods
(defn art-poster
  "Get the asset path for a season's poster artwork"
  [s]
  (str "/vfs/" (-> s :art :poster js/encodeURI)))

(defn art-banner
  "Get the asset path for a season's banner artwork"
  [s]
  (str "/vfs/" (-> s :art :banner js/encodeURI)))

(defn link-to
  "Generate a hash link to a specific season of a TV show"
  [tv-show season]
  (str (wexbmc.video.tvshow/link-to tv-show) "/S" (:season season)))
