#include"utils.h"
using namespace std;

int main() {
    Timer timer;

    long long int lim = 2e6;
    vector<bool> sieve = sieve_of_eratosthenes(lim + 5);
    long long int sum = 0;
    for(long long int i = 2; i <= lim; ++i) if(sieve[i]) sum += i;
    cout << sum << endl;

    timer.elapsed();
    return 0;
}