const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, pass } = req.body;
    if (!email || !pass) {
        return res.status(400).json("incorrect form submission");
    }
    db.select('email', 'hash').from('login').where({
        email: email
    })
        .then(data => {
            const isValid = bcrypt.compareSync(pass, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => {
                        res.status(400).json("Unable to get user");
                    })
            }
            else {
                res.status(400).json("Wrong credentials");
            }
        })
        .catch(err => {
            res.status(400).json("Unable to sign in");
        })
}

module.exports = {
    handleSignin: handleSignin
}