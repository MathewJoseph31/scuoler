
//const mysql = require('mysql');
const pg=require('pg');
const Client=require('pg-native');



const fs = require('fs');


const configuration=require('./Configuration');
const configurationTest=require('./ConfigurationTest');



refreshTestDB=function(req,res){

  var fileStr=fs.readFileSync("./bkp_tbl_names.txt", "utf8");
  var lines = fileStr.split(/\r\n|\r|\n/);


  var pool = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port:configuration.getPort(),
    ssl:true
  });

  var client = Client();
  var connStr='postgresql://'+configurationTest.getUserId()+':'+configurationTest.getPassword()+'@'+configurationTest.getHost()+':'+configurationTest.getPort()+'/'+configurationTest.getDatabase();
  client.connectSync(connStr);

  connStr='\'host='+configuration.getHost()+' port='+configuration.getPort()+' user='+configuration.getUserId()+' password='+configuration.getPassword()+' dbname='+configuration.getDatabase()+'\'';
  var dblinkQuery='select dblink_connect(\'s3\','+connStr+')';
  client.querySync(dblinkQuery);

  for(var i=0;i<lines.length;i++){
    var tableName=lines[i];
    if(tableName=='')
      continue;
    //console.log(table_name);
    var metaQuery='select column_name, udt_name, character_maximum_length, numeric_precision, numeric_scale, table_name from information_schema.columns where table_name=$1 order by ordinal_position';
    pool.query(metaQuery, [tableName], function (err, result, fields){
      if (err) throw err;
      var tabName=result.rows[0].table_name;//tableName variable is not available in the scope
      var suffix=tabName+'(';
      var prefix='SELECT ';
      for(var i=0;i<result.rows.length;i++){
        if(i==result.rows.length-1){
          prefix+=result.rows[i].column_name;
          suffix+=result.rows[i].column_name+ ' ';
          var udt_name=result.rows[i].udt_name;
          if(udt_name.indexOf('num')!=-1){
            suffix+=udt_name+'('+result.rows[i].numeric_precision+','+result.rows[i].numeric_scale+') )';
          }
          else if(udt_name.indexOf('char')!=-1){
            suffix+=udt_name+'('+result.rows[i].character_maximum_length+') ) ';
          }
        }
        else{
          prefix+=result.rows[i].column_name+', ';
          suffix+=result.rows[i].column_name+ ' ';
          var udt_name=result.rows[i].udt_name;
          if(udt_name.indexOf('num')!=-1){
            suffix+=udt_name+'('+result.rows[i].numeric_precision+','+result.rows[i].numeric_scale+'), ';
          }
          else if(udt_name.indexOf('char')!=-1){
            suffix+=udt_name+'('+result.rows[i].character_maximum_length+'), ';
          }
        }
      }
      prefix+=' FROM '+tabName;
      dblinkQuery='CREATE TABLE temp'+tabName+' AS select * from dblink(\'s3\',\''+prefix+'\' ) AS '+suffix;
      console.log(dblinkQuery);
      client.querySync(dblinkQuery);
      dblinkQuery='DROP TABLE '+tabName;
      client.querySync(dblinkQuery);
      dblinkQuery='ALTER TABLE temp'+tabName+' RENAME TO '+tabName;
      client.querySync(dblinkQuery);
    });
  }

}

exports.refreshTestDB=refreshTestDB;

refreshTestDB();
