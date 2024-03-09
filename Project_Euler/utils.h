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

bool isPrime_SqrtN(long long int num) {
    if(num < 2) return 0;
    for(int i = 2; i * i <= num; ++i) {
        if(num % i == 0) return false;
    }
    return true;
}

bool isPalindromic(long long int num) {
    long long int tmp = num;
    long long int rev = 0LL;
    do {
        long long int d = tmp % 10;
        if(rev) rev *= 10;
        rev += d;
        tmp /= 10;
    } while(tmp);
    return rev == num;
}

#endif