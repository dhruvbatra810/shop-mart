import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
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

        <button
          disabled={product.stock === 0}
          className="mt-auto w-full bg-zinc-900 hover:bg-zinc-800 text-white disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed border-none rounded-xl px-4 py-3 font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}