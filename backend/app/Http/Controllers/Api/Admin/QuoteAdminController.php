<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuoteAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = QuoteRequest::query();

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('sku_target', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $quotes = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $quotes->items(),
            'pagination' => [
                'total' => $quotes->total(),
                'per_page' => $quotes->perPage(),
                'current_page' => $quotes->currentPage(),
                'last_page' => $quotes->lastPage(),
            ]
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $quote = QuoteRequest::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $quote
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $quote = QuoteRequest::findOrFail($id);

        $request->validate([
            'status' => 'required|in:new,contacted,quoted,completed,cancelled',
            'admin_notes' => 'nullable|string',
        ]);

        $quote->update([
            'status' => $request->input('status'),
            'admin_notes' => $request->input('admin_notes', $quote->admin_notes),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái yêu cầu báo giá thành công.',
            'data' => $quote
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $quote = QuoteRequest::findOrFail($id);
        $quote->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa yêu cầu báo giá.'
        ]);
    }
}
