(ns wexbmc.core
  (:require
    [cljs.core.async :refer [<!]]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.video.tvshow :as tvshow]
    [wexbmc.video.episode :as episode]
    [wexbmc.type :refer [id]]
    [wexbmc.views]
    [dommy.core :refer [append! attr value listen!]])
  (:require-macros
    [dommy.macros :refer [sel sel1]]
    [cljs.core.async.macros :refer [go]]))

(defn- init
  []
  (go (let [tv-shows (<! (tvshow/fetch-all))
            target   (sel1 :#tvshows)]
        (doseq [show tv-shows]
          (append! target (wexbmc.views/tv-show-banner show)))))
  (listen! (sel1 :#rc) :submit
           (fn [evt]
             (.preventDefault evt)
             (rpc/send-command (value (sel1 "[name=\"command\"]")))))
  (listen! [(sel1 :body) "[data-command]"] :click
           (fn [evt]
             (rpc/send-command (attr (.-target evt) "data-command") {})))
  (listen! [(sel1 :#tvshows) :a.tvshow] :click
           (fn [evt]
             (.preventDefault evt)
             (go (let [tv-show (<! (tvshow/by-id (int (attr (.-selectedTarget evt) :data-tvshow-id))))]
                   (.warn js/console tv-show)
                   (.warn js/console (id tv-show))
                   (doseq [episode (<! (episode/fetch-all (id tv-show)))]
                     (.warn js/console (clj->js episode))))))))

(set! (.-onload js/window) init)
