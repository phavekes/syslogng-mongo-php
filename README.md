Simple web interface for displaying and searching syslog-messages in mongodb

Install apache2, php5, mongodb and syslog-ng

If you want to use text-indexing on the messages, install mongodb 2.6 or later. For Ubuntu:
'''
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

Configure syslog-ng to log to the mongo database:
```
destination mongodb { mongodb(); };
log { source(src); destination(mongodb); };
```


syslog-ng will create the mongo database for you when started.

Configure the database, In a mongo shell :
```
use syslog
db.runCommand({
    convertToCapped: 'messages',
    size: 10000000
    });
db.messages.ensureIndex( { DATE: 1}, {background: true} );
db.messages.ensureIndex( { PROGRAM: 1}, {background: true} );
db.messages.ensureIndex( { MESSAGE: "text"}, {background: true} )
db.messages.ensureIndex( { PRIORITY: 1}, {background: true} )
```

Clone into your webserver directory

```
cd /var/www/
git clone https://github.com/phavekes/syslogng-syslogng-mongo-php.git
```

Open your webpage and enjoy.

