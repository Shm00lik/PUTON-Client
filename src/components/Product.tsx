import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Product } from "../utils/Product";

interface Props {
    product: Product | null
}

const ProductComponent = ({ product }: Props) => {
    if (product == null) {
        return <></>
    }

    return (
        <Card sx={{ width: 240, margin: 2 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={"data:image/jpg;base64," + product.image}
                title={product.title}
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                </Typography>

                <Typography color="text.secondary">
                    {product.description}
                </Typography>
            </CardContent>
            {/* 
            <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions> */}
        </Card>
    )
}

export default ProductComponent;