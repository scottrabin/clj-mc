(ns wexbmc.core
  (:require
    [cljs.core.async :refer [<! chan alts! put!]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.video.tvshow :as tvshow]
    [wexbmc.video.season :as season]
    [wexbmc.video.episode :as episode]
    [wexbmc.xbmc :refer [id]]
    [wexbmc.uri :refer [parse]]
    [wexbmc.views]
    [dommy.core :refer [append! attr value listen!]])
  (:require-macros
    [dommy.macros :refer [sel sel1 by-id by-class]]
    [wexbmc.router :as router]
    [cljs.core.async.macros :refer [go]]))

(defn- init
  []
  (go
    (let [tv-shows (<! (tvshow/fetch-all))
          routes (router/route
                   (#"/tv-shows/([-a-z0-9]+)/S(\d+)E(\d+)(?:/.*)"
                     [show-slug season episode]
                     {:type :tvshow
                      :item (tvshow/by-slug tv-shows show-slug)
                      :season (int season)
                      :episode (int episode)})
                   (#"/tv-shows/([-a-z0-9]+)/S(\d+)"
                     [show-slug season]
                     {:type :tvshow
                      :item (tvshow/by-slug tv-shows show-slug)
                      :season (int season)})
                   (#"/tv-shows/([-a-z0-9]+)/?"
                     [show-slug]
                     {:type :tvshow
                      :item (tvshow/by-slug tv-shows show-slug)})
                   (#"/tv-shows/?"
                     []
                     {:type :tvshows})
                   {:type :tvshows})]
      (doseq [show tv-shows]
        (append! (sel1 [:#tvshows :ul]) (wexbmc.views/tv-show-selector show)))
      (loop [state {}]
        (let [{:keys [type item] :as params} (<! routes)
              newstate (merge state params)]
          ; toggle the visibility of the current state
          (doseq [screen (by-class :screen)]
            (dommy.core/toggle! screen (= (name type) (dommy.core/attr screen :id))))
          (recur
            (condp = type
              :tvshow
              (if (= (:item state) item)
                (do
                  (doseq [episode (sel [:#tvshow :li.episode])]
                    (dommy.core/toggle! episode (= (:season newstate) (-> episode (dommy.core/attr :data-season) int))))
                  newstate)
                (do
                  (dommy.core/set-html! (by-id :tvshow) "")
                  (let [episodes (<! (episode/fetch-all item))
                        seasons  (<! (season/fetch-all item))
                        season   (get params :season (-> seasons first :season))]
                    (dommy.core/replace-contents! (by-id :tvshow) (wexbmc.views/tv-show-episode-selector item seasons episodes))
                    (doseq [episode (sel [:#tvshow :li.episode])]
                      (dommy.core/toggle! episode (= season (-> episode (dommy.core/attr :data-season) int))))
                    {:item     item
                     :episodes episodes
                     :seasons  seasons
                     :season   season})))

              state)))))))

(listen! js/window :load init)
