const pool = require('../../src/conexao').pool;

    const getAll = (req, res) => {
        pool.getConnection((error, connection) => {
            connection.query(
                `select * from user`,
                (error, result, field) => {
                    if (error) console.log(error)
                    res.json(result)
                    connection.release()
                });
        });
    }
    
    const getById = (req, res) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                connection.query(
                    `select * from user where id = ${req.params.id}`,
                    (error, result, field) => {
                        if (result[0])
                            resolve(result[0])
                        else
                            resolve([])
                        connection.release();
                    });
            });
        });
    }

    const newUser = async (user) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                connection.query(
                    `insert into user (name, username, password) values ('${user.name}', '${user.username}', '${user.password}', '${moment().format('YYYY-MM-DD HH:mm:ss')}')`,
                    (error, result, field) => {
                        if (error)
                            console.log(error)
                        resolve(result)
                        connection.release();
                    });
            });
        });
    }

    const login = (req, res) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                connection.query(
                    `select * from user where username = '${req.params.id}' and password = '${req.params.password}'`,
                    (error, result, field) => {
                        if (result.length > 0)
                            resolve(true)
                        else
                            resolve(false)
                        connection.release();
                    });
            });
        });
    }

    module.exports = {
        getAll,
        getById,
        newUser,
        login
    }