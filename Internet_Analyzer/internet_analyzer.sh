#!/bin/bash

rm ./log.txt
rm ./current_speed.csv
rm ./connected_devices
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
    echo "Plotting & Saving Speed Test Graph.."
    python3 plotter.py
    sleep 10 # seconds
done