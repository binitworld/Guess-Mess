#include <cpprest/http_listener.h>
#include <cpprest/json.h>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>

// using namespace web;
using namespace web::http;
using namespace web::http::experimental::listener;

mongocxx::instance instance{}; // This should be done only once.
mongocxx::uri mongodb_uri("mongodb+srv://admin:admin@cluster0.xstrq1b.mongodb.net/guessmess?retryWrites=true&w=majority"); 
mongocxx::client mongodb_client(mongodb_uri);
mongocxx::database mongodb_db = mongodb_client["gessmess"];
mongocxx::collection mongodb_collection = mongodb_db["genere"];

void handle_get(http_request request) {
    try {
        
        auto cursor = mongodb_collection.find({});
        web::json::value response_json;

        for (auto&& doc : cursor) {
            auto json = bsoncxx::to_json(doc);
            response_json[U("documents")].as_array().push_back(web::json::value::parse(json));
        }

        request.reply(status_codes::OK, response_json);
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        request.reply(status_codes::InternalError, U("Internal Server Error"));
    }
}

int main() {
    http_listener listener(L"http://localhost:3000"); 

    listener.support(methods::GET, handle_get);

    try {
        listener.open().wait();
        std::cout << "Listening..." << std::endl;
        std::cin.get(); 
        listener.close().wait();
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}
