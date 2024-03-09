#include"utils.h"

int main() {
    Timer timer;

    long long int num = 600851475143;
    //sqrt(600851475143) ~= 775146
    long long int i = 1;
    while(num > 1) {
        ++i;
        if(num%i == 0 && isPrime_SqrtN(i)) {
            while(num%i == 0) num /= i;
        }
    }
    std::cout << i << endl;

    timer.elapsed();
    return 0;
}