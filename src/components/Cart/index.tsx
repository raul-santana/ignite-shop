import * as Dialog from '@radix-ui/react-dialog';
import { CartButton } from "../CartButton";
import { CartClose, CartContent, CartProduct, CartProductDetails, CartProductImage, CartFinalization, FinalizationDetails } from './styles';
import { X } from 'phosphor-react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Cart({quantity} : {quantity: number}){

    const { cartItems, cartTotal, removeCartItem } = useCart()
    const cartQuantity = cartItems.length

    const formattedCartTotal = new Intl.NumberFormat('pt-BR', {
        style:'currency',
        currency: 'BRL'
    }).format(cartTotal)

    const [isCreatingCheckoutSession, setisCreatingCheckoutSession] = useState(false)

    const [blockBtnFinalization, setBlockBtnFinalization] = useState(false)

    useEffect(()=>{
        isCreatingCheckoutSession == true || cartQuantity < 1 ? setBlockBtnFinalization(true) : setBlockBtnFinalization(false)
    },[isCreatingCheckoutSession, cartQuantity])

    async function handleCheckout(){
        try{
            setisCreatingCheckoutSession(true)

            const response = await axios.post('/api/checkout', {
                products: cartItems,
            })

            const {checkoutUrl} = response.data

            window.location.href = checkoutUrl

        } catch(err){
            setisCreatingCheckoutSession(false)
            alert('Falha ao redirecionar ao checkout')
        }
    }

    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <CartButton quantity={quantity}/>
            </Dialog.Trigger>

            <Dialog.Portal>
                <CartContent>
                    <CartClose>
                        <X size={24} weight='bold' />
                    </CartClose>

                    <h2> Sacola de compras</h2>

                    <section>

                        {cartQuantity <= 0 && <p>Parece que seu carrinho está vazio</p>}

                        {cartItems.map((cartItem) =>(
                            <CartProduct key={cartItem.id}>
                            <CartProductImage>
                                <Image 
                                    width={100} 
                                    height={93} 
                                    alt="" 
                                    src={cartItem.imageUrl} 
                                />
                            </CartProductImage>

                            <CartProductDetails>
                                <p> {cartItem.name}</p>
                                <strong> {cartItem.price} </strong>
                                <button onClick={() => removeCartItem(cartItem.id)}> Remover </button>
                            </CartProductDetails>
                        </CartProduct>
                        ))}

                        
                    </section>

                    <CartFinalization>
                        <FinalizationDetails>
                            <div>
                                <span>Quantidade</span>
                                <p> {cartQuantity} {cartQuantity === 1 ? "item" : "itens"} </p>
                            </div>
                            <div>
                                <span>Valor total</span>
                                <p> {formattedCartTotal} </p>
                            </div>
                        </FinalizationDetails>

                        <button onClick={handleCheckout} disabled={blockBtnFinalization}> Finalizar compra </button>
                    </CartFinalization>

                </CartContent>
            </Dialog.Portal>

        </Dialog.Root>
    )
}