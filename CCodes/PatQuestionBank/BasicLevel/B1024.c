/*
1024 科学计数法（20 分）

科学计数法是科学家用来表示很大或很小的数字的一种方便的方法，其满足正则表达式 [+-][1-9].[0-9]+E[+-][0-9]+，即数字的整数部分只有 1 位，小数部分至少有 1 位，该数字及其指数部分的正负号即使对正数也必定明确给出。

现以科学计数法的格式给出实数 A，请编写程序按普通数字表示法输出 A，并保证所有有效位都被保留。
输入格式：

每个输入包含 1 个测试用例，即一个以科学计数法表示的实数 A。该数字的存储长度不超过 9999 字节，且其指数的绝对值不超过 9999。
输出格式：

对每个测试用例，在一行中按普通数字表示法输出 A，并保证所有有效位都被保留，包括末尾的 0。
输入样例 1：

+1.23400E-03

输出样例 1：

0.00123400

输入样例 2：

-1.2E+10

输出样例 2：

-12000000000

*/
#include <stdio.h>
#include <stdlib.h>

int main ()
{
	char symbol = '+';
	char zheng = '0';
	char xiaoshu[10000];
	int xiao = 0;

	char z_symbol = '+';
	char zhishu[10000];
	int zhi_shu_i;
	int zhi = 0;

	char c;
	int cnt = 0;
	int xiao_flag = 0;
	int zhi_flag = 0;

	int i;

	while ((c = getchar()) != EOF) {
		if (c == '\n') {
			break;
		}
		if (cnt == 0) {
			symbol = c;
		} else if (cnt == 1) {
			zheng = c;
		}

		if (zhi_flag) {
			if (c != '-' && c != '+') {
				zhishu[zhi++] = c;
			} else {
				z_symbol = c;
			}
		}

		if (c == 'E') {
			xiao_flag = 0;
			zhi_flag = 1;
		}
		if (xiao_flag) {
			xiaoshu[xiao++] = c;
		}
		if (c == '.') {
			xiao_flag = 1;
		}
		cnt++;
	}

	zhi_shu_i = atoi(zhishu);
	if (symbol == '-') {
		printf("%c", symbol);
	}

	if (z_symbol == '-') {
		printf("0.");
		for (i = 0; i < zhi_shu_i - 1; i++) {
			printf("0");
		}
		printf("%c", zheng);
		printf("%s", xiaoshu);
	} else {
		if (zhi_shu_i >= xiao) {
			printf("%c", zheng);
			printf("%s", xiaoshu);
			for (i = 0; i < (zhi_shu_i - xiao); i++) {
				printf("0");
			}
		} else {
			printf("%c", zheng);
			for (i = 0; i < xiao; i++) {
				printf("%c", xiaoshu[i]);
				if (i == zhi_shu_i - 1) {
					printf(".");
				}
			}
		}
	}

	return 0;
}