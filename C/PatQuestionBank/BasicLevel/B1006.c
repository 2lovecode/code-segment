/*1006 换个格式输出整数 (15)（15 分）

让我们用字母B来表示“百”、字母S表示“十”，用“12...n”来表示个位数字n（&lt10），换个格式来输出任一个不超过3位的正整数。例如234应该被输出为BBSSS1234，因为它有2个“百”、3个“十”、以及个位的4。

输入格式：每个测试输入包含1个测试用例，给出正整数n（&lt1000）。

输出格式：每个测试用例的输出占一行，用规定的格式输出n。

输入样例1：

234

输出样例1：

BBSSS1234

输入样例2：

23

输出样例2：

SS123
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main ()
{
	char number[4];
	int len, n;
	int j, i = 0;
	char c, cc;
	char str[3] = {'S','B'};

	if (!scanf("%3s", number)) {
		return EXIT_FAILURE;
	}
	len = strlen(number);
	int flag = len - 1;

	while ((c = number[i]) != '\0') {
		n = c - '0';

		if (flag > 0) {
			for (j = 0; j < n; j++) {
				cc = str[flag - 1];
				printf("%c", cc);
			}
			flag--;
		} else {
			for (j = 0; j < n; j++) {
				cc = j + 1 + '0';
				printf("%c", cc);
			}
		}

		i++;
	}
	return EXIT_SUCCESS;
}