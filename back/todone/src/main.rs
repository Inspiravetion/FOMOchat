extern crate websocket;

use websocket::stream::WebSocketStream;
use websocket::ws::receiver::Receiver;
use websocket::ws::sender::Sender;
use websocket::server::sender;
use websocket::{Server, Message};
use websocket::Message::*;
use std::vec::Vec;
use std::thread;
use std::fmt;
use std::sync::{Arc, Mutex};

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
    let address = "127.0.0.1:4006";

    let server = Server::bind(address).unwrap();
    println!("Server running at {:?} ...", address);

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
                    Close(_) => {},
                    _ => {}
                }  
            }
        });
    }
}