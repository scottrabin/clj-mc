(ns wexbmc.components.app
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [wexbmc.components.movie :as movie]
    [cljs.core.async :refer [<! chan]]
    [om.core :as om :include-macros true]
    [om.dom :as dom :include-macros true]))

(defn now
  []
  (.now js/Date))

(defn handle-event
  [& args]
  (.debug js/console "Handling event:" args))

(def render-start nil)

(defn main
  [app opts]
  (reify
    om/IWillMount
    (will-mount [_ owner]
      (let [comm (chan)]
        (om/set-state! owner [:comm] comm)
        (go (while true
              (handle-event app (<! comm))))))
    om/IWillUpdate
    (will-update [_ _ _ _]
      (set! render-start (now)))
    om/IDidUpdate
    (did-update [_ _ _ _ _]
      (.debug js/console "IDidUpdate in" (- (.valueOf (now)) (.valueOf render-start))))
    om/IRender
    (render [_ owner]
      (let [{:keys [message movies] :as state} (om/get-state owner [:data])]
        (.debug js/console "IRender with" owner (clj->js message))
        (dom/div nil
                 message
                 (om/build movie/index app
                           {:path [] :opts {:movies movies}}))))))
