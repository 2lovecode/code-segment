#include <stdio.h>
#include <stdlib.h>

/*
*   给定一个正整数,实现一个方法来求出离该整数最近的大于自身的“换位数”.
*   例如 12345 -> 12354
*   12354 -> 12435      12435->12453
*/

#define NUMBER_MAX_DIGITS 10

int main(void) {
	char c, tmp;
	char num[NUMBER_MAX_DIGITS];
	int cLength = 0, i, j, rLocation, bigLoc;

	while ((c = getchar()) != '\n') {
		num[cLength++] = c;
	}

	//1.寻找最大逆序
	rLocation = cLength - 1;
	for (i = cLength - 1; i > 0; i--) {
		if (num[i-1] > num[i]) {
			rLocation = i - 1;
		} else {
			break;
		}
	}
	//2.逆序的前一个和逆序中刚好大于它的值互换
	bigLoc = rLocation;
	for (i = rLocation; i < cLength; i++) {
		if (num[i] > num[rLocation - 1] && num[i] < num[bigLoc]) {
			bigLoc = i;
		}
	}

	tmp = num[rLocation - 1];
	num[rLocation - 1] = num[bigLoc];
	num[bigLoc] = tmp;

	printf("%s\n", num);

	//3.逆序重排为顺序

	for (i = rLocation; i < cLength; i++) {
		for (j = rLocation; j < cLength - 1 - i + rLocation; j++) {
			if (num[j] > num[j+1]) {
				tmp = num[j];
				num[j] = num[j+1];
				num[j+1] = tmp;
			}
		}
	}
	printf("%s\n", num);

}