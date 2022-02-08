#include <stdio.h>
#include <stdlib.h>

#define MAX_LEVEL 20
#define SKIPLIST_P  0.25

typedef struct SkipListLevel {
    struct SkipListNode *forward;
} SkipListLevel;

typedef struct SkipListNode {
    int value;
    struct SkipListNode *backward;
    SkipListLevel level[];
} SkipListNode;

typedef struct SkipList {
    SkipListNode *head, *tail;
    unsigned int totalLevel;
} SkipList;

SkipListNode *CreateSkipListNode(int level, int value) {
    SkipListNode *node = malloc(sizeof(SkipList) + level * sizeof(struct SkipListLevel));
    node->value = value;
    return node;
}

SkipList *CreateSkipList() {
    SkipList *list = malloc(sizeof(SkipList));

    list->totalLevel = 1;
    list->head = CreateSkipListNode(MAX_LEVEL, 0);
    for (int j = 0; j < MAX_LEVEL; j++) {
        list->head->level[j].forward = NULL;
    }
    list->tail = NULL;
    return list;
}

/**
 *
 *
 *
 */
int RandomLevel(void) {
    int level = 1;
    while ((random()&0xFFFF) < (SKIPLIST_P * 0xFFFF)) {
        level += 1;
    }
    return (level < MAX_LEVEL) ? level : MAX_LEVEL;
}

//添加一个节点
SkipListNode *Insert(SkipList *skipL, int value) {
    SkipListNode *update[MAX_LEVEL], *tmp, *node;
    int level, i;

    tmp = skipL->head;
    for (i = skipL->totalLevel - 1; i >= 0; i--) {
        while (tmp->level[i].forward && tmp->level[i].forward->value < value) {
            tmp = tmp->level[i].forward;
        }
        update[i] = tmp;
    }

    level = RandomLevel();

    if (level > skipL->totalLevel) {
        for (i = skipL->totalLevel; i < level; i++) {
            update[i] = skipL->head;
        }
        skipL->totalLevel = level;
    }

    node = CreateSkipListNode(level, value);
    for (i = 0; i < level; i++) {
        node->level[i].forward = update[i]->level[i].forward;
        update[i]->level[i].forward = node;
    }

    node->backward = (update[0] == skipL->head) ? NULL : update[0];

    if (node->level[0].forward) {
        node->level[0].forward->backward = node;
    } else {
        skipL->tail = node;
    }
    return node;
}


//查找
int Find(SkipList *skipL, int value) {
    int i;
    SkipListNode *start, *stop;

    start = skipL->head;
    for (i = skipL->totalLevel - 1; i >= 0; i--) {
        while (start->level[i].forward && start->level[i].forward->value < value) {
            start = start->level[i].forward;
        }
        stop = start->level[i].forward;
    }

    if (start->value == value) {
        return 1;
    }
    while (start != stop) {
        if (start->level[0].forward->value == value) {
            return 1;
        }
        start = start->level[0].forward;
    }

    return -1;
}

int main() {
    SkipList *list;
    int insertData[7] = {76, 90, 2, 4, 67, 1, 4};
    int testData[5] = {4, 5, 6, 76, 1};

    list = CreateSkipList();

    for (int i = 0; i < 7; i++) {
        Insert(list, insertData[i]);
    }

    for (int i = 0; i < 5; i++) {
        printf("%d : %d\n", testData[i], Find(list, testData[i]));
    }

}