import { Router } from 'express';
import { getLinksCollection, noUnderscoreId } from './db-client';
import request from 'request'
import { PusillusErrorResponse } from './domain';

let router = Router();

const pathPattern = /[\w\d]+/;
router.get(pathPattern, (req, res) => {
    getLinksCollection().then((collection) => {
        const pusillusLink = { id: req.path.slice(1) };
        console.log('Finding url with id=' + pusillusLink.id);
        
        collection.findOne(pusillusLink, noUnderscoreId, (error, doc) => {
            if(error) {
                console.log(`Error retrieving document. message=${error.message}`);
                res.status(500).json(new PusillusErrorResponse('Internal Server Error.'));
            } else if(!doc) {
                res.status(404).json(new PusillusErrorResponse('URL not found.'));
            } else {
                req.session!.url = doc.url;
                request.get(doc.url)
                    .on('response', (response) => {                        
                        res.render('redirect', { 
                            url: doc.url, 
                            urlSupportsIframe: Object.keys(response.headers).indexOf('x-frame-options') == -1 && doc.url.startsWith('https')
                        });
                    })
                    .on('error', (error) => {
                        res.render('redirect', { 
                            url: doc.url,
                            urlSupportsIframe: false
                        });
                    });
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json(new PusillusErrorResponse('Internal Server Error.'));
    });
});

export default router;