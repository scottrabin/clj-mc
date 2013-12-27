(ns wexbmc.components.tvshow
  (:require
    [wexbmc.video.tvshow :as tvshow]
    [wexbmc.video.season :as season]
    [om.core :as om :include-macros true]
    [om.dom :as dom :include-macros true]))

(defn ^:private index-view
  "Internal view to render a TV show for the index"
  [tvshow]
  (dom/div #js {:className "tv-show"}
           (dom/a #js {:className "tvshow" :href (tvshow/link-to tvshow)}
                  (dom/img #js {:src (tvshow/art-banner tvshow)}))))

(defn ^:private -ep-index-season
  "Internal view to render a TV show season for the episode index"
  [tvshow season]
  (dom/li #js {:className "season"}
          (dom/a #js {:href (season/link-to tvshow season)}
                 (dom/img #js {:src (season/art-poster season)})
                 (dom/span #js {:className "season--number"} (:season season)))))

(defn ^:private -ep-index-episode
  "Internal view to render a TV show episode for the episode index"
  [tvshow episode]
  (dom/li #js {:className "episode"}
          (dom/a #js {:href (episode/link-to tvshow episode)}
                 (dom/img #js {:src (episode/art-poster episode)})
                 (dom/div #js {:className "episode--metadata"}
                          (dom/div #js {:className "episode--serial"}
                                   (str "S: " (:season episode) " E: " (:episode episode)))
                          (dom/div #js {:className "episode--airdate"}
                                   (:firstaired episode)))
                 (div/h3 #js {:className "episode--title"}
                         (:title episode)))))

(defn index
  "Component for selecting from a list of TV shows"
  [app data]
  (reify
    om/IDidUpdate
    (did-update [_ _ _ _ _]
      (.scrollTo js/window 0 0))
    om/IRender
    (render [_ owner]
      (.log js/console "[ tvshow/index ] render:" (clj->js data))
      (dom/section #js {:id "tvshow-index"}
                   (into-array
                     (map
                       (fn [[_ tvshow]] (index-view tvshow))
                       (:tvshows data)))))))

(defn episode-index
  "Component for selecting an episode from a TV show"
  [app data]
  (reify
    om/IDidUpdate
    (did-update [_ _ _ _ _]
      (.scrollTo js/window 0 0))
    om/IRender
    (render [_ owner]
      (.log js/console "[ tvshow/episode-index ] render:" (clj->js data))
      (let [tvshow nil]
        (dom/section #js {:id "tvshow-episode-index"}
                     (dom/ol #js {:className "seasons"}
                             (into-array
                               (map #(-ep-index-season tvshow %) (:seasons tvshow))))
                     (dom/ol #js {:className "episodes"}
                             (into-array
                               (map #(-ep-index-episode tvshow %) (:episodes tvshow)))))))))
