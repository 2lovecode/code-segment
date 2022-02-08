#include <inttypes.h>
#include <sys/types.h>
#include <malloc.h>
#include <string.h>

#define SDS_TYPE_16 1
#define SDS_TYPE_32 2


//模拟redis的简单动态字符串SDS
typedef char *sds;

//sizeof(struct sdsdy16)是sdsdy16的header长度.

//16位类型
//__attribute__ ((__packed__)) 去除对齐,节省空间.
struct __attribute__ ((__packed__)) sdsdy16 {
    uint16_t cap;//SDS容量
    uint16_t len;//SDS当前长度
    unsigned char type;//当前SDS的类型sdsdy16 or sdsdy32
    char buf[];//字符串
};

//32位类型
struct __attribute__ ((__packed__)) sdsdy32 {
    uint32_t cap;
    uint32_t len;
    unsigned char type;
    char buf[];
};

//定义的宏,可以用它代替createSDS中71和78行的代码
#define SDS_VAR(T, s) struct sdsdy##T *sh = (void *)((s) - (sizeof(struct sdsdy##T)))

//inline 内连函数[编译时将调有替换为相应的代码,减少调用函数的开销], static可以保证在不同编译优化等级(-O参数)下都能替换
static inline char judgeSDSType(size_t initLen) {
    if (initLen < 1<<16) {
        return SDS_TYPE_16;
    }    
    return SDS_TYPE_32;
}

static inline int calcSDSHeaderLen(char type) {
    switch (type) {
        case SDS_TYPE_16:
            return sizeof(struct sdsdy16);
        case SDS_TYPE_32:
            return sizeof(struct sdsdy32);
    }
}
sds createSDS(const char *str, size_t initLen) {
    //根据字符串长度选择不同类型(initLen)
    char type = judgeSDSType(initLen);
    //根据type计算Header长度
    int headerLen = calcSDSHeaderLen(type);

    sds s;

    void *sh;
    //一个SDS占用的空间是header长度(headerLen) + 字符串长度(initLen) + 1(最后需要添加一个'\0'结尾)
    sh = malloc(headerLen + initLen + 1);
    if (sh == NULL) 
        return NULL;

    //sds字符串指针
    s = (char *)sh + headerLen;

    //需要给header中的3个属性赋值.
    switch (type) {
        case SDS_TYPE_16: {
            struct sdsdy16 *sh = (void *)(s - sizeof(struct sdsdy16));//可用宏SDS_VAR代替
            sh->cap = initLen;
            sh->len = initLen;
            sh->type = type;
            break;
        }
        case SDS_TYPE_32: {
            struct sdsdy32 *sh = (void *)(s - sizeof(struct sdsdy32));//可用宏SDS_VAR代替
            sh->cap = initLen;
            sh->len = initLen;
            sh->type = type;
            break;
        }
    }
    
    //把字符串放到内存中
    if (str && initLen) {
        memcpy(s, str, initLen);
    }

    return s;
}

//获取当前长度
size_t getSDSLen(sds s) {
    unsigned char type = s[-1];
    switch (type & 7) {
        case SDS_TYPE_16 : {
            return ((struct sdsdy16 *)(s - sizeof(struct sdsdy16)))->len;
            break;
        }
        case SDS_TYPE_32 : {
            return ((struct sdsdy32 *)(s - sizeof(struct sdsdy32)))->len;
            break;
        }
    }
}

//获取当前容量
size_t getSDSCap(sds s) {
    unsigned char type = s[-1];
    switch (type & 7) {
        case SDS_TYPE_16 : {
            return ((struct sdsdy16 *)(s - sizeof(struct sdsdy16)))->cap;
            break;
        }
        case SDS_TYPE_32 : {
            return ((struct sdsdy32 *)(s - sizeof(struct sdsdy32)))->cap;
            break;
        }
    }
}
