(ns wexbmc.components.app
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [wexbmc.video.movie]
    [wexbmc.components.movie :as movie]
    [wexbmc.components.remote :as remote]
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
      (.log js/console "[ app/main ] render:" data)
      (dom/div nil
               (dom/nav #js {:id "top-navigation"}
                        (dom/a #js {:href "#/remote"} "Remote")
                        (dom/a #js {:href "#/tv-shows"} "TV Shows")
                        (dom/a #js {:href "#/movies"} "Movies"))
               (case (get data :type :remote)
                 :remote
                 (om/build remote/remote app
                           {:path [:player] :opts data})

                 :movie
                 (om/build movie/view app
                           {:path [] :opts data})

                 :movie-index
                 (om/build movie/index app
                           {:path [] :opts data}))))))