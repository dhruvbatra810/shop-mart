
import { addToCart } from "@/lib/server-action";
import Image from "next/image";
import Link from "next/link";
import AddCartButton from "./addCartButton";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl: string;
  stock: number;
};

export default function ProductCard({ product, cartMap }: { product: Product, cartMap: Map<string, number> }) {
  return (
    <div className="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {/* Quantity/Stock badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-zinc-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            Out of Stock
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-zinc-900 line-clamp-1 flex-1 pr-2">{product.name}</h3>
          <p className="font-bold text-zinc-900">₹{product.price}</p>
        </div>

        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        <AddCartButton product={product} quantity={cartMap.get(product.id) || 0} />
      </div>
    </div>
  );
}