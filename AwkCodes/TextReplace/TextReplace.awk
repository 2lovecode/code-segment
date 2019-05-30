BEGIN {
    FS = "|";
    i = 0;
    while (getline < "dict" > 0) {
        s[i] = $1;
        d[i] = $2;
        i++;
    }
}
{
    for (i in s) {
    }
}