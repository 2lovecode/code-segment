/*
1018 锤子剪刀布 (20)（20 分）

大家应该都会玩“锤子剪刀布”的游戏：两人同时给出手势，胜负规则如图所示：

现给出两人的交锋记录，请统计双方的胜、平、负次数，并且给出双方分别出什么手势的胜算最大。

输入格式：

输入第1行给出正整数N（<=10^5^），即双方交锋的次数。随后N行，每行给出一次交锋的信息，即甲、乙双方同时给出的的手势。C代表“锤子”、J代表“剪刀”、B代表“布”，第1个字母代表甲方，第2个代表乙方，中间有1个空格。

输出格式：

输出第1、2行分别给出甲、乙的胜、平、负次数，数字间以1个空格分隔。第3行给出两个字母，分别代表甲、乙获胜次数最多的手势，中间有1个空格。如果解不唯一，则输出按字母序最小的解。

输入样例：

10
C J
J B
C B
B B
B C
C C
C B
J B
B C
J J

输出样例：

5 3 2
2 3 5
B B

*/
#include <stdio.h>
#include <stdlib.h>

struct people{
	int win;
	int draw;
	int lose;
	int winc[3];
};

int main ()
{
	int number, j, i, jmax, ymax;
	char jc, yc, jmaxc, ymaxc;
	struct people jia = {0, 0, 0, {0, 0, 0}};
	struct people yi = {0, 0, 0, {0, 0, 0}};

	if (!scanf("%d", &number)) {
		return EXIT_FAILURE;
	}
	for (j = 0; j < number; j++) {
		if (!scanf("\n%c %c", &jc, &yc)) {
			return EXIT_FAILURE;
		}
		switch (jc) {
			case 'C':
				switch (yc) {
					case 'C':
						jia.draw++;
						yi.draw++;
						break;
					case 'J':
						jia.win++;
						yi.lose++;
						jia.winc[1]++;
						break;
					case 'B':
						jia.lose++;
						yi.win++;
						yi.winc[0]++;
						break;
				}
				break;
			case 'J':
				switch (yc) {
					case 'C':
						jia.lose++;
						yi.win++;
						yi.winc[1]++;
						break;
					case 'J':
						jia.draw++;
						yi.draw++;
						break;
					case 'B':
						jia.win++;
						jia.winc[2]++;
						yi.lose++;
						break;
				}
				break;
			case 'B':
				switch (yc) {
					case 'C':
						jia.win++;
						jia.winc[0]++;
						yi.lose++;
						break;
					case 'J':
						jia.lose++;
						yi.win++;
						yi.winc[2]++;
						break;
					case 'B':
						jia.draw++;
						yi.draw++;
						break;
				}
				break;
		}
	}

	jmax = 0;
	jmaxc = 'B';
	for (i = 0; i < 3; i++) {
		if (jia.winc[i] > jmax) {
			jmax = jia.winc[i];
			switch (i) {
			case 0:
				jmaxc = 'B';
				break;
			case 1:
				jmaxc = 'C';
				break;
			case 2:
				jmaxc = 'J';
				break;
			}
		}
	}

	ymax = 0;
	ymaxc = 'B';
	for (i = 0; i < 3; i++) {
		if (yi.winc[i] > ymax) {
			ymax = yi.winc[i];
			switch (i) {
				case 0:
					ymaxc = 'B';
					break;
				case 1:
					ymaxc = 'C';
					break;
				case 2:
					ymaxc = 'J';
					break;
			}
		}
	}
	printf("%d %d %d\n", jia.win, jia.draw, jia.lose);
	printf("%d %d %d\n", yi.win, yi.draw, yi.lose);
	printf("%c %c\n", jmaxc, ymaxc);
	return EXIT_SUCCESS;
}