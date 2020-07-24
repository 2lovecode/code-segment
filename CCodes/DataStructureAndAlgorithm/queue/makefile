main : main.o myQueue.o
	$(CC) -o main main.o myQueue.o $(CFLAGS)

main.o : main.c myQueue.h
	$(CC) -c main.c

myQueue.o : myQueue.c myQueue.h
	$(CC) -c myQueue.c

.PHONY : clean

clean : 
	rm *.o main