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

(defn ^:private -cast-member
  "Internal view to render a cast member"
  [actor]
  (dom/li #js {:className "actor"}
          (dom/a #js {:className "actor--photo"
                      :target "_blank"
                      :href (str "http://www.imdb.com/find?s=nm&q=" (js/encodeURIComponent (:name actor)))}
                 (when-let [thumb (:thumbnail actor)]
                   (dom/img #js {:alt (:name actor)
                                 :src (str "/vfs/" (js/encodeURI thumb))})))
          (dom/a #js {:className "actor--name"
                      :target "_blank"
                      :href (str "http://www.imdb.com/find?s=nm&q=" (js/encodeURIComponent (:name actor)))}
                 (:name actor))
          (dom/span #js {:className "actor--role"}
                    " as "
                    (dom/a #js {:target "_blank"
                                :href (str "http://www.imdb.com/find?s=nm&q=" (js/encodeURIComponent (:role actor)))}
                           (:role actor)))))

(defn index
  "Component for selecting from a list of movies"
  [app data]
  (reify
    om/IDidUpdate
    (did-update [_ _ _ _ _]
      (.scrollTo js/window 0 0))
    om/IRender
    (render [_ owner]
      (.log js/console "[ movie/index ] render:" (clj->js data))
      (dom/ul #js {:id "movie-list"}
                   (into-array
                     (map
                       (fn [[_ movie]] (index-view movie))
                       (:movies data)))))))

(defn view
  "Component for displaying a specific movie"
  [app data]
  (reify
    om/IDidUpdate
    (did-update [_ _ _ _ _]
      (.scrollTo js/window 0 0))
    om/IRender
    (render [_ owner]
      (.log js/console "[ movie/view ] render:" (clj->js data))
      (let [movie (get-in data [:movies (:item data)])]
        (dom/section #js {:id "movie-view"}
                     (dom/div #js {:className "movie"}
                              (dom/img #js {:className "movie--poster" :src (movie/art-poster movie)})
                              (dom/h3 #js {:className "movie-title"} (:title movie))
                              (dom/p #js {:className "plot"} (:plot movie))
                              (dom/ul #js {:className "cast"}
                                      (into-array (map -cast-member (:cast movie))))))))))
