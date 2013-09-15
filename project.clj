(defproject MiniMC "0.1.0-SNAPSHOT"
  :description "Web interface to act as a remote for XBMC"
  :license {:name "GPL v2"
            :url "http://www.gnu.org/licenses/gpl-2.0.txt"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1847"]]

  :plugins [[lein-cljsbuild "0.3.3"]]

  :cljsbuild {:builds
              {:dev
               {:source-paths ["src/cljs"]
                :compiler {:output-to "resources/public/js/wexbmc.js"
                           :optimizations :whitespace
                           :pretty-print true}}
               :prod
               {:source-paths ["src/cljs"]
                :compiler {:output-to "resources/public/js/wexbmc.js"
                           :optimizations :advanced
                           :pretty-print false}}}})
