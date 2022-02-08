# str.dat中的字符串,按字典dict中指定的替换内容,进行交互式替换
# Y-替换
# A-替换当前及之后出现的行
# I-不替换，之后出现的也不替换
# 其它-不替换
# 使用: awk -f InterActiveStrReplace.awk str.dat

BEGIN {
	i = 0;
	while (getline < "dict" > 0) {
		source[i] = $1;
		destination[i] = $2;
		i++;
	}
}
{
	for (i in source) {
		if (i in all) {
			gsub(source[i], destination[i], $0);
			continue;
		}
		head = ""
		tail = $0;
		while (idx = index(tail, source[i])) {
			tbuf = tail;
			sub(source[i], "\033[41m&\033[0m", tbuf);
			printf("%4d : %s%s\n", NR, head, tbuf);
			printf("[%s] -> [%s] (Yes/No/All/Ignore): ", source[i], destination[i]);
			getline q < "/dev/stdin";
			if (q ~ /^[yY]/) {
				sub(source[i], destination[i], tail);
				head = head substr(tail, 1, idx+length(destination[i]));
				tail = substr(tail, idx+length(destination[i])+1);
			} else if (q ~ /^[aA]/) {
				gsub(source[i], destination[i], tail);
				all[i] = source[i];
				break;
			} else if (q ~ /^[iI]/) {
				delete source[i];
				break;
			} else {
				head = head substr(tail, 1, idx + length(source[i]));
				tail = substr(tail, idx + length(source[i]) + 1);
			}
		}
		$0 = head tail;
	}
	print $0 > "replace.out";
}