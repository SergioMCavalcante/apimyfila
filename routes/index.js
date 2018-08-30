const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/myfila';

/* GET home page. */
//router.get('/', function(req, res, next) {
datahora = new Date();
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profissional', (req, res, next) => {
  
  console.log(datahora);
  console.log("Buscando profissionais");

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
    const query = client.query('SELECT p1.*, "Descricao" FROM profissional p1, profissao p2 where p1.id_profissao = p2.id_profissao ORDER BY "Nome" ASC;');
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

  console.log("USUARIO ID API: " + id);
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

router.get('/usuario_agenda1/:usuario_id', (req, res, next) => {

  console.log("Buscando total de agendas de 1 usuario");

  const results = [];
  // Grab data from the URL parameters
  const id = req.params.usuario_id;

  console.log("USUARIO ID API (1): " + id);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT u.*,  COUNT(*) as Tot_Agendas FROM usuario u, mov_agenda mva WHERE u.id = mva.id_usuario and data_movimento >= current_date and u.id=($1) Group by u.id Order by 2', [id]);
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

router.get('/usuario_agenda2/:usuario_id', (req, res, next) => {

  console.log("Buscando todas as agendas de 1 usuario");

  const results = [];
  // Grab data from the URL parameters
  const id = req.params.usuario_id;

  console.log("USUARIO ID API (2): " + id);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT u.id as u_id, u.nome as u_nome, mva.id as mov_id, mva.id_profissional, mva.data_movimento, mva.hora_atendimento, p1."Nome" as p_nome, p2."Descricao" FROM usuario u, profissional p1, mov_agenda mva, profissao p2 WHERE u.id=($1) and mva.id_usuario=u.id and data_movimento >= current_date and mva.id_profissional = p1.id and p1.id_profissao = p2.id_profissao Order by 5, 6;', [id]);
        
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
  const id = req.params.usuario_id;
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
  const id = req.params.usuario_id;

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

router.get('/agenda/:prof_id', (req, res, next) => {

  console.log("Buscando agenda (Datas)");

  const results = [];
  // Grab data from the URL parameters
  const id = req.params.prof_id;

  console.log("API ID agenda: " + id);

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM generate_series((current_date), (current_date) + INTERVAL'1 month' - INTERVAL'1 day', INTERVAL'1 day') AS datadisp, EXTRACT(ISODOW FROM datadisp) AS diasemana WHERE EXTRACT(ISODOW FROM datadisp) in (SELECT distinct dia_semana_agenda FROM agenda where id_profissional=($1));", [id]);
      
    //("SELECT  * FROM generate_series(date_trunc('month',current_date), date_trunc('month',current_date) + INTERVAL'1 month' - INTERVAL'1 day', INTERVAL'1 day') AS dias WHERE EXTRACT(ISODOW FROM dias) in (SELECT distinct dia_semana_agenda FROM agenda where id_profissional=($1);", [id]);
   
    //('SELECT distinct dia_semana_agenda FROM agenda where id_profissional=($1);', [id]);
    //'SELECT * FROM agenda where id_profissional=($1) ORDER BY "dia_semana_agenda","hora_agenda" ASC;', [id]);
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

router.get('/agenda_horas/:idProfSelec&:diaSem&:dataSelec', (req, res, next) => {

  console.log("Buscando agenda (Horas)");

  const results = [];
  //const dataSelec = req.params.dataSelec;
  const idProf = req.params.idProfSelec;
  const diaSemana = req.params.diaSem; 
  const dataSelec = req.params.dataSelec; 
  
  console.log("API agenda horas: " + idProf + ' ' + diaSemana + ' ' + dataSelec);

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM agenda WHERE id_profissional=($1) and dia_semana_agenda=($2) and hora_agenda not in (SELECT hora_atendimento FROM mov_agenda WHERE data_movimento=($3) and id_profissional=($1));", [idProf, diaSemana, dataSelec]);
      
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

router.post('/mov_agenda', (req, res, next) => {
  
  console.log(datahora);
  console.log("Incluindo Movto de Agenda");

  const results = [];
  // Grab data from http request
  const data = {datamov: req.body.dataSelec, idProf: req.body.idProfSelec, horaAtend: req.body.horaAtend, 
                idUsuario: req.body.idUsuSelec};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO mov_agenda (data_movimento, id_profissional, hora_atendimento, id_usuario, data_inclusao) values($1, $2, $3, $4, $5)',
    [data.datamov, data.idProf, data.horaAtend, data.idUsuario, datahora]);

    // SQL Query > Select Data
    const query = client.query('SELECT * FROM mov_agenda where data_inclusao = current_date');
    
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

router.delete('/mov_agenda/:mov_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.mov_id;

  console.log("Mov Agenda delete ID API: " + id);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM mov_agenda WHERE id=($1)', [id]);
    
    var query = client.query('SELECT * FROM mov_agenda ORDER BY id ASC');
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


module.exports = router;
