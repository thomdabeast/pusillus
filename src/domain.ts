import { PusillisLink } from "./db-client";

class CreatePusillusLinkRequest {
    readonly url: string;
    readonly customHash?: string;

    constructor(url: string, customHash?: string) {
        this.url = url;
        this.customHash = customHash;
    }
}

class CreatePusillisLinkResponse {
    readonly id: string;
    readonly url: string;
    readonly shortened_url: string;

    constructor(id: string, url: string, shortened_url: string) {
        this.id = id;
        this.url = url;
        this.shortened_url = shortened_url;
    }

    static from(link: PusillisLink) {
        return new CreatePusillisLinkResponse(link.id, link.url, link.shortened_url);
    }
}

class PusillusErrorResponse {
    readonly message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export { PusillusErrorResponse, CreatePusillisLinkResponse, CreatePusillusLinkRequest }
