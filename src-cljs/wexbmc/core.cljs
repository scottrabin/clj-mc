(ns wexbmc.core
  (:require
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.jsonrpc.videolibrary :as videolibrary]
    [wexbmc.views]
    [dommy.core :refer [append! attr value listen!]])
  (:require-macros
    [dommy.macros :refer [sel sel1]]
    [cljs.core.async.macros :refer [go]]))

(defn- init
  []
  (go (let [tv-shows (:tvshows (<! (videolibrary/get-tv-shows)))
            body     (sel1 :body)]
        (doseq [show tv-shows]
          (append! body (wexbmc.views/tv-show-banner show)))))
  (listen! (sel1 :#rc) :submit
           (fn [evt]
             (.preventDefault evt)
             (rpc/send-command (value (sel1 "[name=\"command\"]")))))
  (listen! [(sel1 :body) "[data-command]"] :click
           (fn [evt]
             (rpc/send-command (attr (.-target evt) "data-command") {}))))

(set! (.-onload js/window) init)
