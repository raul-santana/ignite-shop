import Link from "next/link";
import logoImg from '../../assets/logo.svg'
import Image from 'next/image'
import { HeaderContainer } from "./styles";
import { Cart } from "../Cart";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/useCart";

export function Header(){

    const { pathname } = useRouter()

    const { cartTotalItems } = useCart()

    const showCartButton = pathname !== '/success'

    return(
        <HeaderContainer>
            <Link href={"/"}>
                <Image src={logoImg} alt="" />
            </Link>

            {showCartButton && <Cart quantity={cartTotalItems} />}
        </HeaderContainer>
    )
}