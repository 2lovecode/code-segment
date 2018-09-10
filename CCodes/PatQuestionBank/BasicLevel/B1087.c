/*
1087 有多少不同的值（20 分）

当自然数 n 依次取 1、2、3、……、N 时，算式 ⌊n/2⌋+⌊n/3⌋+⌊n/5⌋ 有多少个不同的值？（注：⌊x⌋ 为取整函数，表示不超过 x 的最大自然数，即 x 的整数部分。）
输入格式：

输入给出一个正整数 N（2≤N≤10​4​​）。
输出格式：

在一行中输出题面中算式取到的不同值的个数。
输入样例：

2017

输出样例：

1480

*/
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int main ()
{
	int number, tmp =  0;
	int result[10001];
	int cnt = 0, i, j, flag = 0;

	if (!scanf("%d", &number)) {
		return 1;
	}

	for (i = 1; i <= number; i++) {
		tmp = floor(i/2) + floor(i/3) + floor(i/5);
		flag = 0;
		for (j = 0; j < cnt; j++) {
			if (result[j] == tmp) {
				flag = 1;
				break;
			}
		}

		if (flag) {
			continue;
		} else {
			result[cnt++] = tmp;
		}
	}


	printf("%d", cnt);

	return 0;
}