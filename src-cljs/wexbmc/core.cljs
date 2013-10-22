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
    [wexbmc.router :as router]
    [cljs.core.async.macros :refer [go]]))

(defn evt-chan
  "Create an event channel on the given element"
  [el evt-name msg]
  (let [c (chan)]
    (listen! el evt-name (fn [evt]
                           (put! c [msg evt])))
    c))

;(defn- init
;  []
;  (go
;    (let [tv-shows (<! (tvshow/fetch-all))
;          navigate (evt-chan js/window :hashchange :navigate)]
;      (doseq [show tv-shows]
;        (append! (sel1 [:#tvshows :ul]) (wexbmc.views/tv-show-selector show)))
;      (loop [state :tvshows]
;        (doseq [screen (sel :.screen)]
;          (dommy.core/hide! screen))
;        (dommy.core/show! (sel1 (str "#" (name state))))
;        (let [[action evt] (<! navigate)
;              uri (-> js/window .-location .toString parse)]
;          (recur
;            (condp re-matches (:hash uri)
;              #"/tv-show/([-a-z0-9]+)" :>>
;              (fn [[_ show-slug]]
;                (.warn js/console show-slug)
;                (go (let [tv-show (tvshow/by-slug tv-shows show-slug)
;                          seasons (<! (season/fetch-all tv-show))
;                          episodes (<! (episode/fetch-all tv-show))]
;                      (dommy.core/replace-contents! (sel1 [:#tvshow]) (wexbmc.views/tv-show-episode-selector tv-show seasons episodes))))
;                :tvshow)
;
;              state)))))))

;(defn- init2
;  []
;  (go
;    (let [tv-shows (<! (tvshow/fetch-all))
;          routes (router/doroute
;                   (#"/tv-show/([-a-z0-9]+)/S(\d+)E(\d+)(?:/.*)"
;                     [show-slug season episode]
;                     (.log js/console "the first" show-slug season episode)
;                     {:type :tvshow
;                      :item (tvshow/by-slug tv-shows show-slug)
;                      :season (int season)
;                      :episode (int episode)})
;                   (#"/tv-show/([-a-z0-9]+)/S(\d+)"
;                     [show-slug season]
;                     (.log js/console "the second" show-slug season)
;                     {:type :tvshow
;                      :item (tvshow/by-slug tv-shows show-slug)
;                      :season (int season)})
;                   (#"/tv-show/([-a-z0-9]+)/?"
;                     [show-slug]
;                     (.log js/console "the third" show-slug)
;                     {:type :tvshow
;                      :item (tvshow/by-slug tv-shows show-slug)}))]
;      (loop []
;        (let [{:keys [type item] :as state} (<! routes)
;              active-pane (condp = type
;                            :tvshow :tvshow
;                            nil)]
;          ; toggle the visibility of the current state
;          (doseq [screen (sel :.screen)]
;            (dommy.core/toggle! screen (= active-pane (dommy.core/attr screen :id))))
;          (cond
;            (= :tvshow type)
;            (let [seasons (<! (season/fetch-all item))
;                  episodes (<! (episode/fetch-all item))]
;              (dommy.core/replace-contents! (sel1 [:#tvshow]) (wexbmc.views/tv-show-episode-selector item seasons episodes)))
;
;            )
;          (recur))))))

(defn- init2
  []
  (let [tv-shows 3]
    (router/doroute
      (#"/tv-show/([-a-z0-9]+)/S(\d+)E(\d+)(?:/.*)"
        [show-slug season episode]
        (.log js/console "the first" show-slug season episode)
        {:type :tvshow
         :item (tvshow/by-slug tv-shows show-slug)
         :season (int season)
         :episode (int episode)})
      (#"/tv-show/([-a-z0-9]+)/S(\d+)"
        [show-slug season]
        (.log js/console "the second" show-slug season)
        {:type :tvshow
         :item (tvshow/by-slug tv-shows show-slug)
         :season (int season)})
      (#"/tv-show/([-a-z0-9]+)/?"
        [show-slug]
        (.log js/console "the third" show-slug)
        {:type :tvshow
         :item (tvshow/by-slug tv-shows show-slug)}))))

(listen! js/window :load init2)
