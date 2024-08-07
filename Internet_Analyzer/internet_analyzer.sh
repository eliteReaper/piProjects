#!/bin/bash

while true; do
    echo "Finding connected devices..."
    arp -a > connected_devices
    echo "Devices found:"
    cat connected_devices
    echo "Performing speedtest..."
    speedtest -f csv --output-header -u MB/s > current_speed.csv
    echo "Analyzing speedtest results..."
    rm ./log.txt
    python3 ./internet_analyzer.py
    echo "Clearing artifacts..."
    rm ./connected_devices
    rm ./current_speed.csv
    echo "Done"
    sleep 10 # seconds
done