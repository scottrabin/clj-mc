(ns wexbmc.views
  (:require
    [wexbmc.util :refer [slug]]
    [wexbmc.video.movie :as movie]
    [wexbmc.video.tvshow :as tvshow]
    [wexbmc.video.season :as season]
    [wexbmc.video.episode :as episode]
    [wexbmc.xbmc :refer [id art-poster art-banner]])
  (:require-macros
    [dommy.macros :refer [node deftemplate]]))

(defn- link-to-movie
  "Generate a hash link to a specific movie"
  [movie]
  (str "#/movies/" (-> movie :title slug)))

(defn- link-to-tv-show
  "Generate a hash link to a specific tv-show"
  [tv-show]
  (str "#/tv-shows/" (-> tv-show :title slug)))

(defn- link-to-season
  "Generate a hash link to a specific season of a TV show"
  [tv-show season]
  (str (link-to-tv-show tv-show) "/S" (:season season)))

(defn- link-to-episode
  "Generate a hash link to a specific episode of a TV show"
  [tv-show episode]
  (str (link-to-tv-show tv-show) "/S" (:season episode) "E" (:episode episode) "/" (-> episode :title slug)))

(defn- asset
  "Generate a URL to an XBMC asset"
  [ast]
  (str "/vfs/" (js/encodeURI ast)))

(defn- img-asset
  "Generate an image tag for a given asset"
  ([ast]
   (img-asset ast {}))
  ([ast attrs]
   [:img (assoc attrs :src (asset ast))]))

; privately used templates
(deftemplate -cast-member
  [actor]
  [:li.actor
   [:a.actor--photo {:target "_blank" :href (str "http://www.imdb.com/find?s=nm&q=" (js/encodeURIComponent (:name actor)))}
    (when-not (nil? (:thumbnail actor))
      [:img {:alt (:name actor) :src (str "/vfs/" (-> actor :thumbnail js/encodeURI))}])]
   [:a.actor--name {:target "_blank" :href (str "http://www.imdb.com/find?s=nm&q=" (js/encodeURIComponent (:name actor)))}
    (:name actor)]
   [:span.actor--role
    " as "
    [:a {:target "_blank" :href (str "http://www.imdb.com/find?s=nm&q=" (js/encodeURIComponent (:role actor)))}
     (:role actor)]]])

(deftemplate -tv-show-season-selector
  [tv-show season]
  [:li.season {:data-season (:season season)}
   [:a
    {:href (link-to-season tv-show season)}
    (img-asset (season/art-poster season))
    [:span.season--number (:season season)]]])

(deftemplate -tv-show-episode-selector
  [tv-show episode]
  [:li.episode {:data-season (:season episode) :data-episode (:episode episode)}
   [:a
    {:href (link-to-episode tv-show episode)}
    (img-asset (episode/art-poster episode))
    [:div.episode--metadata
     [:div.episode--serial (str "S: " (:season episode) " E: " (:episode episode))]
     [:div.episode--airdate (:firstaired episode)]]
    [:h3.episode--title (:title episode)]]])

(deftemplate tv-show-selector
  [tv-show]
  [:div.tv-show
   [:a.tvshow {:href (link-to-tv-show tv-show)}
    (img-asset (tvshow/art-banner tv-show))]])

(deftemplate tv-show-episode-selector
  [tv-show seasons episodes]
  (list
    [:ol.seasons (map #(-tv-show-season-selector tv-show %) seasons)]
    [:ol.episodes (map #(-tv-show-episode-selector tv-show %) episodes)]))

(deftemplate movie-selector
  [movie]
  [:li.movie
   [:a {:href (link-to-movie movie)}
    (img-asset (movie/art-poster movie))]])

(deftemplate movie-details
  [movie]
  [:div.movie
   (img-asset (movie/art-poster movie) {:class "movie--poster"})
   [:h3.movie-title (:title movie)]
   [:p.plot (:plot movie)]
   [:ul.cast
    (for [member (:cast movie)] (-cast-member member))]])
