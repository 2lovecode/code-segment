#include<stdio.h>

#define MAX_LINE_LENGTH 1000

/*
*
*	linux下，使用ctrl + D结束输入
*	
*	显示最大长度的输入行。
*
*/

int mygetline(char str[], int limit);
void mycopy(char fromStr[], char toStr[], int limit);


void main ()
{
	char mystr[MAX_LINE_LENGTH];
	char toStr[MAX_LINE_LENGTH];

	int max = 0;
	int len = 0;

	while ((len = mygetline(mystr, MAX_LINE_LENGTH)) > 0) {
		if (max < len) {
			max = len;
			mycopy(mystr, toStr, MAX_LINE_LENGTH);
		}
	}
	printf("\n Max Length Line is : %s\n", toStr);

}

int mygetline(char mystr[], int limit)
{
	int c;
	int lineCount = 0;

	while (((c = getchar()) != EOF) && (c != '\n') && (lineCount < (limit - 1))) {
		mystr[lineCount] = c;
		lineCount++;
	}

	if (lineCount == (limit - 1)) {
		while (((c = getchar()) != EOF) && (c != '\n'));
	}
	if (c == '\n') {
		mystr[lineCount] = '\n';
		lineCount++;
	}

	mystr[lineCount] = '\0';

	return lineCount;
}

void mycopy(char fromStr[], char toStr[], int limit)
{
	int i = 0;
	int c;

	while ((c = fromStr[i]) != '\0') {
		toStr[i] = c;
		i++;
	}

	toStr[i] = '\0';
}