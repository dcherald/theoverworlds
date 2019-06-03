const mongoose = require('mongoose');
const router = require('express').Router();
const Articles = mongoose.model('Articles');

router.post('/', (req, res, next) => {
    /*POST expecting:
     * req == {
     * "title": "Ex title",
     * "description": "Ex desc",
     * "author": "Ex Dude",
     * }
     */
    const { body } = req;

    if (!body.title) {
        return res.status(422).json({
            errors: {
                title: 'is required',
            },
        });
    }

    if (!body.body) {
        return res.status(422).json({
            errors: {
                body: 'is required',
            },
        });
    }

    if (!body.author) {
        return res.status(422).json({
            errors: {
                author: 'is required',
            },
        });
    }

    const finalArticle = new Articles(body);
    //save to MongoDB database using mongoose .save()
    // respond (res) with new article in return
    return finalArticle.save()
        .then(() => res.json({ article: finalArticle.toJSON() }))
        .catch(next);
});

//GET articles, returns a list of all articles
router.get('/', (req, res, next) => {
    console.log("getting articles");
    console.log("category is " + req.query.category);
    let category = req.query.category && req.query.category != "ALL" ? req.query.category : "";
    let findQuery = req.query.category ? { category: new RegExp(category, 'i'), } : null;
    return Articles.find(findQuery)
        .sort({ createdAt: 'descending' })
        .then((articles) => res.json({ articles: articles.map(article => article.toJSON()) }))
        .catch(next);
});

//GET articles with search term
router.get('/search/', (req, res, next) => {
    console.log("getting articles with search");
    console.log("category: " + req.query.category + ", searchTerm: " + req.query.searchTerm);
    //query expects two params, "category" and "searchTerm"
    let searchTerm = req.query.searchTerm ? req.query.searchTerm : "";
    let category = req.query.category && req.query.category != "ALL" ? req.query.category : "";
    let searchQuery = {
        $and: [
            {
                $or: [
                    { title: new RegExp(searchTerm, 'i') },
                    { body: new RegExp(searchTerm, 'i') },
                    { author: new RegExp(searchTerm, 'i') },
                ]
            },
            { category: new RegExp(category, 'i')}
        ],
    }
    //query MongoDB database with mongoose .find() operation with searchQuery as param
    if (searchQuery) {
        return Articles.find(searchQuery)
            .sort({ createdAt: 'descending' })
            .then((articles) => res.json({ articles: articles.map(article => article.toJSON()) }))
            .catch(next);
    }
});

router.param('id', (req, res, next, id) => {
    console.log("id passed to param is: " + id);
    //id = "5cde6841bf41342c0c7af723";
    return Articles.findById(id, (err, article) => {
        if (err) {
            return res.sendStatus(404);
        } else if (article) {
            req.article = article;
            return next();
        }
    }).catch(next);
});

router.get('/:id', (req, res, next) => {
    //GET :id, returns a specific article
    return res.json({
        article: req.article.toJSON(),
    });
});

router.patch('/:id', (req, res, next) => {
    /*PATCH expecting:
     * {
     * "title": "Ex title",
     * "author": "Ex Dude",
     * "description": "Ex desc",
     * }
     */
    console.log("id passed to patch is: " + req.article._id);
    const { body } = req;

    if (typeof body.title !== 'undefined') {
        req.article.title = body.title;
    }

    if (typeof body.author !== 'undefined') {
        req.article.author = body.author;
    }

    if (typeof body.body !== 'undefined') {
        req.article.body = body.body;
    }

    return req.article.save()
        .then(() => res.json({ article: req.article.toJSON() }))
        .catch(next);
});

router.delete('/:id', (req, res, next) => {
    //console.log("id passed to delete is: " + req.article._id);
    return Articles.findByIdAndRemove(req.article._id)
        .then(() => res.sendStatus(200))
        .catch(next);
});

module.exports = router;
