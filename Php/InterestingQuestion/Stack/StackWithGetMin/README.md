#### 题目
    实现一个特殊的栈,在实现栈基本功能的基础上,实现返回栈中最小元素的操作.
#### 要求：
    1.pop,push,getMin操作的时间复杂度为O(1)
    2.可使用现成的栈结构
    
#### 方案一
    类文件：MyStack.php
    示例文件：MyStackExample.php
    
    使用两个栈dataStack和minStack.
    
    push操作：
    假设当前压入栈的值为value.
    将value压入dataStack.
    如果dminStack为空,将value压入这个栈.
    如果minStack不为空,比较minStack栈顶元素和value的大小,如果value小,则压入minStack
    
    pop操作：
    假设要弹出的dataStack栈顶元素的值为value
    将value弹出dataStack
    如果value和minStack的栈顶元素相同,则弹出minStack栈顶元素
    
    getMin操作：
    直接返回minStack的栈顶元素
    
#### 方案二
    类文件：MyStackAnother.php
    示例文件：MyStackAnotherExample.php
    
    使用两个栈dataStack和minStack
    
    push操作：
    假设当前要压入栈的值为value.
    将value压入dataStack.
    如果minStack为空,将value压入minStack
    如果minStack不为空,若value小于minStack栈顶元素,则压入value,否则再次压入minStack栈顶元素
    
    pop操作：
    弹出dataStack栈顶元素
    弹出minStack栈顶元素
    
    getMin操作：
    直接返回minStack栈顶元素
    
    
#### 两个方案的比较
    方案一空间占用少,pop操作耗时长
    方案二pop操作快,空间占用多
    