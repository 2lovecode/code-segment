#   在shell中生成日历
#   使用方式
#   awk -f thisFile +2017
#   awk -f thisFile +2017.10
#   awk -f thisFile +2017.10.10
#
function whichWeek(y, m, d, s) {
        s = 0
        if (((y%4 == 0) && (y%100 != 0)) || (y%400 == 0)) if (M[2] == 28) M[2]++
        if (y>0) s += --y + int(y/4) - int(y/100) + int(y/400)
        while (m > 1) s += M[--m]
        return (s+d)%7
}

function printCalendar(y, m, d, nowWeek, i){
	printf("%d%s %d%s\n", y, "年", m, "月")
	print "日 一 二 三 四 五 六 "
	printf("%s", repeat(" ", ((nowWeek+1)%7)*3))
	for (i=1; i<=M[m]; i++) {
		if ((nowWeek+i) % 7 != 6) {
			printf("%2d ", i)
		} else {
			printf("%2d \n", i)
		}
	}
	print "\n"
}
function repeat(flag, time, i, str){
	for (i=0; i<time; i++) {
		str = str flag
	}

	return str
}
function option(opt) {
	if (ARGC > 1 && ARGV[1] ~ /^\+.*$/) {
		print ARGC, ARGV[1]
		opt = substr(ARGV[1], 2)
		delete ARGV[1]
	}
	return opt
}
BEGIN {
	M[1] = 31
	M[2] = 28
	M[3] = 31
	M[4] = 30
	M[5] = 31
	M[6] = 30
	M[7] = 31
	M[8] = 31
	M[9] = 30
	M[10] = 31
	M[11] = 30
	M[12] = 31
	W[0] = "日"
	W[1] = "一"
	W[2] = "二"
	W[3] = "三"
	W[4] = "四"
	W[5] = "五"
	W[6] = "六"
	split(option(), date, ".")
	nowWeek = whichWeek(date[1]+0, date[2]+0, date[3]+0)
	if (date[3] != "") {
		print "星期" W[nowWeek]
	} else if (date[2] != "") {
		printCalendar(date[1]+0, date[2]+0, M[date[2]], nowWeek)
	} else {
		for (j=1; j<=12; j++) {
			printCalendar(date[1]+0, j, M[i], whichWeek(date[1]+0, j, 0))
		}
	}
}