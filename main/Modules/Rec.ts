import axios from "axios";
export async function getRec(
    siafy: any,
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