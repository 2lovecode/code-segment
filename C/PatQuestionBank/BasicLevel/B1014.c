/*
1014 福尔摩斯的约会 (20)（20 分）

大侦探福尔摩斯接到一张奇怪的字条：“我们约会吧！ 3485djDkxh4hhGE 2984akDfkkkkggEdsb s&hgsfdk d&Hyscvnm”。大侦探很快就明白了，字条上奇怪的乱码实际上就是约会的时间“星期四 14:04”，因为前面两字符串中第1对相同的大写英文字母（大小写有区分）是第4个字母'D'，代表星期四；第2对相同的字符是'E'，那是第5个英文字母，代表一天里的第14个钟头（于是一天的0点到23点由数字0到9、以及大写字母A到N表示）；后面两字符串第1对相同的英文字母's'出现在第4个位置（从0开始计数）上，代表第4分钟。现给定两对字符串，请帮助福尔摩斯解码得到约会的时间。

输入格式：

输入在4行中分别给出4个非空、不包含空格、且长度不超过60的字符串。

输出格式：

在一行中输出约会的时间，格式为“DAY HH:MM”，其中“DAY”是某星期的3字符缩写，即MON表示星期一，TUE表示星期二，WED表示星期三，THU表示星期四，FRI表示星期五，SAT表示星期六，SUN表示星期日。题目输入保证每个测试存在唯一解。

输入样例：

3485djDkxh4hhGE
2984akDfkkkkggEdsb
s&hgsfdk
d&Hyscvnm

输出样例：

THU 14:04

注意：注意下相同的字符的范围
1.A-G
2.0-9或A-N
3.A-Z或a-z
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


struct vp{
	char value;
	int pos;
};

int main ()
{
	struct vp vv[4];

	char ss[4][61];
	int i, vcnt = 0;
	char weeks[7][4] = {"MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"};

	int week, hour, minutes;

	for (i = 0; i < 4; i++) {
		if (!scanf("%s", ss[i])) {
			return EXIT_FAILURE;
		}
	}

	i = 0;
	while (ss[0][i] != '\0' && ss[1][i] != '\0') {
		if ((ss[0][i] == ss[1][i])) {
			if (vcnt < 2) {
				if ((vcnt == 0) && (ss[0][i] >= 'A' && ss[0][i] <= 'G')) {
					vv[vcnt].value = ss[0][i];
					vv[vcnt].pos = i;
					vcnt++;
				} else if ((vcnt == 1) && ((ss[0][i] >= '0' && ss[0][i] <= '9') || (ss[0][i] >= 'A' && ss[0][i] <= 'N'))) {
					vv[vcnt].value = ss[0][i];
					vv[vcnt].pos = i;
					vcnt++;
				}

			} else {
				break;
			}
		}
		i++;
	}

	i = 0;
	while (ss[2][i] != '\0' && ss[3][i] != '\0') {
		if (ss[2][i] == ss[3][i] && ss[2][i] >= 'A' && ss[3][i] <= 'z') {
			if (vcnt < 3) {
				vv[vcnt].value = ss[2][i];
				vv[vcnt].pos = i;
			} else {
				break;
			}
			vcnt++;
		}
		i++;
	}


	if (vv[0].value <= 'Z' && vv[0].value >= 'A') {
		week = vv[0].value - 'A';
	} else {
		week = vv[0].value - 'a';
	}

	if (vv[1].value >= 'A' && vv[1].value <= 'N') {
		hour = vv[1].value - 'A' + 10;
	} else if (vv[1].value >= 'a' && vv[1].value <= 'z') {
		hour = vv[1].value - 'a' + 10;
	} else {
		hour = vv[1].value - '0';
	}

	minutes = vv[2].pos;

	printf("%s%s%d%s%d", weeks[week], hour < 10 ? " 0" : " ", hour, minutes < 10 ? ":0" : ":", minutes);
	return EXIT_SUCCESS;
}