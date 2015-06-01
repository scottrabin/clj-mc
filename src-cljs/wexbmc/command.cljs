(ns wexbmc.command
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [wexbmc.video.movie]
    [wexbmc.video.tvshow]
    [wexbmc.video.season :as season]
    [wexbmc.video.episode :as episode]
    [cljs.core.async :refer [<! chan put!]]
    [om.core :as om :include-macros true]
    [om.dom :as dom :include-macros true]))

(defn initialize
  "Initialize the application"
  [app owner]
  (.log js/console "[ command ] initialize")
  (go
    (let [movies (<! (wexbmc.video.movie/fetch-all))
          tvshows (<! (wexbmc.video.tvshow/fetch-all))]
      (om/update! app [:data] #(merge % {:movies movies
                                         :tvshows tvshows})))))

(defn make-fetch-seasons
  "Return a command to fetch the seasons for a given TV show"
  [tvshow]
  (fn [app owner]
    (go
      (let [seasons (<! (season/fetch-all tvshow))]
        (om/update! app [:data] #(assoc-in % [:seasons show-slug] seasons))))
    ; non-blocking
    nil))

(defn make-fetch-episodes
  "Return a command to fetch the episodes for a given TV show"
  [tvshow]
  (fn [app owner]
    (go
      (let [episodes (<! (episode/fetch-all tvshow))]
        (om/update! app [:data] #(assoc-in % [:episodes show-slug] episodes))))
    ; non-blocking
    nil))
