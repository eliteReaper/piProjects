#!/bin/bash

while true; do
    arp -a > connected_devices
    speedtest -f csv --output-header -u MB/s > current_speed.csv
    python3 ./internet_analyzer.py
    rm ./connected_devices
    rm ./current_speed.csv
    sleep 300
done