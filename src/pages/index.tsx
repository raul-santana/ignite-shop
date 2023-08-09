import Head from "next/head"
import { HomeContainer, Product, SliderContainer } from "@/styles/pages/home"
import Image from "next/image"
import Link from "next/link"
import { stripe } from "../lib/stripe"
import { GetServerSideProps, GetStaticProps } from "next"
import Stripe from "stripe"
import useEmblaCarousel from "embla-carousel-react";
import { CartButton } from "@/components/CartButton"
import { useCart } from "@/hooks/useCart"
import { IProduct } from "@/contexts/CartContext"
import { MouseEvent, useEffect, useState } from "react"
import { ProductSkeleton } from "@/components/ProductSkeleton"

interface HomeProps{
  products:IProduct[];
  
}

export default function Home({ products }: HomeProps) {

  const [isLoading, setIsLoading] = useState(true)

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: true,
  })

  useEffect( () => {
    // fake loading to use the skeleton loading from figma
    const timeOut = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timeOut);
  }, [])

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  function handleAddToCart(e: MouseEvent<HTMLButtonElement>, product: IProduct){
    e.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <div style={{overflow: 'hidden', width: '100%'}}>
        <HomeContainer>

          <div className="embla" ref={emblaRef}>
            <SliderContainer className='embla__container container'>

              {isLoading ? (
                <>
                  <ProductSkeleton className="embla_slide" />
                  <ProductSkeleton className="embla_slide" />
                  <ProductSkeleton className="embla_slide" />
                </>
              )
              :
              (
                <>
                  {products.map(product => {
                  return(
                    <Link href={`/product/${product.id}`} key={product.id} prefetch={false} >
                      <Product className="embla__slide">
                        <Image src={product.imageUrl} width={520} height={480} alt="" />

                        <footer>                        
                            <div>
                              <strong> { product.name } </strong>
                              <span> { product.price } </span>
                            </div>
                            <CartButton  color={'green'} size={'large'} disabled={checkIfItemAlreadyExists(product.id)} onClick={(e) => handleAddToCart(e, product)} />
                        </footer>
                      </Product>
                    </Link>
                  )
                  })}

                </>

              )
              }

              

              
            </SliderContainer>
          </div>

        </HomeContainer>
      </div>
      
      
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async() =>{

//   const response = await stripe.products.list({
//     expand: ['data.default_price'] // o default_price retorna um id do preço e não
//                                   // o preço em si, por isso temos que utilizar
//                                   // expand, para transformarmos em um objeto e pegarmos outras informações
//                                   // de dentro, como o unit_amount.
//   })

//   const products = response.data.map(product =>{

//     const price = product.default_price as Stripe.Price 


//     return{
//       id: product.id,
//       name: product.name,
//       imageUrl: product.images[0],
//       price: price.unit_amount! / 100, //dividindo por 100 porque o preço vem em centavos.
//                                       // uma dica boa é guardar o preço em centavos, para isso basta 
//                                       // multiplicar por 100 e na hora de pega-lo, dividir por 100.
//     }
//   })

//   return{
//     props: {
//       products
//     }
//   }
// }

export const getStaticProps: GetStaticProps = async() =>{

  const response = await stripe.products.list({
    expand: ['data.default_price'],
    active: true
  })

  const products = response.data.map(product =>{

    const price = product.default_price as Stripe.Price 

    return{
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount! / 100),
      numberPrice: price.unit_amount! / 100,
      defaultPriceId: price.id,

    }
  })

  return{
    props: {
      products
    },
    revalidate: 60 * 60 * 2,
  }
}