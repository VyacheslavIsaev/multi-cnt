module.exports={
    create_table : 'CREATE TABLE IF NOT EXISTS values (number INT)',
    values : 'SELECT * FROM values',
    insert : 'INSERT INTO values(number) VALUES($1)'
};