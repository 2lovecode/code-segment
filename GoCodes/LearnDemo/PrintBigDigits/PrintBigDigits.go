package main

import (
	"fmt"
	"os"
)

var bigDigits = [][]string{
	{
		"  000  ",
		" 0   0 ",
		"0     0",
		"0     0",
		"0     0",
		" 0   0 ",
		"  000  ",
	},
	{
		" 1 ",
		"11 ",
		" 1 ",
		" 1 ",
		" 1 ",
		" 1 ",
		"111",
	},
	{
		" 222 ",
		"2   2",
		"    2",
		"   2 ",
		"  2  ",
		"2    ",
		"22222",
	},
	{
		" 333 ",
		"3   3",
		"    3",
		"  33 ",
		"    3",
		"3   3",
		" 333 ",
	},
	{
		"    4  ",
		"   44  ",
		"  4 4  ",
		"4   4  ",
		" 444444",
		"    4  ",
		"    4  ",
	},
	{
		"55555",
		"5    ",
		"5    ",
		"555  ",
		"    5",
		"5   5",
		"555  ",
	},
	{
		"6666 ",
		"6    ",
		"6    ",
		"6666 ",
		"6   6",
		"6   6",
		"6666 ",
	},
	{
		"77777 ",
		"     7",
		"    7 ",
		"   7  ",
		"  7   ",
		" 7    ",
		"7     ",
	},
	{
		" 888 ",
		"8   8",
		"8   8",
		" 888 ",
		"8   8",
		"8   8",
		" 888 ",
	},
	{
		" 9999",
		"9   9",
		"9   9",
		" 9999",
		"    9",
		"    9",
		" 9999",
	},
}

func main() {
	if len(os.Args) == 1 {
		os.Exit(1)
	}
	stringOfDigits := os.Args[1]
	for row := range bigDigits[0] {
		line := ""
		for number := range stringOfDigits {
			numberIndex := stringOfDigits[number] - '0'
			line += bigDigits[numberIndex][row] + "   "
		}
		fmt.Println(line)
	}
}
