'use client';
import React, { useEffect, useState } from "react";
import sanityClient from "@sanity/client";
import Image from "next/image";

const sanity = sanityClient({
    projectId: '16pbspmp', // Replace with your project ID
    dataset: 'production', // Replace with your dataset name
    apiVersion: '2025-01-18', // API version
    useCdn: true,
});

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    discountPercent?: number;
    imageUrl?: string;
    category?: string;
    colors?: string[];
    sizes?: string[];
}

const ProductCards: React.FC = (): React.ReactElement => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const query = `
            *[_type == "products"] {
                _id,
                name,
                price,
                description,
                "imageUrl": image.asset->url,
                category,
                discountPercent,
                colors,
                sizes
            }`;

            const data = await sanity.fetch(query);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const addToCart = (product: Product) => {
        setCart((prevCart) => [...prevCart, product]);
        alert(`${product.name} added to cart`);
    };

    const truncateDescription = (description: string): string =>
        description.length > 100 ? `${description.substring(0, 100)}...` : description;

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-center text-slate-800 mt-4 mb-2">Products From API's Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white shadow-md rounded-lg gap-4 hover:shadow-lg transition-shadow duration-300"
                    >
                        {product.imageUrl && (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        )}
                        <div className="mt-4 p-4">
                            <h2 className="text-lg font-bold">{product.name}</h2>
                            <p className="text-slate-800 mt-2 text-sm">
                                {truncateDescription(product.description)}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p className="text-slate-700 font-bold">${product.price.toFixed(2)}</p>
                                    {product.discountPercent && (
                                        <p className="text-green-600 text-sm">
                                            {product.discountPercent}% Off
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {product.colors?.map((color, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-200 text-black px-2 py-1 text-xs rounded-md"
                                    >
                                        {color}
                                    </span>
                                ))}
                            </div>
                            <button
                                className="w-full mt-4 py-2 text-white bg-slate-900 rounded-md hover:bg-gray-600 transition-colors duration-300"
                                onClick={() => addToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-8 bg-slate-100 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-black text-red-800">Products Added to Cart</h2>
                {cart.length > 0 ? (
                    <ul className="space-y-4">
                        {cart.map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center bg-white shadow-sm p-4 rounded-md"
                            >
                                <div>
                                    <p className="font-medium text-slate-900">{item.name}</p>
                                    <p className="text-sm text-blue-600">${item.price.toFixed(2)}</p>
                                </div>
                                {item.imageUrl && (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                        className="rounded-md"
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-black text-center">
                        Your Cart is Empty. Please Add Products.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCards;
