const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'YOUR API KEY'
  });

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(400).json('Unable to work with api');
    }) 
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1)
        .returning('entries')
        .then(entries => {
            if (!entries.length) {
                res.status(400).json('No user found!')
            }
            else {
                res.json(entries[0]);
            }
        })
        .catch(err => {
            res.status(400).json("Error getting user")
        })
}

module.exports = {
    handleImage,
    handleApiCall
}