extern crate dotenv;
extern crate mindstream;

use dotenv::dotenv;

fn main() {
    dotenv().ok();
    mindstream::run();
}
