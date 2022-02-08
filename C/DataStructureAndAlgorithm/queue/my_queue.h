#include <stdbool.h>
#include "my_animal.h"

typedef struct QNode {
    void *value;
    struct QNode *prev;
    struct QNode *next;
} QNode;

typedef struct MyQueue{
    struct QNode *head;
    struct QNode *tail;
} MyQueue;

MyQueue *createNewQueue();

bool isEmpty(MyQueue *queue);

void enQueue(MyQueue *queue, void *data);

void *deQueue(MyQueue *queue);

void destroyQueue(MyQueue *queue);