extern crate mindstream;
extern crate dotenv;

use dotenv::dotenv;

fn main() {
    dotenv().ok();
    mindstream::run();
}
