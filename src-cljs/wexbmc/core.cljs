(ns wexbmc.core
  (:require
    [om.core :as om :include-macros true]
    [wexbmc.components.app :as wex-app]
    [cljs.core.async :refer [<! chan alts! put!]]
    [cljs.core.async.impl.protocols :as async-protocols]
    [wexbmc.jsonrpc.core :as rpc]
    [wexbmc.video.movie :as movie]
    [wexbmc.video.tvshow :as tvshow]
    [wexbmc.video.season :as season]
    [wexbmc.video.episode :as episode]
    [wexbmc.xbmc :refer [id]]
    [wexbmc.uri :refer [parse]]
    [wexbmc.views]
    [wexbmc.remote :as remote]
    [dommy.core :refer [append! attr value listen!]])
  (:require-macros
    [dommy.macros :refer [sel sel1 by-id by-class]]
    [wexbmc.router :as router]
    [cljs.core.async.macros :refer [go]]))

(defn display-tvshow
  [tvshow seasons episodes season]
  (doseq [episode (sel [:#tvshow :li.episode])]
    (dommy.core/toggle!
      episode
      (= season (-> episode (dommy.core/attr :data-season) int))))
  (doseq [season-el (sel [:#tvshow :.season])]
    (dommy.core/toggle-class! season-el
                              "active"
                              (= season (-> season-el (dommy.core/attr :data-season) int))))
  {:item     tvshow
   :seasons  seasons
   :episodes episodes
   :season   season})

(defn render-tvshow
  [tvshow seasons episodes season]
  (let [season (or season (-> seasons first :season))]
    (dommy.core/replace-contents!
      (by-id :tvshow)
      (wexbmc.views/tv-show-episode-selector tvshow seasons episodes))
    (display-tvshow tvshow seasons episodes season)))

(defn display-movie
  [movie])

(defn render-movie
  [movie]
  (dommy.core/replace-contents!
    (by-id :movie)
    (wexbmc.views/movie-details movie))
  (display-movie movie))

(defn- init
  []
  (listen! [(.-body js/document) "button[data-action]"] :click
           (fn [evt]
             ((remote/actions (attr (.-target evt) :data-action)))))
  (go
    (let [tv-shows (<! (tvshow/fetch-all))
          movies (<! (movie/fetch-all))
          routes (router/route
                   (#"/remote"
                     []
                     {:type :remote})
                   (#"/movies/([-a-z0-9]+)/?"
                     [movie-slug]
                     {:type :movie
                      :item (get movies movie-slug)})
                   (#"/movies/?"
                     []
                     {:type :movie-index})
                   (#"/tv-shows/([-a-z0-9]+)/S(\d+)E(\d+)(?:/.*)"
                     [show-slug season episode]
                     {:type :tvshow
                      :item (get tv-shows show-slug)
                      :season (int season)
                      :episode (int episode)})
                   (#"/tv-shows/([-a-z0-9]+)/S(\d+)"
                     [show-slug season]
                     {:type :tvshow
                      :item (get tv-shows show-slug)
                      :season (int season)})
                   (#"/tv-shows/([-a-z0-9]+)/?"
                     [show-slug]
                     {:type :tvshow
                      :item (get tv-shows show-slug)})
                   (#"/tv-shows/?"
                     []
                     {:type :tvshow-index})
                   {:type :tvshow-index})]
      (doseq [[_ show] tv-shows]
        (append! (sel1 [:#tvshow-index :ul]) (wexbmc.views/tv-show-selector show)))
      (doseq [[_ movie] movies]
        (append! (sel1 [:#movie-index :ul]) (wexbmc.views/movie-selector movie)))
      (loop [state {}]
        (let [{:keys [type item] :as params} (<! routes)
              newstate (merge state params)]
          ; toggle the visibility of the current state
          (doseq [screen (by-class :screen)]
            (dommy.core/toggle! screen (= (name type) (dommy.core/attr screen :id))))
          (recur
            (condp = type
              :tvshow
              (if (= (:item state) item)
                (display-tvshow item
                                (:seasons state)
                                (:episodes state)
                                (:season newstate))
                (do
                  (dommy.core/set-html! (by-id :tvshow) "")
                  (render-tvshow item
                                 (<! (season/fetch-all item))
                                 (<! (episode/fetch-all item))
                                 (:season params))))

              :movie
              (if (= (:item state) item)
                (display-movie item)
                (do
                  (dommy.core/set-html! (by-id :movie) "")
                  (render-movie item)))

              state)))))))

;(listen! js/window :load init)

(defn ^:private fetch-tvshow-seasons
  "Fetch the seasons for a TV show or use the cached variants"
  [app show-slug]
  (.debug js/console "data:" app)
  (let [tvshow (get-in app [:data :tvshows show-slug])
        seasons (get-in app [:data :seasons show-slug])]
    (.debug js/console "Seasons:" seasons)
    (when (nil? seasons)
      (.debug js/console (str "[ core ] Fetching seasons for '" show-slug "'") tvshow)
      (go
        (let [seasons (<! (season/fetch-all tvshow))])
        (om/update! app [:data]
                    #(assoc-in % [:seasons show-slug] seasons))))))

(om/root {:data {}
          :routes (router/route
                    (#"/remote"
                      []
                      (fn [app owner]
                        (.log js/console (str "[ router ] Displaying remote"))
                        (om/update! app [:data] #(assoc % :type :remote))))
                    (#"/movies/([-a-z0-9]+)/?"
                      [movie-slug]
                      (fn [app owner]
                        (.log js/console (str "[ router ] Displaying movie '" movie-slug "'"))
                        (om/update! app [:data] #(merge % {:type :movie
                                                           :item movie-slug}))))
                    (#"/movies/?"
                      []
                      (fn [app owner]
                        (.log js/console "[ router ] Displaying movie index")
                        (om/update! app [:data] #(assoc % :type :movie-index))))
                    (#"/tv-shows/([-a-z0-9]+)/S(\d+)E(\d+)(?:/.*)"
                      [show-slug season episode]
                      (fn [app owner]
                        (.log js/console (str "[ router ] Displaying '" show-slug "' S" season "E" episode))
                        (fetch-tvshow-seasons app show-slug)
                        (om/update! app [:data] #(merge % {:type :tvshow-episode
                                                           :item {:name show-slug
                                                                  :season (int season)
                                                                  :episode (int episode)}}))))
                    (#"/tv-shows/([-a-z0-9]+)/S(\d+)"
                      [show-slug season]
                      (fn [app owner]
                        (.log js/console (str "[ router ] Displaying '" show-slug "' season " season))
                        (fetch-tvshow-seasons app show-slug)
                        (om/update! app [:data] #(merge % {:type :tvshow-episode-index
                                                           :item {:name show-slug
                                                                  :season (int season)}}))))
                    (#"/tv-shows/([-a-z0-9]+)/?"
                      [show-slug]
                      (fn [app owner]
                        (.log js/console (str "[ router ] Displaying '" show-slug "'"))
                        (fetch-tvshow-seasons app show-slug)
                        (om/update! app [:data] #(merge % {:type :tvshow-episode-index
                                                           :item {:name show-slug
                                                                  :season 1}}))))
                    (#"/tv-shows/?"
                      []
                      (fn [app owner]
                        (.log js/console (str "[ router ] Displaying TV shows"))
                        (om/update! app [:data] #(assoc % :type :tvshow-index))))

                    (fn [app owner]
                      (.warn js/console "[ router ] No matching route; defaulting to remote")
                      (om/update! app [:data] #(assoc % :type :remote))))}
         wex-app/main
         js/document.body)
