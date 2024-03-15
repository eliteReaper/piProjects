#include"utils.h"
using namespace std;

// 2(ab + 1000c) = 2*(1000*500)
// ab + 1000c = 500000
// (ab - 500000) / 1000 = c
// (ab/1000) - 500 = c

int main() {
    Timer timer;

    bool found = false;
    for(long long int a = 1; a <= 1000 && !found; ++a) {
        for(long long int b = a + 1; a + b <= 1000; ++b) {
            long long int c = 1000 - a - b;
            if(a*a + b*b == c * c) {
                cout << a << " " << b << " " << c << endl;
                cout << a*b*c << endl;
                cout << 500 - (a * b) / 1000 << endl;
                break;
            }
        }
    }

    timer.elapsed();
    return 0;
}