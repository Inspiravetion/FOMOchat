#Setup React.js
npm install -g react-tools
jsx --watch front/src/ front/build/

#Setup Rust for server
curl -f -L https://static.rust-lang.org/rustup.sh -O
sh rustup.sh
rm rustup.sh