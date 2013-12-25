(defproject MiniMC "0.1.0-SNAPSHOT"
  :description "Web interface to act as a remote for XBMC"
  :license {:name "GPL v2"
            :url "http://www.gnu.org/licenses/gpl-2.0.txt"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/core.async "0.1.267.0-0d7780-alpha"]
                 [org.clojure/clojurescript "0.0-2127"]
                 [om "0.1.0-SNAPSHOT"]
                 [com.cemerick/clojurescript.test "0.0.4"]
                 [org.clojure/google-closure-library-third-party "0.0-2029"]
                 [prismatic/dommy "0.1.1"]]

  :source-paths ["src-clj"]

  :plugins [[lein-cljsbuild "0.3.3"]]

  ; enable lein hooks for `clean`, `compile`, `test`, `jar`
  :hooks [leiningen.cljsbuild]

  :repl-init minimc-clj.repl

  :cljsbuild {:test-commands {"phantomjs-whitespace"
                              ["runners/phantomjs.js" "target/cljs/run-tests-ws.js"]
                              "phantomjs-simple"
                              ["runners/phantomjs.js" "target/cljs/run-tests-smpl.js"]
                              "phantomjs-advanced"
                              ["runners/phantomjs.js" "target/cljs/run-tests-adv.js"]}

              :builds [{:id "test-whitespace"
                        :source-paths ["src-cljs" "test-cljs"]
                        :compiler {:output-to "target/cljs/run-tests-ws.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}
                       {:id "test-simple"
                        :source-paths ["src-cljs" "test-cljs"]
                        :compiler {:output-to "target/cljs/run-tests-smpl.js"
                                   :optimizations :simple
                                   :pretty-print true}}
                       {:id "test-advanced"
                        :source-paths ["src-cljs" "test-cljs"]
                        :compiler {:output-to "target/cljs/run-tests-adv.js"
                                   :optimizations :advanced
                                   :pretty-print true}}
                       {:id "dev"
                        :source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/wexbmc.js"
                                   :output-dir "out"
                                   :externs ["react/externs/react.js"]
                                   :optimizations :none
                                   :source-map true
                                   :pretty-print true}}
                       {:id "prod"
                        :source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/wexbmc.js"
                                   :externs ["react/externs/react.js"]
                                   :optimizations :advanced
                                   :pretty-print false
                                   :preamble ["react/react.min.js"]
                                   :closure-warnings
                                   {:non-standard-jsdoc :off}}}]})
