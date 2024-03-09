#include"utils.h"
using namespace std;

int main() {
    Timer timer;

    vector<bool> sieve = sieve_of_eratosthenes(104800);
    int cnt = 0;
    int wanted = 10001, i = 0;
    while(i<sieve.size() && cnt < wanted) {
        if(sieve[i++]) {
            ++cnt;
        }
    }
    cout << cnt << " " << i - 1 << endl;

    timer.elapsed();
    return 0;
}