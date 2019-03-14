typedef struct sNode {
    struct sNode *prev;
    int value;
} sNode;

typedef struct myStack {
    sNode *top;
} myStack;

myStack *createMyStack();

void myPush(myStack *ms, int value);

int myPop(myStack *ms);

int isEmpty(myStack *ms);

void destroyMyStack(myStack *ms);
