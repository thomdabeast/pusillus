import { MongoClient, Db, Collection, FindOneOptions } from 'mongodb'
const username = 'staging_user';
const password = 'Qi3mviy8fYrYN3xm';

const url = `mongodb+srv://${username}:${password}@staging-links-oalv7.mongodb.net/test?retryWrites=true&w=majority`;

const client = new MongoClient(url, { useNewUrlParser: true });

const noUnderscoreId: FindOneOptions = { projection: { _id: 0 } };

function getLinksCollection(): Promise<Collection<PusillisLink>> {
    return new Promise((resolve, reject) => {
        client.connect((err) => {
            if (err) {
                console.log('Failed to connect to the db.');
                reject(err);
            }
        
            console.log("Connected successfully to server");
            
            resolve(client.db('staging').collection('links'));
        });
    });
};

class PusillisLink {
    readonly id: string;
    readonly url: string;
    readonly shortened_url: string;

    constructor(id: string, url?: string, shortened_url?: string) {
        this.id = id;
        this.url = url || '';
        this.shortened_url = shortened_url || '';
    }
}

export { PusillisLink, getLinksCollection, client, noUnderscoreId }
