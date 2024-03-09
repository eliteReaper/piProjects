#include"utils.h"

int main() {
    Timer timer;

    long long int a = 1;
    long long int b = 2;
    long long int c = 0;
    long long int sum = b;
    long long int four_million = 4000000LL;
    while(c <= four_million) {
        c = a + b;
        a = b;
        b = c;
        if(c % 2 == 0) sum += c;
    }
    cout << sum << endl;

    timer.elapsed();
    return 0;
}