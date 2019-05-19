use actix_web::HttpResponse;

use crate::auth::Auth;

pub fn me_service(auth: Auth) -> HttpResponse {
    HttpResponse::Ok().json(auth.claime.user)
}
