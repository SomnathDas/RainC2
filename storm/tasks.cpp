#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#endif

#include "tasks.h"

#include <string>
#include <array>
#include <sstream>
#include <fstream>
#include <cstdlib>

#include <boost/uuid/uuid_io.hpp>
#include <boost/property_tree/ptree.hpp>

#include <Windows.h>
#include <tlhelp32.h>

[[nodiscard]] Task parseTaskFrom(const boost::property_tree::ptree& taskTree,
    std::function<void(const Configuration&)> setter) {
    const auto taskType = taskTree.get_child("task_type").get_value<std::string>();
    const auto idString = taskTree.get_child("task_id").get_value<std::string>();
    std::stringstream idStringStream{ idString };
    boost::uuids::uuid id{};
    idStringStream >> id;

    if (taskType == PingTask::key) {
        return PingTask{
            id
        };
    }
    if (taskType == ConfigureTask::key) {
        return ConfigureTask{
            id,
            taskTree.get_child("dwell").get_value<double>(),
            taskTree.get_child("running").get_value<bool>(),
            std::move(setter)
        };
    }
    if (taskType == ExecuteTask::key) {
        return ExecuteTask{
            id,
            taskTree.get_child("task_options").get_child("command").get_value<std::string>()
        };
    }
    if (taskType == ListThreadsTask::key) {
        return ListThreadsTask{
            id,
            taskTree.get_child("procid").get_value<std::string>()
        };
    }

    std::string errorMsg{ "Illegal task type encountered: " };
    errorMsg.append(taskType);
    throw std::logic_error{ errorMsg };
}

PingTask::PingTask(const boost::uuids::uuid& id)
    : id{ id } {
}

Result PingTask::run() const {
    const auto pingResult = "PONG!";
    return Result{ id, pingResult, true };
}

Configuration::Configuration(const double meanDwell, const bool isRunning)
    : meanDwell(meanDwell), isRunning(isRunning) {
}

ConfigureTask::ConfigureTask(const boost::uuids::uuid& id,
    double meanDwell,
    bool isRunning,
    std::function<void(const Configuration&)> setter)
    : id{ id },
    meanDwell{ meanDwell },
    isRunning{ isRunning },
    setter{ std::move(setter) } {
}

Result ConfigureTask::run() const {
    setter(Configuration{ meanDwell, isRunning });
    return Result{ id, "Configuration successful!", true };
}

ExecuteTask::ExecuteTask(const boost::uuids::uuid& id, std::string command)
    : id{ id },
    command{ std::move(command) } {
}

Result ExecuteTask::run() const {
    std::string result;
    try {
        std::array<char, 128> buffer{};
        std::unique_ptr<FILE, decltype(&_pclose)> pipe{
            _popen(command.c_str(), "r"),
            _pclose
        };
        if (!pipe)
            throw std::runtime_error("Failed to open pipe.");
        while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
            result += buffer.data();
        }
        return Result{ id, std::move(result), true };
    }
    catch (const std::exception& e) {
        return Result{ id, e.what(), false };
    }
}

ListThreadsTask::ListThreadsTask(const boost::uuids::uuid& id, std::string processId)
    : id{ id },
    processId{ processId } {
}

Result ListThreadsTask::run() const {
    try {
        std::stringstream threadList;
        auto ownerProcessId{ 0 };

        if (processId == "-") {
            ownerProcessId = GetCurrentProcessId();
        }
        else if (processId != "") {
            ownerProcessId = stoi(processId);
        } 
        else {
            return Result{ id, "Error! Failed to handle given process ID.", false };
        }

        HANDLE threadSnap = INVALID_HANDLE_VALUE;
        THREADENTRY32 te32;
        threadSnap = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
        if (threadSnap == INVALID_HANDLE_VALUE)
            return Result{ id, "Error! Could not take a snapshot of all running threads.", false };

        te32.dwSize = sizeof(THREADENTRY32);
        if (!Thread32First(threadSnap, &te32))
        {
            CloseHandle(threadSnap);
            return Result{ id, "Error! Could not retrieve information about first thread.", false };
        }

        do
        {
            if (te32.th32OwnerProcessID == ownerProcessId)
            {
                threadList << "THREAD ID      = " << te32.th32ThreadID << "\n";
            }
        } while (Thread32Next(threadSnap, &te32));

        CloseHandle(threadSnap);
        return Result{ id, threadList.str(), true };
    }
    catch (const std::exception& e) {
        return Result{ id, e.what(), false };
    }
}