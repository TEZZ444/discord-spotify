import axios from "axios";
import { getRec } from "./Modules/Rec";

interface TokenCache {
    token: string;
    expiry: number;
}

export class Siafy {
    private clientId: string;
    private clientSecret: string;
    private tokenCache: TokenCache | null;
    getRec: (track: string, limit: number, market: string) => Promise<any[]>;

    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenCache = null;
    }

    async getSiaSpotiToken(): Promise<string> {
        try {
            if (this.tokenCache && this.tokenCache.expiry > Date.now()) {
                return this.tokenCache.token;
            }
            const response = await axios.post(
                "https://accounts.spotify.com/api/token",
                null,
                {
                    params: {
                        grant_type: "client_credentials",
                    },
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${this.clientId}:${this.clientSecret}`
                        ).toString("base64")}`,
                    },
                }
            );

            const siaToken = response.data.access_token;
            const expiresIn = response.data.expires_in * 1000;
            this.tokenCache = {
                token: siaToken,
                expiry: Date.now() + expiresIn,
            };

            return siaToken;
        } catch (siaError) {
            throw new Error(siaError);
        }
    }
    async siaLinkConvert(link: string): Promise<string> {
        try {
            const match = link.match(
                /https?:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+)/
            );
            if (!match) {
                throw new Error(
                    "Invalid Spotify link - Please Provide A Valid Spotify Link"
                );
            }
            const trackId = match[1];
            return trackId;
        } catch (siError) {
            throw new Error(siError);
        }
    }
}
Siafy.prototype.getRec = function (
    track: string,
    limit: number,
    market: string
): Promise<any[]> {
    return getRec(this, track, limit, market);
};
