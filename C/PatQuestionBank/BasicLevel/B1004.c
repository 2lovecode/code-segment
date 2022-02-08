/*
1004 成绩排名 (20)（20 分）

读入n名学生的姓名、学号、成绩，分别输出成绩最高和成绩最低学生的姓名和学号。

输入格式：每个测试输入包含1个测试用例，格式为\

  第1行：正整数n
  第2行：第1个学生的姓名 学号 成绩
  第3行：第2个学生的姓名 学号 成绩
  ... ... ...
  第n+1行：第n个学生的姓名 学号 成绩

其中姓名和学号均为不超过10个字符的字符串，成绩为0到100之间的一个整数，这里保证在一组测试用例中没有两个学生的成绩是相同的。

输出格式：对每个测试用例输出2行，第1行是成绩最高学生的姓名和学号，第2行是成绩最低学生的姓名和学号，字符串间有1空格。

输入样例：

3
Joe Math990112 89
Mike CS991301 100
Mary EE990830 95

输出样例：

Mike CS991301
Joe Math990112
*/

#include <stdio.h>
#include <stdlib.h>

struct student {
	char name[11];
	char number[11];
	int score;
} s[101];

int main(void) {
	int n;
	int i;
	int r[2][2] = {{0, 0}, {0, 0}};

	if (!scanf("%d", &n)) {
		return EXIT_FAILURE;
	}

	for (i = 0; i < n; i++) {
		if (!scanf("%s %s %d", s[i].name, s[i].number, &(s[i].score))) {
			return EXIT_FAILURE;
		}
		if (i != 0) {
			if (s[i].score > r[1][1]) {
				r[1][0] = i;
				r[1][1] = s[i].score;
			}
			if (s[i].score < r[0][1]) {
				r[0][0] = i;
				r[0][1] = s[i].score;
			}
		} else {
			r[0][1] = s[i].score;
			r[1][1] = s[i].score;
		}
	}

	for (i = 1; i >= 0; i--) {
		printf("%s %s\n", s[r[i][0]].name, s[r[i][0]].number);
	}
	return EXIT_SUCCESS;
}