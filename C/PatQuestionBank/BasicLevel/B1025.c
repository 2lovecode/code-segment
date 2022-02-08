/**
1025 反转链表 （25 分）

给定一个常数 K 以及一个单链表 L，请编写程序将 L 中每 K 个结点反转。例如：给定 L 为 1→2→3→4→5→6，K 为 3，则输出应该为 3→2→1→6→5→4；如果 K 为 4，则输出应该为 4→3→2→1→5→6，即最后不到 K 个元素不反转。
输入格式：

每个输入包含 1 个测试用例。每个测试用例第 1 行给出第 1 个结点的地址、结点总个数正整数 N (≤10​5​​)、以及正整数 K (≤N)，即要求反转的子链结点的个数。结点的地址是 5 位非负整数，NULL 地址用 −1 表示。

接下来有 N 行，每行格式为：

Address Data Next

其中 Address 是结点地址，Data 是该结点保存的整数数据，Next 是下一结点的地址。
输出格式：

对每个测试用例，顺序输出反转后的链表，其上每个结点占一行，格式与输入相同。
输入样例：

00100 6 4
00000 4 99999
00100 1 12309
68237 6 -1
33218 3 00000
99999 5 68237
12309 2 33218

输出样例：

00000 4 33218
33218 3 12309
12309 2 00100
00100 1 99999
99999 5 68237
68237 6 -1

*/


/*
审题需要注意的地方:
1.输入的N个节点中有无效的节点,即从起始位置开始,通过next遍历,有些节点不在链表上,无效节点需要舍去.
2.[每 K 个结点反转]:把链表分成组,每组中有K个节点,反转发生在每一个组内.
3.[最后不到 K 个元素不反转]:有两种情况,一种是链表总长度不足K,不反转;另一种是按每组K个节点分组,链表最后一组节点数不足K,这一组不反转.
*/

#include <stdio.h>
#include <stdlib.h>

typedef struct {
	int addr;
	int data;
	int next;
} node;

int main ()
{
	node map[100000];
	node rightMap[100000];
	node rMap[100000];

	int root, num, k, num_right = 0, tn, nn = 0;
	int addr, data, next;
	int i, tt;
	int cur;

	if (!scanf("%d %d %d", &root, &num, &k)) {
		return 1;
	}

	for (i = 0; i < num; i++) {
		if (!scanf("%d %d %d", &addr, &data, &next)) {
			return 1;
		}
		map[addr].addr = addr;
		map[addr].data = data;
		map[addr].next = next;
	}

	cur = root;
	while (cur != -1) {
		rightMap[num_right++] = map[cur];
		cur = map[cur].next;
	}

	tt = 0;
	tn = num_right;

	while (tn >= k) {
		tt++;
		if (tt % k == 0) {
			for (i = tt - 1; i >= tt - k; i--) {
				rMap[nn++] = rightMap[i];
			}
			tn -= k;
		}
	}

	for (i = tt; i < num_right; i++) {
		rMap[nn++] = rightMap[i];
	}

	for (i = 0; i < num_right - 1; i++) {
		printf("%05d %d %05d\n", rMap[i].addr, rMap[i].data, rMap[i+1].addr);
	}
	printf("%05d %d -1\n", rMap[i].addr, rMap[i].data);
	return 0;
}