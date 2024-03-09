#ifndef UTILS_H
#define UTILS_H

#include<bits/stdc++.h>
#include <chrono>
using namespace std;

class Timer {
    chrono::time_point<chrono::high_resolution_clock> startTime;
public:
    Timer() {
        startTime = chrono::high_resolution_clock::now();
    }
    void start() {
        startTime = chrono::high_resolution_clock::now();
    }
    void elapsed() {
        // Assuming start() was called.
        auto endTime = chrono::high_resolution_clock::now();
        chrono::duration<double, milli> elapsed = endTime - startTime;
        cout << "Time taken: " << elapsed.count() << " milliseconds\n";
    }
};

#endif