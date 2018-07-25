/*
1016 部分A+B（15 分）提问

正整数 A 的“D​A​​（为 1 位整数）部分”定义为由 A 中所有 D​A​​ 组成的新整数 P​A​​。例如：给定 A=3862767，D​A​​=6，则 A 的“6 部分”P​A​​ 是 66，因为 A 中有 2 个 6。

现给定 A、D​A​​、B、D​B​​，请编写程序计算 P​A​​+P​B​​。
输入格式：

输入在一行中依次给出 A、D​A​​、B、D​B​​，中间以空格分隔，其中 0<A,B<10​10​​。
输出格式：

在一行中输出 P​A​​+P​B​​ 的值。
输入样例 1：

3862767 6 13530293 3

输出样例 1：

399

输入样例 2：

3862767 1 13530293 8

输出样例 2：

0
*/
#include <stdio.h>
#include <stdlib.h>

int main ()
{
	char a[10];
	char da;
	char b[10];
	char db;

	char c;
	int i = 0;

	int a_sum = 0;
	int b_sum = 0;

	if (!scanf("%s %c %s %c", a, &da, b, &db)) {
		return EXIT_FAILURE;
	}

	i = 0;
	while ((c = a[i]) != '\0') {
		if (a[i] == da) {
			a_sum = a_sum * 10 + (da - '0');
		}
		i++;
	}

	i = 0;
	while ((c = b[i]) != '\0') {
		if (b[i] == db) {
			b_sum = b_sum * 10 + (db - '0');
		}
		i++;
	}

	printf("%d", a_sum + b_sum);

	return EXIT_SUCCESS;
}