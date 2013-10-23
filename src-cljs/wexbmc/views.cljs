(ns wexbmc.views
  (:require
    [wexbmc.util :refer [slug]]
    [wexbmc.video.tvshow :as tvshow]
    [wexbmc.video.season :as season]
    [wexbmc.video.episode :as episode]
    [wexbmc.xbmc :refer [id art-poster art-banner]])
  (:require-macros
    [dommy.macros :refer [node deftemplate]]))

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
  [ast]
  [:img {:src (asset ast)}])

; privately used templates
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
