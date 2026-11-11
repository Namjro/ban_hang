<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use App\Models\QuoteRequest;

class DashboardService
{
    /**
     * Get aggregate statistics and recent quotes for admin dashboard.
     */
    public function getDashboardStats(): array
    {
        $totalProducts = Product::count();
        $inStockProducts = Product::where('stock_status', 'in_stock')->count();
        $totalCategories = Category::count();

        $totalQuotes = QuoteRequest::count();
        $newQuotes = QuoteRequest::where('status', 'new')->count();
        $contactedQuotes = QuoteRequest::where('status', 'contacted')->count();
        $quotedQuotes = QuoteRequest::where('status', 'quoted')->count();
        $completedQuotes = QuoteRequest::where('status', 'completed')->count();

        $recentQuotes = QuoteRequest::orderBy('created_at', 'desc')->take(6)->get();

        return [
            'overview' => [
                'total_products'    => $totalProducts,
                'in_stock_products' => $inStockProducts,
                'total_categories'  => $totalCategories,
                'total_quotes'      => $totalQuotes,
                'new_quotes'        => $newQuotes,
                'contacted_quotes'  => $contactedQuotes,
                'quoted_quotes'     => $quotedQuotes,
                'completed_quotes'  => $completedQuotes,
            ],
            'recent_quotes' => $recentQuotes,
        ];
    }
}
