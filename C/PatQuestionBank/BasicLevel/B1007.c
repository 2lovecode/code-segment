/*
1007 素数对猜想 (20)（20 分）

让我们定义 d~n~ 为：d~n~ = p~n+1~ - p~n~，其中 p~i~ 是第i个素数。显然有 d~1~=1 且对于n&gt1有 d~n~ 是偶数。“素数对猜想”认为“存在无穷多对相邻且差为2的素数”。

现给定任意正整数N (< 10^5^)，请计算不超过N的满足猜想的素数对的个数。

输入格式：每个测试输入包含1个测试用例，给出正整数N。

输出格式：每个测试用例的输出占一行，不超过N的满足猜想的素数对的个数。

输入样例：

20

输出样例：

4
*/
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int isPrime(int number);

int main ()
{
	int max, prevPrime;
	int i = 0, count = 0;

	if (!scanf("%d", &max)) {
		return EXIT_FAILURE;
	}

	for (i = 1; i <= max; i++) {
		if (isPrime(i)) {
			if (i - prevPrime == 2) {
				count++;
			}
			prevPrime = i;
		}
	}

	printf("%d", count);

	return EXIT_SUCCESS;
}

int isPrime(int number)
{
	int i;
	int max;
	max = sqrt(number);
	for (i = 2; i <= max; i++) {
		if (number % i == 0) {
			return 0;
		}
	}

	return 1;
}