/*
1020 月饼（25 分）

月饼是中国人在中秋佳节时吃的一种传统食品，不同地区有许多不同风味的月饼。现给定所有种类月饼的库存量、总售价、以及市场的最大需求量，请你计算可以获得的最大收益是多少。

注意：销售时允许取出一部分库存。样例给出的情形是这样的：假如我们有 3 种月饼，其库存量分别为 18、15、10 万吨，总售价分别为 75、72、45 亿元。如果市场的最大需求量只有 20 万吨，那么我们最大收益策略应该是卖出全部 15 万吨第 2 种月饼、以及 5 万吨第 3 种月饼，获得 72 + 45/2 = 94.5（亿元）。
输入格式：

每个输入包含一个测试用例。每个测试用例先给出一个不超过 1000 的正整数 N 表示月饼的种类数、以及不超过 500（以万吨为单位）的正整数 D 表示市场最大需求量。随后一行给出 N 个正数表示每种月饼的库存量（以万吨为单位）；最后一行给出 N 个正数表示每种月饼的总售价（以亿元为单位）。数字间以空格分隔。
输出格式：

对每组测试用例，在一行中输出最大收益，以亿元为单位并精确到小数点后 2 位。
输入样例：

3 20
18 15 10
75 72 45

输出样例：

94.50

需要注意的是,moon[i].total_sale * max_need / moon[i].inventory这段代码,因为涉及到浮点数运算,先计算谁对结果的正确性有影响(按说不应该这样,可能pat平台的测试用例的断言只针对一种顺序的计算).
*/

#include <stdio.h>
#include <stdlib.h>

typedef struct {
	float inventory;
	float total_sale;
	float price;
} mcake;

int my_cmp(const void *a, const void *b);

int main ()
{
	int category;
	int i = 0;
	float max = 0, max_need;
	mcake moon[1001];


	if (!scanf("%d %f", &category, &max_need)) {
		return 1;
	}

	for (i = 0; i < category; i++) {
		if (!scanf("%f", &moon[i].inventory)) {
			return 1;
		}
	}
	for (i = 0; i < category; i++) {
		if (!scanf("%f", &moon[i].total_sale)) {
			return 1;
		}
	}

	for (i = 0; i < category; i++) {
		moon[i].price = moon[i].total_sale / moon[i].inventory;
	}

	qsort(&moon, category, sizeof(mcake), my_cmp);

	for (i = 0; i < category; i++) {
		if (max_need <= 0) {
			break;
		}
		if (moon[i].inventory <= max_need) {
			max += moon[i].total_sale;
			max_need -= moon[i].inventory;
		} else {
			max += (moon[i].total_sale * max_need / moon[i].inventory);
			max_need = 0;
		}
	}

	printf("%.2f", max);

	return 0;
}

int my_cmp(const void *a, const void *b) {
	mcake *c = (mcake *)a;
	mcake *d = (mcake *)b;

	return c->price < d->price;
}