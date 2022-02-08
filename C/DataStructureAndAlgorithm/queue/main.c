#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<malloc.h>

#include "my_queue.h"



int main() {
    MyAnimal *a;
    MyAnimal *b;

    MyQueue *queue;

    a = malloc(sizeof(struct MyAnimal));
    b = malloc(sizeof(struct MyAnimal));

    a->type = 1;
    a->name = "cat";

    b->type = 2;
    b->name = "dog";
    
    queue = createNewQueue();

    if (queue == NULL) {
        return EXIT_FAILURE;
    }
    
    enQueue(queue, a);
    enQueue(queue, b);

    MyAnimal *myHeadValue = (MyAnimal *)(deQueue(queue));


    printf("%d : %s\n", myHeadValue->type, myHeadValue->name);

    destroyQueue(queue);

    return EXIT_SUCCESS;
}