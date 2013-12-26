(ns wexbmc.components.remote
  (:require
    [wexbmc.jsonrpc.core :as rpc]
    [om.core :as om :include-macros true]
    [om.dom :as dom :include-macros true]))

(def actions {"player/playpause"
              (fn []
                (rpc/send-command "Player.PlayPause" {:playerid 1}))

              "player/stop"
              (fn []
                (rpc/send-command "Player.Stop" {:playerid 1}))

              "player/rewind"
              (fn []
                (rpc/send-command "Player.SetSpeed" {:playerid 1
                                                     :speed "decrement"}))

              "player/fastforward"
              (fn []
                (rpc/send-command "Player.SetSpeed" {:playerid 1
                                                     :speed "increment"}))})

(defn remote
  "Render the remote control component"
  [app]
  (om/component
    (dom/section #js {:id "remote"
                      :className "screen"}
                 (dom/button #js {:type "button"
                                  :onClick #(rpc/send-command "Player.Stop" {:playerid 1})}
                             "Stop")
                 (dom/button #js {:type "button"
                                  :onClick #(rpc/send-command "Player.PlayPause" {:playerid 1})}
                             "Play/Pause")
                 (dom/button #js {:type "button"
                                  :onClick #(rpc/send-command "Player.SetSpeed" {:playerid 1
                                                                                 :speed "decrement"})}
                             "Rewind")
                 (dom/button #js {:type "button"
                                  :onClick #(rpc/send-command "Player.SetSpeed" {:playerid 1
                                                                                 :speed "increment"})}
                             "Fast Forward"))))
