import axios from "axios";

export async function getRec(
    siafy: { getSiaSpotToken: () => Promise<string>; siaLinkConvert: (link: string) => Promise<string> },
    track: string,
    limit: number,
    market: string
): Promise<any[]> {
    try {
        const siaToken = await siafy.getSiaSpotToken();
        const trackId = await siafy.siaLinkConvert(track);
        const response = await axios.get(
            "https://api.spotify.com/v1/recommendations",
            {
                params: {
                    seed_tracks: trackId,
                    limit: limit,
                    market: market,
                },
                headers: {
                    Authorization: `Bearer ${siaToken}`,
                },
            }
        );
        return response.data.tracks;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function siaLinkConvert(link: string): Promise<string> {
    try {
        const linkParts = link.split("/");
        return linkParts[linkParts.length - 1];
    } catch (error) {
        console.error(error);
        return "";
    }
}

