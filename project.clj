(defproject MiniMC "0.1.0-SNAPSHOT"
  :description "Web interface to act as a remote for XBMC"
  :license {:name "GPL v2"
            :url "http://www.gnu.org/licenses/gpl-2.0.txt"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/core.async "0.1.242.0-44b1e3-alpha"]
                 [org.clojure/clojurescript "0.0-1909"]
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

              :builds
              {:test-whitespace
               {:source-paths ["src-cljs" "test-cljs"]
                :compiler {:output-to "target/cljs/run-tests-ws.js"
                           :optimizations :whitespace
                           :pretty-print true}}
               :test-simple
               {:source-paths ["src-cljs" "test-cljs"]
                :compiler {:output-to "target/cljs/run-tests-smpl.js"
                           :optimizations :simple
                           :pretty-print true}}
               :test-advanced
               {:source-paths ["src-cljs" "test-cljs"]
                :compiler {:output-to "target/cljs/run-tests-adv.js"
                           :optimizations :advanced
                           :pretty-print true}}
               :dev
               {:source-paths ["src-cljs"]
                :compiler {:output-to "resources/public/js/wexbmc.js"
                           :optimizations :whitespace
                           :pretty-print true}}
               :prod
               {:source-paths ["src-cljs"]
                :compiler {:output-to "resources/public/js/wexbmc.js"
                           :optimizations :advanced
                           :pretty-print false}}}})
