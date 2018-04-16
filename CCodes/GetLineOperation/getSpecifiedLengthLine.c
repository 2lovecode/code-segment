/*
*
*	获取任意长度的输入行
*
*
*
*
*/

#include<stdio.h>


#define MAX_LINE_LENGTH 1000
#define MAX_LINE_NUMBER 100

int myGetLine(char myStr[], int lengthLimit);
void myCopy(char fromStr[], char toStr[]);

void main (int argc, char **argv)
{
	int speLength = 0;
	int curLen = 0;
	int sumLen = 0;

	char myStr[MAX_LINE_LENGTH];
	char resStr[MAX_LINE_NUMBER][MAX_LINE_LENGTH];

	if (argc > 1) {
		speLength = argv[1][0] - '0';
	}

	while ((curLen = myGetLine(myStr, MAX_LINE_LENGTH)) > 0) {

		if (curLen == (speLength + 1)) {
			myCopy(myStr, resStr[sumLen]);
			sumLen++;
		}
	}

	printf("\nLength %d Strings:\n", speLength);

	for (int i = 0; i < sumLen; i++) {
		printf("\t(%d) : %s", i+1, resStr[i]);
	}
}

int myGetLine (char myStr[], int lengthLimit)
{
	int c;
	int countNum = 0;

	while (((c = getchar()) != EOF) && (c != '\n') && (countNum < (lengthLimit - 1))) {
		myStr[countNum] = c;
		countNum++;
	}

	if (countNum >= (lengthLimit - 1)) {
		while (((c = getchar()) != EOF) && (c != '\n'));
	}

	if (c == '\n') {
		myStr[countNum] = c;
		countNum++;
	}

	myStr[countNum] = '\0';

	return countNum;
}

void myCopy(char fromStr[], char toStr[])
{
	int c;
	int offset = 0;

	while ((c = fromStr[offset]) != '\0') {
		toStr[offset] = c;
		offset++;
	}

	toStr[offset] = '\0';
}