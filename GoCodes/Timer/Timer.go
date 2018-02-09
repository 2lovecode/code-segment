package main

import (
	"errors"
	"flag"
	"fmt"
	log "github.com/cihub/seelog"
	"github.com/garyburd/redigo/redis"
	"github.com/robfig/cron"
	"runtime"
	"strings"
	"sync"
	"time"
)

var ch chan int = make(chan int)

//声明一些全局变量
var (
	pool *redis.Pool
	redisServer   = flag.String("h", "127.0.0.1:6379", "")
	redisPassword = flag.String("p", "", "")
	redisDbName =  flag.String("db", "1", "")
)

/**
 * [timerLog description]
 * @param  {[type]} logFileName string        [description]
 * @param  {[type]} logLevel    string        [Warning Debug Error Info]
 * @param  {[type]} logContent  string        [description]
 * @return {[type]}             [description]
 */
func timerLog(logLevel string, logContent string) {
	config := `
		<seelog>
		    <outputs formatid="testSeeLog">
		        <filter levels="debug,error,info">
		            <file path="./error.log" /> 
		        </filter>
		    </outputs>
		    <formats>
		        <format id="testSeeLog" format="%Date/%Time [%LEV] %Msg%n"/>    
		    </formats>
		</seelog>
		`
	defer log.Flush()
	logger, _ := log.LoggerFromConfigAsBytes([]byte(config))
	log.ReplaceLogger(logger)
	if logLevel == "error" {
		log.Error(logContent)
	} else if logLevel == "debug" {
		log.Error(logContent)
	} else {
		log.Info(logContent)
	}

}

/**
 * 初始化一个pool
 */
func newPool(server, password string) *redis.Pool {
	return &redis.Pool{
		MaxIdle:     3,
		MaxActive:   5,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", server)
			if err != nil {
				fmt.Println("conn error:%s",err.Error())
				timerLog("error",  server+" conn error :"+err.Error())
				return nil, err
			}
			if password != "" {
				if _, err := c.Do("AUTH", password); err != nil {
					c.Close()
					fmt.Println("pass auth error :%s",err.Error())
					timerLog("error",  server+" pass auth error :"+err.Error())
					return nil, err
				}
			}
			if _, err := c.Do("SELECT", *redisDbName); err != nil {
				fmt.Println("db exists error :%s",err.Error())
				timerLog("error",  server+" db exists error :"+err.Error())
				c.Close()
				return nil, err
			}
			return c, err
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			if time.Since(t) < time.Minute {
				return nil
			}
			_, err := c.Do("PING")
			return err
		},
	}
}

var ErrValueFormatError = errors.New("bucket: value format is error,may be topic,id")
var ErrValueTypeError = errors.New("bucket: value type is error,may be number")
var lock sync.Mutex

func timerProcess(key string) (string, error) {
	lock.Lock()
	pool = newPool(*redisServer, *redisPassword)
	conn := pool.Get()
	defer func() {
		pool.Close()
		conn.Close()
		lock.Unlock()
	}()
	// conn.Do("select",*redisDbName)
	t := time.Now().Unix()
	rs, errGet := redis.Values(conn.Do("ZREVRANGEBYSCORE", key, t, 0))
	if errGet != nil {
		timerLog("error", key+":"+errGet.Error())
		return key, errGet
	}
	for _, v := range rs {
		value := string(v.([]byte))
		topicAndId := strings.Split(value, ",")
		var topic string
		var queueId string
		if len(topicAndId) == 2 {
			topic = topicAndId[0]
			queueId = topicAndId[1]
			_, errSet := conn.Do("rpush", topic, queueId)
			if errSet != nil {
				timerLog("error", key+"-"+value+":"+errSet.Error())
			} else {
				_, errDel := conn.Do("zrem", key, value)
				if errDel != nil {
					timerLog("error", key+"-"+value+":"+errDel.Error())
				}
			}

		} else {
			timerLog("error", key+"-"+value+":"+ErrValueFormatError.Error())
		}
	}
	ch <- 1
	return "success", nil
}

var dbLock sync.Mutex

func main() {
	flag.Parse()
	fmt.Println("begin")
	runtime.GOMAXPROCS(runtime.NumCPU())
	/**
	Seconds      | Yes        | 0-59            | * / , -
	Minutes      | Yes        | 0-59            | * / , -
	Hours        | Yes        | 0-23            | * / , -
	Day of month | Yes        | 1-31            | * / , - ?
	Month        | Yes        | 1-12 or JAN-DEC | * / , -
	Day of week  | Yes        | 0-6 or SUN-SAT  | * / , - ?
	**/
	c := cron.New()
	spec := "*/1 * * * * *"
	c.AddFunc(spec, func() {
		dbLock.Lock()
		pool = newPool(*redisServer, *redisPassword)
		conn := pool.Get()
		defer func() {
			pool.Close()
			conn.Close()
			dbLock.Unlock()
		}()
		// conn.Do("SELECT",*redisDbName)
		keys, errGet := redis.Values(conn.Do("keys", "DELAY_BUCKET_*"))
		// fmt.Println(keys)
		if errGet != nil {
			timerLog("error", "get keys error:"+errGet.Error())
			panic("get keys error:" + errGet.Error())
			c.Stop()
		}

		for _, k := range keys {
			key := string(k.([]byte))
			fmt.Println(key)
			go timerProcess(key)
		}

		for i := 0; i < len(keys); i++ {
			fmt.Println(i)
			<-ch
		}
	})
	c.Start()
	select {}
}