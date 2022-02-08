/*
1001 A+B Format（20 分）

Calculate a+b and output the sum in standard format -- that is, the digits must be separated into groups of three by commas (unless there are less than four digits).
Input Specification:

Each input file contains one test case. Each case contains a pair of integers a and b where −10​6​​≤a,b≤10​6​​. The numbers are separated by a space.
Output Specification:

For each test case, you should output the sum of a and b in one line. The sum must be written in the standard format.
Sample Input:

-1000000 9

Sample Output:

-999,991

*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main ()
{
	int a, b, i, cnt = 0, cc = 0;
	int sum, str_len;
	int flag = 0;
	char s[20], c[20];

	if (!scanf("%d %d", &a, &b)) {
		return 1;
	}

	sum = a + b;

	if (sum < 0) {
		flag = 1;
	}
	sprintf(s, "%d", sum);

	str_len = strlen(s);

	for (i = str_len - 1; i >= 0; i--) {
		c[cnt++] = s[i];
		cc++;
		if (cc % 3 == 0) {
			if (i != 0) {
				if (!flag || i != 1) {
					c[cnt++] = ',';
					cc = 0;
				}
			}
		}
	}

	for (i = cnt - 1; i >= 0; i--) {
		printf("%c", c[i]);
	}
	return 0;
}