import ProductCard from "@/components/productCard"

export default function ProductList({ products, cartMap }: { products: any[], cartMap: Map<string, number> }) {
    return <div className="bg-white p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.length != 0 && products.map((product) => (
            <ProductCard key={product.id} product={product} cartMap={cartMap} />
        ))}
    </div>
}   