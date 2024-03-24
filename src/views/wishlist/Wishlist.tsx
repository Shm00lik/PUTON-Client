import { useEffect, useState } from "react";
import { Client } from "../../utils/Protocol";
import { Product } from "../../utils/Product";
import ProductComponent from "../../components/Product";
import { Grid } from "@mui/material";


const Wishlist = () => {
    const [wishlistProducts, setWishlistProducts] = useState<(Product | null)[]>([]);

    useEffect(() => {
        Client.wishlist().then((wishlist) => setWishlistProducts(wishlist));
    }, []);

    return <>
        <Grid container>
            {wishlistProducts.map((p, index) =>
                <Grid item key={index}>
                    <ProductComponent product={p} />
                </Grid>
            )}
        </Grid>
    </>
}

export default Wishlist;