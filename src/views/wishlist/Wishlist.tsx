import { useEffect, useState } from "react";
import { Client } from "../../utils/Protocol";
import { Product } from "../../utils/Product";


const Wishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState<(Product | null)[]>([]);

    useEffect(() => {
        const runThis = async () => {
            setWishlistProducts(await Client.wishlist());
        };

        runThis();
    }, []);

    return <>
        {wishlistProducts}
    </>
}

export default Wishlist;