// Require Statements
const express = require('express');
const Superhero = require('../models/superhero');
const Power = require('../models/power');

const router = express.Router();

// New Superhero Route
router.get('/new', (request, response) => {
    response.render ('superheroes/new')

});

// Create Superhero Route
router.post('/', (request, response) => {
    const superhero = request.body

    if (superhero.mask === "on"){
        superhero.mask = true
    } else {
        superhero.mask = false
    }
    if (superhero.weapon === "on"){
        superhero.weapon = true
    } else {
        superhero.weapon = false
    }
    Superhero.create(superhero, (err, createdSuperhero) => {
        response.redirect('/superheroes/'+ createdSuperhero._id)
    });
});

// Index Route for Superheroes
router.get('/gallery', (request, response) => {
    Superhero.find({}, (err, allSuperheroes) => {
        response.render('superheroes/index.ejs', {
            superheroes: allSuperheroes
        });  
    });
});

// Show Route for Superheroes
router.get('/:id', (request, response) => {
    Superhero.findById(request.params.id)
        .populate({
            path: 'powers',
        })
    .exec((err, foundSuperhero) => {
        if(err){
            response.send(err)
        } else {
            response.render('superheroes/show', {
                superheroes: foundSuperhero,
                powers: foundSuperhero.powers
            });
        };
    });
});

// Delete Route for Superheroes
router.delete('/:id', (request, response) => {
    Superhero.findByIdAndDelete(request.params.id, (err, deletedSuperhero) => {
        if(err) {
            console.error(err)
            response.send('error check console')
        } else {
            Power.deleteMany({
                _id: {
                    $in: deletedSuperhero.powers
                }
            }, (err, data) => {
                response.redirect('/superheroes/gallery')
            });
        };
    });
});

// Edit Route for Superheroes
router.get('/:id/edit', (request, response) => {
    Superhero.findById(request.params.id, (err, foundSuperhero) => {
        response.render('superheroes/edit', {
            superheroes: foundSuperhero
        });
    });
});

// Update Route for Superheroes
router.put('/:id', (request, response) => {
    request.body.mask === 'on' ? request.body.mask = true : request.body.mask = false
    request.body.weapon === 'on' ? request.body.weapon = true : request.body.weapon = false
    Superhero.findByIdAndUpdate(request.params.id, request.body, () => {
        response.redirect('/superheroes/'+ request.params.id)
    });
});

module.exports = router
