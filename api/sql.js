module.exports={    
    create_table : 'CREATE TABLE IF NOT EXISTS fibvalues (number INT)',
    values : 'SELECT * FROM fibvalues',
    insert : 'INSERT INTO fibvalues(number) VALUES($1)'
};