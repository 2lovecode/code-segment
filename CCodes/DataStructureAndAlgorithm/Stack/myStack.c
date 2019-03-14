#include<stdlib.h>
#include "myStack.h"

myStack *createMyStack() {
    myStack *ms = malloc(sizeof(struct myStack));

    if (ms == NULL) {
        return NULL;
    }

    ms->top = 0;

    return ms;
}

void myPush(myStack *ms, int value) {
    sNode *n = malloc(sizeof(struct sNode));
    if (n == NULL) {
        return;
    }

    n->value = value;

    if (isEmpty(ms)) {
        n->prev = 0;
    } else {
        n->prev = ms->top;
    }

    ms->top = n;
}

int myPop(myStack *ms) {
    if (!isEmpty(ms)) {
        int value = ms->top->value;
        sNode *tmp = ms->top;
        ms->top = ms->top->prev;
        free(tmp);
        return value;
    } else {
        return -1;
    }
}

int isEmpty(myStack *ms) {
    return ms->top == 0;
}

void destroyMyStack(myStack *ms) {
    sNode *tmp = ms->top;
    sNode *current = ms->top;
    while(current) {
        tmp = current;
        current = current->prev;
        free(tmp);
    }
    free(ms);
}