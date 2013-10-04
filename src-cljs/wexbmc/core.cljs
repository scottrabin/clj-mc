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
    [dommy.macros :refer [sel sel1]]
    [cljs.core.async.macros :refer [go]]))

(defn evt-chan
  "Create an event channel on the given element"
  [el evt-name msg]
  (let [c (chan)]
    (listen! el evt-name (fn [evt]
                           (put! c [msg evt])))
    c))

(defn- init
  []
  (go
    (let [tv-shows (<! (tvshow/fetch-all))
          navigate (evt-chan js/window :hashchange :navigate)]
      (doseq [show tv-shows]
        (append! (sel1 [:#tvshows :ul]) (wexbmc.views/tv-show-selector show)))
      (loop [state :tvshows]
        (doseq [screen (sel :.screen)]
          (dommy.core/hide! screen))
        (dommy.core/show! (sel1 (str "#" (name state))))
        (let [[action evt] (<! navigate)
              uri (-> js/window .-location .toString parse)]
          (recur
            (condp re-matches (:hash uri)
              #"/tv-show/([-a-z0-9]+)" :>>
              (fn [[_ show-slug]]
                (.warn js/console show-slug)
                (go (let [tv-show (tvshow/by-slug tv-shows show-slug)
                          seasons (<! (season/fetch-all tv-show))
                          episodes (<! (episode/fetch-all tv-show))]
                      (dommy.core/replace-contents! (sel1 [:#tvshow]) (wexbmc.views/tv-show-episode-selector tv-show seasons episodes))))
                :tvshow)

              state)))))))

(listen! js/window :load init)
