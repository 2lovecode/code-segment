#include<stdio.h>

void swap(int *a, int *b)
{
	printf("%p, %p\n", a, b);
	*a = *a ^ *b;
	*b = *a ^ *b;
	*a = *b ^ *a;
}

void main()
{
	int a = 3;
	int b = 2;

	printf("%d, %d\n", a, b);

	swap(&a, &b);

	printf("%d, %d\n", a, b);

}