<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with('items.product')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        return DB::transaction(function () use ($request, $data) {
            $total = 0;
            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                if ($product->stock_quantity < $item['quantity']) {
                    abort(400, "Insufficient stock for {$product->name}");
                }
                $total += $product->price * $item['quantity'];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $total,
                'status' => 'pending'
            ]);

            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price
                ]);
                // decrease stock
                $product->decrement('stock_quantity', $item['quantity']);
            }

            return response()->json($order->load('items.product'), 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $order = $request->user()->orders()->with('items.product')->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    // not used

    /**
     * Remove the specified resource from storage.
     */
    // not used

    public function pay(Request $request, string $id)
    {
        $order = $request->user()->orders()->findOrFail($id);
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Payment already processed or order is not pending'], 400);
        }
        $order->update(['status' => 'processing']);
        return response()->json(['message' => 'Payment successful, order is now processing.']);
    }
}
