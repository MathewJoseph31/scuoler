const pg = require("pg");
//const Client=require('pg-native');

const fs = require("fs");

const configuration = require("./Configuration");
const configurationTest = require("./ConfigurationTest");

const refreshDb = async () => {
  var fileStr = fs.readFileSync("./bkp_tbl_names.txt", "utf8");
  var lines = fileStr.split(/\r\n|\r|\n/);
  //lines.forEach((va) => console.log(va));

  var poolDest = new pg.Pool({
    host: configuration.getHost(),
    user: configuration.getUserId(),
    password: configuration.getPassword(),
    database: configuration.getDatabase(),
    port: configuration.getPort(),
    ssl: { rejectUnauthorized: false },
  });

  const poolSource = new pg.Pool({
    host: configurationTest.getHost(),
    port: configurationTest.getPort(),
    user: configurationTest.getUserId(),
    password: configurationTest.getPassword(),
    database: configurationTest.getDatabase(),
    ssl: { rejectUnauthorized: false },
  });

  for (let k = 0; k < lines.length; k++) {
    var tableName = lines[k];
    if (!tableName) continue;

    let metaQuery = `select column_name, udt_name, 
    character_maximum_length, 
    numeric_precision, numeric_scale, table_name 
    from information_schema.columns 
    where table_name=$1 order by ordinal_position`;

    let result = await poolDest.query(metaQuery, [tableName.trim()]);
    let tabName = result.rows[0].table_name; //tableName variable is not available in the scope
    let suffix = "insert into " + tabName + "(";
    let suffix1 = " values (";
    let prefix = "SELECT ";
    let columnNames = [];
    for (let i = 0; i < result.rows.length; i++) {
      columnNames.push(result.rows[i].column_name);
      if (i == result.rows.length - 1) {
        prefix += result.rows[i].column_name;
        suffix += result.rows[i].column_name + ") ";
        suffix1 += "$" + (i + 1) + ") ";
      } else {
        prefix += result.rows[i].column_name + ", ";
        suffix += result.rows[i].column_name + ", ";
        suffix1 += "$" + (i + 1) + ", ";
      }
    }
    prefix += " FROM " + tabName + "  ";

    let insertQuery = suffix + suffix1;

    poolSource.query(prefix, function (err, result, fields) {
      if (err) return;
      let i = 0;
      for (i = 0; i < result.rows.length; i++) {
        let valArray = columnNames.map((val) => {
          return result.rows[i][val];
        });
        poolDest
          .query(insertQuery, valArray)
          .then()
          .catch((err) => {
            console.log(insertQuery, valArray);
            console.log(err);
            process.exit(1);
          });
        //console.log(columnNames);
      }
    });

    /*console.log(suffix);
    console.log(suffix1);
    console.log(prefix);
    console.log(columnNames);*/
  }
};

refreshDb().then();
