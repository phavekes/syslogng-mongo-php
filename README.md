Simple web interface for displaying and searching syslog-messages in mongodb

Install apache2, php5, mongodb and syslog-ng

Configure syslog-ng:
destination mongodb { mongodb(); };
log { source(src); destination(mongodb); };

syslog-ng will create the mongo database for you when started.

Configure the database:
In an mongo shell :
use syslog
db.runCommand({
    convertToCapped: 'messages',
    size: 10000000
    });
db.messages.ensureIndex( { DATE: 1}, {background: true} );
db.messages.ensureIndex( { PROGRAM: 1}, {background: true} );
db.messages.ensureIndex( { MESSAGE: "text"}, {background: true} )
db.messages.ensureIndex( { PRIORITY: 1}, {background: true} )

Clone into your webserver directory
cd /var/www/
git clone https://github.com/phavekes/syslogng-syslogng-mongo-php.git

