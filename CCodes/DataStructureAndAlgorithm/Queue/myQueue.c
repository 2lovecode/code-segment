#include <stdlib.h>
#include "myQueue.h"

myQueue *createNewQueue() {
    myQueue *queue = NULL;
    queue = (myQueue *)malloc(sizeof(struct myQueue));
    queue->head = 0;
    queue->tail = 0;
}

bool isEmpty(myQueue *queue) {
    if (queue == NULL) {
        return true;
    }
    if ((queue->head == 0) && (queue->tail == 0)) {
        return true;
    }

    return false;
}

void enQueue(myQueue *queue, void *data) {
    qNode *newNode = NULL;

    if (queue == NULL) {
        return;
    }
    newNode = (qNode *)malloc(sizeof(struct qNode));

    if (newNode == NULL) {
        return;
    }
    
    newNode->value = data;

    if ((queue->head == 0) && (queue->tail == 0)) {
        queue->head = newNode;
        queue->tail = newNode;
        newNode->next = 0;
        newNode->prev = 0;
    } else {
        newNode->next = queue->tail->next;
        newNode->prev = queue->tail;
        queue->tail = newNode;
    }
}

void *deQueue(myQueue *queue) {
    if (queue == NULL) {
        return NULL;
    }
    if (isEmpty(queue)) {
        return NULL;
    }
    void *value = queue->head->value;

    qNode *tmp = queue->head;

    queue->head = queue->head->next;
    if (queue->head != 0) {
        queue->head->prev = 0;
    }

    free(tmp);
    return value;
}

void destroyQueue(myQueue *queue) {
    qNode *tmp = queue->head;
    qNode *now = queue->head;

    while(now) {
        tmp = now;
        now = now->next;
        free(tmp);
    }

    free(queue);
}