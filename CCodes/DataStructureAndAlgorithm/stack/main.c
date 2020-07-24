#include <stdio.h>
#include <stdlib.h>
#include "myStack.h"


void main () {
    myStack *ms = NULL;

    ms = createMyStack();

    myPush(ms, 1);
    myPush(ms, 2);
    myPush(ms, 3);

    while(!isEmpty(ms)) {
        printf("---%d\n", myPop(ms));
    }

    destroyMyStack(ms);
}