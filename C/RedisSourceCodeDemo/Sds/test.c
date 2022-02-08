#include <stdio.h>
#include <stdlib.h>
#include "sds.c"

void main () {
    char *str = "Hello World!";
    sds s = createSDS(str, strlen(str));
    printf("测试字符串:%s\n", s);
    printf("长度Len为:%ld\n", getSDSLen(s));
    printf("容量Cap为:%ld\n", getSDSCap(s));
}