import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface cartIconProps {
  itemCount : number
}


const CartIcon = ({ itemCount } : cartIconProps) => {
  return (
    <Link href="/cart" className="md:hidden relative">
      <ShoppingBag className="" size={20} />
      {itemCount >= 0 && <Badge className="absolute -top-2 -right-2 size-5 rounded-full p-0 flex items-center justify-center">{itemCount > 99 ? "99+" : itemCount}</Badge>}
    </Link>
  );
};
export default CartIcon;
