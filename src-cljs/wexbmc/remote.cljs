(ns wexbmc.remote
  (:require
    [wexbmc.jsonrpc.core :as rpc])
  (:require-macros
    [cljs.core.async.macros :refer [go]]))

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
