/*
1019 数字黑洞（20 分）

给定任一个各位数字不完全相同的 4 位正整数，如果我们先把 4 个数字按非递增排序，再按非递减排序，然后用第 1 个数字减第 2 个数字，将得到一个新的数字。一直重复这样做，我们很快会停在有“数字黑洞”之称的 6174，这个神奇的数字也叫 Kaprekar 常数。

例如，我们从6767开始，将得到

7766 - 6677 = 1089
9810 - 0189 = 9621
9621 - 1269 = 8352
8532 - 2358 = 6174
7641 - 1467 = 6174
... ...

现给定任意 4 位正整数，请编写程序演示到达黑洞的过程。
输入格式：

输入给出一个 (0,10​4​​) 区间内的正整数 N。
输出格式：

如果 N 的 4 位数字全相等，则在一行内输出 N - N = 0000；否则将计算的每一步在一行内输出，直到 6174 作为差出现，输出格式见样例。注意每个数字按 4 位数格式输出。
输入样例 1：

6767

输出样例 1：

7766 - 6677 = 1089
9810 - 0189 = 9621
9621 - 1269 = 8352
8532 - 2358 = 6174

输入样例 2：

2222

输出样例 2：

2222 - 2222 = 0000

*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void m_sort(char *ori, int up);

int main ()
{
	char big[5], small[5], r[5];
	int big_i, small_i, r_i = 0;

	if (!scanf("%d", &r_i)) {
		return 1;
	}

	do {
		sprintf(r, "%04d", r_i);
		strcpy(big, r);
		strcpy(small, big);
		m_sort(big, 0);
		m_sort(small, 1);
		big_i = atoi(big);
		small_i = atoi(small);
		r_i = big_i - small_i;
		printf("%04d - %04d = %04d\n", big_i, small_i, r_i);

	} while ((r_i != 6174) && (big_i != small_i));

	return 0;
}

void m_sort(char *ori, int up)
{
	int i, j, str_len, t;

	str_len = strlen(ori);

	for (i = 0; i < str_len; i++) {
		for (j = 0; j < str_len - i - 1; j++) {
			if (up) {
				if (ori[j] > ori[j+1]) {
					t = ori[j];
					ori[j] = ori[j+1];
					ori[j+1] = t;
				}
			} else {
				if (ori[j] < ori[j+1]) {
					t = ori[j];
					ori[j] = ori[j+1];
					ori[j+1] = t;
				}
			}

		}
	}
}

