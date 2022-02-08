/*
1022 D进制的A+B（20 分）

输入两个非负 10 进制整数 A 和 B (≤2​30​​−1)，输出 A+B 的 D (1<D≤10)进制数。
输入格式：

输入在一行中依次给出 3 个整数 A、B 和 D。
输出格式：

输出 A+B 的 D 进制数。
输入样例：

123 456 8

输出样例：

1103

*/

#include <stdio.h>
#include <stdlib.h>

int main ()
{
	int a, b, c, d;
	int number[32], count = 0, i;

	if (!scanf("%d %d %d", &a, &b, &d)) {
		return 1;
	}

	c = a + b;

	if (c == 0) {
		number[count++] = 0;
	}
	while (c != 0) {
		number[count++] = c % d;
		c = c / d;
	}

	for (i = count - 1; i >= 0; i--) {
		printf("%d", number[i]);
	}

	return 0;
}