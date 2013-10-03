(ns wexbmc.jsonrpc.videolibrary
  (:require [wexbmc.jsonrpc.core :refer [send-command]]))

(def Video-Fields-TVShow [:title :genre :year :rating :plot :studio
                          :mpaa :cast :playcount :episode :imdbnumber
                          :premiered :votes :lastplayed :fanart :thumbnail
                          :file :originaltitle :sorttitle :episodeguide
                          :season :watchedepisodes :dateadded :tag :art])

(defn get-tv-shows
  "Fetch the set of TV shows"
  []
  (send-command "VideoLibrary.GetTVShows" {:properties Video-Fields-TVShow}))
