python -m SimpleHTTPServer 8888 &
pid=$!
node node_single.js
kill $pid
