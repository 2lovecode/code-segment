/*
1017 A除以B（20 分）

本题要求计算 A/B，其中 A 是不超过 1000 位的正整数，B 是 1 位正整数。你需要输出商数 Q 和余数 R，使得 A=B×Q+R 成立。
输入格式：

输入在一行中依次给出 A 和 B，中间以 1 空格分隔。
输出格式：

在一行中依次输出 Q 和 R，中间以 1 空格分隔。
输入样例：

123456789050987654321 7

输出样例：

17636684150141093474 3

*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main ()
{
	char number[1001];
	char quotient[1001];
	int remainder = 0;
	int divisor, i = 0, j = 0, current, currentQuotient, stringlen;

	if (!scanf("%s %d", number, &divisor)) {
		return EXIT_FAILURE;
	}

	stringlen = strlen(number);

	while (number[i] != '\0') {
		current = number[i] - '0' + remainder * 10;
		currentQuotient = current / divisor;
		remainder = current % divisor;

		if (stringlen == 1 || i != 0 || currentQuotient > 0) {
			quotient[j++] = currentQuotient + '0';
		}
		i++;
	}
	quotient[j] = '\0';

	printf("%s %d", quotient, remainder);

	return EXIT_SUCCESS;
}