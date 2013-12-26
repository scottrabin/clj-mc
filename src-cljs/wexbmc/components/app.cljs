(ns wexbmc.components.app
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [wexbmc.video.movie]
    [wexbmc.components.movie :as movie]
    [cljs.core.async :refer [<! chan put!]]
    [om.core :as om :include-macros true]
    [om.dom :as dom :include-macros true]))

(defn now
  []
  (.now js/Date))

(def render-start nil)

(defn command-initialize
  "Initialize the application"
  [app]
  (.log js/console "[ command ] initialize")
  (go
    (let [movies (<! (wexbmc.video.movie/fetch-all))]
      (om/update! app [:data] #(assoc % :movies movies)))))

(defn main
  [{:keys [routes data] :as app}]
  (reify
    om/IWillMount
    (will-mount [_ owner]
      (let [comm (chan)]
        (om/set-state! owner [:comm] comm)
        (go (loop [[command _] [command-initialize nil]]
              (command app)
              (recur (alts! [comm routes]))))))
    om/IWillUpdate
    (will-update [_ _ _ _]
      (set! render-start (now)))
    om/IDidUpdate
    (did-update [_ _ _ _ _]
      (.log js/console "[ app/main ] updated in" (- (.valueOf (now)) (.valueOf render-start)) "ms"))
    om/IRender
    (render [_ owner]
      (dom/div nil
               (om/build movie/index app
                         {:path [] :opts {:movies (:movies data)}})))))
