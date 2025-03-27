#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#endif

#include "implant.h"
#include <stdio.h>
#include <boost/system/system_error.hpp>


int main()
{
    const auto host = "localhost";
    const auto port = "5000";
    const auto uri = "/results";

    Implant implant{ host, port, uri };
    try {
        implant.beacon();
    }
    catch (const boost::system::system_error& se) {
        printf("\nSystem error: %s\n", se.what());
    }
}