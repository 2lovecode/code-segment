/*
1088 三人行（20 分）

子曰：“三人行，必有我师焉。择其善者而从之，其不善者而改之。”

本题给定甲、乙、丙三个人的能力值关系为：甲的能力值确定是 2 位正整数；把甲的能力值的 2 个数字调换位置就是乙的能力值；甲乙两人能力差是丙的能力值的 X 倍；乙的能力值是丙的 Y 倍。请你指出谁比你强应“从之”，谁比你弱应“改之”。
输入格式：

输入在一行中给出三个数，依次为：M（你自己的能力值）、X 和 Y。三个数字均为不超过 1000 的正整数。
输出格式：

在一行中首先输出甲的能力值，随后依次输出甲、乙、丙三人与你的关系：如果其比你强，输出 Cong；平等则输出 Ping；比你弱则输出 Gai。其间以 1 个空格分隔，行首尾不得有多余空格。

注意：如果解不唯一，则以甲的最大解为准进行判断；如果解不存在，则输出 No Solution。
输入样例 1：

48 3 7

输出样例 1：

48 Ping Cong Gai

输入样例 2：

48 11 6

输出样例 2：

No Solution

注意浮点运算
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int m_r(int a);
char *m_cmp(float my, float ot);

int main ()
{
	float my, x, y;

	int min = 10, max = 99;

	int i, flag = 0;

	float jia, yi, bing, cha;

	if (!scanf("%f %f %f", &my, &x, &y)) {
		return 1;
	}

	for (i = max; i >= min; i--) {
		jia = i;
		yi = m_r(jia);

		if (jia > yi) {
			cha = jia - yi;
		} else {
			cha = yi - jia;
		}


		bing = cha / x;
		if (bing * y == yi) {
			flag = 1;
			break;
		}

	}

	if (flag) {
		printf("%.0f %s %s %s", jia, m_cmp(my, jia), m_cmp(my, yi), m_cmp(my, bing));
	} else {
		printf("No Solution");
	}
	return 0;
}

int m_r(int a)
{
	int sum = 0;

	sum = a % 10 * 10 + a / 10;

	return sum;
}

char *m_cmp(float my, float ot)
{
	char *s;
	s = (char *)malloc(6);

	if (ot > my) {
		strcpy(s, "Cong");
	} else if (ot < my) {
		strcpy(s, "Gai");
	} else {
		strcpy(s, "Ping");
	}

	return s;
}