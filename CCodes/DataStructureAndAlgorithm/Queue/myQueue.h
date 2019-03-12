#include <stdbool.h>
#include "myAnimal.h"

typedef struct qNode {
    void *value;
    struct qNode *prev;
    struct qNode *next;
} qNode;
typedef struct myQueue{
    struct qNode *head;
    struct qNode *tail;
} myQueue;

myQueue *createNewQueue();

bool isEmpty(myQueue *queue);

void enQueue(myQueue *queue, void *data);

void *deQueue(myQueue *queue);

void destroyQueue(myQueue *queue);