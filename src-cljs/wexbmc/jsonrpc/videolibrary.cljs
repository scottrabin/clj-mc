(ns wexbmc.jsonrpc.videolibrary
  (:require [wexbmc.jsonrpc.core :refer [send-command]]))

(def Video-Fields-TVShow [:title :genre :year :rating :plot :studio
                          :mpaa :cast :playcount :episode :imdbnumber
                          :premiered :votes :lastplayed :fanart :thumbnail
                          :file :originaltitle :sorttitle :episodeguide
                          :season :watchedepisodes :dateadded :tag :art])

(def Video-Fields-Episode [:title :plot :votes :rating :writer
                           :firstaired :playcount :runtime :director
                           :productioncode :season :episode :originaltitle
                           :showtitle :cast :streamdetails :lastplayed :fanart
                           :thumbnail :file :resume :tvshowid :dateadded :uniqueid :art])

(defn get-tv-shows
  "Fetch the set of TV shows"
  []
  (send-command "VideoLibrary.GetTVShows" {:properties Video-Fields-TVShow}))

(defn get-episodes
  "Get the episodes of a given TV show"
  [id]
  (send-command "VideoLibrary.GetEpisodes" {:properties Video-Fields-Episode :tvshowid id}))
