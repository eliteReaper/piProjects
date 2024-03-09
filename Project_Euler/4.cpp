#include"utils.h"
using namespace std;

int main() {
    Timer timer;

    long long int mx = 0LL;
    for(long long int a = 999; a >= 100; --a) {
        for(long long int b = 100; b <= a; ++b) {
            long long int c = a * b;
            if(isPalindromic(c)) mx = max(mx, c);
        }
    }
    cout << mx << endl;

    timer.elapsed();
    return 0;
}