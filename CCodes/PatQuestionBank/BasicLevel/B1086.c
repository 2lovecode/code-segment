/*
1086 就不告诉你（15 分）

做作业的时候，邻座的小盆友问你：“五乘以七等于多少？”你应该不失礼貌地围笑着告诉他：“五十三。”本题就要求你，对任何一对给定的正整数，倒着输出它们的乘积。

53.jpg
输入格式：

输入在第一行给出两个不超过 1000 的正整数 A 和 B，其间以空格分隔。
输出格式：

在一行中倒着输出 A 和 B 的乘积。
输入样例：

5 7

输出样例：

53

作者: CHEN, Yue
单位: 浙江大学
时间限制: 400 ms
内存限制: 64 MB
代码长度限制: 16 KB
*/

#include <stdio.h>
#include <stdlib.h>

int main ()
{
	int x, y;
	int n, yu;
	int flag = 0;

	if (!scanf("%d %d", &x, &y)) {
		return 1;
	}

	n = x * y;

	while (n != 0) {
		yu = n % 10;

		if (yu == 0) {
			if (flag) {
				printf("%d", yu);
			}
		} else {
			flag = 1;
			printf("%d", yu);
		}

		n = n / 10;
	}

	return 0;
}