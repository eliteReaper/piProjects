#!/bin/bash

rm ./log.txt
while true; do
    echo "Finding connected devices..."
    arp -a > connected_devices
    echo "Devices found:"
    cat connected_devices
    echo "Performing speedtest..."
    speedtest -f csv --output-header -u MB/s > current_speed.csv
    echo "Analyzing speedtest results..."
    python3 ./internet_analyzer.py
    echo "Clearing artifacts..."
    rm ./current_speed.csv
    echo "Done"
    sleep 10 # seconds
done