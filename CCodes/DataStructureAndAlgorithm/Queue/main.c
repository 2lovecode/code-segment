#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<malloc.h>

#include "myQueue.h"



int main() {
    myAnimal *a;
    myAnimal *b;

    myQueue *queue;

    a = malloc(sizeof(struct myAnimal));
    b = malloc(sizeof(struct myAnimal));

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

    myAnimal *myHeadValue = (myAnimal *)(deQueue(queue));


    printf("%d : %s\n", myHeadValue->type, myHeadValue->name);

    destroyQueue(queue);

    return EXIT_SUCCESS;
}