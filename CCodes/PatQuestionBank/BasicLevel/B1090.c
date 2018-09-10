/*
1090 危险品装箱（25 分）

集装箱运输货物时，我们必须特别小心，不能把不相容的货物装在一只箱子里。比如氧化剂绝对不能跟易燃液体同箱，否则很容易造成爆炸。

本题给定一张不相容物品的清单，需要你检查每一张集装箱货品清单，判断它们是否能装在同一只箱子里。
输入格式：

输入第一行给出两个正整数：N (≤10​4​​) 是成对的不相容物品的对数；M (≤100) 是集装箱货品清单的单数。

随后数据分两大块给出。第一块有 N 行，每行给出一对不相容的物品。第二块有 M 行，每行给出一箱货物的清单，格式如下：

K G[1] G[2] ... G[K]

其中 K (≤1000) 是物品件数，G[i] 是物品的编号。简单起见，每件物品用一个 5 位数的编号代表。两个数字之间用空格分隔。
输出格式：

对每箱货物清单，判断是否可以安全运输。如果没有不相容物品，则在一行中输出 Yes，否则输出 No。
输入样例：

6 3
20001 20002
20003 20004
20005 20006
20003 20001
20005 20004
20004 20006
4 00001 20004 00002 20003
5 98823 20002 20003 20006 10010
3 12345 67890 23333

输出样例：

No
Yes
Yes

使用快速排序和二分查找,减少程序运行时间.
*/

#include <stdio.h>
#include <stdlib.h>

int m_cmp(const void *p, const void *q);

int main ()
{
	int dui_n = 0, dan_n = 0, num_n[100];
	int dui[10000][2];
	int dan[100][1000];

	int i, j, flag = 0;

	if (!scanf("%d %d", &dui_n, &dan_n)) {
		return 1;
	}

	for (i = 0; i < dui_n; i++) {
		if (!scanf("%d %d", &dui[i][0], &dui[i][1])) {
			return 1;
		}
	}

	for (i = 0; i < dan_n; i++) {
		if (!scanf("%d", &num_n[i])) {
			return 1;
		}
		for (j = 0; j < num_n[i]; j++) {
			if (!scanf("%d", &dan[i][j])) {
				return 1;
			}
		}
		qsort(dan[i], num_n[i], sizeof(int), m_cmp);
	}

	for (j = 0; j < dan_n; j++) {
		flag = 0;
		for (i = 0; i < dui_n; i++) {
			if ((int *)bsearch(&dui[i][0], dan[j], num_n[j], sizeof(int), m_cmp) != NULL && (int *)bsearch(&dui[i][1], dan[j], num_n[j], sizeof(int), m_cmp) != NULL) {
				flag = 1;
				break;
			}
		}
		if (flag) {
			printf("No\n");
		} else {
			printf("Yes\n");
		}
	}
	return 0;
}

int m_cmp(const void *p, const void *q)
{
	int a = *(int *)p;
	int b = *(int *)q;
	return a - b;
}