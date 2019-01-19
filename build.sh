#/bin/bash -e

echo "Run build client"
cd client && npm install && npm run tslint && npm run build && cd ..

echo "Run test server"
cargo test --all
echo "Run build server"
cargo build --all
