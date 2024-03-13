import { useEffect, useState } from "react";
import { Client, Response } from "../../utils/Protocol";

const Wishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState([]);
    

    useEffect(() => {
        const runThis = async () => {
            let result: Response = await Client.getWishlist(localStorage.getItem("username"));
            console.log(result);

            setWishlistProducts(result.body)
        };

        runThis();
    }, []);

    return <>NIGGA</>
}

export default Wishlist;