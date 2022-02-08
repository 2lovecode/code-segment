/*
*
*	编写一个程序，把较长的输入行“折”成短一些的两行或多行
*	折行的位置在输入行的第n列之前的最后一个非空格之后。要保证
*	程序能够智能地处理输入行很长以及在指定的列前没有空格或制表
*	符时的情况
*
*	题中的第n列之前的最后一个非空格之后，该程序没有满足，只满足第n列之前最后一个字符之后。
*/

#include<stdio.h>

#define MAX_LINE_LENGTH 100
#define MAX_LINE_NUMBER 10




int myGetLine(char resStr[][MAX_LINE_LENGTH], int n, int limit);

void main ()
{
	char myStr[MAX_LINE_LENGTH];
	char resStr[MAX_LINE_NUMBER][MAX_LINE_LENGTH];

	int lineCnt, j = 0;
	int n = 4;

	while ((lineCnt = myGetLine(resStr, n, MAX_LINE_LENGTH)) > 0) {
		for (int i = 0; i <= lineCnt; i++) {
			j = 0;
			while (resStr[i][j] != '\0') {
				putchar(resStr[i][j]);
				j++;
			}
		}
	}
}

int myGetLine(char resStr[][MAX_LINE_LENGTH], int n, int limit)
{
	int c;
	int cnt = 0;
	int lineCnt = 0;

	while (((c = getchar()) != EOF) && (c != '\n') && (cnt < (limit - 1))) {
		resStr[lineCnt][cnt] = c;

		if (cnt >= (n - 2)) {
			cnt++;
			resStr[lineCnt][cnt] = '\n';
			cnt++;
			resStr[lineCnt][cnt] = '\0';
			cnt = 0;
			lineCnt++;
		} else {
			cnt++;
		}
	}

	if (c == '\n') {
		resStr[lineCnt][cnt] = '\n';
		cnt++;
	}

	resStr[lineCnt][cnt] = '\0';

	return lineCnt;
}