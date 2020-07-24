#include <stdlib.h>
#include "my_queue.h"

myQueue *createNewQueue() {
    MyQueue *queue = NULL;
    queue = (MyQueue *)malloc(sizeof(struct MyQueue));
    queue->head = 0;
    queue->tail = 0;
}

bool isEmpty(MyQueue *queue) {
    if (queue == NULL) {
        return true;
    }
    if ((queue->head == 0) && (queue->tail == 0)) {
        return true;
    }

    return false;
}

void enQueue(MyQueue *queue, void *data) {
    QNode *newNode = NULL;

    if (queue == NULL) {
        return;
    }
    newNode = (QNode *)malloc(sizeof(struct QNode));

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

void *deQueue(MyQueue *queue) {
    if (queue == NULL) {
        return NULL;
    }
    if (isEmpty(queue)) {
        return NULL;
    }
    void *value = queue->head->value;

    QNode *tmp = queue->head;

    queue->head = queue->head->next;
    if (queue->head != 0) {
        queue->head->prev = 0;
    }

    free(tmp);
    return value;
}

void destroyQueue(MyQueue *queue) {
    QNode *tmp = queue->head;
    QNode *now = queue->head;

    while(now) {
        tmp = now;
        now = now->next;
        free(tmp);
    }

    free(queue);
}