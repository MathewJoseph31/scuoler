//const mysql = require('mysql');
const pg=require('pg');
//const Client=require('pg-native');

const fs = require('fs');


const configuration=require('./Configuration');
const configurationTest=require('./ConfigurationTest');

const refreshTestDB=async function (){

		var fileStr=fs.readFileSync("./bkp_tbl_names.txt", "utf8");
		var lines = fileStr.split(/\r\n|\r|\n/);
		//lines.forEach((va)=>console.log(va));

		var pool = new pg.Pool({
			host: configuration.getHost(),
			user: configuration.getUserId(),
			password: configuration.getPassword(),
			database: configuration.getDatabase(),
			port:configuration.getPort(),
		  ssl:{rejectUnauthorized: false}
		});

		//var client = Client();
		const client = new  pg.Pool({
		  host: configurationTest.getHost(),
		  port: configurationTest.getPort(),
		  user: configurationTest.getUserId(),
		  password: configurationTest.getPassword(),
			database: configurationTest.getDatabase(),
		  ssl:{rejectUnauthorized: false}
		});

		connStr='\'host='+configuration.getHost()+' port='+configuration.getPort()+' user='+configuration.getUserId()+' password='+configuration.getPassword()+' dbname='+configuration.getDatabase()+'\'';
		var dblinkQuery='select dblink_connect(\'s3\','+connStr+')';

		//var connStr='postgresql://'+configurationTest.getUserId()+':'+configurationTest.getPassword()+'@'+configurationTest.getHost()+':'+configurationTest.getPort()+'/'+configurationTest.getDatabase();
		//client.connectSync();
		await client.query(dblinkQuery);

		for(let k=0;k<lines.length;k++){
			var tableName=lines[k];
			if(tableName=='')
				continue;
			//console.log(tableName);
			var metaQuery='select column_name, udt_name, character_maximum_length, numeric_precision, numeric_scale, table_name from information_schema.columns where table_name=$1 order by ordinal_position';
			let result=await pool.query(metaQuery, [tableName]);
			var tabName=result.rows[0].table_name;//tableName variable is not available in the scope
			var suffix=tabName+'(';
			var prefix='SELECT ';
			for(let i=0;i<result.rows.length;i++){
				if(i==result.rows.length-1){
					prefix+=result.rows[i].column_name;
					suffix+=result.rows[i].column_name+ ' ';
					var udt_name=result.rows[i].udt_name;
					if(udt_name.indexOf('num')!=-1){
						if(result.rows[i].numeric_precision==null)
							suffix+=udt_name+' )'
						else if(result.rows[i].numeric_scale==null)
							 suffix+=udt_name+'('+result.rows[i].numeric_precision+',0) )';
						else
							 suffix+=udt_name+'('+result.rows[i].numeric_precision+','+result.rows[i].numeric_scale+') )';
					}
					else if(udt_name.indexOf('char')!=-1){
						suffix+=udt_name+'('+result.rows[i].character_maximum_length+') ) ';
					}
					else//date, .. datatype
						suffix+=udt_name+')';
				}
				else{
					prefix+=result.rows[i].column_name+', ';
					suffix+=result.rows[i].column_name+ ' ';
					var udt_name=result.rows[i].udt_name;
					if(udt_name.indexOf('num')!=-1){
						if(result.rows[i].numeric_precision==null)
							 suffix+=udt_name+', '
						else if(result.rows[i].numeric_scale==null)
							 suffix+=udt_name+'('+result.rows[i].numeric_precision+',0), ';
						else
							 suffix+=udt_name+'('+result.rows[i].numeric_precision+','+result.rows[i].numeric_scale+'), ';
					}
					else if(udt_name.indexOf('char')!=-1){
						suffix+=udt_name+'('+result.rows[i].character_maximum_length+'), ';
					}
					else//date, .. datatype
						suffix+=udt_name+', ';
				}
			}
			prefix+=' FROM '+tabName;
			dblinkQuery='CREATE TABLE temp'+tabName+' AS select * from dblink(\'s3\',\''+prefix+'\' ) AS '+suffix;
			console.log(dblinkQuery);
			await client.query(dblinkQuery);

			dblinkQuery='DROP TABLE '+tabName;
			await client.query(dblinkQuery);

			dblinkQuery='ALTER TABLE temp'+tabName+' RENAME TO '+tabName;
			await client.query(dblinkQuery);
		}


}

refreshTestDB().
then(  console.log('after start') )
.catch(console.error);
