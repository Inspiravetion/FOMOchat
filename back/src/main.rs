extern crate websocket;
extern crate staticfile;
extern crate mount;
extern crate iron;

use websocket::stream::WebSocketStream;
use websocket::ws::receiver::Receiver;
use websocket::ws::sender::Sender;
use websocket::server::sender;
use websocket::{Server, Message};
use websocket::Message::*;

use std::collections::BTreeMap;
use std::vec::Vec;
use std::thread;
use std::fmt;
use std::path::Path;
use std::ops::*;
use std::sync::{Arc, Mutex};

use iron::Iron;
use staticfile::Static;
use mount::Mount;

#[derive(Clone)]
struct Anchorman {
    tvs : Arc<Mutex<Vec<sender::Sender<WebSocketStream>>>>
}

impl Anchorman {
    fn new() -> Anchorman {
        Anchorman {
            tvs : Arc::new(Mutex::new(Vec::new()))
        }
    }

    fn register(&mut self, sender : sender::Sender<WebSocketStream>) {
        let mut tvs = self.tvs.lock().unwrap();

        tvs.push(sender);
    }

    fn broadcast(&mut self, msg : Message) {
        let mut tvs = self.tvs.lock().unwrap();

        for tv in tvs.iter_mut() {
            match tv.send_message(msg.clone()) {
                Err(e) => {},
                _ => {}
            }
        }
    }
}

fn main() {
    let file_address = "10.0.0.3:4003".to_string();
    let websocket_address = "10.0.0.3:4004";

    start_file_server(file_address);
    start_websocket_server(websocket_address);
}

fn start_file_server(address : String) {
    println!("{:?}", std::env::current_dir().unwrap());

    thread::spawn(move || {
        println!("File Server running at {}", &address);

        let mut mount = Mount::new();

        // Serve the html
        let src_path = Path::new("./front/src/");
        mount.mount("/", Static::new(src_path));
        // Serve the static file docs at /js/
        let js_path = Path::new("./front/src/js/");
        mount.mount("/js/", Static::new(js_path));
        // // Serve the source code at /css/
        let css_path = Path::new("./front/src/css/");
        mount.mount("/css/", Static::new(css_path));

        Iron::new(mount).http(address.deref()).unwrap();
    });
}

fn start_websocket_server(address : &str) {
    let server = Server::bind(address).unwrap();
    
    println!("Web Socket Server running at {}", address);

    let mut anchorman = Anchorman::new();

    for connection in server {
        let mut anchorman = anchorman.clone();
        // Spawn a new thread for each connection.
        thread::spawn(move || {

            let request = connection.unwrap().read_request().unwrap(); // Get the request
            let response = request.accept(); // Form a response
            let mut client = response.send().unwrap(); // Send the response

            let (mut sender, mut receiver) = client.split(); // Split the Client

            anchorman.register(sender);

            for message in receiver.incoming_messages::<Message>() {

                match message.unwrap() {
                    Text(json) => anchorman.broadcast(Message::Text(json)),
                    Close(_) => { return; },
                    _ => {}
                }  
            }
        });
    }
}