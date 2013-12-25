(ns wexbmc.components.movie
  (:require
    [wexbmc.video.movie :as movie]
    [om.core :as om :include-macros true]
    [om.dom :as dom :include-macros true]))

(defn ^:private index-view
  "Internal view to render a movie for the movie index"
  [movie]
  (dom/li #js {:className "movie"}
          (dom/a #js {:href (movie/link-to movie)}
                 (dom/img #js {:src (movie/art-poster movie)})
                 (dom/span #js {:className "movie-name"} (:title movie)))))

(defn index
  "Component for selecting from a list of movies"
  [app data]
  (reify
    om/IRender
    (render [_ owner]
      (.debug js/console "[movie/index] IRender:" (clj->js data))
      (dom/ul #js {:id "movie-list"}
                   (into-array
                     (map
                       (fn [[_ movie]] (index-view movie))
                       (:movies data)))))))
