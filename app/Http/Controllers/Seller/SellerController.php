<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;

class SellerController extends Controller
{
    // Dashboard Stats
    public function dashboard()
    {
        $sellerId = auth()->id();
        
        $stats = [
            'total_products' => Product::where('seller_id', $sellerId)->count(),
            'active_products' => Product::where('seller_id', $sellerId)->where('stock_quantity', '>', 0)->count(),
            'total_sales' => Order::whereHas('items.product', function($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })->where('status', 'completed')->count(),
            'total_revenue' => Order::whereHas('items.product', function($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })->where('status', 'completed')->sum('total_amount'),
        ];

        return response()->json($stats);
    }

    // Product Management
    public function getProducts()
    {
        $products = Product::where('seller_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($products);
    }

    public function createProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'seller_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::where('seller_id', auth()->id())->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
        ]);

        $product->update($request->all());

        return response()->json(['message' => 'Product updated successfully', 'product' => $product]);
    }

    public function deleteProduct($id)
    {
        $product = Product::where('seller_id', auth()->id())->findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    // Sales/Orders
    public function getSales()
    {
        $sellerId = auth()->id();
        
        $orders = Order::with(['user:id,name,email', 'items' => function($query) use ($sellerId) {
            $query->whereHas('product', function($q) use ($sellerId) {
                $q->where('seller_id', $sellerId);
            })->with('product');
        }])
        ->whereHas('items.product', function($query) use ($sellerId) {
            $query->where('seller_id', $sellerId);
        })
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($orders);
    }
}
