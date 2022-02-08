# 模拟数据库查询某人的详细信息:
#   private.dat 存放个人简略信息
#   job.dat     存放工作相关信息
#   family.dat  存放家庭信息
#
# 使用方式: awk -f PersonInfo.awk +姓名 private.dat
#     例如: awk -f PersonInfo.awk +阿部慎平 private.dat
#     输出要查询人的详细信息

BEGIN {
	FS = "[\t]+";
	name = option();
}
$2 == name{
	printf("%s : %s\n", "姓名", $2);
	printf("%s : %s\n", "住址", $4);
	printf("%s : %s\n", "电话", $3);
	job = $5;
	id = $1;
	printJob(job);
	printFamily(id);
	printf("%s\n", repeat("---", 8));
}
function option(opt) {
	if ((ARGC > 1)&&(ARGV[1] ~ /^+.*$/)) {
		opt = substr(ARGV[1], 2);
		delete ARGV[1];
	}
	return opt;
}
function printJob(job, n) {
	n = 0;
	while (getline < "job.dat" > 0) {
		if ($1 == job) {
			printf("公司:%s  职位:%s 电话:%s\n", $1, $2, $3);
			n++;
		}
	}
	if (n == 0) {
		print "无\n";
	}
}
function printFamily(id, n) {
	print "家庭关系\n";
	n = 0;
	while (getline < "family.dat" > 0) {
		if ($1 == id) {
			printf("关系:%s 姓名:%s\n", $3, $2);
			n++;
		}
	}
	if (n == 0) {
		print "无\n";
	}
}
function repeat(flag, time, i, str) {
	for (i=0; i<time; i++) {
		str = str flag
	}
	return str
}