import { useCart } from "@/hooks/useCart"
import { stripe } from "../../lib/stripe"
import { Imagecontainer, ProductContainer, ProductDetail } from "@/styles/pages/product"
import axios from "axios"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { handleClientScriptLoad } from "next/script"
import { useState } from "react"
import Stripe from "stripe"
import { IProduct } from "@/contexts/CartContext"

interface ProductProps{
    product: IProduct;
}


export default function Product({ product }:ProductProps ) {

    const { isFallback } = useRouter()

    const { checkIfItemAlreadyExists, addToCart } = useCart()

    if(isFallback){
        return <p>loading...</p>
    }

    const itemAlreadyInCart = checkIfItemAlreadyExists(product.id)

    return(
        <>
            <Head>
                <title>{product.name}</title>
            </Head>
            
            <ProductContainer>
                <Imagecontainer>
                    <Image src={product.imageUrl} width={520} height={480} alt="" />
                </Imagecontainer>

                <ProductDetail>
                    <h1>{product.name}</h1>
                    <span> {product.price}</span>

                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quo excepturi fuga deleniti dolorem nam aut veniam provident commodi eos sapiente similique impedit, dolorum facilis fugiat odio. Ipsum, odit labore.</p>

                    <button disabled={itemAlreadyInCart} onClick={() => addToCart(product)}>
                        {itemAlreadyInCart 
                            ?'Produto já está na sacola'
                            : 'Colocar na sacola'
                        }
                    </button>

                </ProductDetail>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () =>{
    return{
        paths: [
            {params: { id: 'prod_NRTKdcdmui7zQl'}}
        ],
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async({params}) =>{

    if(!params) {
        return {
          notFound: true // Caso não exista parametros, retorna um 404
        }
      }

    const productId = params.id
                                                  
    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']  // como não é o lista, não precisa d odata
    })

    const price = product.default_price as Stripe.Price 


    return{
        props: {
            product:{
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(price.unit_amount! / 100),
                numberPrice: price.unit_amount! / 100,
                description: product.description,
                defaultPriceId: price.id
            },
        },
        revalidate: 60*60*1, //1 hour
    }
}