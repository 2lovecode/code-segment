#include <stdio.h>
#include <stdlib.h>
#include <math.h>

//打印帮助文件
void HelpDoc() {
	printf("**************************************\n");
	printf("*              支持的运算              *\n");
	printf("**************************************\n");
	printf("*    1:ADD;    2:SUB;    3:MUL       *\n");
	printf("*    4:DIV;    5:EXT;    6:SQR       *\n");
	printf("*    7:SIN;    8:COS;    9:TAN       *\n");
	printf("**************************************\n");
	printf("*   对于正弦，余弦和正切操作，参数为弧度    *\n");
	printf("**************************************\n");
}

//打印功能选择列表
void FuncList() {
	printf("运算 1: 加 ; 2: 减 ; 3: 乘 ; 4: 除 ; 5: 平方 ; 6: 开方 ; 7: 正弦; 8: 余弦; 9: 正切; 其它: 退出;\n");
}

//加法
int Add(int x, int y) {
	return x + y;
}

//减法
int Sub(int x, int y) {
	return x - y;
}

//乘法
int Mul(int x, int y) {
	return x * y;
}

//除法
int Div(int x, int y) {
	return x / y;
}

//乘方
int Ext(int x) {
	return x * x;
}

//开方
float Sqr(int x) {
	return sqrt(x);
}

//正弦
float Sin(int x) {
	return sin(x);
}

//余弦
float Cos(int x) {
	return cos(x);
}

//正切
float Tan(int x) {
	return tan(x);
}

int main () {
	int input = 1;
	int x, y;
	int back = 0;
	float backA = 0;

	//打印帮助文件
	HelpDoc();
	while (input) {
		//打印功能列表
		FuncList();
		printf("请选择:");
		if (!scanf("%d", &input)) {
			return EXIT_FAILURE;
		}

		//1-4需要2个运算值
		if (input >= 1 && input <= 4) {
			printf("请输入两个值:");
			if (!scanf("%d %d", &x, &y)) {
				return EXIT_FAILURE;
			}
		}

		//5-9需要1个运算值
		if (input >= 5 && input <= 9) {
			printf("请输入一个值:");
			if (!scanf("%d", &x)) {
				return EXIT_FAILURE;
			}
		}

		//根据选项调用不同计算方法
		switch (input) {
		case 1:
			back = Add(x, y);
			break;
		case 2:
			back = Sub(x, y);
			break;
		case 3:
			back = Mul(x, y);
			break;
		case 4:
			if (y != 0) {
				back = Div(x, y);
			}
			break;
		case 5:
			back = Ext(x);
			break;
		case 6:
			backA = Sqr(x);
			break;
		case 7:
			backA = Sin(x);
			break;
		case 8:
			backA = Cos(x);
			break;
		case 9:
			backA = Tan(x);
			break;
		default:
			printf("退出!\n");
			return EXIT_SUCCESS;
			break;
		}

		//打印结果
		if (input == 4 && y == 0) {
			printf("除数不能为0\n");
		} else if (input <= 5) {
			printf("结果: %d\n", back);
		} else {
			printf("结果: %f\n", backA);
		}
	}


	return EXIT_SUCCESS;
}
