(ns wexbmc.jsonrpc.core
  (:require [goog.net.XhrIo :as xhr]
            [cljs.core.async :as async :refer [chan put! close!]]
            [goog.json :as json])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(def ^:private rpcid (atom 0))

(defn- format-rpc-request-data
  "Translate a command & parameter map into a proper JS object to serialize"
  [method params]
  (clj->js {:id      (swap! rpcid inc)
            :jsonrpc "2.0"
            :method  (str method)
            :params  params}))

(defn send-command
  "Send a command via JSON-RPC"
  ([command] (send-command command {}))
  ([command data]
   (let [c (chan)]
     (.send goog.net.XhrIo
            (str "/jsonrpc?" command)
            (fn [evt]
              (put! c (-> evt .-target .getResponseJson .-result
                          (js->clj :keywordize-keys true)))
              (close! c))
            "POST"
            (.serialize goog.json (format-rpc-request-data command data))
            (js-obj "Content-Type" "application/json"))
     c)))
