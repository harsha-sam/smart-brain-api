const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, pass } = req.body;
    if (!email || !name || !pass) {
        return res.status(400).json("incorrect form submission");
    }
    else {
        const hash = bcrypt.hashSync(pass)
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                console.log(loginEmail);
                return trx('users')
                    .returning('*')
                    .insert({
                        email: email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            res.status(400).json("unable to register");
        })
    }
}

module.exports = {
    handleRegister: handleRegister
}