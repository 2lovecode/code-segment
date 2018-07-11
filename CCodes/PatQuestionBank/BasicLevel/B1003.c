/*
1003 我要通过！(20)（20 分）

“答案正确”是自动判题系统给出的最令人欢喜的回复。本题属于PAT的“答案正确”大派送 —— 只要读入的字符串满足下列条件，系统就输出“答案正确”，否则输出“答案错误”。

得到“答案正确”的条件是：

1. 字符串中必须仅有P, A, T这三种字符，不可以包含其它字符；\

    任意形如 xPATx 的字符串都可以获得“答案正确”，其中 x 或者是空字符串，或者是仅由字母 A 组成的字符串；\
    如果 aPbTc 是正确的，那么 aPbATca 也是正确的，其中 a, b, c 均或者是空字符串，或者是仅由字母 A 组成的字符串。

现在就请你为PAT写一个自动裁判程序，判定哪些字符串是可以获得“答案正确”的。

输入格式： 每个测试输入包含1个测试用例。第1行给出一个自然数n (&lt10)，是需要检测的字符串个数。接下来每个字符串占一行，字符串长度不超过100，且不包含空格。

输出格式：每个字符串的检测结果占一行，如果该字符串可以获得“答案正确”，则输出YES，否则输出NO。

输入样例：

8
PAT
PAAT
AAPATAA
AAPAATAAAA
xPATx
PT
Whatever
APAAATAA

输出样例：

YES
YES
YES
YES
NO
NO
NO
NO
*/
#include <stdio.h>
#include <stdlib.h>

int main(void) {
	int number = 0;
	int i = 0;
	int j = 0;
	int flag = 0;
	int h_c = 0;
	int m_c = 0;
	int t_c = 0;
	int fflag = 0;
	int p_cc = 0;
	int t_cc = 0;

	char strlist[10][101];

	if (!scanf("%d", &number)) {
		return EXIT_FAILURE;
	}

	if (number > 10 || number < 0) {
		return EXIT_FAILURE;
	}

	for (i = 0; i < number; i++) {
		if (!scanf("%100s", strlist[i])) {
			return EXIT_FAILURE;
		}
	}

	for (i = 0; i < number; i++) {
		j = 0;
		flag = 0;
		h_c = 0;
		m_c = 0;
		t_c = 0;
		fflag = 0;
		p_cc = 0;
		t_cc = 0;

		while (strlist[i][j] != '\0') {
			if (strlist[i][j] == 'P') {
				flag = 1;
				p_cc++;
			} else if (strlist[i][j] == 'T') {
				flag = 2;
				t_cc++;
			} else if (strlist[i][j] == 'A') {
				if (flag == 0) {
					h_c++;
				} else if (flag == 1) {
					m_c++;
				} else if (flag == 2) {
					t_c++;
				}
			} else {
				fflag = 1;
			}
			j++;
		}

		if ((fflag != 1) && (p_cc == 1) && (t_cc == 1) && (m_c != 0) && t_c == (h_c * m_c)) {
			printf("YES\n");
		} else {
			printf("NO\n");
		}

	}

	return EXIT_SUCCESS;
}