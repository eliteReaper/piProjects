#ifndef UTILS_H
#define UTILS_H

#include<bits/stdc++.h>
#include <chrono>

// ---------------- UTILS ----------------
class Timer {
    std::chrono::time_point<std::chrono::high_resolution_clock> startTime;
public:
    Timer() {
        startTime = std::chrono::high_resolution_clock::now();
    }
    void start() {
        startTime = std::chrono::high_resolution_clock::now();
    }
    void elapsed() {
        // Assuming start() was called.
        auto endTime = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> elapsed = endTime - startTime;
        std::cout << "Time taken: " << elapsed.count() << " milliseconds\n";
    }
};

// ---------------- FUNCTIONS ----------------
// Returns if number is a prime in O(sqrt(num)).
bool isPrime_SqrtN(long long int num) {
    if(num < 2) return 0;
    for(int i = 2; i * i <= num; ++i) {
        if(num % i == 0) return false;
    }
    return true;
}

// Returns true if number is palindromic, that is reads the same from
// front as from the back.
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

// Generate Sieve of Erastoshenes upto a given number N.
std::vector<bool> sieve_of_eratosthenes(long long int n) {
    // Create a boolean array to store prime number information
    std::vector<bool> is_prime(n + 1, true);

    // 0 and 1 are not prime
    is_prime[0] = is_prime[1] = false;

    // Optimization: Only iterate up to the square root of n
    for (long long int i = 2; i * i <= n; i++) {
        if (is_prime[i]) {
            // Mark all multiples of i as non-prime
            for (long long int j = i * i; j <= n; j += i) {
                is_prime[j] = false;
            }
        }
    }

    return is_prime;
}

// ---------------- GENERATORS ----------------
long long int triangularNumberGenerator()

#endif