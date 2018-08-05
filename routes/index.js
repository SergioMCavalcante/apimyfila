const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/myfila';

/* GET home page. */
//router.get('/', function(req, res, next) {
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/usuario', (req, res, next) => {

  console.log("Buscando usuarios");

  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM usuario ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/usuario_email/:usuario_email', (req, res, next) => {

  console.log("Verifcando se email existe");

  const results = [];
  // Grab data from the URL parameters
  const email = req.params.usuario_email;

  console.log("Email API: " + email);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM usuario WHERE email=($1)', [email]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/usuario/:usuario_id', (req, res, next) => {

  console.log("Buscando 1 usuario");

  const results = [];
  // Grab data from the URL parameters
  const id = req.params.usuario_id;

  console.log("ID API: " + id);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM usuario WHERE id=($1)', [id]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


router.get('/med', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM medicos ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/usuario', (req, res, next) => {

  console.log("Cadastrando usuario");

  const results = [];
  // Grab data from http request
  const data = {nome: req.body.nome, email: req.body.email, data_nasc: req.body.data_nasc, 
                password: req.body.password, telefone: req.body.telefone};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO usuario (nome, email, data_nasc, password, telefone) values($1, $2, $3, $4, $5)',
    [data.nome, data.email, data.data_nasc, data.password, data.telefone]);

    // SQL Query > Select Data
    const query = client.query('SELECT * FROM usuario ORDER BY id ASC');
    
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.put('/usuario/:usuario_id', (req, res, next) => {

  console.log("Atualizando usuario");

  const results = [];
  // Grab data from the URL parameters
  // const id = req.params.id;
  // Grab data from http request
  const data = {id: req.body.id, nome: req.body.nome, email: req.body.email, data_nasc: req.body.data_nasc, 
      password: req.body.password, telefone: req.body.telefone};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    //client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    //[data.text, data.complete, id]);
    console.log(data.id + " " + data.nome + " " + data.email + " " + data.data_nasc + " " + data.password + " " + data.telefone)
    client.query('UPDATE usuario SET nome=($1), email=($2), data_nasc=($3), password=($4), telefone=($5) WHERE id=($6)',
    [data.nome, data.email, data.data_nasc, data.password, data.telefone, data.id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM usuario ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});


router.delete('/usuario/:usuario_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;

  console.log("delete ID API: " + id);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM usuario WHERE id=($1)', [id]);
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;
