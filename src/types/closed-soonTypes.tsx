type ClosingSoonLot = {
    auctionProductId: string;
    title: string;
    image: string | null;
};

type ClosingSoonAuction = {
    _id: string;
    title: string;
    endsAt: string;
    totalLots: number;
    summary: {
        highestBidAmount: number;
        highestBidder: {
            firstName: string;
            lastName: string;
        } | null;
        mostBidsCount: number;
        mostBiddersCount: number;
    };
    highValueLots: ClosingSoonLot[];
    mostBidLots: ClosingSoonLot[];
};

type ClosingSoonResponse = {
    success: boolean;
    message: string;
    statusCode: number;
    data: ClosingSoonAuction[];
};

export type { ClosingSoonLot, ClosingSoonAuction, ClosingSoonResponse };