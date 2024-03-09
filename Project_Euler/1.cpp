#include"utils.h"

int main() {
    Timer timer;
    timer.start();

    long long int sum = 0;
    for(int i = 1; i < 1000; ++i) {
        if(i%3==0 || i%5==0) sum += i;
    }
    cout << sum << endl;

    timer.elapsed();
    return 0;
}