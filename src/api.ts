import { PusillisLink, getLinksCollection, noUnderscoreId } from './db-client'
import { Router } from 'express'
import { ObjectID } from 'mongodb'
import Hashids from 'hashids'
import { PusillusErrorResponse, CreatePusillisLinkResponse } from './domain'

let router = Router();
let hashids = new Hashids('url shortener', 8);

// Retrieve a link
router.get('/link/:id', (req, res) => {
    getLinksCollection().then((collection) => {
        console.log('Finding url with id=' + req.params.id);

        collection.findOne({ id: req.params.id }, noUnderscoreId, (error, doc) => {
            if(error) {
                console.log(`Error retrieving document. message=${error.message}`);
                res.status(500).json(new PusillusErrorResponse('Internal Server Error.'));
            } else if(!doc) {
                res.status(404).json(new PusillusErrorResponse('URL not found.'));
            } else {
                res.json(doc);
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(new PusillusErrorResponse('Internal Server Error.'));
    });
});

router.post('/link', (req, res) => {
    getLinksCollection().then((collection) => {
        collection.countDocuments((error, numberOfLinks) => {
            const hash = hashids.encode(numberOfLinks);
            const doc = new PusillisLink(hash, req.body.url, 'https://localhost:8080/'+hash);
    
            collection.insertOne(doc, (error) => {
                if (error) {
                    console.log('Unable to insert document error=' + error);
                    res.status(500).json(new PusillusErrorResponse('Internal Server Error.'));
                } else {
                    res.status(201).json(CreatePusillisLinkResponse.from(doc));
                }
            });
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(new PusillusErrorResponse('Internal Server Error.'));
    });
});

export default router;