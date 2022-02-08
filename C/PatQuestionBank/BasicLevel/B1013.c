/*
1013 数素数 (20)（20 分）

令P~i~表示第i个素数。现任给两个正整数M <= N <= 10^4^，请输出P~M~到P~N~的所有素数。

输入格式：

输入在一行中给出M和N，其间以空格分隔。

输出格式：

输出从P~M~到P~N~的所有素数，每10个数字占1行，其间以空格分隔，但行末不得有多余空格。

输入样例：

5 27

输出样例：

11 13 17 19 23 29 31 37 41 43
47 53 59 61 67 71 73 79 83 89
97 101 103

注意审题：是第5到第27个素数
*/
#include <stdio.h>
#include <stdlib.h>
#include <math.h>


int isPrime(int n);

int main ()
{
	int start, end;
	int i, cnt = 0, ccnt = 0;

	if (!scanf("%d%d", &start, &end)) {
		return EXIT_FAILURE;
	}

	i = 2;

	while (cnt < end) {
		if (isPrime(i)) {
			cnt++;
			if (cnt >= start) {
				if (ccnt % 10 == 0) {
					if (ccnt != 0) {
						printf("\n%d", i);
					} else {
						printf("%d", i);
					}
				} else {
					printf(" %d", i);
				}
				ccnt++;
			}
		}
		i++;
	}

	return EXIT_SUCCESS;
}

int isPrime(int n)
{
	int i;
	for (i = 2; i <= sqrt(n); i++) {
		if (n % i == 0) {
			return 0;
		}
	}
	return 1;
}