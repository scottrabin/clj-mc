(ns wexbmc.views
  (:require
    [wexbmc.type :refer [id poster banner]])
  (:require-macros
    [dommy.macros :refer [node deftemplate]]))

(deftemplate tv-show-banner
  [tv-show]
  [:div.tv-show
   [:a.tvshow {:data-tvshow-id (id tv-show)}
    [:img {:src (banner tv-show)}]]])
