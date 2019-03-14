main : main.o myStack.o
	$(CC) -o main main.o myStack.o $(CFLAGS)

myStack.o : myStack.c
	$(CC) -c myStack.c $(CFLAGS)

.PHONY : clean

clean:
	rm -rf *.o main